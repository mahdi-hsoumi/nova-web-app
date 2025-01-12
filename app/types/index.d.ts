export type UserStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  _id: string
  username: string
  email: string
  role: 'admin' | 'user'
  status: UserStatus
  idDocument?: string // Path to the uploaded ID document
  createdAt: Date
  updatedAt: Date
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
