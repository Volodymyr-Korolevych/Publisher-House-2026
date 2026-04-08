<template>
  <section>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="page-title">Керування публікаціями</h1>
        <p class="page-subtitle">Створення, редагування та видалення електронних публікацій.</p>
      </div>

      <NuxtLink to="/admin/publications/create" class="btn-primary">
        Додати публікацію
      </NuxtLink>
    </div>

    <div class="mt-6 card p-4">
      <label class="label" for="search">Пошук у списку</label>
      <input
        id="search"
        v-model="search"
        type="text"
        class="input"
        placeholder="Введіть назву або автора"
      >
    </div>

    <div v-if="filteredPublications.length" class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Обкладинка</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Назва</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Автор</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Категорія</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredPublications"
            :key="item.id"
            class="border-t border-slate-200 align-top"
          >
            <td class="px-4 py-3">
              <div class="h-16 w-12 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                <img
                  v-if="item.coverImage"
                  :src="item.coverImage"
                  :alt="item.title"
                  class="h-full w-full object-cover"
                >
                <div v-else class="flex h-full items-center justify-center text-[10px] text-slate-400">
                  Немає
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-900">{{ item.title }}</td>
            <td class="px-4 py-3 text-slate-600">{{ item.author }}</td>
            <td class="px-4 py-3 text-slate-600">{{ getCategoryName(item.categoryId) }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-2">
                <NuxtLink :to="`/admin/publications/${item.id}/edit`" class="btn-secondary">
                  Редагувати
                </NuxtLink>

                <button class="btn-secondary text-red-600" @click="handleDelete(item.id)">
                  Видалити
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="mt-6 card p-8 text-center text-slate-500">
      Публікації не знайдено.
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { loadPublications, publications, removePublication } = usePublications()
const { categories, loadCategories } = useCategories()

const search = ref('')

await loadCategories()
await loadPublications()

const getCategoryName = (categoryId: string) => {
  return categories.value.find(item => item.id === categoryId)?.name || '—'
}

const filteredPublications = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return publications.value

  return publications.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.author.toLowerCase().includes(query)
  )
})

const handleDelete = async (id: string) => {
  if (!confirm('Видалити цю публікацію?')) return

  try {
    await removePublication(id)
  } catch (error) {
    console.error(error)
    alert('Не вдалося видалити публікацію.')
  }
}
</script>
