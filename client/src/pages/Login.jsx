import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";

import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return (<div className="flex justify-center items-center h-96">
    <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
  </div>)
  }

  return (
    <div 
    className="h-screen w-full bg-cover bg-center flex items-center justify-center log"
    style={{ backgroundImage: "url('/bg.jpg')" }}
     >
     
      <section className=" mx-auto  border-2 border-sky-500 shadow-md shadow-cyan-200 w-80 px-4 py-4 text-center bg-zinc-950  rounded-3xl">
        <form onSubmit={onSubmit} className="py-5 mt-6">
          <div>
            <input
              type="email"
             className="py-2.5 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>

          <div>
            <input
              type="password"
              className="py-2.5 px-3 border-2 border-pink-400 rounded-3xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-black caret-rose-500 text-rose-500 mb-8"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className=" bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Login
            </button>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-cyan-300 text-1xl">
              New User ?{" "}
              <Link to="/register" className="text-green-400 hover:text-green-300">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
