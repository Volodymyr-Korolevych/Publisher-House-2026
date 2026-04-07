<template>
  <section>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="page-title">Керування публікаціями</h1>
        <p class="page-subtitle">Список матеріалів, доступних для редагування.</p>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Назва</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Автор</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Категорія</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in publications" :key="item.id" class="border-t border-slate-200">
            <td class="px-4 py-3 text-slate-900">{{ item.title }}</td>
            <td class="px-4 py-3 text-slate-600">{{ item.author }}</td>
            <td class="px-4 py-3 text-slate-600">{{ item.categoryId || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { loadPublications, publications } = usePublications()
await loadPublications()
</script>
