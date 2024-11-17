import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, Card } from "@material-tailwind/react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
      const response = await axios.get("http://localhost:6888/expense", { headers: {
        'Authorization': `Bearer ${token}`
      }});
      setTransactions(response.data.slice(-5).reverse());
    };
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:6888/expense", form, { headers: {
      'Authorization': `Bearer ${token}`
    }});
    setTransactions([response.data, ...transactions].slice(0, 5));
    setForm({ amount: "", category: "", description: "", type: "expense" });
    setShowModal(false);
  };

  const getMonthlyData = () => {
    const monthlySums = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date); // Ensure date exists in your API response
      const month = date.toLocaleString("default", { month: "long" });
      if (transaction.type === "expense") {
        monthlySums[month] = (monthlySums[month] || 0) + transaction.amount;
      }
    });

    const labels = Object.keys(monthlySums);
    const data = Object.values(monthlySums);

    const colors = labels.map(
      () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    return {
      labels,
      datasets: [
        {
          label: "Monthly Expenses",
          data,
          backgroundColor: colors, // Use color array
        },
      ],
    };
  };

  // Helper to group expenses by day
  const getDailyData = () => {
    const dailySums = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date); // Ensure date exists in your API response
      const day = date.toLocaleString("default", { weekday: "long" });
      if (transaction.type === "expense") {
        dailySums[day] = (dailySums[day] || 0) + transaction.amount;
      }
    });

    const labels = Object.keys(dailySums);
    const data = Object.values(dailySums);

    return {
      labels,
      datasets: [
        {
          label: "Daily Expenses",
          data,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };
  };

  const getToken = () => {
    const user = localStorage.getItem('user');  // Retrieve the user object from localStorage
    if (user) {
      const parsedUser = JSON.parse(user);      // Parse the JSON string back into an object
      return parsedUser.token;                  // Access the token from the parsed object
    }
    return null;  // Return null if there's no user data
  };
  
  
  
  const token = getToken()

  return (
    <div className="px-7 py-5">

  
    <div >
    {/* Recent Expenses Card */}
    <div className="flex-col text-center ">
      <Card className="max-w-full h-52 sm:max-w-lg dark:bg-zinc-900 m-auto  ">
        <h1 className="text-center font-bold dark:text-sky-500 border-b border-white ">
          Recent Expenses
        </h1>
        <List className="dark:text-red-500 text-sm font-extrabold text-center">
          <ListItem className="flex justify-between -mt-4 dark:text-yellow-400">
            <p>Category</p>
            <p>Type</p>
            <p>Amount</p>
          </ListItem>
          {transactions.map((transaction) => (
            <ListItem
              key={transaction._id}
              className="flex justify-between -mt-4 text-sm"
            >
              <p>{transaction.category}</p>
              <p>{transaction.type}</p>
              <p className="dark:text-sky-400">${transaction.amount}</p>
            </ListItem>
          ))}
        </List>
      </Card>
  
      <button
        onClick={() => setShowModal(true)}
        className="text-white bg-gradient-to-r mb-5 mt-4 font-medium from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm px-5 py-2.5 mx-auto block"
      >
        + New Expense
      </button>
    </div>
  
    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-lg p-5 w-11/12 sm:w-96">
          <h2 className="text-lg font-bold mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="flex items-center flex-col">
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
  
    {/* Charts */}
    <div className="grid gap-6 sm:grid-cols-2 ">
      {/* Monthly Expenses Chart */}
      <div className="bg-white dark:bg-zinc-900 p-4  rounded-lg shadow-md dark:text-green-500">
        <h2 className="font-bold text-lg mb-4">Monthly Expenses</h2>
        <div className="aspect-w-16 aspect-h-9">
          <Bar data={getMonthlyData()} />
        </div>
      </div>
  
      {/* Daily Expenses Chart */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-md dark:text-green-500">
        <h2 className="font-bold text-lg mb-4">Daily Expenses</h2>
        <div className="aspect-w-16 aspect-h-9">
          <Line data={getDailyData()} />
        </div>
      </div>
    </div>
  </div>

  </div>
  
  );
}

export default DashBoard;
