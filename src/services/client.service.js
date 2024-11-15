import baseApi from "./baseApi"

export const priceService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientsByCompanyId: builder.query({
      query: ({ companyId }) =>
        `/Profile/AgencyClientsByAgencyCompany/${companyId}`,
      transformResponse: (res) => res?.$values,
      providesTags: (result) => {
        if (result) {
          const record = result?.map((item) => ({
            type: "clients",
            id: item.agencyCompanyChildId
          }))
          return [{ type: "clients", id: "clients_list" }, ...record]
        } else {
          return [{ type: "clients", id: "clients_list" }]
        }
      }
    }),
    getSubscriptionPaymentData: builder.query({
      query: ({ agencyCompanyId }) =>
        `/Billing/get-agency-subscription-payment-data/${agencyCompanyId}`
    })
  })
})

export const {
  useGetClientsByCompanyIdQuery,
  useGetSubscriptionPaymentDataQuery
} = priceService
