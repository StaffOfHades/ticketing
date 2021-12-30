import Router from 'next/router'
import cx from 'classnames'
import { useState } from "react"
import { useSWRConfig } from 'swr'

import { useRequest } from '../../hooks/use-request'

export function Signup() {
  const { mutate } = useSWRConfig()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { formattedErrors, request } = useRequest({ data: { email, password }, method: 'post', url: "/authentication-service/users/signup" })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await request()
    if (response !== null) {
      setEmail('')
      setPassword('')
      mutate('/authentication-service/users/current-user')
      Router.push('/')
    }
  }

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Sign Up</h3>
            <p className="mt-1 text-sm text-gray-600">Create new account</p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={onSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
              {formattedErrors[undefined]}
              <div className="px-4 bg-white sm:p-6 py-5">
                <div className={cx("grid grid-cols-6", formattedErrors['email'] !== undefined || formattedErrors['password'] !== undefined ? ' gap-4' : 'gap-6' )}>
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={({ target: { value }}) => setEmail(value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {formattedErrors['email']}
                  <div className={cx("col-span-6 sm:col-span-4", formattedErrors['email'] === undefined && formattedErrors['password'] !== undefined && 'mt-2')}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={({ target: { value }}) => setPassword(value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                   {formattedErrors['password']}
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
