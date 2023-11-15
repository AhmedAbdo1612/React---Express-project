import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/autoplay";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, Navigation, EffectFade]);
  const params = useParams();
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState(false)
  const {currentUser} = useSelector((state)=>state.user)['user']
  useEffect(() => {
    async function fetchListing() {
      const listingId = params.id;
      try {
        setLoading(true);
        setLoading(false);
        const res = await fetch(`/api/listings/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(false);
        setListing(data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.id]);
  return (
    <main className="max-w-6xlg">
      {loading && <p className="text-center text-3xl pt-5">Loading....</p>}
      {error && (
        <div className="text-center text-3xl pt-5">
          <p>Something went wrong</p>
          <Link to={"/"}>
            <p className="text-blue-700 pt-4 text-lg"> Back to home</p>
          </Link>
        </div>
      )}
      {listing && !error && !loading && (
        <div className="mt-4 p-5">
          <Swiper
            navigation={true}
            loop={true}
            autoplay={{ delay: 1500 }}
            modules={[Autoplay, Navigation, Pagination]}
            speed={1700}
            slidesPerView={1}
          >
            {listing.imageUrls.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className="h-[500px]"
                    style={{
                      background: `url(${item}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="max-w-6xl mx-auto py-2">
            <div className="p-4 mt-2">
              <h1 className="text-3xl font-bold">
                {" "}
                {listing.name} - $
                {listing.type === "sell"
                  ? `${listing.regularPrice}`
                  : `${listing.regularPrice} / month`}
              </h1>
              <h2 className="text-2xl font-bold pt-3">
                {" "}
                {listing.offer === true
                  ? `Updated ${listing.discountPrice}$`
                  : ""}{" "}
              </h2>
            </div>
            <p className="flex  items-center p-4 mt-5 gap-3">
              <FaMapMarkedAlt className="text-green-700 text-3xl" />
              {listing.address}
            </p>
            <div>
              <p
                className="bg-red-900 w-full max-w-[200px]
                   text-white text-center p-1 rounded-lg"
              >
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
            </div>
            <p className="pb-5 pt-2 text-black max-w-[90%] text-xl">
              <span className="font-semibold">Dedcription: </span>
              {listing.description}
            </p>

            <ul className=" text-lg whitespace-nowrap text-green-800 font-semibold flex-wrap flex gap-4 sm:gap-6 items-center">
              <li className="flex gap-2 items-center">
                <FaBed className="text-3xl" /> {listing.bedrooms}{" "}
                {listing.bedrooms > 1 ? "Beds" : "Bed"}
              </li>
              <li className="flex gap-2 items-center">
                <FaBath className="text-3xl" /> {listing.bathrooms}{" "}
                {listing.bathrooms > 1 ? "Baths" : "Bath"}
              </li>

              <li className="flex gap-2 items-center">
                <FaParking className="text-3xl" /> 
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>

              <li className="flex gap-2 items-center">
                <FaChair className="text-3xl" /> 
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && currentUser.id !== listing.userRef&& !contact &&(
            <button onClick={()=>setContact(true)}
              className="bg-slate-700 w-full p-3 
             mt-3 rounded-lg text-white font-semibold hover:opacity-90" >
              Contact Landlord
            </button>
            )}
            {contact &&(
              <Contact listing = {listing}/>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
