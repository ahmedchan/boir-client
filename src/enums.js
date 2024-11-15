/* eslint-disable no-useless-escape */
// IsActive Enum
export const IsActive = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 0
})

export const MAX_FILE_SIZE = 4 * 1024 * 1024 // 2 MB
export const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf"
]
export const FILENAME_PATTERN = /^[a-zA-Z0-9!@#$%()_=+\-]+$/

// ProfileStatus Enum
export const ProfileStatus = Object.freeze({
  NEW_UNCONFIRMED_ACCOUNT: 1,
  CLIENT_INVITED: 2,
  ACCOUNT_LOCKED: 3,
  ACCOUNT_CONFIRMED: 4
})

// ProfileRole Enum
export const ProfileRole = Object.freeze({
  REGULAR_CLIENT: 1,
  AGENCY: 2,
  AGENCY_CLIENT: 3,
  SUPER_ADMIN: 4
})

// MasterBillingType Enum
export const MasterBillingType = Object.freeze({
  REGULAR_CLIENT_FILING_FEE: 1,
  AGENCY_SUBSCRIPTION_FEE: 2,
  AGENCY_CLIENT_FILING_FEE: 3,
  AGENCY_CLIENT_CHARGE_FEE: 4
})

// BoirFilingType Enum
export const BoirFilingType = Object.freeze({
  INITIAL_REPORT: "1",
  CORRECT_PRIOR_REPORT: "2",
  UPDATE_PRIOR_REPORT: "3",
  NEWLY_EXEMPT_ENTITY: "4"
})

// EFilingPriorReportingCompanyIdentificationType Enum
export const EFilingPriorReportingCompanyIdentificationType = Object.freeze({
  SSN_ITIN_9D: "1",
  EIN_9D: "2",
  FOREIGN_ENTITY_25: "9"
})

// ActivityPartyType Enum
export const ActivityPartyType = Object.freeze({
  AW_REPORTING_COMPANY: 62,
  AW_COMPANY_APPLICANT: 63,
  AW_BENEFICIAL_OWNER: 64
})

// OrganizationClassificationTypeSubtype Enum
export const OrganizationClassificationTypeSubtype = Object.freeze({
  NOT_APPLICABLE: 0,
  FOREIGN_POOLED_INVESTMENT_VEHICLE: 19
})

// PartyNameType Enum
export const PartyNameType = Object.freeze({
  SELECT_NAME_TYPE: "...",
  LEGAL_NAME: "L",
  DBA_NAME: "DBA"
})
