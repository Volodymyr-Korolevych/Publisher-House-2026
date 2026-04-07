<template>
  <section class="space-y-6">
    <div>
      <h1 class="page-title">Керування категоріями</h1>
      <p class="page-subtitle">Створення, редагування та видалення тематичних категорій.</p>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-slate-900">
        {{ editingId ? 'Редагування категорії' : 'Додавання категорії' }}
      </h2>

      <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="label" for="name">Назва категорії</label>
          <input id="name" v-model="form.name" type="text" class="input" required>
        </div>

        <div>
          <label class="label" for="description">Опис категорії</label>
          <textarea
            id="description"
            v-model="form.description"
            class="input min-h-[110px]"
            required
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <button type="submit" class="btn-primary">
            {{ editingId ? 'Зберегти зміни' : 'Додати категорію' }}
          </button>

          <button
            v-if="editingId"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            Скасувати редагування
          </button>
        </div>
      </form>
    </div>

    <div v-if="categories.length" class="grid gap-4">
      <div
        v-for="item in categories"
        :key="item.id"
        class="card p-5"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ item.name }}</h2>
            <p class="mt-2 text-sm text-slate-600">{{ item.description }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn-secondary" @click="startEdit(item.id)">
              Редагувати
            </button>

            <button class="btn-secondary text-red-600" @click="handleDelete(item.id)">
              Видалити
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card p-8 text-center text-slate-500">
      Категорії ще не створено.
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { categories, loadCategories, createCategory, updateCategory, removeCategory } = useCategories()

const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  description: ''
})

await loadCategories()

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.description = ''
}

const startEdit = (id: string) => {
  const category = categories.value.find(item => item.id === id)
  if (!category) return

  editingId.value = id
  form.name = category.name
  form.description = category.description
}

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await updateCategory(editingId.value, {
        name: form.name.trim(),
        description: form.description.trim()
      })
    } else {
      await createCategory({
        name: form.name.trim(),
        description: form.description.trim()
      })
    }

    resetForm()
  } catch (error) {
    console.error(error)
    alert('Не вдалося зберегти категорію.')
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Видалити цю категорію?')) return

  try {
    await removeCategory(id)

    if (editingId.value === id) {
      resetForm()
    }
  } catch (error) {
    console.error(error)
    alert('Не вдалося видалити категорію.')
  }
}
</script>
