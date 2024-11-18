import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, Card } from "@material-tailwind/react";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";

function DashBoard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    type: "expense",
  });
  const [showModal, setShowModal] = useState(false);

  const getToken = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    }
    return null;
  };

  const token = getToken();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://expensy-backend.vercel.app/expense",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data.slice(-5).reverse());
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://expensy-backend.vercel.app/expense",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions([response.data, ...transactions].slice(0, 5));
      setForm({ amount: "", category: "", description: "", type: "expense" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Calculate Total Income and Expense
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div>
      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {!loading && (
        <div className="px-3 flex h-screen items-center flex-col">
          {/* Recent Expenses Card */}
        
            <Card className="w-full  m-auto md:max-w-lg  dark:bg-zinc-900 ">
              <h1 className="text-center mb-3 font-extrabold dark:text-sky-500 border-b border-white">
                Recent Expenses
              </h1>
              <List className="dark:text-red-500 text-sm font-bold text-center">
                <ListItem className="flex justify-between -mt-4 text-md font-extrabold text-center dark:text-deep-purple-400">
                  <div className="basis-1/4">
                    <p>Category</p>
                  </div>
                  <div className="basis-1/4">
                    <p>Type</p>
                  </div>
                  <div className="basis-1/4">
                    <p>Amount</p>
                  </div>
                </ListItem>
                {transactions.map((transaction) => (
                  <ListItem
                    key={transaction._id}
                    className="flex justify-between -mt-4 text-md font-extrabold text-center"
                  >
                    <div className="basis-1/4">
                      <p>{transaction.category}</p>
                    </div>
                    <div className="basis-1/4">
                      <p>{transaction.type}</p>
                    </div>
                    <div className="basis-1/4">
                      <p className="dark:text-sky-400">${transaction.amount}</p>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Card>

            <button
              onClick={() => setShowModal(true)}
              className="text-white bg-gradient-to-r -mt-9  font-bold from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm px-5 py-2.5 mx-auto block"
            >
              + New Expense
            </button>
        

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-neutral-900 rounded-lg p-5 w-11/12 sm:w-96">
                <h2 className="text-md font-extrabold mb-4 text-center dark:text-blue-500">Add New Expense</h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center flex-col"
                >
                  <input
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="py-3 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8"
                  />
                  <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    className="py-3 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8"
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="py-3 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8"
                  />
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="py-2.5 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Total Income and Expense */}
          <div className="flex justify-evenly flex-wrap m-auto gap-4 md:gap-10 mt-16">
            <Card className="p-2 w-auto md:w-52 text-center flex-row justify-around items-center bg-green-100">
              <div className="mr-2">
                <BsGraphDownArrow size={28} />
              </div>

              <div>
                <h2 className="text-md font-semibold text-green-800">Income</h2>
                <p className="text-2xl font-bold text-green-600">
                  ${totalIncome}
                </p>
              </div>
            </Card>

            <Card className="p-2 w-auto md:w-52 text-center flex-row justify-around items-center bg-red-100">
              <div className=" mr-2">
                <BsGraphUpArrow size={28} />
              </div>

              <div>
                <h2 className="text-md font-semibold text-red-800">Expense</h2>
                <p className="text-2xl font-bold text-red-600">
                  ${totalExpense}
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
