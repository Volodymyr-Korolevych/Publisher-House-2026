import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

let services: FirebaseServices | null = null

export const hasFirebaseEnv = (config: ReturnType<typeof useRuntimeConfig>) => {
  const firebase = config.public.firebase
  return Boolean(
    firebase.apiKey &&
      firebase.authDomain &&
      firebase.projectId &&
      firebase.storageBucket &&
      firebase.messagingSenderId &&
      firebase.appId
  )
}

export const getFirebaseServices = () => {
  if (import.meta.server) {
    return null
  }

  if (services) {
    return services
  }

  const config = useRuntimeConfig()

  if (!hasFirebaseEnv(config)) {
    return null
  }

  const firebaseConfig = { ...config.public.firebase }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

  services = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app)
  }

  return services
}
