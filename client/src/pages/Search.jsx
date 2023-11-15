import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
export default function Search() {
  
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading,setLoading] = useState(false)
  const [listings ,setListings] = useState([])
  const[showMore,setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || sidebardata.searchTerm;
    const offerFromUrl = (urlParams.get("offer")) ==='true'? true:false
    const parkingFromUrl = (urlParams.get("parking") ) ==='true' ?true:false 
    const furnishedFromUrl = (urlParams.get("furnished")) === 'true'?true :false 
    const sortFromUrl = urlParams.get("sort") || sidebardata.sort;
    const orderFromUrl = urlParams.get("order") || sidebardata.order;
    const typeFromUrl = urlParams.get("type") || sidebardata.type;
    setSidebardata({
      offer: offerFromUrl,
      parking: parkingFromUrl,
      searchTerm: searchTermFromUrl,
      furnished: furnishedFromUrl,
      sort: sortFromUrl,
      order: orderFromUrl,
      type: typeFromUrl,
    });
    async function fetchListings(){
      setLoading(true)
      setShowMore(false)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/listings/search?${searchQuery}`)
      const data = await res.json()
      if(data.length >8){
        setShowMore(true)
      }
      else{setShowMore(false)}
      setLoading(false)
      setListings(data)
    }
    fetchListings()
  }, [location.search]);
  function handleChange(e) {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (id === "all" || id === "rent" || id === "sale") {
        setSidebardata({ ...sidebardata, type: id });
      } else {
        setSidebardata({ ...sidebardata, [id]: checked });
      }

      return;
    } else if (id === "sort_order") {
      const sort = value.split("_")[0] || "createdAt";
      const order = value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
      return;
    }
    setSidebardata({ ...sidebardata, [id]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("order", sidebardata.order);
    urlParams.set("sort", sidebardata.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
 async  function onShowMoreClick(){
    const startIndex = listings.length +1 ;
    const urlParams = new URLSearchParams()
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()
   const  res = await fetch(`/api/listings/search?${searchQuery}`)
   const data = await res.json()
   if(data.length <9){
    setShowMore(false)
   }
   setListings([...listings, ...data])
  }
  return (
    <div className="flex flex-col px-5 md:flex-row ">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term: </label>
            <input
              onChange={handleChange}
              type="text"
              id="searchTerm"
              value={sidebardata.searchTerm}
              placeholder="Search..."
              className="border rounded-lg p-3 w-full  "
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <label className="font-bold"> Type: </label>
            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                id="all"
                checked={sidebardata.type === "all"}
                className="w-6 h-6"
              />
              <label htmlFor="all" className="font-semibold">
                Rent & Sale
              </label>
            </div>

            <div className="flex gap-2 ">
              <input
                type="checkbox"
                checked={sidebardata.type === "rent"}
                id="rent"
                className="w-6 h-6"
                onChange={handleChange}
              />
              <label htmlFor="rent" className="font-semibold">
                Rent
              </label>
            </div>

            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                id="sale"
                checked={sidebardata.type === "sale"}
                className="w-6 h-6"
              />
              <label htmlFor="sale" className="font-semibold">
                Sale
              </label>
            </div>

            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                id="offer"
                checked={sidebardata.offer}
                className="w-6 h-6"
              />
              <label htmlFor="offer" className="font-semibold">
                Offer
              </label>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <label className="font-bold"> Animities: </label>
            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                id="parking"
                checked={sidebardata.parking}
                className="w-6 h-6"
              />
              <label htmlFor="parking" className="font-semibold">
                Parking
              </label>
            </div>

            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                id="furnished"
                className="w-6 h-6"
                checked = {sidebardata.furnished}
              />
              <label htmlFor="furnished" className="font-semibold">
                Furnished
              </label>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <label htmlFor="sort_order" className="font-bold">
              Sort:
            </label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-3"
            >
              <option
                value={"regularPrice_desc"}
                className="bg-slate-700 text-white font-semibold"
              >
                Price high to low
              </option>
              <option
                value={"regularPrice_asc"}
                className="bg-slate-700 text-white font-semibold"
              >
                Price low to high
              </option>
              <option
                value={"createdAt_desc"}
                className="bg-slate-700 text-white font-semibold"
              >
                Latest
              </option>
              <option
                value={"createdAt_asc"}
                className="bg-slate-700 text-white font-semibold"
              >
                Oldest
              </option>
            </select>
          </div>
          <button
            className="bg-slate-700 font-bold uppercase p-3 rounded-lg 
          text-xl text-white hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1
          className="text-center 
        text-slate-800 font-semibold text-3xl mt-5 p-3"
        >
          Search Result
        </h1>
        <div className="p-7 flex gap-4 flex-wrap w-full">
          {!loading && listings.length ===0 &&(
            <h3 className="text-center text-xl font-semibold">No listings found!</h3>
          )}
          {loading &&(
            <h3 className="text-center text-xl font-semibold">Loading...</h3>
          )}

          {!loading && listings && listings.map((item)=>{
            return <ListingCard key={item.id} listing = {item}/>
          })}
        </div>
        {showMore &&(
          <button
          className="text-green-700 hover:underline p-8 font-semibold text-xl w-full "
          onClick={()=>onShowMoreClick()}> Show more</button>
        )}
      </div>
    </div>
  );
}
