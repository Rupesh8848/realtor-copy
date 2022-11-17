import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import OAuth from '../Components/OAuth'
export default function ForgotPassword() {
  
  const [email, setEmail] = React.useState("")


  function handleChange(event){
    setEmail(event.target.value)
  }

  async function handleSubmit(event){
    event.preventDefault();
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Email sent successfully.")
    } catch (error) {
      toast.error("Couldn't send the reset email.")
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
          <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
           <img src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80' alt='Key' className='w-full rounded-2xl'/>
          </div >
          
          <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
            <form onSubmit={handleSubmit}>
              <input type="email" 
              className='w-full px-4 py-2 text-x1 text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out mb-6' 
              id='email' value={email} onChange={handleChange}
              placeholder="Email Address"/>

              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                <p className='mb-6'>Don't have a account? 
                  <Link to="/sign-up" className='text-red-600
                  hover:tet-red-700 transition duration-200 ease-in-out
                  ml-1'>Register</Link>
                </p>
                <p>
                  <Link to="/sign-in"
                  className='text-blue-600
                  hover:tet-blue-800 transition duration-200 ease-in-out
                  ml-1'>
                  Sign In instead</Link>
                </p>
              </div>
            <button type='submit' className='
            w-full bg-blue-600 text-white px-7 py-3 text-sm
            font-medium uppercase rounded shadow-md hover:bg-blue-700
            transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Send Reset Mail</button>

            <div className='my-4 before:border-t flex before:flex-1 items-center
            before:border-gray-300
            after:border-t
            after:flex-1
            after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth/>
          </form>
          </div>
      </div>
      </section>

  )
}
