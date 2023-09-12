'use client'
import React from 'react'
import { useContext } from 'react'
import { UserContext } from '@/Context/UserProvider'
import { Staatliches } from 'next/font/google'
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
</>
  )
}
export default UserProfile