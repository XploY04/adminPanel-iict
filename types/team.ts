export interface Participant {
  name: string
  email: string
  age: number
  phone: string
  student_or_professional: string
  college_or_company_name: string
  github_profile: string
  linkedin_profile: string
  devfolio_profile: string
}

export interface Team {
  _id?: string
  team_name: string
  team_size: number
  idea_title: string
  idea_document_url: string
  participants: Participant[]
  status: "registered"
  selected: boolean
  createdAt: Date
}
