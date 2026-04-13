<template>
  <section>
    <div class="mb-6">
      <h1 class="page-title">Редагування книги</h1>
      <p class="page-subtitle">Оновлення даних електронної книги.</p>
    </div>

    <div v-if="publication" class="card p-6">
      <PublicationForm
        :categories="categories"
        :initial-data="publication"
        submit-text="Зберегти зміни"
        submit-loading-text="Збереження..."
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>

    <div v-else class="card p-8 text-center text-slate-500">
      Книгу не знайдено.
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PublicationItem } from '~/composables/usePublications'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const { categories, loadCategories } = useCategories()
const { currentPublication, loadPublications, loadPublicationById, updatePublication } = usePublications()

await loadCategories()
await loadPublications()
await loadPublicationById(String(route.params.id))

const publication = computed(() => currentPublication.value)

const handleUpdate = async (payload: Omit<PublicationItem, 'id'>) => {
  try {
    await updatePublication(String(route.params.id), payload)
    await navigateTo('/admin/publications')
  } catch (error) {
    console.error(error)
    alert('Не вдалося оновити книгу.')
  }
}

const handleCancel = async () => {
  await navigateTo('/admin/publications')
}
</script>
