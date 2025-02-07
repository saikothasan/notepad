export interface Note {
  id: string
  content: string
  isPublic: boolean
  expiresIn: string
  createdAt: number
  updatedAt: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

