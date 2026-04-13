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

export interface PublicationItem {
  id: string
  title: string
  author: string
  description: string
  categoryId: string
  coverImage: string
  bookFileUrl: string
  bookFileName: string
  downloadsCount: number
  ratingAverage: number
  ratingsCount: number
  createdAt?: unknown
}

const demoPublications: PublicationItem[] = [
  {
    id: 'demo-1',
    title: 'Основи веб-розробки',
    author: 'Олена Коваль',
    description: 'Короткий вступ до сучасної веб-розробки та основ побудови інтерфейсів.',
    categoryId: '1',
    coverImage: '',
    bookFileUrl: '',
    bookFileName: '',
    downloadsCount: 0,
    ratingAverage: 0,
    ratingsCount: 0
  },
  {
    id: 'demo-2',
    title: 'Tailwind CSS для початківців',
    author: 'Ірина Петренко',
    description: 'Практичний матеріал для створення адаптивних інтерфейсів за допомогою utility-first підходу.',
    categoryId: '2',
    coverImage: '',
    bookFileUrl: '',
    bookFileName: '',
    downloadsCount: 0,
    ratingAverage: 0,
    ratingsCount: 0
  }
]

const publicationsState = () => useState<PublicationItem[]>('publications', () => [])
const currentPublicationState = () => useState<PublicationItem | null>('currentPublication', () => null)

export const usePublications = () => {
  const { $db } = useNuxtApp()
  const publications = publicationsState()
  const currentPublication = currentPublicationState()

  const normalizePublication = (id: string, data: Record<string, any>): PublicationItem => ({
    id,
    title: String(data.title || ''),
    author: String(data.author || ''),
    description: String(data.description || ''),
    categoryId: String(data.categoryId || ''),
    coverImage: String(data.coverImage || ''),
    bookFileUrl: String(data.bookFileUrl || ''),
    bookFileName: String(data.bookFileName || ''),
    downloadsCount: Number(data.downloadsCount || 0),
    ratingAverage: Number(data.ratingAverage || 0),
    ratingsCount: Number(data.ratingsCount || 0),
    createdAt: data.createdAt
  })

  const loadPublications = async () => {
    try {
      const q = query(collection($db, 'publications'), orderBy('title'))
      const snapshot = await getDocs(q)

      publications.value = snapshot.docs.map((docItem) =>
        normalizePublication(docItem.id, docItem.data())
      )

      if (!publications.value.length) {
        publications.value = demoPublications
      }
    } catch {
      publications.value = demoPublications
    }
  }

  const loadPublicationById = async (id: string) => {
    try {
      const snapshot = await getDoc(doc($db, 'publications', id))

      if (snapshot.exists()) {
        currentPublication.value = normalizePublication(snapshot.id, snapshot.data())
        return
      }

      currentPublication.value = publications.value.find((item) => item.id === id) || null
    } catch {
      currentPublication.value = publications.value.find((item) => item.id === id) || null
    }
  }

  const createPublication = async (payload: Omit<PublicationItem, 'id'>) => {
    await addDoc(collection($db, 'publications'), {
      title: payload.title,
      author: payload.author,
      description: payload.description,
      categoryId: payload.categoryId,
      coverImage: payload.coverImage,
      bookFileUrl: payload.bookFileUrl,
      bookFileName: payload.bookFileName,
      downloadsCount: 0,
      ratingAverage: 0,
      ratingsCount: 0,
      createdAt: serverTimestamp()
    })

    await loadPublications()
  }

  const updatePublication = async (id: string, payload: Omit<PublicationItem, 'id'>) => {
    await updateDoc(doc($db, 'publications', id), {
      title: payload.title,
      author: payload.author,
      description: payload.description,
      categoryId: payload.categoryId,
      coverImage: payload.coverImage,
      bookFileUrl: payload.bookFileUrl,
      bookFileName: payload.bookFileName
    })

    await loadPublications()
  }

  const updatePublicationStats = async (
    id: string,
    payload: { downloadsCount?: number; ratingAverage?: number; ratingsCount?: number }
  ) => {
    await updateDoc(doc($db, 'publications', id), payload)
    await loadPublications()
  }

  const removePublication = async (id: string) => {
    await deleteDoc(doc($db, 'publications', id))
    await loadPublications()
  }

  return {
    publications,
    currentPublication,
    loadPublications,
    loadPublicationById,
    createPublication,
    updatePublication,
    updatePublicationStats,
    removePublication
  }
}
