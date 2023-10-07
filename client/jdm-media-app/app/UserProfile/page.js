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
<div className={staatliches.className}>
  <div className='flex justify-center gap-0 bg-sky-100'>
<Navbar isBordered={true} shouldHideOnScroll={true} onMenuOpenChange={setIsMenuOpen} maxWidth='full'  >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarContent justify='start' className='absolute m-unit-2xl'>
        <div>
        <NavbarBrand/>Users Posts
        </div>
      </NavbarContent>
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
    <div className='flex justify-center h-screen w-full flex-wrap text-center  bg-sky-100'>
        {images ?
            images.map((image) => (
              <div key={image.id}>
              <form onSubmit={(e) => handleEdit(e, image.id)}>
              </form>
                <img className='h-auto w-96 px-3 hover:bg-black' src={`data:image/jpeg;base64, ${image.photo}` || `data:image/png;base64. ${images}`} alt='Images From Database'></img>
                <div>{image.title}</div>
                <Button className='h-8 red' onClick={(e) => handleDelete(e,image.id)}>DELETE POST</Button >
                {/* <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/> */}
                {/* <Button color='primary' type='submit'>Submit</Button> */}
              </div>
              
              ))
        : ( <h1>IMAGE LOADING</h1>
        )}
      </div>
    </div>
</div>
  )
}
export default UserProfile