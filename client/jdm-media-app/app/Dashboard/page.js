'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Staatliches } from 'next/font/google'
import { Button, image, user } from '@nextui-org/react'
import { UserContext } from '@/Context/UserProvider'
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
    sortedMap.map(comment => comment.post_comments.sort((a,b) => b.id - a.id))
    setImage(sortedMap);
  })
  .catch("This was an error fetch")
},[]
)
const [title, setTitle] = useState('')
const [comment, setComment]= useState('')
const [file ,setFile] = useState(null)
const handleComment = (e, post_id) => {
  e.preventDefault()
  fetch(`http://127.0.0.1:5555/Comment/${post_id}`,{
    method:"POST",
    credentials:"include",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      comment:comment,
    })
  })
  .then(fetch("http://127.0.0.1:5555/UserDashboard",{
    credentials: "include"
  })
  .then((response => response.json()))
  .then((response) => {
    const sortedMap = response
    .flatMap(userPhoto => userPhoto.posts.map(image => ({...image, username:userPhoto.username,
    post_likes:userPhoto.post_likes
    })))
    .sort((a,b) => b.id - a.id);
    sortedMap.map(comment => comment.post_comments.sort((a,b) => b.id - a.id))
    setImage(sortedMap);
  })
  .catch("This was an error fetch"))
}
const handlePost = (e) => {
  // NOTE TO SELF: FORMDATA() is used when Content or encType is multipart/form-data:
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("title", title);
  fetch("http://127.0.0.1:5555/UploadImage",{
    method: "POST",
    credentials:"include",
  headers: {
    "encType": "multipart/form-data",
  },
  body: formData
  })
  .then (fetch("http://127.0.0.1:5555/UserDashboard",{
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
  .catch("This was an error fetch"))
}
console.log(images)
const handleLike = (e, post_id) => {
  // e.preventDefault();
  setImage((pastState) => pastState.map((image) =>
    image.id === post_id ? { ...image, likes: image.likes + 1 } : image
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
  <label onChange={(e) => setTitle(e.target.value)}>TITLE: <input type='text'></input></label>
    <input id="photo" onChange={(e) => setFile(e.target.files[0])} type='file'></input>
    <button type='submit'>Submit</button>
</form>
<div className='Container'>
    {images ?  (
      images.map((image) => (
        <div key={image.id}>
          <h2>From : {image.username}</h2>
          <h1>{image.title}</h1>
          <img
            src={`data:image/jpeg;base64, ${image.photo}` || `data:image/png;base64. ${image.photo}`}
            alt='Images From Database'
          ></img>
          <h2>Likes : {image.likes}</h2>
          <button onClick={(e) => handleLike(e, image.id)}>♥</button>
            <form onSubmit={(e)=> handleComment(e, image.id)}>
            <label>Comment</label>
            <input  onChange={(e) => setComment(e.target.value)} type='text'></input>
          <Button type='submit'>Submit</Button>
          </form>
            {image.post_comments.map((comments)=> (
              <div  key={comments.id}>
              <h3 id="commentdiv" >{comments.username} : {comments.comment}</h3>
              </div>
            ))}
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
