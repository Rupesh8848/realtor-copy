import React from 'react'
import { toast } from 'react-toastify';
import Spinner from '../Components/Spinner';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import {v4 as uuidv4} from "uuid"
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { useNavigate, useParams } from 'react-router-dom';
export default function CreateListing() {
    const auth = getAuth()
    const navigate = useNavigate()
    const [geoloactionEnabled, setGeolocationEnabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [listing, setListing] = React.useState(null)
    const [formData, setFormData] = React.useState({
        type:'rent',
        name: '',
        bedrooms:1,
        bathrooms:1,
        parking:false,
        furnished: false,
        address: '',
        description:'',
        offer:false,
        regularPrice:0,
        discountedPrice:0,
        latitude: 0,
        longitude: 0,
        images: {}
    })

    const params = useParams()


    React.useEffect(()=>{
        if(listing && listing.userRef !== auth.currentUser.uid){
            toast.error("You cannot edit this listing.")
            navigate("/")
        }
    },[listing, navigate])



    React.useEffect(()=>{
        setLoading(true)
        async function fetchListing(){
            const docRef = doc(db,"listings", params.listingId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setListing(docSnap.data())
                setFormData({
                    ...docSnap.data(),

                })
            }else{
                navigate("/")
                toast.error("Listings doesn't exist.")
            }
        }
        fetchListing()
        setLoading(false)
    },[navigate, params.listingId])



    function onChange(event){
        let boolean = null;
        if(event.target.value === "true"){
            boolean = true
        }
        if(event.target.value === "false"){
            boolean = false
        }

        if(event.target.files){
            setFormData(oldState => ({
                ...oldState,
                images: event.target.files
            }))
        }

        if(!event.target.files){
            setFormData(oldState =>({
                ...oldState,
                [event.target.id]: boolean ?? event.target.value, 
            }))
        }
        

    }

    


    async function handleSubmit(event){
        event.preventDefault();
        setLoading(true);
        if( +discountedPrice >= +regularPrice){
            setLoading(false)
            toast.error("Discounted Price needs to be less than Regular Price.")
            return;
        }

        if(images.length > 6){
            setLoading(false)
            toast.error("Maximum 6 images are allowed.")
            return
        }

        let geolocation = {}
        if(geoloactionEnabled){
            console.log("LOL need to pay.!!")
        }
        else{
            geolocation.lat = latitude
            geolocation.lng = longitude
        }

        async function storeImage(img){
            return new Promise((resolve, reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`
                const storageRef = ref(storage, filename)
                const uploadTask = uploadBytesResumable(storageRef,img)

                uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    reject(error)
                }, 
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                    });
                }
                );
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image)=> storeImage(image))).catch((error)=>{
                setLoading(false)
                toast.error("Images not uploaded.")
                return
            })
        
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid
        }

        delete formDataCopy.latitude
        delete formDataCopy.longitude
        delete formDataCopy.images
        !formDataCopy.offer && delete formDataCopy.discountedPrice
        const docRef = await updateDoc(doc(db,"listings",params.listingId), formDataCopy)
        setLoading(false)
        toast.success("Listing updated.")
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    } 

    if(loading){
        return <Spinner />
    }
    // console.log(formData)

    const {type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice,discountedPrice,
    latitude, longitude, images} = formData
  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Edit Listing</h1>
        <form onSubmit={handleSubmit}>
            <p className='text-lg mt-6 font-semibold '>Sell / Rent</p>
            <div className='flex'>
                <button type='button' id="type" value= "sell"
                onClick={onChange}
                className={`mr-3  px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${type === "rent"? "bg-white text-black":"bg-slate-600 text-white"}`}>Sell</button>

                <button type='button' id="type" value="rent"
                onClick={onChange}
                className={`ml-3 px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${type === "sell"? "bg-white text-black":"bg-slate-600 text-white"}`}>Rent</button>

            </div>

            <p className='text-lg mt-6 font-semibold'>Name</p>
            <input type="text" id="name" value={name} onChange={onChange}
            placeholder="Property Name" maxLength="32" minLength="10" 
            required className='w-full px-4 py-2 text-xl text-gray-700
            bg-white border border-gray-300 rounded transition
            duration-100 ease-in-out focus:text-gray-700
            focus:bg-white focus:border-slate-600 mb-6'/>

            <div className='flex space-x-6 mb-6'>
                <div className=''>
                    <p className='w-full text-lg font-semibold'>Beds</p>
                    <input type="number" id="bedrooms" value={bedrooms} 
                    onChange={onChange} min="1" max="50" required
                    className='px-4 py-2 text-lg text-gray-700 bg-white
                    border border-gray-300 rounded transition-none duration-150
                    ease-in-out focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center' />
                </div>

                <div className=''>
                    <p className='w-full text-lg font-semibold'>Baths</p>
                    <input type="number" id="bathrooms" value={bathrooms} 
                    onChange={onChange} min="1" max="50" required
                    className='px-4 py-2 text-lg text-gray-700 bg-white
                    border border-gray-300 rounded transition-none duration-150
                    ease-in-out focus:text-gray-700 focus:bg-white 
                    focus:border-slate-600 text-center' />
                </div>
            </div>


            <p className='text-lg mt-6 font-semibold '>Parking</p>
            <div className='flex'>
                <button type='button' id="parking" value={true}
                onClick={onChange}
                className={`mr-3  px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${!parking ? "bg-white text-black":"bg-slate-600 text-white"}`}>Yes</button>

                <button type='button' id="parking" value={false}
                onClick={onChange}
                className={`ml-3 px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${parking? "bg-white text-black":"bg-slate-600 text-white"}`}>No</button>

            </div>


            <p className='text-lg mt-6 font-semibold '>Furnished</p>
            <div className='flex'>
                <button type='button' id="furnished" value={true}
                onClick={onChange}
                className={`mr-3  px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${!furnished? "bg-white text-black":"bg-slate-600 text-white"}`}>Yes</button>

                <button type='button' id="furnished" value={false}
                onClick={onChange}
                className={`ml-3 px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${furnished? "bg-white text-black":"bg-slate-600 text-white"}`}>No</button>

            </div>


            <p className='text-lg mt-6 font-semibold'>Address</p>
            <textarea type="text" id="address" value={address} onChange={onChange}
            placeholder="Address"
            required className='w-full px-4 py-2 text-xl text-gray-700
            bg-white border border-gray-300 rounded transition
            duration-100 ease-in-out focus:text-gray-700
            focus:bg-white focus:border-slate-600 mb-6'/>

            <p className='text-lg font-semibold'>Description</p>
            <textarea type="text" id="description" value={description} onChange={onChange}
            placeholder="Address"
            required className='w-full px-4 py-2 text-xl text-gray-700
            bg-white border border-gray-300 rounded transition
            duration-100 ease-in-out focus:text-gray-700
            focus:bg-white focus:border-slate-600 mb-6'/>

            {!geoloactionEnabled && (
                <div className='flex space-x-6 justify-start mb-6 '>
                    <div>
                        <p className='text-lg font-semibold'>Latitude</p>
                        <input type="number" id="latitude" value={latitude}
                        onChange={onChange} required
                        className='w-full px-4 py-4 text-xl
                        text-gray-700 bg-white border border-gray-300
                        rounded transition duration-150 ease-in-out
                        focus:bg-white focus:text-gray-700
                        focus:border-slate-600 text-center'
                        min="-90"
                        max="90"/>
                    </div>

                    <div>
                        <p className='text-lg font-semibold'>Longitude</p>
                        <input type="number" id="longitude" value={longitude}
                        onChange={onChange} required
                        className='w-full px-4 py-4 text-xl
                        text-gray-700 bg-white border border-gray-300
                        rounded transition duration-150 ease-in-out
                        focus:bg-white focus:text-gray-700
                        focus:border-slate-600 text-center'
                        min="-180"
                        max="180"/>
                    </div>
                </div>
            )}

            <p className='text-lg font-semibold '>Offer</p>
            <div className='flex mb-6'>
                <button type='button' id="offer" value={true}
                onClick={onChange}
                className={`mr-3  px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${!offer? "bg-white text-black":"bg-slate-600 text-white"}`}>Yes</button>

                <button type='button' id="furnished" value={false}
                onClick={onChange}
                className={`ml-3 px-7 py-3 font-medium text-sm
                uppercase shadow-md rounded hover:shadow-lg
                focus:shadow-lg active:shadow-lg
                trasition duration-150 ease-in-out w-full
                ${offer? "bg-white text-black":"bg-slate-600 text-white"}`}>No</button>

            </div>


            <div className='flex items-center mb-6'>
                <div>
                    <p className='text-lg font-semibold '>Regular Price</p>
                    <div className='flex w-full justify-center items-center
                    space-x-6 '>
                        <input type="number" id="regularPrice" value={regularPrice}
                        onChange={onChange} min="50" max="400000000" required={offer}
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white
                        border border-gray-300 rounded transition duration-150
                        ease-in-out focus:text-gray-700 focus:bg-white
                        focus:border-slate-600 text-center'/>

                        {type === "rent" && (
                            <div>
                                <p className='text-md w-full whitespace-nowrap
                                '>$ /Month</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
            {offer && (
                <div className='flex items-center mb-6'>
                <div>
                    <p className='text-lg font-semibold '>Discounted Price</p>
                    <div className='flex w-full justify-center items-center
                    space-x-6 '>
                        <input type="number" id="discountedPrice" value={discountedPrice}
                        onChange={onChange} min="50" max="400000000" required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white
                        border border-gray-300 rounded transition duration-150
                        ease-in-out focus:text-gray-700 focus:bg-white
                        focus:border-slate-600 text-center'/>

                        {type === "rent" && (
                            <div>
                                <p className='text-md w-full whitespace-nowrap
                                '>$ /Month</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            )}                    


            <div className='mb-6'>
                <p className='text-lg font-semibold '>Images</p>
                <p className='text-gray-600 '>The first image will be cover (max 6)</p>
                <input type="file" id="images" onChange={onChange}
                accept=".jpg,.png,.jpeg"
                multiple
                required
                className='w-full px-3 py-1.5 text-gray-700 bg-white
                bordergray300 rounded transition duration-150 ease-in-out
                focus:bg-white focus:border-slate-600 '/>
            </div>                    

            <button type='submit' className='
            mb-6 w-full px-7 py-3 bg-blue-600
            text-white font-medium text-sm uppercase rounded
            shadow-md hover:bg-blue-700 hover:shadow-lg
            focus:bg-blue-700 focus:shadow-lg
            active:bg-blue-800 active:shadow-lg transition
            duration-150 ease-in-out'>Edit Listing</button>
        </form>
    </main>
  )
}
