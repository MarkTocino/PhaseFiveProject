'use client'
import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../Context/UserProvider'
import { Staatliches } from 'next/font/google'
const staatliches = Staatliches({
  weight:'400',
  subsets:['latin'],
  display: 'swap'
})
export const Dashboard = () => {
const { user } = useContext(UserContext)
const handlelogout = () => {
  fetch("http://127.0.0.1:5555/Logout",{
    method:"POST",
    credentials:"include",
  })
}


const [image, setImage] = useState([]);
useEffect(() => {
  fetch("http://127.0.0.1:5555/UserDashboard",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    setImage(response)
  })
  .catch("This was an error fetch")
},[]
)
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
        {image ?
            image.map((images) => (
            <>
            <div key ={images.id}></div>
              {images.posts.map((all_images) => (
                console.log(all_images.created_at),
                <>
                  {images.username}
                <img key={all_images.id} src={`data:image/jpeg;base64, ${all_images.photo}` || `data:image/png;base64. ${images.photo}`} alt='Images From Database'></img>
                </>
              ))}
            </>
            ))
          
        : ( <h1>IMAGE LOADING</h1>
        )}
      </div>
</>
  )
}
export default Dashboard
