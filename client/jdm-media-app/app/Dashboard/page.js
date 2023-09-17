'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Staatliches } from 'next/font/google'
const staatliches = Staatliches({
  weight:'400',
  subsets:['latin'],
  display: 'swap'
})
export const Dashboard = () => {
const handlelogout = () => {
  fetch("http://127.0.0.1:5555/Logout",{
    method:"POST",
    credentials:"include",
  })
}
const [images, setImage] = useState([]);
useEffect(() => {
  fetch("http://127.0.0.1:5555/UserDashboard",{
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
const [file ,setFile] = useState(null)
const formData = new FormData();
formData.append("photo", file);

const handlePost = (e) => {
  // e.preventDefault();
  fetch("http://127.0.0.1:5555/UploadImage",{
    method: "POST",
    credentials:"include",
  headers: {
    "encType": "multipart/form-data",
  },
  body: formData
  })
  .catch("FAILED TO POST")
}
const [liked, setLiked] = useState(false)
const handleLike = (e, post_id) => {
  // e.preventDefault();
  setLiked(true)
  setImage((pastState) => pastState.map((image) =>
    image.id === post_id
      ? { ...image, likes: image.likes + 1 }
      : image
  )
);
  fetch(`http://127.0.0.1:5555/Like/${post_id}`,{
    method: "PATCH",
    credentials:"include",
  headers: {
    "Content-Type":"application/json"
  },
  body: JSON.stringify({
    likes:1
  }),
  })
  .catch("FAILED TO POST")
}
console.log(images)
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
<form onSubmit={handlePost}>
    <label></label>
    <input id="photo" onChange={(e) => setFile(e.target.files[0])} type='file'></input>
    <button type='submit'>Submit</button>
</form>
<div>
    {images ?  (
      images.map((image) => (
        <div key={image.id}>
          <h2>From : {image.username}</h2>
          <img className='flex max-w-lg'
            src={`data:image/jpeg;base64, ${image.photo}` || `data:image/png;base64. ${image.photo}`}
            alt='Images From Database'
          ></img>
          <h2>Likes : {image.likes}
          </h2>
          <button onClick={(e) => handleLike(e, image.id)}>♥</button>
          <br></br>
          <button onClick={(e) => handleDelete(e,image.id)}>DELETE POST</button>
        </div>
      ))
    ) : (
      <h1>IMAGE LOADING</h1>
    )}
</div>
</>
  )
}
export default Dashboard
