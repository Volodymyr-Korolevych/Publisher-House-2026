<template>
  <section>
    <h1 class="page-title">Керування категоріями</h1>
    <p class="page-subtitle">Перегляд наявних тематичних категорій.</p>

    <div class="mt-6 grid gap-4">
      <div v-for="item in categories" :key="item.id" class="card p-5">
        <h2 class="text-lg font-semibold text-slate-900">{{ item.name }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { categories, loadCategories } = useCategories()
await loadCategories()
</script>
