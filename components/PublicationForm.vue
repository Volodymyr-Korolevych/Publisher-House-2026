<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label class="mb-2 block text-sm font-medium">Назва</label>
        <input v-model="form.title" class="form-input" required />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium">Автор</label>
        <input v-model="form.author" class="form-input" required />
      </div>
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium">Короткий опис</label>
      <textarea v-model="form.description" class="form-input min-h-28" required />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium">Повний текст</label>
      <textarea v-model="form.content" class="form-input min-h-48" required />
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label class="mb-2 block text-sm font-medium">Категорія</label>
        <select v-model="form.categoryId" class="form-input" required>
          <option disabled value="">Оберіть категорію</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium">URL обкладинки</label>
        <input v-model="form.coverImage" class="form-input" required />
      </div>
    </div>

    <div class="flex gap-3">
      <button class="btn-primary" type="submit">{{ submitLabel }}</button>
      <slot />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Category, Publication } from '~/types/models'

const props = withDefaults(
  defineProps<{
    initialValue?: Omit<Publication, 'id' | 'createdAt'>
    categories: Category[]
    submitLabel?: string
  }>(),
  {
    initialValue: () => ({
      title: '',
      author: '',
      description: '',
      content: '',
      categoryId: '',
      coverImage: ''
    }),
    submitLabel: 'Зберегти'
  }
)

const emit = defineEmits<{
  (e: 'submit', value: Omit<Publication, 'id' | 'createdAt'>): void
}>()

const form = reactive({ ...props.initialValue })

const submit = () => {
  emit('submit', { ...form })
}
</script>
