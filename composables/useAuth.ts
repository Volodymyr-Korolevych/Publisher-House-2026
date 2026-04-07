import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import type { AppUser, UserRole } from '~/types/models'

const toSerializableDate = () => new Date().toISOString()

export const useAuth = () => {
  const { auth, db, isConfigured } = useFirebase()
  const firebaseUser = useState<User | null>('firebase-user', () => null)
  const profile = useState<AppUser | null>('auth-profile', () => null)
  const ready = useState<boolean>('auth-ready', () => false)

  const role = computed<UserRole>(() => profile.value?.role || 'guest')
  const isLoggedIn = computed(() => Boolean(firebaseUser.value))
  const isAdmin = computed(() => role.value === 'admin')

  const stopListener = () => {
    // reserved for future TASK updates if we need unsubscribe handling
  }

  const fetchProfile = async (uid: string) => {
    if (!db) {
      profile.value = null
      return
    }

    const snapshot = await getDoc(doc(db, 'users', uid))

    if (!snapshot.exists()) {
      profile.value = null
      return
    }

    const data = snapshot.data() as Omit<AppUser, 'id'>
    profile.value = {
      id: uid,
      ...data
    }
  }

  const init = async () => {
    if (!auth || ready.value) {
      ready.value = true
      return
    }

    await new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        firebaseUser.value = user
        if (user) {
          await fetchProfile(user.uid)
        } else {
          profile.value = null
        }
        ready.value = true
        resolve()
      })
    })
  }

  const register = async (name: string, email: string, password: string) => {
    if (!auth || !db || !isConfigured) {
      throw new Error('Firebase не налаштований. Заповни .env файл.')
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (credential.user) {
      await updateProfile(credential.user, { displayName: name })
      await setDoc(doc(db, 'users', credential.user.uid), {
        name,
        email,
        role: 'user',
        createdAt: toSerializableDate(),
        serverCreatedAt: serverTimestamp()
      })
      await fetchProfile(credential.user.uid)
    }

    return credential
  }

  const login = async (email: string, password: string) => {
    if (!auth || !isConfigured) {
      throw new Error('Firebase не налаштований. Заповни .env файл.')
    }

    const credential = await signInWithEmailAndPassword(auth, email, password)
    if (credential.user) {
      await fetchProfile(credential.user.uid)
    }

    return credential
  }

  const logout = async () => {
    if (!auth) {
      return
    }

    await signOut(auth)
    firebaseUser.value = null
    profile.value = null
    stopListener()
    await navigateTo('/')
  }

  return {
    firebaseUser,
    profile,
    role,
    isLoggedIn,
    isAdmin,
    ready,
    init,
    login,
    register,
    logout,
    fetchProfile
  }
}
