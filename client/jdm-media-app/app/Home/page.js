'use client'
import React, {useState, useEffect} from 'react'

export const home = () => {
  const[user,setUser] = useState('')
  useEffect(() => {
      fetch("http://127.0.0.1:5555/currentUser",{
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        },
      })
      .then((response => response.json()))
      .then((response) => setUser(response))
  },[]
)
  return (
    <div>{user ? user.username : <>None</>}</div>
  )
}
export default home
