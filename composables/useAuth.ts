import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

type UserRole = 'user' | 'admin'

interface AuthUser {
  uid: string
  name: string
  email: string
  role: UserRole
}

const authUserState = () => useState<AuthUser | null>('authUser', () => null)
const authReadyState = () => useState<boolean>('authReady', () => false)
const authInitState = () => useState<boolean>('authInitialized', () => false)

export const useAuth = () => {
  const { $auth, $db } = useNuxtApp()
  const user = authUserState()
  const isReady = authReadyState()
  const isInitialized = authInitState()

  const initAuth = () => {
    if (!process.client || isInitialized.value) return

    isInitialized.value = true

    onAuthStateChanged($auth, async (firebaseUser) => {
      if (!firebaseUser) {
        user.value = null
        isReady.value = true
        return
      }

      const userRef = doc($db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        user.value = {
          uid: firebaseUser.uid,
          name: String(data.name || ''),
          email: String(data.email || firebaseUser.email || ''),
          role: (data.role as UserRole) || 'user'
        }
      } else {
        user.value = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: 'user'
        }
      }

      isReady.value = true
    })
  }

  const register = async (payload: { name: string; email: string; password: string }) => {
    const credentials = await createUserWithEmailAndPassword($auth, payload.email, payload.password)

    await setDoc(doc($db, 'users', credentials.user.uid), {
      name: payload.name,
      email: payload.email,
      role: 'user',
      createdAt: serverTimestamp()
    })

    return credentials.user
  }

const login = async (payload: { email: string; password: string }) => {
  const credentials = await signInWithEmailAndPassword($auth, payload.email, payload.password)

  const userRef = doc($db, 'users', credentials.user.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const data = userSnap.data()

    user.value = {
      uid: credentials.user.uid,
      name: String(data.name || ''),
      email: String(data.email || credentials.user.email || ''),
      role: (data.role as UserRole) || 'user'
    }
  } else {
    user.value = {
      uid: credentials.user.uid,
      name: credentials.user.displayName || '',
      email: credentials.user.email || '',
      role: 'user'
    }
  }

  isReady.value = true

  return credentials.user
}

  const logout = async () => {
    await signOut($auth)
    user.value = null
  }

  return {
    user,
    isReady,
    initAuth,
    register,
    login,
    logout
  }
}
