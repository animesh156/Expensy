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
  const [loading, setLoading] = useState(false);

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
  }, []);

  const getDailyData = () => {
    const dailySums = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
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
          tension: 0.4,
        },
      ],
    };
  };

  const getMonthlyData = () => {
    const monthlySums = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
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
          backgroundColor: colors,
        },
      ],
    };
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
      <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center h-screen gap-5 px-4 py-8">
      {/* Daily Expenses Chart */}
      <div className="w-full lg:w-1/2 xl:w-5/12 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg mb-4 text-center dark:text-cyan-400">
          Daily Expenses
        </h2>
        <div className="aspect-w-16 aspect-h-9 ">
          <Line data={getDailyData()} options={{ responsive: true }} />
        </div>
      </div>

      {/* Monthly Expenses Chart */}
      <div className="w-full lg:w-1/2 xl:w-5/12 bg-white dark:bg-zinc-950 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-lg mb-4 text-center dark:text-cyan-400">
          Monthly Expenses
        </h2>
        <div className="aspect-w-16 aspect-h-9 ">
          <Bar data={getMonthlyData()} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

export default Stats;
