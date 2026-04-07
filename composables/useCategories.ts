import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import type { Category } from '~/types/models'

const fallbackCategories: Category[] = [
  {
    id: 'demo-1',
    name: 'Програмування',
    description: 'Навчальні матеріали з програмування',
    createdAt: '2026-04-07'
  },
  {
    id: 'demo-2',
    name: 'Дизайн',
    description: 'Матеріали про UI, UX і візуальну культуру',
    createdAt: '2026-04-07'
  }
]

export const useCategories = () => {
  const { db, isConfigured } = useFirebase()
  const categories = useState<Category[]>('categories-list', () => [])
  const loading = useState<boolean>('categories-loading', () => false)

  const fetchCategories = async () => {
    loading.value = true
    try {
      if (!db || !isConfigured) {
        categories.value = fallbackCategories
        return
      }

      const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('createdAt', 'desc')))
      categories.value = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Category, 'id'>)
      }))
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (payload: Pick<Category, 'name' | 'description'>) => {
    if (!db || !isConfigured) {
      throw new Error('Firebase не налаштований. CRUD стане активним після заповнення .env.')
    }

    await addDoc(collection(db, 'categories'), {
      ...payload,
      createdAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp()
    })

    await fetchCategories()
  }

  const updateCategory = async (id: string, payload: Pick<Category, 'name' | 'description'>) => {
    if (!db || !isConfigured) {
      throw new Error('Firebase не налаштований. CRUD стане активним після заповнення .env.')
    }

    await updateDoc(doc(db, 'categories', id), payload)
    await fetchCategories()
  }

  const removeCategory = async (id: string) => {
    if (!db || !isConfigured) {
      throw new Error('Firebase не налаштований. CRUD стане активним після заповнення .env.')
    }

    await deleteDoc(doc(db, 'categories', id))
    await fetchCategories()
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    removeCategory
  }
}
