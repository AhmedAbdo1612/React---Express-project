import { useState ,useEffect} from 'react'
import {useParams} from 'react-router-dom'

export default function Activation() {
    const {token} = useParams()
    const [error, setError]  = useState(false)
    useEffect(()=>{
      async function activateEmail(){
        try {
          setError(false)
          const res = await fetch("/api/users/activate", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({activation_token:token}),
          });
          const data = await res.json()
          console.log(data)
          if(data.success === false) {setError(true)}
        } catch (error) {
         
          setError(true)
          console.log(error)
        }
      }
      activateEmail()
    },[token])
    return <div style={{
      width:"100%",
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }}>
      {error? (
          <p className='text-3xl'>Your token is expired!</p>
      ):
      (
          <p className='text-3xl'>Your account has been created successfully!</p>
      )}
    </div>;
}
