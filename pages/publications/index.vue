<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-semibold">Каталог публікацій</h1>
      <p class="mt-2 text-slate-500">Стартова сторінка каталогу з пошуком і фільтрацією за категоріями.</p>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div class="card p-4">
        <label class="mb-2 block text-sm font-medium">Пошук за назвою або автором</label>
        <input v-model="search" class="form-input" placeholder="Наприклад, JavaScript або Олена Коваль" />
      </div>

      <CategoryFilter v-model="selectedCategory" :categories="categories" />
    </div>

    <div v-if="filteredPublications.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <PublicationCard v-for="publication in filteredPublications" :key="publication.id" :publication="publication" />
    </div>

    <div v-else class="card p-10 text-center text-slate-500">
      За поточними параметрами публікацій не знайдено.
    </div>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const selectedCategory = ref('')

const { publications, fetchPublications } = usePublications()
const { categories, fetchCategories } = useCategories()

await Promise.all([fetchPublications(), fetchCategories()])

const filteredPublications = computed(() => {
  return publications.value.filter((item) => {
    const matchesSearch = `${item.title} ${item.author}`.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || item.categoryId === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
</script>
