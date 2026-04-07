import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore'

export interface CategoryItem {
  id: string
  name: string
  description: string
}

const defaultCategories: CategoryItem[] = [
  { id: '1', name: 'Програмування', description: 'Навчальні матеріали з програмування' },
  { id: '2', name: 'Дизайн', description: 'Публікації з дизайну та графіки' },
  { id: '3', name: 'Освіта', description: 'Матеріали для навчання та саморозвитку' }
]

const categoriesState = () => useState<CategoryItem[]>('categories', () => [])

export const useCategories = () => {
  const { $db } = useNuxtApp()
  const categories = categoriesState()

  const loadCategories = async () => {
    try {
      const q = query(collection($db, 'categories'), orderBy('name'))
      const snapshot = await getDocs(q)

      categories.value = snapshot.docs.map(docItem => ({
        id: docItem.id,
        name: String(docItem.data().name || ''),
        description: String(docItem.data().description || '')
      }))

      if (!categories.value.length) {
        categories.value = defaultCategories
      }
    } catch {
      categories.value = defaultCategories
    }
  }

  const createCategory = async (payload: { name: string; description: string }) => {
    await addDoc(collection($db, 'categories'), payload)
    await loadCategories()
  }

  const updateCategory = async (id: string, payload: { name: string; description: string }) => {
    await updateDoc(doc($db, 'categories', id), payload)
    await loadCategories()
  }

  const removeCategory = async (id: string) => {
    await deleteDoc(doc($db, 'categories', id))
    await loadCategories()
  }

  return {
    categories,
    loadCategories,
    createCategory,
    updateCategory,
    removeCategory
  }
}
