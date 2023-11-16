import { FaSearch } from "react-icons/fa";
import { Link ,useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)["user"];
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  async function handleSubmit(e){
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery =urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }

  },[location.search])
  return (
    <header className="bg-slate-700 shadow-md w-full">
      <div className="flex justify-around w-full  items-center  p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-3xl flex flex-warp">
            <span className="text-gray-100">Places</span>
            <span className="text-gray-300">Market</span>
          </h1>
        </Link>
       <div className="max-w-3xl">
       <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search....."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-[22rem]"
          />
          <button>
            <FaSearch className="text-salte-500" />
          </button>
        </form>
       </div>
        <ul className="flex list-none gap-6">
          <Link to="/">
            <li className="flext justify-center  gap-2 hidden  sm:inline  text-white hover:underline">
            Home 
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline  text-white hover:underline">
            About
            </li>
          </Link>
          <Link to="profile" className="text-white hover:underline">
            {currentUser ? (
              <img
                className="h-7 w-7 rounded-full object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              "Sign in"
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
