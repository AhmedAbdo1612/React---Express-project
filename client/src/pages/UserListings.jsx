import { Link } from "react-router-dom";
import {useState} from 'react'
export default function UserListings(props) {
  const[ listings, setListings] = useState(props.listings)
    const [deleteListingError, setDeleListingError] = useState(null)
 async function handleDeleteListing(id){
        try {
          setDeleListingError(null)
            const res = await fetch(`/api/listings/delete/${id}`,{
                method:"DELETE"
            })
            const data = await res.json()
            if(data.success===false) {
                setDeleListingError(data.message)
                console.log(deleteListingError)
                return
            }
            setListings(listings.filter((item)=>{
              return(item.id !==id)
            }))
        } catch (error) {
            console.log(error)
        }
  }
  return (
    <div className="pt-10 pb-20">
      <h2 className="text-center text-3xl font-semibold pt-4">Your Listings</h2>
     <div className="pt-10">
     {listings.map((item) => {
        return (
          <div key={item._id} className="py-3 flex items-center justify-between gap-4 border-b shadow-black">
            <Link to={`/listing/${item._id}`}>
              <img
                src={item.imageUrls[0]}
                alt="listing cover"
                className="w-20 h-20 object-contain"
              />
            </Link>
            <Link className="flex-1 uppercase font-semibold text-xl truncate " to={`/listing/${item._id}`}>
                <p className="text-center truncate px-3">{item.name}</p>
            </Link>
            <div className="flex flex-col gap-2 ">
                <button onClick={()=>handleDeleteListing(item.id)} className="p-2 px-4 font-semibold 
                rounded-lg uppercase text-xl
                 text-red-700 hover:text-white
                hover:bg-red-700">Delete</button>

               <Link to={`/edit-listing/${item._id}`}>
               <button className="p-2 px-6 font-semibold uppercase text-xl rounded-lg
                 text-green-700 hover:text-white
                hover:bg-green-700">Edit</button>
               </Link>
            </div>
          </div>
        );
      })}
     </div>
     {deleteListingError&& <p className="text-red-700 font-semibold text-center">{deleteListingError}</p>}
    </div>
  );
}
