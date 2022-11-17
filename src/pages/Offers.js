import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import React from 'react'
import { toast } from 'react-toastify'
import ListingItem from '../Components/ListingItem'
import Spinner from '../Components/Spinner'
import { db } from '../Firebase/firebase'

export default function Offers() {
  const [listings, setListings] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [lastFetchedListing, setLastFetchedListing] = React.useState(null)
  React.useEffect(()=>{
    async function getListings(){
      try {
        const listingRef = collection(db,"listings")
        const q = query(listingRef,where("offer","==",true), orderBy("timestamp", "desc"),limit(8))
        const querySnap = await getDocs(q)
        const lastVisible = querySnap.docs[querySnap.docs.length -1]
        setLastFetchedListing(lastVisible)
        const listings = []
        querySnap.forEach((doc)=>{
          console.log(doc.data())
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Error fetching listings.")
      }
    }
    getListings()
  },[])

  async function handleFetchMore(){
    try {
      const listingRef = collection(db,"listings")
      const q = query(listingRef,where("offer","==",true), orderBy("timestamp", "desc"),startAfter(lastFetchedListing),limit(4))
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length -1]
      setLastFetchedListing(lastVisible)
      const listings = []
      querySnap.forEach((doc)=>{
        console.log(doc.data())
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(prevState =>([
        ...prevState,
        ...listings,
      ]))
      setLoading(false)
    } catch (error) {
      toast.error("Error fetching listings.")
    }
  }


  return (
    
    <div className='max-w-6xl mx-auto px-3'>
    
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>Offers</h1>
      {loading?(
        <Spinner/>
      ):listings && listings.length > 0 ? (
        <>
          <main>
            
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            2xl:grid-cols-5'>
              {listings.map(listing=><ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              )}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className='flex justify-center items-center '>
              <button className='bg-white px-3 py-1.5 text-gray-700 border 
              border-gray-300 mb-6 mt-6 hover:border-slate-600 transition rounded 
              duration-150 ease-in-out'
              onClick={handleFetchMore}>Load More</button>
            </div>
          )}
        </>
      ):(
        <p>There are no current offers</p>
      )}

    </div>
    
  )
}
