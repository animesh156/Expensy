import { Avatar, Typography } from "@material-tailwind/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import {  useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import { logout, reset } from '../features/auth/authSlice'

ChartJS.register(ArcElement, Tooltip, Legend);

function Profile() {
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }



  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:6888/expense",{ headers: {
          'Authorization': `Bearer ${token}`
        }});
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions to only show expenses
 

  const groupedExpenses = transactions.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Prepare data for the pie chart
  const chartData = {
    labels: Object.keys(groupedExpenses),
    datasets: [
      {
        data: Object.values(groupedExpenses),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
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

  const user = localStorage.getItem('user')
 
  const userName = JSON.parse(user).name
  

  return (
    <div className="flex flex-col md:justify-evenly p-6 mt-10  items-center md:flex-row gap-8 border-0 ">


    <div className="flex-col items-center text-center ml-3">

    <div >
        <Avatar
          src="https://docs.material-tailwind.com/img/face-2.jpg"
          alt="avatar"
          className="w-32 h-32"
        />
      </div>

      <div className="mt-5">
        <Typography
          variant="h6"
          className="text-3xl font-bold dark:text-blue-500"
        >
          {userName}
        </Typography>

        <button
          type="button"
          onClick={onLogout}
          className="focus:outline-none mt-7 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          LogOut
        </button>
      </div>

    </div>

      

      {/* Pie Chart */}
      <div className="max-w-lg  ">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default Profile;
