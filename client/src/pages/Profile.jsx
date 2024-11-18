import { Avatar, Typography,Card } from "@material-tailwind/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import {  useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import { logout, reset } from '../features/auth/authSlice'
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

function Profile() {
  const [transactions, setTransactions] = useState([]);
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }



  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://expensy-backend.vercel.app/expense",{ headers: {
          'Authorization': `Bearer ${token}`
        }});
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false)
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

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // Extract `name` and `avatar` from localStorage or set defaults
  const userName = user?.name || parsedUser?.name || "Guest";
  const avatar = user?.avatar || parsedUser?.avatar || "/default-avatar.png"; // Use a default avatar if none is provided

  // Calculate Total Income and Expense
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
        <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      </div>
      );
    }

  return (
    <>
     <div className="flex flex-col md:justify-evenly p-5 mt-3   items-center md:flex-row gap-8 border-0 ">


<div className="flex-col items-center text-center ml-3">

<div >
    <Avatar
      src={avatar}
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
      className="focus:outline-none mt-7 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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

 {/* Total Income and Expense */}
 <div className="flex justify-evenly mt-16 px-3 gap-5 flex-wrap mb-5">
        <Card className="p-3 w-auto md:w-52 text-center flex-row justify-around  items-center bg-green-100 text-wrap">
         
       
       
       <h2 className="text-sm md:text-md font-semibold text-green-800 mr-2">Total Income: </h2>
       <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
     
        
        </Card>

        
        <Card className="p-3 w-auto md:w-52 text-center flex-row justify-around items-center bg-red-100">
         

         <h2 className="text-sm md:text-md font-semibold text-red-800 mr-2">Total Expense: </h2>
         <p className="text-2xl font-bold text-red-600">${totalExpense}</p>

        
          
        </Card>
      </div>

    </>
   
  );
}

export default Profile;
