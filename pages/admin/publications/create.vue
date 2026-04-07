<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Додавання публікації</h1>
        <p class="mt-2 text-slate-500">Стартова форма створення нового запису.</p>
      </div>

      <div class="card p-6">
        <PublicationForm :categories="categories" @submit="handleSubmit" />
      </div>

      <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Publication } from '~/types/models'

definePageMeta({
  middleware: ['admin']
})

const { categories, fetchCategories } = useCategories()
const { createPublication } = usePublications()
const message = ref('')

await fetchCategories()

const handleSubmit = async (value: Omit<Publication, 'id' | 'createdAt'>) => {
  message.value = ''
  try {
    await createPublication(value)
    await navigateTo('/admin/publications')
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Не вдалося створити публікацію.'
  }
}
</script>
