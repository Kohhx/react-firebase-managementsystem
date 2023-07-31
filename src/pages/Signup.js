import React, { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import  { useNavigate, Link } from 'react-router-dom'


const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, getValues, setValue, formState: { errors }, formState, reset } = useForm({
    mode: "all"
  });
  const { signup } = useSignup();
  const [signupState, setSignupState] = useState({
    email: '',
    password: '',
    displayName: '',
  })

  const inputClass = (isError) => {
    if (isError) {
      return "block flex-1 border border-red-500 rounded focus:border-red-500  py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-red-100 focus:outline-none"
    }
    return "block flex-1 border border-transparent bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:ring-0"
  }

  const setForm = () => {
    setValue("email", "k@gmail.com")
    setValue("password", "password")
    setValue("displayName", "Koh He Xiang")
  }

  const handleFileUpload = (e) => {
    // const file = watch("file")
    const file = e.target?.files[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.includes("image")) {
      toast.error("Invalid file type. Please upload an image file")
      reset({ profileImage: "" })
      return
    }

    // Check file size
    if (file.size > 1000000) {
      toast.error("Image file size must be less tahn 1000Kb")
      reset({ profileImage: "" })
      return
    }
  }

  const handleSignUpSubmit = async (data) => {
    console.log(formState)
    // Get Values
    console.log("Display name", getValues("displayName"))
    console.log("Email", getValues("email"))
    console.log("Password", getValues("password"))
    console.log("Profile img",data.profileImage[0])
    // Console log all the registered data
    console.log(data)

    await signup(data.email, data.password, data.displayName, data.profileImage[0])
    navigate("/")
  }
  return (
    <div className="sigup-container">
      <form onSubmit={handleSubmit(handleSignUpSubmit)}>
        <h1 className="text-2xl">Register</h1>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label for="username" className="block text-sm font-medium leading-6 text-gray-900">Display Name</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input {...register("displayName", { required: true })} type="text" className={inputClass(errors.displayName)} placeholder="Enter display name" />
                  </div>
                  <div>
                    {errors.displayName && errors.displayName.type === "required" && <span className="text-red-500 text-sm">This field is required</span>}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label for="username" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input  {...register("email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })} type="text" autocomplete="username" className={inputClass(errors.email)} placeholder="Enter email" />
                  </div>
                  <div>
                    {errors.email && errors.email.type === "required" && <span className="text-red-500 text-sm">This field is required</span>}
                    {errors.email && errors.email.type === "pattern" && <span className="text-red-500 text-sm">Email is invalid</span>}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label for="username" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input {...register("password", { required: true, minLength: 8 })} type="text" autocomplete="username" className={inputClass(errors.password)} placeholder="Enter password" />
                  </div>
                  <div>
                    {errors.password && errors.password.type === "required" && <span className="text-red-500 text-sm">This field is required</span>}
                    {errors.password && errors.password.type === "minLength" && <span className="text-red-500 text-sm">Password should have minimum length of 8 chars</span>}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label for="username" className="block text-sm font-medium leading-6 text-gray-900">Profile Image</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input  {...register("profileImage", { required: true })} onChange={handleFileUpload} type="file" className={inputClass(errors.profileImage)} placeholder="Enter password" />
                  </div>
                  <div>
                    {errors.profileImage && errors.profileImage.type === "required" && <span className="text-red-500 text-sm">Please upload an profile image</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button onClick={setForm} className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300" type="button">Set</button>
            <button className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300" type="reset">Reset</button>
            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default Signup
