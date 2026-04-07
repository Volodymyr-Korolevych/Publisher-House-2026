<template>
  <div class="space-y-10">
    <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div class="space-y-5">
        <span class="inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-800">
          Дипломний стартовий проєкт
        </span>
        <h1 class="text-4xl font-bold leading-tight sm:text-5xl">
          Web-сайт для інтернет-видавництва на Nuxt, Tailwind і Firebase
        </h1>
        <p class="max-w-2xl text-lg text-slate-600">
          Проєкт уже має стартову структуру сторінок, Tailwind-оформлення, підготовлені composables для Firebase та основу для подальших TASK-оновлень через GitHub Actions.
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/publications" class="btn-primary">Відкрити каталог</NuxtLink>
          <NuxtLink to="/admin" class="btn-secondary">Перейти в адмінку</NuxtLink>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-semibold">Що вже готово</h2>
        <ul class="mt-4 space-y-3 text-sm text-slate-600">
          <li>• Nuxt 3 з базовою структурою папок</li>
          <li>• Tailwind CSS без окремого postcss.config</li>
          <li>• Firebase-конфігурація через `.env`</li>
          <li>• Сторінки каталогу, профілю та адмінки</li>
          <li>• Composables для auth, categories, publications</li>
          <li>• Перший GitHub Actions workflow: TASK001</li>
        </ul>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-2xl font-semibold">Демонстраційні публікації</h2>
        <NuxtLink to="/publications" class="text-sm font-medium text-brand-700">Увесь каталог →</NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <PublicationCard v-for="publication in previewPublications" :key="publication.id" :publication="publication" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { publications, fetchPublications } = usePublications()

await fetchPublications()

const previewPublications = computed(() => publications.value.slice(0, 2))
</script>
