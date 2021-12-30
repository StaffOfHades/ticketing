import axios from "axios"
import { useCallback, useState } from "react"

export const useRequest = (requestOptions) => {
  const [errors, setErrors] = useState({})
  const [formattedErrors, setFormattedErrors] = useState({})

  const request = useCallback(async () => {
    try {
      const response = await axios.request(requestOptions);
      return response;
    } catch(error) {
      const errorsByFieldObject = error.response.data.errors.reduce(
        (errorsByField, { field, message }) => {
          if (errorsByField[field] === undefined) {
            errorsByField[field] = []
          }
          errorsByField[field].push(message)
          return errorsByField;
        },
        {}
      )
      setErrors(errorsByFieldObject)
      setFormattedErrors(
        Object.entries(errorsByFieldObject).reduce((errorsByField, [field, messages]) => {
          const formattedMessages = messages.map((message) => (<p className="pl-1 text-sm text-red-600" key={message}>{message}</p>))
          const messageContainer = (<div className="col-span-6 sm:col-span-4">{formattedMessages}</div>)

          errorsByField[field] = field !== "undefined" ? messageContainer : (
            <div className="px-4 bg-white pt-5 sm:px-6 sm:pt-6">
              <div className="grid grid-cols-6 gap-6 mt-3">
                {messageContainer}
              </div>
            </div>
          )

          return errorsByField;
        }, {})
      );
      return null;
    }
  }, [requestOptions])

  return { errors, formattedErrors, request }
}
