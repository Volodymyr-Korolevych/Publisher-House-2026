export default defineNuxtRouteMiddleware(async () => {
  const { user, isReady, initAuth } = useAuth()

  if (process.client) {
    initAuth()

    if (!isReady.value) {
      await new Promise<void>((resolve) => {
        const stop = watch(isReady, (value) => {
          if (value) {
            stop()
            resolve()
          }
        })
      })
    }
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
