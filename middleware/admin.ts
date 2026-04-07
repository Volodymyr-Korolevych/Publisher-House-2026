export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return
  }

  const { isConfigured } = useFirebase()
  if (!isConfigured) {
    return
  }

  const { init, isAdmin } = useAuth()
  await init()

  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
