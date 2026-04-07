export type UserRole = 'guest' | 'user' | 'admin'

export interface AppUser {
  id: string
  name: string
  email: string
  role: Exclude<UserRole, 'guest'>
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Publication {
  id: string
  title: string
  author: string
  description: string
  content: string
  categoryId: string
  coverImage: string
  createdAt: string
}
