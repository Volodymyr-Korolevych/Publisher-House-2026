export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return
  }

  const { isConfigured } = useFirebase()
  if (!isConfigured) {
    return
  }

  const { init, isLoggedIn } = useAuth()
  await init()

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
