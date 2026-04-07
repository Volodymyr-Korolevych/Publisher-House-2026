<template>
  <div>
    <h1 class="page-title">Адміністративна панель</h1>
    <p class="page-subtitle">Керування основними сутностями WEB-застосунку.</p>

    <div class="mt-6 grid gap-6 md:grid-cols-3">
      <div class="card p-5">
        <p class="text-sm text-slate-500">Публікації</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ publications.length }}</p>
      </div>

      <div class="card p-5">
        <p class="text-sm text-slate-500">Категорії</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ categories.length }}</p>
      </div>

      <div class="card p-5">
        <p class="text-sm text-slate-500">Роль</p>
        <p class="mt-2 text-3xl font-bold uppercase text-slate-900">{{ user?.role || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { user, initAuth } = useAuth()
const { publications, loadPublications } = usePublications()
const { categories, loadCategories } = useCategories()

if (process.client) {
  initAuth()
}

await loadPublications()
await loadCategories()
</script>
