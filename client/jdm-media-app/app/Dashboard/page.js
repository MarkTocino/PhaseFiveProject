'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Staatliches } from 'next/font/google'
import { UserContext } from '@/Context/UserProvider'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,NavbarMenu,NavbarMenuItem
} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { Link } from '@nextui-org/react'
import { Input } from '@nextui-org/react';
const staatliches = Staatliches({
  weight:'400',
  subsets:['latin'],
  display: 'swap'
})
export const Dashboard = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
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
const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
<>
<Navbar isBordered={true} shouldHideOnScroll={true} onMenuOpenChange={setIsMenuOpen} className='justify-start'>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarBrand className='flex justify-center'/>Dashboard
      <NavbarMenu>
          <NavbarMenuItem>
            <Link href='Dashboard'>
            Dashboard
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='UserProfile'>
            Posts
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link href='AccountSettings'>
            UserProfile/Settings
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
          <Link onClick={handlelogout} href='/'>
            Logout
            </Link>
          </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
    <Button onPress={onOpen}>Make a Post!</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
            <form onSubmit={handlePost}>
              <br></br>
              <label onChange={(e) => setTitle(e.target.value)}>What Would You Like To Say?<Input type='text'></Input></label>
              <br></br>
              <label><input id="photo" onChange={(e) => setFile(e.target.files[0])} type='file'></input></label>
              <Button type='submit'>Submit Post</Button>
            </form>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
            </>
          )}
        </ModalContent>
      </Modal>
<div className='Container'>
    {images ?  (
      images.map((image) => (
        <div key={image.id}>
          <h1>{image.username} : {image.title}</h1>
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
