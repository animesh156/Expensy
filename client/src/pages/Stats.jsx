import { Line, Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";

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

function Stats() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get("https://expensy-backend.vercel.app/expense", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data.slice(-5).reverse());
    };
    fetchTransactions();
  }, []);

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
          tension: 0.4, // Smoothing lines
        },
      ],
    };
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

  const getToken = () => {
    const user = localStorage.getItem("user"); // Retrieve the user object from localStorage
    if (user) {
      const parsedUser = JSON.parse(user); // Parse the JSON string back into an object
      return parsedUser.token; // Access the token from the parsed object
    }
    return null; // Return null if there's no user data
  };

  const token = getToken();

  return (
    <div className="flex flex-wrap justify-center items-center h-screen gap-5 px-4 py-8">
      {/* Daily Expenses Chart */}
      <div className="w-full lg:w-1/2 xl:w-5/12 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg mb-4 text-center dark:text-cyan-400">Daily Expenses</h2>
        <div className="aspect-w-16 aspect-h-9">
          <Line data={getDailyData()} options={{ responsive: true }} />
        </div>
      </div>

      {/* Monthly Expenses Chart */}
      <div className="w-full lg:w-1/2 xl:w-5/12 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg mb-4 text-center dark:text-cyan-400">Monthly Expenses</h2>
        <div className="aspect-w-16 aspect-h-9 ">
          <Bar data={getMonthlyData()} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

export default Stats;
