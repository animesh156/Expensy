import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
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
      {user || parsedUser ? ( // Render Navbar only if a user is logged in
        <div className="flex-col bg-gray-300 text-center w-fit md:w-auto dark:bg-zinc-900 h-full">
          <div>
            <Avatar
              src={avatar} // Use the avatar from localStorage or Redux
              alt="User Avatar"
              className="mt-6"
            />
            <p className="mt-1 font-bold dark:text-pink-600">{userName}</p>
          </div>

          <div>
            <ul className="space-y-4 dark:text-teal-500">
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
              <Link to="/stats">
                <li className="hover:bg-gray-200 mb-8 font-bold rounded cursor-pointer">
                  Stats
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
        null // Show nothing if no user is logged in
      )}
    </>
  );
}

export default Navbar;
