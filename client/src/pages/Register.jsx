import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const { name, email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/dashboard')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

   
      const userData = {
        name,
        email,
        password,
      }

      dispatch(register(userData))
    }
  

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="h-screen w-full bg-cover bg-center flex items-center justify-center log">
     
      <section className=' mx-auto  border-2 border-sky-500 shadow-md shadow-cyan-200 w-80 px-4 py-6 text-center bg-zinc-950  rounded-3xl'>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type='text'
              className='py-2.5 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8'
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
          <div >
            <input
              type='email'
              className='py-2.5 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div >
            <input
              type='password'
              className='py-2.5 px-3 border-2 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-3xl  bg-black caret-yellow-500 text-rose-500 mb-8'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
         
          <div >
          <button type="submit" className="font-bold bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign Up</button>
          </div>

          <div>
           <p className=' font-semibold text-1xl text-cyan-300 mt-3'>Already have an account ? <Link to='/login' className='text-orange-500 font-extrabold '>LogIn</Link></p> 
          </div>
        </form>
      </section>
    </div>
  )
}

export default Register