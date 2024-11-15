import baseApi from "./baseApi"

export const authService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/Profile/login",
        method: "POST",
        body: data
      })
    }),
    login2FA: builder.mutation({
      query: ({ otp, ...data }) => ({
        url: `/Profile/login2FA?otp=${otp}`,
        method: "POST",
        body: data
      })
    }),
    register: builder.mutation({
      query: (data) => {
        return {
          url: `/Profile/register`,
          method: "POST",
          body: data
        }
      }
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: `/Authentication/ValidateOTP?email=${email}&otp=${otp}`,
        method: "POST"
      })
    }),
    resendOtpCode: builder.mutation({
      query: ({ email }) => ({
        url: `/Authentication/GenerateOTP?email=${email}`,
        method: "POST"
      })
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/Profile/ResetPassword`,
        method: "POST",
        body: data
      })
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogin2FAMutation,
  useVerifyOtpMutation,
  useResendOtpCodeMutation,
  useResetPasswordMutation
} = authService
