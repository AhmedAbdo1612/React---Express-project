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
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="fotnt-bold text-sm sm:text-xl flex flex-warp">
            <span className="text-slate-500">Places</span>
            <span className="text-slate-900">Market</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search....."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-salte-500" />
          </button>
        </form>
        <ul className="flex list-none gap-6">
          <Link to="/">
            <li className="flext justify-center  gap-2 hidden  sm:inline  text-slate-700 hover:underline">
            Home 
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline  text-slate-700 hover:underline">
            About
            </li>
          </Link>
          <Link to="profile">
            {currentUser ? (
              <img
                className="h-7 w-7 rounded-full object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              "Sing in"
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
