import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ListingCard from "../components/ListingCard";
export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  useEffect(() => {
    async function fetchOfferListings() {
      try {
        const res = await fetch(`/api/listings/search?offer=true&limi=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();

    async function fetchRentListings() {
      try {
        const res = await fetch(`/api/listings/search?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchSaleListings() {
      try {
        const res = await fetch(`/api/listings/search?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <div>
      {/* top*/}
      <div className=" flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-700 lg:text-6xl">
          Find Your Next <span className="text-slate-500">Perfect </span> <br />
          Place With Ease
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          This Market Place helps you to find youe new perfect place to live in.
          <br />
          We have a wide range of choices for you
        </p>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          <p> Let's starts now...</p>
        </Link>
      </div>
      {/* swiper*/}
      <div className="px-8">
        <Swiper
          navigation={true}
          loop={true}
          autoplay={{ delay: 1500 }}
          modules={[Navigation, Pagination, Autoplay]}
          speed={1700}
        >
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${item.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      {/* listings results*/}
      <div className="max-w-[1500px] mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className=" my-2">
              <h2 className="text-2xl text-slate-600 font-bold">
               
                Recent Offers
              </h2>
              <Link
                className="text-blue-700 text-sm font-semibold hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap pt-5">
              {offerListings.map((item) => (
                <ListingCard listing={item} key={item.id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className=" my-2">
              <h2 className="text-2xl text-slate-600 font-bold">
                Recent Places for Rent
              </h2>
              <Link
                className="text-blue-600 text-sm font-semibold hover:underline"
                to={"/search?type=all"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap pt-5">
              {rentListings.map((item) => (
                <ListingCard listing={item} key={item.id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className=" my-2">
              <h2 className="text-2xl text-slate-600 font-bold">
                Recent Places for Sale
              </h2>
              <Link
                className="text-blue-600 text-sm font-semibold hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex gap-4 flex-wrap pt-5">
              {saleListings.map((item) => (
                <ListingCard listing={item} key={item.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
