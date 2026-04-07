<template>
  <section>
    <div class="mb-8">
      <h1 class="page-title">Каталог публікацій</h1>
      <p class="page-subtitle">
        Перегляд доступних книг, статей та електронних матеріалів.
      </p>
    </div>

    <div class="card mb-6 p-4">
      <label class="label" for="search">Пошук</label>
      <input
        id="search"
        v-model="search"
        type="text"
        class="input"
        placeholder="Введіть назву або автора"
      >
    </div>

    <div v-if="filteredPublications.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <PublicationCard
        v-for="publication in filteredPublications"
        :key="publication.id"
        :publication="publication"
      />
    </div>

    <div v-else class="card p-8 text-center text-slate-500">
      Публікації не знайдено.
    </div>
  </section>
</template>

<script setup lang="ts">
const { publications, loadPublications } = usePublications()
const search = ref('')

await loadPublications()

const filteredPublications = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return publications.value

  return publications.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.author.toLowerCase().includes(query)
  )
})
</script>
