import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { toast } from 'react-toastify'
import { db } from '../Firebase/firebase'
import {useNavigate} from "react-router-dom"

export default function OAuth() {

  const navigate = useNavigate()
  async function handleGoogleClick(){
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      //check if user already exists
      const docRef = doc(db,"users",user.uid) //database ref
      const docSnap = await getDoc(docRef) //checks if account exists in database
      if(!docSnap.exists()){ //if account doesn't exists
        await setDoc(docRef, { //set data in database
          name: user.displayName,  //parameters
          email: user.email,  //parameters
          timestamp: serverTimestamp(), //parameters
        })
      }
      navigate('/')
    } catch (error) {
      toast.error("Couldn't authorize with Google.")
    }
  }

  return (
    <button type='button' onClick={handleGoogleClick} className='flex items-center justify-center w-full bg-red-700
    text-white px-7 py-3 uppercase text-sm font-medium
    hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg
    transition duration-150 ease-in-out rounded '>
        <FcGoogle className='text-2xl bg-white rounded-full mr-2'/>
        Continue with Google
    </button>
  )
}
