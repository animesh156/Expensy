import { Avatar } from "@material-tailwind/react";

import { Link } from "react-router-dom";
import {useSelector} from 'react-redux'

function Navbar() {
  const { user } = useSelector((state) => state.auth)


  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userName = parsedUser?.name || "Guest"; // Default to "Guest" if no name is found

  



  return (
    <>
      {user ? (
        // Render Navbar if user is logged in
        <div className="flex-col bg-gray-300 text-center w-fit md:w-auto dark:bg-zinc-900 h-full">
          <div>
            <Avatar
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="avatar"
              className="mt-6"
            />
            <p className="mt-1 font-bold dark:text-pink-600">{userName}</p>
          </div>

          <div>
            <ul className="space-y-4 dark:text-teal-500 ">
              <Link to="/dashboard">
                <li className="hover:bg-gray-200 mt-12 mb-8 font-bold rounded cursor-pointer">
                  Home
                </li>
              </Link>

              <Link to="/income">
                <li className="hover:bg-gray-200 mb-8 font-bold rounded cursor-pointer">
                  Income
                </li>
              </Link>

              <Link to="/expenses">
                <li className="hover:bg-gray-200 mb-8 font-bold rounded cursor-pointer">
                  Expense
                </li>
              </Link>

              <Link to="/profile">
                <li className="hover:bg-gray-200 font-bold rounded cursor-pointer">
                  Profile
                </li>
              </Link>
            </ul>
          </div>
        </div>
      ) : (
        // Show nothing if user is not logged in
        null
      )}
    </>
  );
}

 

 

export default Navbar;
