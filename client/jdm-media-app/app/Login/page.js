'use client'
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from 'yup'
import { Input } from "@nextui-org/react";

export default function Login() {
  const router = useRouter()
  const basicSchema = yup.object().shape({
    username: yup.string().required("Please Enter A Valid Username"),
    password: yup.string()
    .required("Please Enter A Valid Password")
  })
  const onSubmit = () => {
      fetch("http://127.0.0.1:5555/Login", {
        method: "POST",
        credentials: "include",
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
          router.push('/Dashboard')
        } else {
          return alert("You have entered the Wrong Username or Password, Please Try Again")
        }
      })
    }
// FORMIK
    const { values, errors, handleBlur,touched, handleChange, handleSubmit } = useFormik({
      initialValues: {
        username:"",
        password:""
      },
      validationSchema: basicSchema,
      onSubmit,
    })
  return (
<div className="bg-cover bg-center bg-no-repeat bg-[url('../Images/Supra_Login.gif')]">
<div className="flex h-screen w-auto flex-col text-center items-center justify-center">
  <form autoComplete="off" onSubmit={handleSubmit}>
    <div className="text-white text-4xl font-bold">JDM LOGIN</div>
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
      <Button radius="lg" color="primary" variant="shadow" type="Submit">LOGIN</Button>
      <a href="Signup"><Button radius="lg" color="primary" variant="shadow">NEED TO SIGN UP?</Button></a>
  </form>
  </div>
  </div>
  )
}
