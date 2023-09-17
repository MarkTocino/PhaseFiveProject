'use client'
import React, { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '@/Context/UserProvider'
import { Staatliches } from 'next/font/google'
import 'reactjs-popup'
import Popup from 'reactjs-popup'
const staatliches = Staatliches({
  weight:'400',
  subsets:['latin'],
  display: 'swap'
})
const AccountSettings = () => {
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
<div className={staatliches.className}>
  <div className="flex justify-between align-middle headerNav">
    <ul className='flex text-2xl'>JDM</ul>
      <nav>
        <ul className='Navbar'>
          <li className='flex text-2xl'><a href='Dashboard'>Home</a></li>
          <li className='flex text-2xl'><a href='UserProfile'>UserProfile</a></li>
          <li className='flex text-2xl'><a href='AccountSettings'>Settings</a></li>
        </ul>
      </nav>
      <button onClick={handlelogout} className='flex text-2xl'><a href='/'>LOGOUT</a></button>
  </div>
<div className='UserCover'>
    <div className='text-white text-4xl p-10'>Greetings {user?.username}, Here you can change your profile settings
      <br></br>
        What Would You Like To Change?
      <br></br>
    <div className='p-10 space-x-60'>
    <Popup position={'bottom center'}trigger={<button>UserName?</button>}>
      <div className=' text-white text-2xl bg-auto bg-black rounded-lg border-black p-5'>
        <form onSubmit={handleUsername} className={staatliches.className}>
          <div className='p-2'>Current UserName: {user?.username}</div>
          <label className='p-2'>New Username:</label>
          <br></br>
          <input onChange={(e) => setNew_username(e.target.value)} className='bg-black border-white p-2' id='id' type='text' name='username' placeholder='Input New Username'></input>
        <div className={staatliches.className}>
          <button  className='animate-pulse p-2' position={'Bottom Center'}>Submit</button>
        </div>
        </form>
      </div>
    </Popup>
    <Popup position={'bottom center'}trigger={<button>Password?</button>}>
      <div className=' text-white text-2xl bg-auto bg-black rounded-lg border-black p-5'>
        <form onSubmit={handlePassword} className={staatliches.className}>
          <label className='p-2'>New Password:</label>
          <br></br>
          <input id='id' onChange={(e) => setNew_Password(e.target.value)} className='bg-black border-white p-2' type='text' name='Password' placeholder='Input New Password'></input>
        <div className={staatliches.className}>
          <button  className='animate-pulse p-2' position={'Bottom Center'}>Submit</button>
        </div>
        </form>
      </div>
    </Popup>
    <Popup position={'bottom center'}trigger={<button>FIRSTNAME?</button>}>
      <div className=' text-white text-2xl bg-auto bg-black rounded-lg border-black p-5'>
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
    <Popup position={'bottom center'}trigger={<button>LASTNAME?</button>}>
      <div className=' text-white text-2xl bg-auto bg-black rounded-lg border-black p-5'>
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