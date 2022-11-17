import { collection, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import React from "react"
import { Link } from "react-router-dom"
import Slider from "../Components/Slider"
import { db } from "../Firebase/firebase"
import ListingItem from "../Components/ListingItem"
export default function Home(){

    const [offerListings, setOfferListings] = React.useState(null)
    React.useEffect(()=>{
        async function fetchListings(){
            try {
                const listingsRef = collection(db,"listings")
                const q = query(listingsRef,where("offer","==", true),orderBy("timestamp","desc"));
                const snapshot = await getDocs(q)
                const listings = []
                snapshot.forEach(doc =>{
                     listings.push({
                        id: doc.id,
                        data:doc.data(),
                    })
                })
                setOfferListings(listings)
            } catch (error) {
                console.log(error)
            }
        }
        fetchListings()
    },[])


    const [rentListings, setRentListings] = React.useState(null)
    React.useEffect(()=>{
        async function fetchListings(){
            try {
                const listingsRef = collection(db,"listings")
                const q = query(listingsRef,where("type","==", "rent"),orderBy("timestamp","desc"));
                const snapshot = await getDocs(q)
                const listings = []
                snapshot.forEach(doc =>{
                     listings.push({
                        id: doc.id,
                        data:doc.data(),
                    })
                })
                setRentListings(listings)
            } catch (error) {
                console.log(error)
            }
        }
        fetchListings()
    },[])


    const [sellListings, setSellListings] = React.useState(null)
    React.useEffect(()=>{
        async function fetchListings(){
            try {
                const listingsRef = collection(db,"listings")
                const q = query(listingsRef,where("type","==", "sell"),orderBy("timestamp","desc"));
                const snapshot = await getDocs(q)
                const listings = []
                snapshot.forEach(doc =>{
                     listings.push({
                        id: doc.id,
                        data:doc.data(),
                    })
                })
                setSellListings(listings)
            } catch (error) {
                console.log(error)
            }
        }
        fetchListings()
    },[])

    return (
        <>
            <Slider />
            <div className="max-w-6xl mx-auto pt4 space-y-6">
                {offerListings && offerListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
                        <Link to="/offers">
                            <p className="px-3 text-sm text-blue-600
                            hover:text-blue-800 transition duration-150 ease-in-out
                            ">Show more offers</p>

                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3
                        xl:grid-cols-4">
                            {offerListings.map((listing)=>{
                                return <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                            })}
                        </ul>
                    </div>
                )}


                {rentListings && rentListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
                        <Link to="/category/rent">
                            <p className="px-3 text-sm text-blue-600
                            hover:text-blue-800 transition duration-150 ease-in-out
                            ">Show more places for rent</p>

                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3
                        xl:grid-cols-4">
                            {rentListings.map((listing)=>{
                                return <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                            })}
                        </ul>
                    </div>
                )}

                {sellListings && sellListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sell</h2>
                        <Link to="/category/sell">
                            <p className="px-3 text-sm text-blue-600
                            hover:text-blue-800 transition duration-150 ease-in-out
                            ">Show more places to sell</p>

                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3
                        xl:grid-cols-4">
                            {sellListings.map((listing)=>{
                                return <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                            })}
                        </ul>
                    </div>
                )}


            </div>
        </>
    ) 
}