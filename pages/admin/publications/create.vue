<template>
  <section>
    <div class="mb-6">
      <h1 class="page-title">Додавання книги</h1>
      <p class="page-subtitle">Створення нового запису в каталозі інтернет-видавництва.</p>
    </div>

    <div class="card p-6">
      <PublicationForm
        :categories="categories"
        submit-text="Створити книгу"
        submit-loading-text="Створення..."
        @submit="handleCreate"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PublicationItem } from '~/composables/usePublications'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { categories, loadCategories } = useCategories()
const { createPublication } = usePublications()

await loadCategories()

const handleCreate = async (payload: Omit<PublicationItem, 'id'>) => {
  try {
    await createPublication(payload)
    await navigateTo('/admin/publications')
  } catch (error) {
    console.error(error)
    alert('Не вдалося створити книгу.')
  }
}

const handleCancel = async () => {
  await navigateTo('/admin/publications')
}
</script>
