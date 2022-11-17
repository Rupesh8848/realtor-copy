import React from 'react'
import { Link } from 'react-router-dom'
import Moment from "react-moment"
import {MdLocationOn} from "react-icons/md"
import { list } from 'postcss'
import {FaTrash} from "react-icons/fa"
import {MdEdit} from "react-icons/md"
export default function ListingItem(props) {
    const {listing, id, onDelete, onEdit} = props
    console.log(listing)
  return (
    <li className=' relative bg-white flex flex-col justify-between
    items-center shadow-md hover:shadow-lg rounded-md
    overflow-hidden transition-shadow duration-150 m-[10px]'>
        <Link className='contents' to={`/category/${listing.type}/${id}`}>
            <img src={listing.imgUrls[0]}
            alt="" className='h-[170px] w-full object-cover
            hover:scale-150 transition duration-500
            ease-in overflow-hidden'
            loading='lazy'/>
            <Moment fromNow className='absolute 
            top-2 left-2 bg-[#3377cc] text-white uppercase
            text-xs font-semibold rounded-md px-2 py-1 shadow-lg'>{listing.timestamp ?.toDate()}</Moment>
            <div className='w-full p-[10px]'>
                <div className='flex items-center space-x-1'>
                    <MdLocationOn className='h-4 w-4 space-x-1'/>
                <p className='font-semibold textsm mb-[2px]
                text-gray-600 truncate'>{listing.address}</p>
                </div>
            </div>
            <p className='font-semibold m-0 text-xl '>{listing.name}</p>
            <p className='text-[#457b9d] mt-2 font-semibold'>{(listing.offer ? listing.discountedPrice : listing.regularPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && "/ month"}
            </p>

            <div className='flex items-center mt-[10px] space-x-3'>
                <div className='flex items-center space-x-1'>
                    <p className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds`:
                    `1 Bed`}</p>
                </div>
                <div>
                <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths`:
                    `1 Bath`}</p>
                </div>
            </div>

        </Link>
        {onDelete && (
            <FaTrash className='absolute bottom-2 right-2 h-[14px] cursor-pointer
            text-red-500' onClick={()=>onDelete(listing.id)}/>
        )}

        {onEdit && (
            <MdEdit className='absolute bottom-2 right-7 h-4 cursor-pointer' onClick={()=>onEdit(listing.id)}/>
        )}
    </li>
  )
}
