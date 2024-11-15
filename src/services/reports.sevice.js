import baseApi from "./baseApi"

export const reportService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportsByCompanyId: builder.query({
      query: ({ companyId }) => `/BOI/reports/${companyId}`,
      transformResponse: (res) => res
    }),
    initialEmptyReport: builder.mutation({
      query: (data) => ({
        url: `/BOI/NewReport`,
        method: "POST",
        body: data
      })
    }),
    getReportById: builder.query({
      query: ({ reportId }) => `/BOI/report/${reportId}`
    }),
    getBOIRbillingData: builder.query({
      query: ({ reportIds }) => {
        let query = ""

        reportIds.forEach((item) => {
          query += "reportId=" + item + "&"
        })

        return `/Billing/get-boir-payment-data?${query}`
      }
    }),
    saveReport: builder.mutation({
      query: (data) => ({
        url: "/BOI/saveReport",
        method: "POST",
        body: data
      })
    }),
    createPaymentIntend: builder.mutation({
      query: (data) => ({
        url: "/Billing/create-payment-intent",
        method: "POST",
        body: data
      })
    }),
    submitReport: builder.mutation({
      query: ({ reportId }) => ({
        url: `/BOI/submitReport/${reportId}`,
        method: "POST"
      })
    }),
    applyPayment: builder.mutation({
      query: (data) => ({
        url: "/Billing/apply-payment",
        method: "POST",
        body: data
      })
    })
  })
})

export const {
  useGetReportsByCompanyIdQuery,
  useInitialEmptyReportMutation,
  useGetReportByIdQuery,
  useGetBOIRbillingDataQuery,
  useSubmitReportMutation,
  useSaveReportMutation,
  useCreatePaymentIntendMutation,
  useApplyPaymentMutation
} = reportService
