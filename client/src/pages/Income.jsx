import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function Expenses() {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ category: "", amount: "", description: "" });
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("https://expensy-backend.vercel.app/expense",{ headers: {
          'Authorization': `Bearer ${token}`
        }});
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally{
        setLoading(false)
      }
    };
    fetchTransactions();
  }, []);

  const filteredExpenses = transactions.filter((val) => val.type === "income");

  const handleOpenModal = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
    setIsEditing(false); // Ensure modal opens in view mode by default
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
    setFormData({ category: "", amount: "", description: "" }); // Reset form
  };



  const handleDelete = async (id, event) => {
    event.stopPropagation();
    setLoading(true)
    try {
      await axios.delete(`https://expensy-backend.vercel.app/expense/${id}`,{ headers: {
        'Authorization': `Bearer ${token}`
      }},);
      setTransactions((prev) => prev.filter((expense) => expense._id !== id));
      alert("Expense deleted successfully");
    } catch (error) {
      alert("Expense was not deleted");
      console.error("Error deleting expense:", error);
    } finally{
      setLoading(false)
    }
  };



  const handleEdit = (expense, event) => {
    event.stopPropagation();

    setFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || "",
    });
    setSelectedExpense(expense);
    setIsEditing(true);
    setShowModal(true);
  };


  const handleUpdate = async () => {
    setLoading(true)
    try {
      const updatedExpense = { ...formData, type: selectedExpense.type }; // Keep the original type
      await axios.put(`https://expensy-backend.vercel.app/expense/${selectedExpense._id}`,{ headers: {
        'Authorization': `Bearer ${token}`
      }}, updatedExpense);
      setTransactions((prev) =>
        prev.map((expense) =>
          expense._id === selectedExpense._id ? { ...expense, ...updatedExpense } : expense
        )
      );
  
      alert("Expense updated successfully");
      handleCloseModal();
    } catch (error) {
      alert("Failed to update expense");
      console.error("Error updating expense:", error);
    } finally {
      setLoading(false)
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <>
      <div className="text-4xl text-center font-bold mt-3 ">Incomes</div>
      
  {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-96">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

{!loading && (
        <ul className="mt-7 text-center dark:text-yellow-500 font-normal text-sm overflow-y-scroll px-6 md:font-bold  h-96">
          {filteredExpenses.map((expense) => (
            <li
              key={expense._id}
              onClick={() => handleOpenModal(expense)}
              className="flex justify-around border-2 border-gray-500 mb-3 rounded-lg max-w-xl m-auto py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <p>{expense.type}</p>
              <p>{expense.category}</p>
              <p>${expense.amount}</p>

              <div className="flex">
                <MdEdit
                  className="cursor-pointer mr-3 text-green-500"
                  onClick={(event) => handleEdit(expense, event)}
                  size={22}
                />
                <MdDelete
                  className="cursor-pointer text-red-500"
                  onClick={(event) => handleDelete(expense._id, event)}
                  size={22}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-lg w-96">
            {isEditing ? (
              <>
                <h2 className="text-lg font-bold mb-4 dark:text-yellow-500">Edit Expense</h2>
                <form>
                  <label className="block mb-2 dark:text-gray-200">Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:text-gray-200"
                  />
                  <label className="block mb-2 dark:text-gray-200">Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:text-gray-200"
                  />
                  <label className="block mb-2 dark:text-gray-200">Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:text-gray-200"
                  />
                </form>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                >
                  Update
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4 dark:text-yellow-500">Expense Details</h2>
                <p className="mb-4 text-gray-800 dark:text-gray-200">
                  {selectedExpense.description || "No description available"}
                </p>
              </>
            )}
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Expenses;
