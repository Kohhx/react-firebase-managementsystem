import React from 'react'
import "./Login.css"
import { useLogin } from '../hooks/useLogin'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, error, isPending } = useLogin();

  const handleSubmitForm = async (data) => {
    console.log(data)
    await login(data.email, data.password);
    navigate("/");
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="w-[50%]">
        <h1 className="text-2xl">Login</h1>
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input {...register("email")} type="text" autocomplete="username" class="w-full block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Enter email" />
                  </div>
                </div>
              </div>
              <div class="sm:col-span-4">
                <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input {...register("password")} type="text" autocomplete="username" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Enter password" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          Register <Link className="underline text-blue-600" to="/signup">Now</Link>
          <div class="mt-6 flex items-center justify-end gap-x-6">
            {!isPending && <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>}
            {isPending && <button disabled type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300">Loading...</button>}
          </div>

        </div>
      </form>
    </div>
  )
}

export default Login
