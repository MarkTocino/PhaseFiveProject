'use client'
import {useState} from "react"
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from 'yup'
import { Input } from "@nextui-org/react";

export default function Signup() {
const router = useRouter()
const PasswordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/
const basicSchema = yup.object().shape({
  username: yup.string().min(4).required("Please Enter A Valid Username"),
  password: yup.string().min(5).matches(PasswordRules, { message: "Please Create A Stronger Password"})
  .required("Please Enter A Valid Password")
})

  const onSubmit = () => {
      fetch("http://127.0.0.1:5555/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      })
      .then((response) => {
        if (response.ok) {
          return router.push('/Login')
        }
      })
    }
// Formik
const { values, errors, handleBlur,touched, handleChange, handleSubmit } = useFormik({
  initialValues: {
    username:"",
    password:""
  },
  validationSchema: basicSchema,
  onSubmit,
})
console.log(errors)
  return (
<div className="bg-cover bg-center bg-no-repeat bg-[url('../Images/Signup_Cover.gif')]">
<div className="flex h-screen w-auto flex-col text-center items-center justify-center">
  <form autoComplete="off" onSubmit={handleSubmit}>
    <div className="text-white text-4xl font-bold">JDM SIGN UP</div>
    <div className="m-2 w-60">
      <Input
      color="white"
      value={values.username}
      onChange={handleChange}
      id="username"
      type="username"
      placeholder="Enter Your Username"
      onBlur={handleBlur}
      className={errors.username && touched.username ? "input-error" : ""}
     />
     {errors.username && touched.username && <p className="text-xs text-white">{errors.username}</p>}
     </div>
     <div className="m-2 w-60">
      <Input 
      className={errors.password && touched.password ? "input-error" : ""}
      color="white"
      value={values.password}
      onChange={handleChange}
      id="password"
      type="password"
      placeholder="Password"
      onBlur={handleBlur}
      />
      {errors.password && touched.password && <p className="text-xs text-white">{errors.password}</p>}
      </div>
      <Button radius="lg" color="primary" variant="shadow" type="Submit">SIGN ME UP!</Button>
      <a href="Login"><Button radius="lg" color="primary" variant="shadow">BACK TO LOGIN</Button></a>
  </form>
  </div>
  </div>
  )
}
