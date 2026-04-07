export const useFirebase = () => {
  const config = useRuntimeConfig()
  const services = getFirebaseServices()

  return {
    isConfigured: hasFirebaseEnv(config),
    app: services?.app ?? null,
    auth: services?.auth ?? null,
    db: services?.db ?? null,
    storage: services?.storage ?? null
  }
}
