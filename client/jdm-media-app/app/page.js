'use client'
import { Anton } from "next/font/google"
import { Button } from "@nextui-org/react"
import Link from "next/link"
const anton = Anton({subsets:['latin'], weight:['400']})

export const home = () => {

  return (
  <>
    <div className="flexbox">
      <section className={anton.className}>
        <div
          className="bg-[url('../Images/Background_homepage.jpg')] bg-cover">
          <h1 className="grid place-items-center h-screen text-white text-8xl">Welcome to JDM Social Media App!</h1>
          <div className="flex justify-center place-items-center content-center">
            <Link href="Signup">
              <Button className="flex h-12 px-6 text-2xl relative bottom-80" type="Click" >SIGN UP</Button>
            </Link>
            <Link href="Login">
              <Button className="flex h-12 px-6 text-2xl relative bottom-80">LOGIN</Button>
            </Link>
          </div>
          <div className="flex justify-center">
              <Button className="h-20 px-10 text-3xl bg-red-600 opacity-100 flex text-center relative bottom-80" isLoading>TURBO LOADING...SIGN IN IS NEEDED</Button>
            </div>
          </div>
      </section>
    </div>
  </>
  )
}
export default home
