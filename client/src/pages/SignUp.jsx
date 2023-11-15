/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
export default function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  function handleChange(event) {
    const { name, value } = event.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)
    try {
      const res = await fetch("/api/users/sign-up", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if(data.success ===false){
        setError(data.message)
        setLoading(false)
        return
      }
      setError(null)
      setLoading(false)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
 
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center py-7 text-3xl font-bold">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={formData.username}
          className="border p-3 rounded-lg"
          placeholder="Username"
          name="username"
        />

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
          {loading?'Loading...':"Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-4 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700 font-semibold"> Sing in </span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 font-semibold">{error}</p>}
    </div>
  );
}
