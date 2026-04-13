import {
  addDoc, collection, deleteDoc, doc,
  getDocs, updateDoc, serverTimestamp
} from 'firebase/firestore'

export const usePublications = () => {
  const { $db } = useNuxtApp()
  const publications = useState<any[]>('publications', () => [])

  const loadPublications = async () => {
    const snap = await getDocs(collection($db, 'publications'))
    publications.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  const createPublication = async (data: any) => {
    await addDoc(collection($db, 'publications'), {
      ...data,
      downloadsCount: 0,
      ratingAverage: 0,
      ratingsCount: 0,
      createdAt: serverTimestamp()
    })
  }

  const updatePublication = async (id: string, data: any) => {
    await updateDoc(doc($db, 'publications', id), data)
  }

  const removePublication = async (id: string) => {
    await deleteDoc(doc($db, 'publications', id))
  }

  return {
    publications,
    loadPublications,
    createPublication,
    updatePublication,
    removePublication
  }
}
