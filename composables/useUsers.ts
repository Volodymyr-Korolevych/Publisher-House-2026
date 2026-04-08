import { collection, getDocs, orderBy, query } from 'firebase/firestore'

export interface UserItem {
  id: string
  name: string
  email: string
  role: string
  createdAt?: unknown
}

const usersState = () => useState<UserItem[]>('users', () => [])

const formatFallbackDate = () => {
  return new Date().toISOString()
}

export const useUsers = () => {
  const { $db } = useNuxtApp()
  const users = usersState()

  const loadUsers = async () => {
    try {
      const q = query(collection($db, 'users'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)

      users.value = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        name: String(docItem.data().name || ''),
        email: String(docItem.data().email || ''),
        role: String(docItem.data().role || 'user'),
        createdAt: docItem.data().createdAt || formatFallbackDate()
      }))
    } catch {
      users.value = []
    }
  }

  const formatUserRole = (role: string) => {
    if (role === 'admin') return 'Адміністратор'
    if (role === 'user') return 'Користувач'
    return role || 'Не вказано'
  }

  const formatCreatedAt = (value: any) => {
    if (!value) return '—'

    try {
      if (typeof value?.toDate === 'function') {
        return new Intl.DateTimeFormat('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(value.toDate())
      }

      if (typeof value === 'string' || value instanceof Date) {
        return new Intl.DateTimeFormat('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(value))
      }

      return '—'
    } catch {
      return '—'
    }
  }

  return {
    users,
    loadUsers,
    formatUserRole,
    formatCreatedAt
  }
}
