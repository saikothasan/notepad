export interface Note {
  id: string
  content: string
  createdAt: number
  updatedAt: number
  isPublic: boolean
  expiresIn?: number
}

