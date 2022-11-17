import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import React from 'react'
import { db } from '../Firebase/firebase'
import Spinner from './Spinner'
import {Swiper, SwiperSlide} from "swiper/react"
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper"
import "swiper/css/bundle"
import { useNavigate } from 'react-router'

export default function Slider() {

    const [listings, setListings] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    SwiperCore.use([Autoplay, Navigation, Pagination])
    const navigate = useNavigate()
    React.useEffect(()=>{
        async function fetchListings(){
            const listingRef = collection(db,"listings")
            const q = query(listingRef,orderBy("timestamp","desc"), limit(5))
            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach((doc)=>listings.push({
                id: doc.id,
                data: doc.data(),
            }))
            setListings(listings)
            setLoading(false)
        }
        fetchListings()
    },[])

    if(loading){
        return <Spinner />
    }

    if(listings.length === 0){
        return <></>
    }

  return listings && <>
    <Swiper 
    slidesPerView={1}
    navigation
    pagination={{type:"progressbar"}}
    effect="fade"
    modules={{EffectFade}}
    autoplay={{delay:3000}}>
    {listings.map(listing=>(
            <SwiperSlide key={listing.id} onClick={()=>navigate(`/category/${listing.data.type}/${listing.id}`)}>
            <div 
            style={{background: `url(${listing.data.imgUrls[0]}) center, no-repeat`, 
            backgroundSize:"cover",}}
            className="relative w-full h-[300px] overflow-hidden">

            </div>

            <p className='text-[#fafaee] absolute left-1
            top-3 font-medium max-w-[90%] bg-[#45b79d] shadow-lg
            opacity-90 p-2 rounded-br-3xl'>{listing.data.name}</p>

<p className='text-[#fafaee] absolute left-1
            bottom-3 font-semibold max-w-[90%] bg-[#e63946] shadow-lg
            opacity-90 p-2 rounded-tr-3xl'>$ {listing.data.discountedPrice??listing.data.regularPrice}
            {listing.data.type === "rent" && " / month"}</p>
        </SwiperSlide>
    )
    )}
    </Swiper>
  </>
}
