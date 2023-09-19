'use client'
import React, { useState, useEffect, useContext} from 'react'
import { Staatliches } from 'next/font/google'
const staatliches = Staatliches({
    weight:'400',
    subsets:['latin'],
    display: 'swap'
  })
const UserProfile = () => {
const handlelogout = () => {
  fetch("http://127.0.0.1:5555/Logout",{
    method:"POST",
    credentials:"include",
  })
}
const [images, setImage] = useState([]);
useEffect(() => {
  fetch("http://127.0.0.1:5555/UserProfile",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    const sortedMap = response
    .flatMap(userPhoto => userPhoto.posts.map(image => ({...image, username:userPhoto.username,
    post_likes:userPhoto.post_likes
    })))
    .sort((a,b) => b.id - a.id);
    setImage(sortedMap);
  })
  .catch("This was an error fetch")
},[]
)
const handleDelete = (e, post_id) => {
  fetch(`http://127.0.0.1:5555/DeletePost/${post_id}`,{
    method: "DELETE",
    credentials:"include",
  })
  .catch("FAILED TO POST")
}
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
        <h1>Your Uploaded Posts! You Can Edit Your Posts Here!</h1>
        {images ?
            images.map((image) => (
              <>
              <img src={`data:image/jpeg;base64, ${image.photo}` || `data:image/png;base64. ${images}`} alt='Images From Database'></img>
              <button onClick={(e) => handleDelete(e,image.id)}>DELETE POST</button>
              </>
            ))
        : ( <h1>IMAGE LOADING</h1>
        )}
      </div>
</>
  )
}
export default UserProfile