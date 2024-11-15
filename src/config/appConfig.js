const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
  defaultPublicRoute: "/",
  defaultClientRoute: "/clients/{{clientId}}",
  defaultAgencyRoute: "/clients"
}

export default appConfig
