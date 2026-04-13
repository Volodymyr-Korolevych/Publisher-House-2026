import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'

export interface UserBookItem {
  id: string
  userId: string
  publicationId: string
  downloadedAt?: unknown
  rating: number | null
}

const userBooksState = () => useState<UserBookItem[]>('userBooks', () => [])

export const useUserBooks = () => {
  const { $db } = useNuxtApp()
  const userBooks = userBooksState()

  const normalizeUserBook = (id: string, data: Record<string, any>): UserBookItem => ({
    id,
    userId: String(data.userId || ''),
    publicationId: String(data.publicationId || ''),
    downloadedAt: data.downloadedAt,
    rating: typeof data.rating === 'number' ? data.rating : null
  })

  const loadUserBooks = async (userId: string) => {
    try {
      const q = query(collection($db, 'user_books'), where('userId', '==', userId))
      const snapshot = await getDocs(q)

      userBooks.value = snapshot.docs.map((docItem) =>
        normalizeUserBook(docItem.id, docItem.data())
      )
    } catch {
      userBooks.value = []
    }
  }

  const recordDownload = async (userId: string, publicationId: string) => {
    const documentId = `${userId}_${publicationId}`
    const userBookRef = doc($db, 'user_books', documentId)
    const publicationRef = doc($db, 'publications', publicationId)

    const existing = await getDoc(userBookRef)

    if (!existing.exists()) {
      await setDoc(userBookRef, {
        userId,
        publicationId,
        downloadedAt: serverTimestamp(),
        rating: null
      })

      await updateDoc(publicationRef, {
        downloadsCount: increment(1)
      })
    }
  }

  const setRating = async (userId: string, publicationId: string, rating: number) => {
    const documentId = `${userId}_${publicationId}`
    const userBookRef = doc($db, 'user_books', documentId)

    await setDoc(
      userBookRef,
      {
        userId,
        publicationId,
        downloadedAt: serverTimestamp(),
        rating
      },
      { merge: true }
    )

    const q = query(collection($db, 'user_books'), where('publicationId', '==', publicationId))
    const snapshot = await getDocs(q)

    const ratings = snapshot.docs
      .map((docItem) => docItem.data().rating)
      .filter((value) => typeof value === 'number' && value >= 1 && value <= 5)

    const ratingsCount = ratings.length
    const ratingAverage = ratingsCount
      ? Number((ratings.reduce((sum, item) => sum + item, 0) / ratingsCount).toFixed(2))
      : 0

    await updateDoc(doc($db, 'publications', publicationId), {
      ratingAverage,
      ratingsCount
    })

    await loadUserBooks(userId)
  }

  const getUserBookRecord = (userId: string, publicationId: string) => {
    return userBooks.value.find(
      (item) => item.userId === userId && item.publicationId === publicationId
    ) || null
  }

  return {
    userBooks,
    loadUserBooks,
    recordDownload,
    setRating,
    getUserBookRecord
  }
}
