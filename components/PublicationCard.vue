<template>
  <article class="card overflow-hidden">
    <img :src="publication.coverImage" :alt="publication.title" class="h-56 w-full object-cover" />
    <div class="space-y-4 p-5">
      <div>
        <p class="text-sm text-brand-700">{{ publication.author }}</p>
        <h3 class="mt-1 text-xl font-semibold">{{ publication.title }}</h3>
      </div>
      <p class="line-clamp-3 text-sm text-slate-600">{{ publication.description }}</p>
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs uppercase tracking-wide text-slate-400">{{ publication.createdAt }}</span>
        <NuxtLink :to="`/publications/${publication.id}`" class="btn-primary">Читати</NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Publication } from '~/types/models'

defineProps<{
  publication: Publication
}>()
</script>
