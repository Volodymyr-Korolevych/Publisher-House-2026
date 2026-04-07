<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Огляд адміністративної частини</h1>
        <p class="mt-2 text-slate-500">Стартовий дашборд адміністратора. Тут уже є навігація на керування публікаціями, категоріями та користувачами.</p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="card p-5">
          <p class="text-sm text-slate-500">Публікації</p>
          <p class="mt-2 text-3xl font-semibold">{{ publications.length }}</p>
        </div>
        <div class="card p-5">
          <p class="text-sm text-slate-500">Категорії</p>
          <p class="mt-2 text-3xl font-semibold">{{ categories.length }}</p>
        </div>
        <div class="card p-5">
          <p class="text-sm text-slate-500">Статус Firebase</p>
          <p class="mt-2 text-lg font-semibold">{{ isConfigured ? 'Налаштований' : 'Потрібен .env' }}</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

const { publications, fetchPublications } = usePublications()
const { categories, fetchCategories } = useCategories()
const { isConfigured } = useFirebase()

await Promise.all([fetchPublications(), fetchCategories()])
</script>
