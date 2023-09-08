'use client'
import React, { useContext } from 'react'
import { UserContext } from '../../Context/UserProvider'
export const home = () => {
const { user } = useContext(UserContext)
  return (
    <div>{user ? user.username : <>None</>}</div>
  )
}
export default home
