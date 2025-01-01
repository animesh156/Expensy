import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { MdOutlinePayments } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  // State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Get the logged-in user data from Redux
  const { user } = useSelector((state) => state.auth);

  // Fallback to localStorage if Redux `user` is not set
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // Extract `name` and `avatar` from localStorage or set defaults
  const userName = user?.name || parsedUser?.name || "Guest";
  const avatar = user?.avatar || parsedUser?.avatar || "/default-avatar.png"; // Use a default avatar if none is provided

  return (
    <>
      {/* Hamburger Menu */}
      <div className="flex items-center justify-between w-12 py-3 text-center bg-gray-300 dark:bg-zinc-950">
        <button
          className="md:hidden text-gray-700 m-auto dark:text-teal-500 focus:outline-none"
          onClick={() => setSidebarOpen(!isSidebarOpen)} // Toggle the sidebar open/close
        >
          {isSidebarOpen ? (
            <IoMdClose className="text-red-500" size={24} /> // Close Icon in Red
          ) : (
            <IoMdMenu className="text-orange-600" size={24} /> // Hamburger Icon in Yellow
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50  h-full bg-gray-300 dark:bg-zinc-950 p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 w-auto md:w-40  xl:w-52 `}
      >
        {/* Close Button Inside Sidebar */}
        <button
          className="absolute top-4 right-4 text-white text-2xl md:hidden"
          onClick={() => setSidebarOpen(false)} // Close button functionality
        >
          <IoMdClose className="text-red-500" /> {/* Close button in red */}
        </button>

        <div className="flex flex-col items-center justify-center m-auto">
  <Avatar
    src={avatar}
    alt="User Avatar"
    className="mt-6"
  />
  <p className="mt-2 text-center font-medium dark:text-pink-600">
    {userName}
  </p>
</div>


        <div>
          <ul className="space-y-6 mt-8 dark:text-gray-400">
            <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
              <li className="hover:text-blue-500 flex items-center gap-x-2 py-2 px-4 rounded font-bold text-sm cursor-pointer">
              <IoHomeOutline size={18} />  Home
              </li>
            </Link>
            <Link to="/income" onClick={() => setSidebarOpen(false)}>
              <li className="hover:text-blue-500 flex items-center gap-x-2 py-2 px-4 rounded font-bold text-sm cursor-pointer">
               <CiCreditCard1 size={18} /> Income
              </li>
            </Link>
            <Link to="/expenses" onClick={() => setSidebarOpen(false)}>
              <li className="hover:text-blue-500 flex items-center gap-x-2 py-2 px-4 rounded font-bold text-sm cursor-pointer">
               <MdOutlinePayments size={18} /> Expense
              </li>
            </Link>
            <Link to="/stats" onClick={() => setSidebarOpen(false)}>
              <li className="hover:text-blue-500 py-2 flex items-center gap-x-2 px-4 rounded font-bold text-sm cursor-pointer">
              <IoIosStats size={18}/>  Stats
              </li>
            </Link>
            <Link to="/profile" onClick={() => setSidebarOpen(false)}>
              <li className="hover:text-blue-500 flex items-center gap-x-2 py-2 px-4 font-semibold text-sm rounded cursor-pointer">
              <CgProfile size={18}/>  Profile
              </li>
            </Link>
          </ul>
        </div>
      </div>

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 dark:bg-zinc-950 opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)} // Close the sidebar when clicking the overlay
        ></div>
      )}
    </>
  );
}

export default Navbar;
