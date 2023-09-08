'use client'
import React, {createContext, useState, useEffect} from 'react'
// Create the Context
export const UserContext = createContext();
// This export is what I have to use
export const UserProvider = ({children}) => {
    const[user,setUser] = useState()
    useEffect(() => {
        fetch("http://127.0.0.1:5555/currentUser",{
          credentials: "include"
        })
        .then((response => response.json()))
        .then((response) => setUser(response))
    },[]
  )
  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  )
}
