export interface User {
  id: number
  name: string
  enrich: string
  hubspot: string
  phantombuster: string
}

export interface Contact {
  id: number
  name: string
  title: string
  company: string
  phone: string
  comment: string
  linkedin_profile: string
  linkedin_url: string
  firstname: string
  lastname: string
  vmid: string
  vmid_2: string
  created_date: Date
  hs_id: number
  deleted: boolean
  area: string
  status: string
  PK: string
  Employees: string
  linkedin_company_url: string
  user: string
  industry: string
  company_location: string
  email: string
  action: string
  photo: string
  note: string
  tags: string[]
}
