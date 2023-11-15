import { Link } from "react-router-dom";
import {MdLocationOn} from 'react-icons/md'
export default function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg
     transition-shadow overflow-hidden rounded-lg w-full sm:w-[320px]">
      <Link className=" flex flex-col gap-2" to={`/listing/${listing.id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="cover"
          className="h-[320px] sm:h-[220px] w-full object-cover
               hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className=" truncate text-lg font-semibold text-slate-700">{listing.name}</p>
          <div className="flex gap-2 items-center">
           <MdLocationOn className="text-green-700 w-5 h-5"/> 
           <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
          <p className="text-slate-800 font-semibold mt-2"> $
          {listing.offer?
          listing.discountPrice.toLocaleString('en-US'):
          listing.regularPrice.toLocaleString('en-US')}
          {listing.type ==='rent' && ' / month'}
          </p>
          <div className="flex gap-6">
              <p className="font-bold text-xs ">
                {listing.bedrooms} {listing.bedrooms===1 ?"Bed":"Beds"}
              </p>
              <p className="font-bold text-xs ">
                {listing.bathrooms} {listing.bathrooms===1 ?"Bath":"Baths"}
              </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
