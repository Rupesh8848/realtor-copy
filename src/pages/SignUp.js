import React from 'react'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import { Link } from 'react-router-dom'
import OAuth from '../Components/OAuth'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {db} from '../Firebase/firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
export default function SignUp() {
  const [formData, setFormData] = React.useState({
    email:'',
    password:'',
    name:'',
  })

  const [showPassword, setShowPassword] = React.useState(false)

  function handleChange(event){
    setFormData(oldData =>{
      return {
        ...oldData,
        [event.target.id] : event.target.value
      }
    })
  }

  const {email, password, name} = formData;
  const navigate = useNavigate();
  async function handleSubmit(event){
    event.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      updateProfile(auth.currentUser, {
        displayName: name
      })
      const user = userCredentials.user
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db,"users", user.uid),formDataCopy)
      // toast.success("SignUp was successful.")
      navigate("/")
    } catch (error) {
      toast.error("Something went wrong with the registration.")
    }
  }


  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
          <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
           <img src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80' alt='Key' className='w-full rounded-2xl'/>
          </div >
          
          <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
            <form onSubmit={handleSubmit}>
            <input type="text" 
              className='w-full px-4 py-2 text-x1 text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out mb-6' 
              id='name' value={name} onChange={handleChange}
              placeholder="Full Name"/>


              <input type="email" 
              className='w-full px-4 py-2 text-x1 text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out mb-6' 
              id='email' value={email} onChange={handleChange}
              placeholder="Email Address"/>

              <div className='relative mb-6'>
              <input type={showPassword?"text":"password"} 
              className='w-full px-4 py-2 text-x1 text-gray-700 bg-white
              border-gray-300 rounded transition ease-in-out' 
              id='password' 
              value={password} 
              onChange={handleChange}
              placeholder="Password"/>

              {showPassword? <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword(oldState=>!oldState)}/>:<AiFillEye 
              className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword(oldState=>!oldState)}/>}

              </div>
              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                <p className='mb-6'>Have an account? 
                  <Link to="/sign-up" className='text-red-600
                  hover:text-red-700 transition duration-200 ease-in-out
                  ml-1'>Sign In</Link>
                </p>
                <p>
                  <Link to="/forgot-password"
                  className='text-blue-600
                  hover:text-blue-800 transition duration-200 ease-in-out
                  ml-1'>
                  Forgot Password</Link>
                </p>
              </div>
            <button type='submit' className='
            w-full bg-blue-600 text-white px-7 py-3 text-sm
            font-medium uppercase rounded shadow-md hover:bg-blue-700
            transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Sign Up</button>

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
