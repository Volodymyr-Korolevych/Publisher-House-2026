<template>
  <div class="space-y-10">
    <section class="max-w-3xl border-l-4 border-primary pl-6 pt-2">
      <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Літера &mdash; це платформа для перегляду каталогу електронних публікацій, пошуку книг та завантаження обраної
        книги
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink to="/publications" class="btn-primary">Перейти до каталогу</NuxtLink>
        <NuxtLink to="/register" class="btn-secondary">Створити обліковий запис</NuxtLink>
      </div>
    </section>

    <section class="space-y-8">
      <div>
        <h2
          class="relative text-2xl font-bold tracking-tight text-slate-900 after:mt-3 after:block after:h-[2px] after:w-12 after:bg-primary">
          Книги за категоріями
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          Добірки електронних книг, згруповані за тематичними категоріями каталогу.
        </p>
      </div>

      <div v-for="category in categoriesWithPublications" :key="category.id" class="space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-xl font-semibold text-slate-900">
              {{ category.name }}
            </h3>
            <p v-if="category.description" class="mt-1 text-sm text-slate-600">
              {{ category.description }}
            </p>
          </div>

          <NuxtLink :to="`/publications?category=${category.id}`" class="btn-secondary">
            Усі книги категорії
          </NuxtLink>
        </div>

        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PublicationCard v-for="publication in category.publications" :key="publication.id"
            :publication="publication" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { categories, loadCategories } = useCategories()
const { publications, loadPublications } = usePublications()

await loadCategories()
await loadPublications()

const categoriesWithPublications = computed(() => {
  return categories.value
    .map((category) => ({
      ...category,
      publications: publications.value
        .filter((publication) => publication.categoryId === category.id)
        .slice(0, 3)
    }))
    .filter((category) => category.publications.length > 0)
})
</script>
