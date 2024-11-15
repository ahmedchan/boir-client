import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import appConfig from "@/config/appConfig"

const baseQuery = fetchBaseQuery({
  baseUrl: appConfig.apiUrl,
  prepareHeaders: (headers) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = localStorage.getItem("accessToken")
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    headers.set("Accept", "application/json")
    return headers
  }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    window.localStorage.removeItem("accessToken")
    window.localStorage.removeItem("user")
    // window.location.href = "/auth/login"
  }

  return result
}

const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: 0, //30 * 60,
  tagTypes: ["clients"],
  endpoints: () => ({})
})

export default baseApi
