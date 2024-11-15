import baseApi from "./baseApi"

export const priceService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => "/BOI/Countries",
      transformResponse: (res) => res.$values
    }),
    getUSATerritory: builder.query({
      query: () => "/BOI/USATerritory",
      transformResponse: (res) => res.$values
    }),
    getForeignCountries: builder.query({
      query: () => "/BOI/Foreign",
      transformResponse: (res) => res.$values
    }),
    getStatesByCountry: builder.query({
      query: ({ countryId }) => `/BOI/States/${countryId}`,
      transformResponse: (res) => res.$values
    }),
    getPartyIdentificationCompanyType: builder.query({
      query: () => "/BOI/PartyIdentificationCompanyType",
      transformResponse: (res) => res.$values
    }),
    getPartyIdentificationPersonalType: builder.query({
      query: () => "/BOI/PartyIdentificationPersonalType",
      transformResponse: (res) => res.$values
    }),
    getTribes: builder.query({
      query: () => "/BOI/Tribes",
      transformResponse: (res) => res.$values
    })
  })
})

export const {
  useGetCountriesQuery,
  useGetStatesByCountryQuery,
  useGetUSATerritoryQuery,
  useGetForeignCountriesQuery,
  useGetPartyIdentificationCompanyTypeQuery,
  useGetPartyIdentificationPersonalTypeQuery,
  useGetTribesQuery
} = priceService
