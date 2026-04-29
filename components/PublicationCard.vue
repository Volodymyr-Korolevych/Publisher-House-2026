<template>
  <article class="card overflow-hidden">
    <div class="bg-slate-200 p-4">
      <div class="mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-xl bg-slate-100">
        <img v-if="publication.coverImage" :src="publication.coverImage" :alt="publication.title"
          class="h-full w-full object-cover">
        <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
          Без обкладинки
        </div>
      </div>
    </div>

    <div class="p-5">
      <p class="mb-2 text-xs uppercase tracking-wide text-slate-500">
        {{ publication.author || 'Невідомий автор' }}
      </p>

      <h3 class="mb-2 text-xl font-semibold text-slate-900">
        {{ publication.title }}
      </h3>

      <p class="mb-4 line-clamp-3 text-sm text-slate-600">
        {{ publication.description }}
      </p>

      <NuxtLink :to="`/publications/${publication.id}`" class="btn-primary">
        Читати
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  publication: {
    id: string
    title: string
    author?: string
    description?: string
    coverImage?: string
  }
}>()
</script>