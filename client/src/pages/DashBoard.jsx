import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, Card } from "@material-tailwind/react";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";
import { MdAccountBalance } from "react-icons/md";

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
        <div className="flex justify-center  items-center h-screen">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {!loading && (
        <div className="px-3 flex h-screen items-center flex-col">
          {/* Total Income and Expense */}
          <div className="flex md:gap-x-20 gap-x-2 mt-6 ">
            <Card className="md:p-4 p-2 w-auto  text-center flex-row md:gap-x-3 gap-x-1 items-center bg-green-100 dark:bg-zinc-950 shadow-sm hover:dark:shadow-neutral-800">
              <div className="mr-2">
                <MdAccountBalance size={28} className="dark:text-yellow-500" />
              </div>

              <div>
                <h2 className="text-sm font-bold  text-yellow-600">
                  Balance
                </h2>
                <p className="text-sm font-bold text-yellow-600">
                  ${totalIncome - totalExpense}
                </p>
              </div>
            </Card>

            <Card className="p-4 w-auto text-center flex-row md:gap-x-3 gap-x-1 items-center bg-green-100 dark:bg-zinc-950 shadow-sm hover:dark:shadow-neutral-800">
              <div className="mr-2">
                <BsGraphDownArrow size={28} className="dark:text-green-500" />
              </div>

              <div>
                <h2 className="text-sm font-bold  text-green-600">
                  Income
                </h2>
                <p className="text-sm font-bold text-green-600">
                  ${totalIncome}
                </p>
              </div>
            </Card>

            <Card className="p-4 w-auto  text-center flex-row md:gap-x-3 gap-x-1 items-center dark:bg-zinc-950 bg-red-100 shadow-sm hover:dark:shadow-neutral-800">
              <div className=" mr-2">
                <BsGraphUpArrow size={28} className="dark:text-red-600" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-red-600">
                  Expense
                </h2>
                <p className="text-sm font-bold text-red-600">
                  ${totalExpense}
                </p>
              </div>
            </Card>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-black font-bold mb-6 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80  rounded-lg text-sm px-5 py-2.5 text-center mt-5"
          >
            + New Expense
          </button>{" "}
          {/* Button for adding new expense */}


          {/* Recent Expenses Card */}
          <div className=" rounded-lg  w-full p-3  dark:bg-zinc-950">
            <Card className="w-full mt-5 border-zinc-800 border  dark:bg-zinc-950 ">
              <h1
                className="text-center py-4
               font-extrabold dark:text-sky-500 border-b border-gray-500"
              >
                Recent Expenses
              </h1>
              <List className="w-full text-sm font-bold text-center">
                <ListItem className="flex w-full hover:dark:bg-neutral-900 dark:bg-neutral-900 hover:text-yellow-500 rounded-none border-b border-gray-500 justify-between text-md font-extrabold text-center dark:text-yellow-400">
                  <div className="basis-1/4">
                    <p>Title</p>
                  </div>
                  <div className="basis-1/4">
                    <p>Type</p>
                  </div>
                  <div className="basis-1/4">
                    <p>Amount</p>
                  </div>
                </ListItem>
                {transactions.length === 0 ? (
                  <p className="dark:text-pink-600 font-bold text-md">
                    No transactions
                  </p>
                ) : (
                  transactions.slice(0,5).map((transaction) => (
                    <ListItem
                      key={transaction._id}
                      className="flex dark:hover:bg-zinc-900 w-full rounded-none justify-between border-b border-gray-500 last:border-none text-md font-extrabold text-center"
                    >
                      <div className="basis-1/4">
                        <p className="dark:text-white">
                          {transaction.category}
                        </p>
                      </div>
                      <div className="basis-1/4">
                        <p
                          className={
                            transaction.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {transaction.type}
                        </p>
                      </div>
                      <div className="basis-1/4">
                        <p className="dark:text-white">${transaction.amount}</p>
                      </div>
                    </ListItem>
                  ))
                )}
              </List>
            </Card>
          </div>


          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-neutral-900 rounded-lg p-5 w-11/12 sm:w-96">
                <h2 className="text-md font-extrabold mb-4 text-center dark:text-blue-500">
                  Add New Expense
                </h2>
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
        </div>
      )}
    </div>
  );
}

export default DashBoard;
