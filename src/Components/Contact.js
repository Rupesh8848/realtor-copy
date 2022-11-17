import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { toast } from 'react-toastify'
import { db } from '../Firebase/firebase'

export default function Contact(props) {
    const [message, setMessage] = React.useState("")
    const {userRef, listing} = props
    const [landlord, setLandlord] = React.useState(null)
    React.useEffect(()=>{
        async function getLandlord(){
            const docRef = doc(db, "users", userRef)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setLandlord(docSnap.data())
            }else{
                toast.error("Couldn't get landlord data.")
            }
        }

     getLandlord()
    },[userRef])

    function handleChange(event){
        setMessage(event.target.value)
    }

  return (
    <>{landlord !== null && (
        <div className='flex flex-col w-full'>
            <p>Contact {landlord.name} for the {listing.name.toLowerCase()}</p>
            <div className='mt-3 mb-6'>
                <textarea name="message" id="message"
                rows="2" value={message}
                onChange = {handleChange}
                className="w-full px-4 py-2 text-xl text-gray-700
                bg-white border border-gray-300 rounded transition duration-150
                ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                ></textarea>
            </div>

            <a href={`mailto: ${landlord.email}?Subject=${listing.name}&
            body=${message}`}>
                <button type="button" className='px-7 py-3 bg-blue-600
                text-white rounded text-sm uppercase 
                shadow-md hover:bg-blue-700
                hover:shadow-lg 
                focus:bg-blue-700
                focus:shadow-lg
                active:bg-blue-800 mb-6
                active:shadow-lg transition duration-150 ease-in-out w-full text-center'>Send Message</button>
            </a>

        </div>
    )}</>
  )
}
