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
  content: string
  categoryId: string
  coverImage: string
  createdAt?: unknown
}

const demoPublications: PublicationItem[] = [
  {
    id: 'demo-1',
    title: 'Основи веб-розробки',
    author: 'Олена Коваль',
    description: 'Короткий вступ до сучасної веб-розробки та основ побудови інтерфейсів.',
    content: 'Це демонстраційний текст публікації. Надалі тут буде повний вміст книги або статті.',
    categoryId: '1',
    coverImage: ''
  },
  {
    id: 'demo-2',
    title: 'Tailwind CSS для початківців',
    author: 'Ірина Петренко',
    description: 'Практичний матеріал для створення адаптивних інтерфейсів за допомогою utility-first підходу.',
    content: 'Це демонстраційний текст другої публікації. Його можна буде замінити реальним контентом.',
    categoryId: '2',
    coverImage: ''
  }
]

const publicationsState = () => useState<PublicationItem[]>('publications', () => [])
const currentPublicationState = () => useState<PublicationItem | null>('currentPublication', () => null)

export const usePublications = () => {
  const { $db } = useNuxtApp()
  const publications = publicationsState()
  const currentPublication = currentPublicationState()

  const loadPublications = async () => {
    try {
      const q = query(collection($db, 'publications'), orderBy('title'))
      const snapshot = await getDocs(q)

      publications.value = snapshot.docs.map(docItem => ({
        id: docItem.id,
        title: String(docItem.data().title || ''),
        author: String(docItem.data().author || ''),
        description: String(docItem.data().description || ''),
        content: String(docItem.data().content || ''),
        categoryId: String(docItem.data().categoryId || ''),
        coverImage: String(docItem.data().coverImage || ''),
        createdAt: docItem.data().createdAt
      }))

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
        currentPublication.value = {
          id: snapshot.id,
          title: String(snapshot.data().title || ''),
          author: String(snapshot.data().author || ''),
          description: String(snapshot.data().description || ''),
          content: String(snapshot.data().content || ''),
          categoryId: String(snapshot.data().categoryId || ''),
          coverImage: String(snapshot.data().coverImage || ''),
          createdAt: snapshot.data().createdAt
        }
        return
      }

      currentPublication.value = publications.value.find(item => item.id === id) || null
    } catch {
      currentPublication.value = publications.value.find(item => item.id === id) || null
    }
  }

  const createPublication = async (payload: Omit<PublicationItem, 'id'>) => {
    await addDoc(collection($db, 'publications'), {
      ...payload,
      createdAt: serverTimestamp()
    })
    await loadPublications()
  }

  const updatePublication = async (id: string, payload: Omit<PublicationItem, 'id'>) => {
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
    removePublication
  }
}
