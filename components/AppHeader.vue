<template>
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="container-app flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight text-slate-900">
          Інтернет-видавництво Літера
        </NuxtLink>

        <button class="rounded-xl border border-slate-300 px-3 py-2 text-sm md:hidden" @click="isOpen = !isOpen">
          Меню
        </button>
      </div>

      <nav :class="['flex-col gap-3 md:flex md:flex-row md:items-center', isOpen ? 'flex' : 'hidden']">
        <NuxtLink to="/" class="text-sm text-slate-700 hover:text-slate-900">Головна</NuxtLink>

        <div class="group relative">
          <NuxtLink to="/publications" class="text-sm text-slate-700 hover:text-slate-900">
            Публікації
          </NuxtLink>

          <div v-if="categories.length"
            class="mt-2 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg md:absolute md:left-0 md:top-full md:z-20 md:mt-0 md:hidden md:min-w-[240px] md:group-hover:flex"
           > <NuxtLink to="/publications"
              class="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              Усі публікації
            </NuxtLink>

            <NuxtLink v-for="category in categories" :key="category.id" :to="`/publications?category=${category.id}`"
              class="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <NuxtLink v-if="isLoggedIn && user?.role === 'user'" to="/profile"
          class="text-sm text-slate-700 hover:text-slate-900">
          Кабінет
        </NuxtLink>

        <NuxtLink v-if="isAdmin" to="/admin" class="text-sm text-slate-700 hover:text-slate-900">
          Адмін-панель
        </NuxtLink>

        <NuxtLink v-if="!isLoggedIn" to="/login" class="btn-secondary">
          Вхід
        </NuxtLink>

        <NuxtLink v-if="!isLoggedIn" to="/register" class="btn-primary">
          Реєстрація
        </NuxtLink>

        <button v-if="isLoggedIn" class="btn-secondary" @click="handleLogout">
          Вийти
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const { user, logout } = useAuth()
const { categories, loadCategories } = useCategories()

const isLoggedIn = computed(() => !!user.value)
const isAdmin = computed(() => user.value?.role === 'admin')

onMounted(async () => {
  await loadCategories()
})

const handleLogout = async () => {
  await logout()
  await navigateTo('/')
}
</script>