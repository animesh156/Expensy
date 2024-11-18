import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, Card } from "@material-tailwind/react";
import { BsGraphUpArrow, BsGraphDownArrow  } from "react-icons/bs";

function DashBoard() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    type: "expense",
  });
  
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get("http://localhost:6888/expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data.slice(-5).reverse());
    };
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:6888/expense", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTransactions([response.data, ...transactions].slice(0, 5));
    setForm({ amount: "", category: "", description: "", type: "expense" });
    setShowModal(false);
  };

  const getToken = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    }
    return null;
  };

  const token = getToken();

  // Calculate Total Income and Expense
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div>
     

      {/* Recent Expenses Card */}
      <div className="flex-col px-4 text-center mt-8">
        <Card className="w-full md:max-w-lg h-56 dark:bg-zinc-900 m-auto">
          <h1 className="text-center font-extrabold dark:text-sky-500 border-b border-white">
            Recent Expenses
          </h1>
          <List className="dark:text-red-500 text-sm font-bold text-center">
            <ListItem className="flex justify-between text-center -mt-4 dark:text-yellow-400">
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
          className="text-white bg-gradient-to-r mb-5 mt-7 font-bold from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm px-5 py-2.5 mx-auto block"
        >
          + New Expense
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-5 w-11/12 sm:w-96">
            <h2 className="text-lg font-bold mb-4">Add New Expense</h2>
            <form
              onSubmit={handleSubmit}
              className="flex items-center flex-col"
            >
              <input
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="border-2 mb-3 w-full px-2 py-1 border-gray-300 rounded-md"
              />
              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="border-2 mb-3 w-full px-2 py-1 border-gray-300 rounded-md"
              />
              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border-2 mb-3 w-full px-2 py-1 border-gray-300 rounded-md"
              />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border-2 mb-3 w-full px-2 py-1 border-gray-300 rounded-md"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

       {/* Total Income and Expense */}
       <div className="flex justify-evenly mt-16 ">
        <Card className="p-4 w-auto md:w-52 text-center flex-row justify-around items-center bg-green-100">
          <div className="basis-1/5 mr-3">
          <BsGraphDownArrow size={28} />
          </div>
       
       <div>
       <h2 className="text-md font-semibold text-green-800">Income</h2>
       <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
       </div>
        
        </Card>

        
        <Card className="p-4 w-auto md:w-52 text-center flex-row justify-around items-center bg-red-100">
          <div className="basis-1/5 mr-3">
          <BsGraphUpArrow size={28}/>
          </div>

         <div>

         <h2 className="text-md font-semibold text-red-800">Expense</h2>
         <p className="text-2xl font-bold text-red-600">${totalExpense}</p>

         </div>
          
        </Card>
      </div>

    </div>
  );
}

export default DashBoard;
