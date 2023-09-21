'use client'
import React, { useState, useEffect, useContext} from 'react'
import { Staatliches } from 'next/font/google'
import { Button } from '@nextui-org/react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,NavbarMenu,NavbarMenuItem
} from "@nextui-org/react";
import { Link } from '@nextui-org/react';
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
  location.reload()
}
const [editedTitle, setEditedTitle] = useState('');

const handleEdit = (e, post_id) => {
  e.preventDefault()

    fetch(`http://127.0.0.1:5555/ImagePatch/${post_id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editedTitle,
      }),
  })
  location.reload()
}
const [isMenuOpen, setIsMenuOpen] = useState(false);
return (
<>
<div>
<Navbar onMenuOpenChange={setIsMenuOpen} className='flex justify-start'>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarBrand className={staatliches.className}/>Your Posts
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
</div>
<div>
  
      <div className='Container bg-gradient bg-cyan-500'>
      <h1>Your Uploaded Posts! You Can Edit Your Posts Here!</h1>
        {images ?
            images.map((image) => (
              <div key={image.id}>
              <form onSubmit={(e) => handleEdit(e, image.id)}>
                <label>Current Message: {image.title}</label>
                <br></br>
                <label>Change Message Here! : </label>
                <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>
                <Button color='primary' type='submit'>Submit</Button>
              </form>
                <img src={`data:image/jpeg;base64, ${image.photo}` || `data:image/png;base64. ${images}`} alt='Images From Database'></img>
                <Button color='danger' onClick={(e) => handleDelete(e,image.id)}>DELETE POST</Button >
              </div>
              
            ))
        : ( <h1>IMAGE LOADING</h1>
        )}
      </div>
      </div>
</>
  )
}
export default UserProfile