import appConfig from "@/config/appConfig"

export const getDefaultRouteForUserRole = (auth) => {
  if (!auth) return appConfig.defaultPublicRoute

  const { user } = auth

  return appConfig.defaultClientRoute.replace("{{clientId}}", user?.companyID)
}

export const displayDateTime = ({ date, isTimestamp }) => {
  const dateObject = isTimestamp ? new Date(date * 1000) : new Date(date)

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]

  const month = months[dateObject.getMonth()]
  const day = dateObject.getDate()
  const year = dateObject.getFullYear()

  let hours = dateObject.getHours()
  const minutes = dateObject.getMinutes().toString().padStart(2, "0")

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12

  return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`
}

export const formatAmount = (amount) => {
  if (!amount) return
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function getFileExtension(file) {
  return file.name.split(".").pop()
}

export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export function jsonToFormData(
  data,
  formData = new FormData(),
  namespace = ""
) {
  for (let property in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (!data.hasOwnProperty(property)) continue
    const key = namespace ? `${namespace}[${property}]` : property
    const value = data[property]

    if (value instanceof Date) {
      formData.append(key, value.toISOString())
    } else if (typeof value === "object" && !(value instanceof File)) {
      jsonToFormData(value, formData, key)
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemKey = `${key}[${index}]`
        if (typeof item === "object" && item !== null) {
          jsonToFormData(item, formData, itemKey)
        } else {
          formData.append(itemKey, item)
        }
      })
    } else {
      formData.append(key, value != null ? value.toString() : "")
    }
  }
  return formData
}
