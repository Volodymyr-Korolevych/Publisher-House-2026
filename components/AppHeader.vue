<template>
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <NuxtLink to="/" class="text-xl font-bold text-slate-900">{{ appName }}</NuxtLink>
        <p class="text-sm text-slate-500">Навчальний стартовий проєкт для інтернет-видавництва</p>
      </div>

      <nav class="flex flex-wrap items-center gap-2 text-sm">
        <NuxtLink to="/" class="btn-secondary">Головна</NuxtLink>
        <NuxtLink to="/publications" class="btn-secondary">Каталог</NuxtLink>
        <NuxtLink to="/profile" class="btn-secondary">Профіль</NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin" class="btn-secondary">Адмінка</NuxtLink>
        <NuxtLink v-if="!isLoggedIn" to="/login" class="btn-primary">Увійти</NuxtLink>
        <button v-else class="btn-primary" @click="logout">Вийти</button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName)
const { init, isLoggedIn, isAdmin, logout } = useAuth()

onMounted(async () => {
  await init()
})
</script>
