<template>
  <article
    class="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div class="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
      <img v-if="publication.coverImage" :src="publication.coverImage" :alt="publication.title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]">
      <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
        Без обкладинки
      </div>
    </div>

    <div class="p-5">
      <p class="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
        {{ publication.author || 'Невідомий автор' }}
      </p>

      <p v-if="categoryName"
        class="mb-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-[#5a1e2c]">
        {{ categoryName }}
      </p>

      <h3 class="mb-2 border-l-4 border-[#5a1e2c] pl-3 text-xl font-semibold leading-snug text-slate-900">
        {{ publication.title }}
      </h3>

      <p class="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
        {{ publication.description }}
      </p>

      <NuxtLink :to="`/publications/${publication.id}`" class="btn-primary">
        Читати
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  publication: {
    id: string
    title: string
    author?: string
    description?: string
    coverImage?: string
    categoryId?: string
  }
}>()

const { categories, loadCategories } = useCategories()

await loadCategories()

const categoryName = computed(() => {
  return categories.value.find((category) => category.id === props.publication.categoryId)?.name || ''
})
</script>