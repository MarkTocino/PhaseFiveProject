'use client'
import React, { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '@/Context/UserProvider'
import { Staatliches } from 'next/font/google'
import { Link } from '@nextui-org/react'
import 'reactjs-popup'
import Popup from 'reactjs-popup'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle,NavbarMenu,NavbarMenuItem
} from "@nextui-org/react";
const staatliches = Staatliches({
  weight:'400',
  subsets:['latin'],
  display: 'swap'
})
const AccountSettings = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const { user } = useContext(UserContext)
const [new_username, setNew_username] = useState('')
const [hashed, setNew_Password] = useState('')
const [new_FirstName, setNew_FirstName] = useState('')
const [new_LastName, setNew_LastName] = useState('')
const handleUsername = () => {
  fetch("http://127.0.0.1:5555/ChangeUsername",{
    method:"PATCH",
    credentials:"include",
    headers: {
      "Content-Type": "application/json; cahrset=UTF-8",
    },
    body:JSON.stringify({
      username: new_username,
    })
  })
  .then(response => {
    if (response.ok)
    alert('Username Change Succesful')
  })
}
const handlePassword = (e) => {
  e.preventDefault()
  fetch("http://127.0.0.1:5555/ChangePassword",{
    method:"PATCH",
    credentials:"include",
    headers: {
      "Content-Type": "application/json; cahrset=UTF-8",
    },
    body:JSON.stringify({
      password: hashed,
    })
  })
  .then(response => {
    if (response.ok)
    alert('Password Change Succesful')
  })
}
const handleFirstName = () => {
  fetch("http://127.0.0.1:5555/ChangeFirstName",{
    method:"PATCH",
    credentials:"include",
    headers: {
      "Content-Type": "application/json; cahrset=UTF-8",
    },
    body:JSON.stringify({
      first_name: new_FirstName,
    })
  })
  .then(response => {
    if (response.ok)
    alert('FirstName Change Succesful')
  })
}
const handleLastName = () => {
  fetch("http://127.0.0.1:5555/ChangeLastName",{
    method:"PATCH",
    credentials:"include",
    headers: {
      "Content-Type": "application/json; cahrset=UTF-8",
    },
    body:JSON.stringify({
      last_name: new_LastName,
    })
  })
  .then(response => {
    if (response.ok)
    alert('Last Name Change Succesful')
  })
}
const handlelogout = () => {
  fetch("http://127.0.0.1:5555/Logout",{
    method:"POST",
    credentials:"include",
  })
}
return (
<>
<div>

<Navbar onMenuOpenChange={setIsMenuOpen} className='flex justify-start'>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand className={staatliches.className}/>UserSettings
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
<div className={staatliches.className}>
<div className='Container'>
    <div className='flex justify-center align-middle text-center flex-col text-black lg:text-4xl md:text-xl p-10'>Greetings {user?.username}, Here you can change your profile settings
      <br></br>
        What Would You Like To Change?
      <br></br>
    <div className='flex flex-row justify-evenly'>
    <Popup position={'bottom left'}trigger={<button>UserName?</button>}>
      <div className='flex flex-col text-white lg:text-2xl md:text-md bg-auto bg-black rounded-lg border-black p-3'>
        <form onSubmit={handleUsername} className={staatliches.className}>
          <div className=''>Current UserName: {user?.username}</div>
          <label className=''>New Username:</label>
          <br></br>
          <input onChange={(e) => setNew_username(e.target.value)} className='bg-black border-white p-2' id='id' type='text' name='username' placeholder='Input New Username'></input>
        <div className={staatliches.className}>
          <button  className='animate-pulse p-2' position={'Bottom Center'}>Submit</button>
        </div>
        </form>
      </div>
    </Popup>
    <Popup position={'bottom center'}trigger={<button>Password?</button>}>
      <div className='flex flex-col text-white lg:text-2xl md:text-md bg-auto bg-black rounded-lg border-black p-3'>
        <form onSubmit={handlePassword} className={staatliches.className}>
          <label className=''>New Password:</label>
          <br></br>
          <input id='id' onChange={(e) => setNew_Password(e.target.value)} className='bg-black border-white p-2' type='text' name='Password' placeholder='Input New Password'></input>
        <div className={staatliches.className}>
          <button  className='animate-pulse p-2' position={'Bottom Center'}>Submit</button>
        </div>
        </form>
      </div>
    </Popup>
    <Popup position={'bottom center'}trigger={<button>FIRSTNAME?</button>}>
      <div className='flex flex-col text-white lg:text-2xl md:text-md bg-auto bg-black rounded-lg border-black p-3'>
        <form onSubmit={handleFirstName} className={staatliches.className}>
          <div className='p-2'>Current FirstName: {user ? user?.first_name : 'None'}</div>
          <label className='p-2'>New FirstName:</label>
          <br></br>
          <input id='id' onChange={(e) => setNew_FirstName(e.target.value)} className='bg-black border-white p-2' type='text' name='FirstName' placeholder='Input New FirstName'></input>
        <div className={staatliches.className}>
          <button className='animate-pulse p-2' position={'Bottom Center'}>Submit</button>
        </div>
        </form>
      </div>
    </Popup>
    <Popup position={'bottom right'}trigger={<button>LASTNAME?</button>}>
      <div className='flex flex-col text-white lg:text-2xl md:text-md bg-auto bg-black rounded-lg border-black p-3'>
        <form onSubmit={handleLastName} className={staatliches.className}>
          <div className='p-2'>Current Lastname: {user ? user.last_name : 'None'}</div>
          <label className='p-2'>NEW LAST NAME:</label>
          <br></br>
          <input id='id' onChange={(e) => setNew_LastName(e.target.value)} className='bg-black border-white p-2' type='text' name='' placeholder='Input New LastName'></input>
        <div className={staatliches.className}>
          <button className='animate-pulse p-2' position={'Bottom Center'}>Submit</button>
        </div>
        </form>
      </div>
    </Popup>
    </div>
    </div>
  </div>
  </div>
</>
  )
}
export default AccountSettings