<template>
  <div class="space-y-10">
    <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div>

        <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Літера &mdash; це платформа для перегляду каталогу електронних публікацій, пошуку книг та завантаження обраної
          книги
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/publications" class="btn-primary">Перейти до каталогу</NuxtLink>
          <NuxtLink to="/register" class="btn-secondary">Створити обліковий запис</NuxtLink>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="mb-4 text-xl font-semibold text-slate-900">Основні можливості</h2>
        <ul class="space-y-3 text-sm text-slate-600">
          <li>• каталог публікацій</li>
          <li>• пошук і перегляд матеріалів</li>
          <li>• реєстрація та авторизація</li>
          <li>• ролі користувачів</li>
          <li>• адміністративна частина</li>
          <li>• CRUD для публікацій і категорій</li>
        </ul>
      </div>
    </section>

    <section class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">
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