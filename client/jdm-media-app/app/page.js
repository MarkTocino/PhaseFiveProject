'use client'
import { Anton } from "next/font/google"
import { Button } from "@nextui-org/react"
import Link from "next/link"
const anton = Anton({subsets:['latin'], weight:['400']})

export const home = () => {

  return (
  <>
    <div>
      <section className={anton.className}>
        <div
          className="flex align-middle items-center justify-center h-screen bg-[url('../Images/Background_homepage.jpg')] bg-cover">
          <div>
          <h1 className=" text-white text-8xl">Welcome to JDM Social Media App!</h1>
          <div className="flex justify-center place-items-center content-center">
            <Link href="Signup">
              <Button className="flex h-12 px-6 text-2xl" type="Click" >SIGN UP</Button>
            </Link>
            <Link href="Login">
              <Button className="flex h-12 px-6 text-2xl">LOGIN</Button>
            </Link>
          </div>
          <div className="flex justify-center">
              <Button className="h-20 px-10 text-3xl bg-red-600 opacity-100 flex text-center" isLoading>TURBO LOADING...SIGN IN IS NEEDED</Button>
            </div>
            </div>
          </div>
      </section>
    </div>
  </>
  )
}
export default home
