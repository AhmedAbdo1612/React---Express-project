import {GoogleAuthProvider, getAuth,signInWithPopup} from "@firebase/auth"
import { app } from "../firebase";
import {useDispatch}from 'react-redux'
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    async function handleGoogleClick(){
        
        try {
           const provider = new GoogleAuthProvider()
           const auth = getAuth(app)
           const result = await signInWithPopup(auth,provider)
           const res = await fetch('/api/users/google',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:result.user.displayName,
                 email:result.user.email,
                 photo:result.user.photoURL})
           }
           )
           const data = await res.json()
           dispatch(signInSuccess(data))
           navigate('/')
        } 
        catch (error) {
            console.log(error);
        }
    }
  return (
    <button onClick={handleGoogleClick} 
    type="button" className="bg-red-700 rounded-lg py-5
     text-white font-semibold uppercase
      hover:bg-slate-500"> continue with google</button>
  )
}
