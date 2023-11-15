import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import { signInStart,signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
export default function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({});
  const {loading} = useSelector((state)=>state.user)
  const[singError, setSignError]= React.useState(null)
  const dispatch = useDispatch()
  function handleChange(event) {
    const { name, value } = event.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(signInStart())
    try {
      const res = await fetch("/api/users/sign-in", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
    
      if(data.success ===false){
        dispatch(signInFailure(data.message))
        setSignError(data.message)
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.meassage))
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center py-7 text-3xl font-bold ">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          onChange={handleChange}
          value={formData.email}
          className="border p-3 rounded-lg"
          placeholder="Email"
          name="email"
        />
        <input
          type="password"
          onChange={handleChange}
          value={formData.password}
          className="border p-3 rounded-lg"
          placeholder="password"
          name="password"
        />
        <button disabled ={loading}
          className="bg-slate-700 p-5 rounded-lg
          text-white uppercase font-bold hover:opacity-95 
          disapled:opacity-50 ">
          {loading?'Loading...':"Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-4 mt-5">
        <p>Do not have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700 font-semibold"> Sing up </span>
        </Link>
      </div>
      {singError && <p className="text-red-500 mt-5 font-semibold">{singError}</p>}
    </div>
  );
}
