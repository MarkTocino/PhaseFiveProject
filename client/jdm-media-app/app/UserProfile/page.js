'use client'
import React, { useState, useEffect, useContext} from 'react'
import { Staatliches } from 'next/font/google'
import { UserContext } from '@/Context/UserProvider'
const staatliches = Staatliches({
    weight:'400',
    subsets:['latin'],
    display: 'swap'
  })
const UserProfile = () => {
  const { user } = useContext(UserContext)
const handlelogout = () => {
  fetch("http://127.0.0.1:5555/Logout",{
    method:"POST",
    credentials:"include",
  })
  
}
const [image, setImage] = useState([]);

useEffect(() => {
  fetch("http://127.0.0.1:5555/Images",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    setImage(response.images)
  })
  .catch("This was an error fetch")
},[])
return (
<>
<div className={staatliches.className}>
  <header className='flex justify-between align-middle headerNav'>
    <ul className='flex text-2xl'>JDM</ul>
      <nav>
        <ul className='Navbar'>
          <li className='flex text-2xl'><a href='Dashboard'>Home</a></li>
          <li className='flex text-2xl'><a href='UserProfile'>UserProfile</a></li>
          <li className='flex text-2xl'><a href='AccountSettings'>Settings</a></li>
        </ul>
      </nav>
      <button onClick={handlelogout} className='flex text-2xl'><a href='/'>LOGOUT</a></button>
  </header>
</div>
<div>
        <h1>{user ? user.username : "NO USER LOGGED IN"}</h1>
        {image ?
            image.map((images) => (
              <img src={`data:image/jpeg;base64, ${images}` || `data:image/png;base64. ${images}`} alt='Images From Database'></img>
            ))
        : ( <h1>IMAGE LOADING</h1>
        )}
      </div>
</>
  )
}
export default UserProfile