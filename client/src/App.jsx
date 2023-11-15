import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from './pages/Home'
import Singin from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import CreateListing from "./pages/CreateListing";
import PrivateRoute from "./components/PrivateRoute";
import EditListing from './pages/EditListing'
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
    <Header/>   
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/sign-in" element = {<Singin/>} />
        <Route path="/sign-up" element = {<SignUp/>} />
        <Route path="/listing/:id" element ={<Listing/>}></Route>
        <Route path="/search" element ={<Search/>}></Route>
        <Route element = {<PrivateRoute/>}>
        <Route path="/profile" element = {<Profile/>} />
        <Route path='/create-listing' element={<CreateListing/>}/>
        <Route path='/edit-listing/:id' element={<EditListing/>}/>
        </Route>
        <Route path="/about" element = {<About/>} />
      </Routes>
    </BrowserRouter>
  );
}
