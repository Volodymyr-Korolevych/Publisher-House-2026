<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-semibold">Керування публікаціями</h1>
          <p class="mt-2 text-slate-500">Базовий список для CRUD-операцій.</p>
        </div>
        <NuxtLink to="/admin/publications/create" class="btn-primary">Додати публікацію</NuxtLink>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-slate-600">Назва</th>
              <th class="px-4 py-3 text-left font-medium text-slate-600">Автор</th>
              <th class="px-4 py-3 text-left font-medium text-slate-600">Дата</th>
              <th class="px-4 py-3 text-right font-medium text-slate-600">Дії</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in publications" :key="item.id">
              <td class="px-4 py-4">{{ item.title }}</td>
              <td class="px-4 py-4">{{ item.author }}</td>
              <td class="px-4 py-4">{{ item.createdAt }}</td>
              <td class="px-4 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink :to="`/admin/publications/${item.id}/edit`" class="btn-secondary">Редагувати</NuxtLink>
                  <button class="btn-danger" @click="handleDelete(item.id)">Видалити</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

const { publications, fetchPublications, removePublication } = usePublications()
const message = ref('')

await fetchPublications()

const handleDelete = async (id: string) => {
  message.value = ''
  try {
    await removePublication(id)
    message.value = 'Публікацію видалено.'
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Не вдалося видалити публікацію.'
  }
}
</script>
