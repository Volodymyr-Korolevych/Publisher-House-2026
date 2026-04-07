<template>
  <div class="card p-4">
    <label class="mb-2 block text-sm font-medium text-slate-700">Фільтр за категорією</label>
    <select :value="modelValue" class="form-input" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option value="">Усі категорії</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types/models'

defineProps<{
  modelValue: string
  categories: Category[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
