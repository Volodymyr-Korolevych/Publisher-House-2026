import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import type { Publication } from '~/types/models'

const fallbackPublications: Publication[] = [
  {
    id: 'demo-1',
    title: 'Основи сучасного JavaScript',
    author: 'Олена Коваль',
    description: 'Короткий вступ до сучасної мови JavaScript для початківців.',
    content: 'Це демонстраційний текст публікації. Після підключення Firebase тут будуть реальні дані з Firestore.',
    categoryId: 'demo-1',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-04-07'
  },
  {
    id: 'demo-2',
    title: 'Візуальна мова цифрових видань',
    author: 'Марія Сенько',
    description: 'Стаття про структуру, типографіку та композицію у веб-публікаціях.',
    content: 'Ще один демонстраційний матеріал для стартового каталогу. Він допомагає одразу побачити, як виглядає сайт.',
    categoryId: 'demo-2',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-04-07'
  }
]

export const usePublications = () => {
  const { db, isConfigured } = useFirebase()
  const publications = useState<Publication[]>('publications-list', () => [])
  const loading = useState<boolean>('publications-loading', () => false)

  const fetchPublications = async () => {
    loading.value = true
    try {
      if (!db || !isConfigured) {
        publications.value = fallbackPublications
        return
      }

      const snapshot = await getDocs(query(collection(db, 'publications'), orderBy('createdAt', 'desc')))
      publications.value = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Publication, 'id'>)
      }))
    } finally {
      loading.value = false
    }
  }

  const getPublicationById = async (id: string) => {
    if (!db || !isConfigured) {
      return publications.value.find((item) => item.id === id) || fallbackPublications.find((item) => item.id === id) || null
    }

    const snapshot = await getDoc(doc(db, 'publications', id))
    if (!snapshot.exists()) {
      return null
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Publication, 'id'>)
    } as Publication
  }

  const createPublication = async (payload: Omit<Publication, 'id' | 'createdAt'>) => {
    if (!db || !isConfigured) {
      throw new Error('Firebase не налаштований. CRUD стане активним після заповнення .env.')
    }

    await addDoc(collection(db, 'publications'), {
      ...payload,
      createdAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp()
    })

    await fetchPublications()
  }

  const updatePublication = async (id: string, payload: Omit<Publication, 'id' | 'createdAt'>) => {
    if (!db || !isConfigured) {
      throw new Error('Firebase не налаштований. CRUD стане активним після заповнення .env.')
    }

    await updateDoc(doc(db, 'publications', id), payload)
    await fetchPublications()
  }

  const removePublication = async (id: string) => {
    if (!db || !isConfigured) {
      throw new Error('Firebase не налаштований. CRUD стане активним після заповнення .env.')
    }

    await deleteDoc(doc(db, 'publications', id))
    await fetchPublications()
  }

  return {
    publications,
    loading,
    fetchPublications,
    getPublicationById,
    createPublication,
    updatePublication,
    removePublication
  }
}
