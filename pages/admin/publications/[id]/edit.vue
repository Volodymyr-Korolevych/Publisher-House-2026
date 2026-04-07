<template>
  <NuxtLayout name="admin">
    <div v-if="initialValue" class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Редагування публікації</h1>
        <p class="mt-2 text-slate-500">Базова форма оновлення запису.</p>
      </div>

      <div class="card p-6">
        <PublicationForm :initial-value="initialValue" :categories="categories" submit-label="Оновити" @submit="handleSubmit" />
      </div>

      <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
    </div>

    <div v-else class="card p-10 text-center text-slate-500">
      Публікацію не знайдено.
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Publication } from '~/types/models'

definePageMeta({
  middleware: ['admin']
})

const route = useRoute()
const { categories, fetchCategories } = useCategories()
const { getPublicationById, updatePublication } = usePublications()
const message = ref('')

await fetchCategories()
const currentPublication = await getPublicationById(route.params.id as string)

const initialValue = computed(() => {
  if (!currentPublication) {
    return null
  }

  const { id: _id, createdAt: _createdAt, ...rest } = currentPublication
  return rest
})

const handleSubmit = async (value: Omit<Publication, 'id' | 'createdAt'>) => {
  message.value = ''
  try {
    await updatePublication(route.params.id as string, value)
    await navigateTo('/admin/publications')
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Не вдалося оновити публікацію.'
  }
}
</script>
