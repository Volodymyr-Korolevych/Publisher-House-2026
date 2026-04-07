<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Керування категоріями</h1>
        <p class="mt-2 text-slate-500">Стартова CRUD-сторінка для категорій публікацій.</p>
      </div>

      <div class="card p-6">
        <form class="grid gap-4 md:grid-cols-[1fr_1fr_auto]" @submit.prevent="handleCreate">
          <input v-model="name" class="form-input" placeholder="Назва категорії" required />
          <input v-model="description" class="form-input" placeholder="Опис категорії" required />
          <button class="btn-primary" type="submit">Додати</button>
        </form>
      </div>

      <div class="space-y-3">
        <div v-for="item in categories" :key="item.id" class="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="font-semibold">{{ item.name }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ item.description }}</p>
          </div>
          <button class="btn-danger" @click="handleDelete(item.id)">Видалити</button>
        </div>
      </div>

      <p v-if="message" class="text-sm text-slate-500">{{ message }}</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})

const { categories, fetchCategories, createCategory, removeCategory } = useCategories()
const name = ref('')
const description = ref('')
const message = ref('')

await fetchCategories()

const handleCreate = async () => {
  message.value = ''
  try {
    await createCategory({ name: name.value, description: description.value })
    name.value = ''
    description.value = ''
    message.value = 'Категорію додано.'
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Не вдалося створити категорію.'
  }
}

const handleDelete = async (id: string) => {
  message.value = ''
  try {
    await removeCategory(id)
    message.value = 'Категорію видалено.'
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Не вдалося видалити категорію.'
  }
}
</script>
