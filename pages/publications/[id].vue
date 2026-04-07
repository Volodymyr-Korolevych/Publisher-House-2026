<template>
  <section v-if="publication" class="space-y-6">
    <div class="card overflow-hidden">
      <div class="aspect-[21/8] bg-slate-200">
        <img
          v-if="publication.coverImage"
          :src="publication.coverImage"
          :alt="publication.title"
          class="h-full w-full object-cover"
        >
        <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
          Без обкладинки
        </div>
      </div>

      <div class="p-6">
        <p class="mb-2 text-sm uppercase tracking-wide text-slate-500">
          {{ publication.author }}
        </p>
        <h1 class="page-title">{{ publication.title }}</h1>
        <p class="mt-3 text-base leading-7 text-slate-600">
          {{ publication.description }}
        </p>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="mb-4 text-xl font-semibold text-slate-900">Текст публікації</h2>
      <div class="whitespace-pre-line leading-8 text-slate-700">
        {{ publication.content }}
      </div>
    </div>
  </section>

  <section v-else class="card p-8 text-center text-slate-500">
    Публікацію не знайдено.
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const { currentPublication, loadPublicationById, loadPublications } = usePublications()

await loadPublications()
await loadPublicationById(String(route.params.id))

const publication = computed(() => currentPublication.value)
</script>
