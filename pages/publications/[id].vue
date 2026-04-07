<template>
  <div v-if="publication" class="space-y-8">
    <div class="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
      <img :src="publication.coverImage" :alt="publication.title" class="card h-auto w-full object-cover" />
      <div class="space-y-4">
        <p class="text-sm font-medium text-brand-700">{{ publication.author }}</p>
        <h1 class="text-4xl font-bold">{{ publication.title }}</h1>
        <p class="text-lg text-slate-600">{{ publication.description }}</p>
        <div class="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>Дата: {{ publication.createdAt }}</span>
          <span>Категорія: {{ categoryName }}</span>
        </div>
      </div>
    </div>

    <article class="card p-6 leading-8 text-slate-700">
      {{ publication.content }}
    </article>
  </div>

  <div v-else class="card p-10 text-center text-slate-500">
    Публікацію не знайдено.
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getPublicationById } = usePublications()
const { categories, fetchCategories } = useCategories()

await fetchCategories()
const publication = await getPublicationById(route.params.id as string)

const categoryName = computed(() => {
  return categories.value.find((item) => item.id === publication?.categoryId)?.name || 'Без категорії'
})
</script>
