'use client'
import React, {createContext, useContext, useState, useEffect} from 'react'
const UserData = createContext('');

export const dataUser = () => {
    const[user,setUser] = useState('')
    useEffect(() => {
        fetch("http://127.0.0.1:5555/userLoader",{
          credentials: "include"
        })
        .then((response => response.json()))
        .then((response) => setUser(response))
    }
  )
  return (
    <UserData.Provider value={user}>
      <Home/>
    </UserData.Provider>
  )
}
