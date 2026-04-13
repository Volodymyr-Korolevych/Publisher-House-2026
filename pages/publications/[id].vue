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

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Кількість завантажень</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ publication.downloadsCount || 0 }}
            </p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Середній рейтинг</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ formatAverageRating(publication.ratingAverage) }}
            </p>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Кількість оцінок</p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ publication.ratingsCount || 0 }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            class="btn-primary"
            :disabled="isDownloading"
            @click="handleDownload"
          >
            {{ isDownloading ? 'Підготовка...' : 'Завантажити книгу' }}
          </button>

          <p v-if="downloadMessage" class="self-center text-sm text-slate-600">
            {{ downloadMessage }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="card p-8 text-center text-slate-500">
    Книгу не знайдено.
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: []
})

const route = useRoute()
const { user, initAuth } = useAuth()
const { currentPublication, loadPublications, loadPublicationById } = usePublications()
const { recordDownload } = useUserBooks()

const isDownloading = ref(false)
const downloadMessage = ref('')

if (process.client) {
  initAuth()
}

await loadPublications()
await loadPublicationById(String(route.params.id))

const publication = computed(() => currentPublication.value)

const formatAverageRating = (value: number) => {
  if (!value) return 'Немає оцінок'
  return value.toFixed(2)
}

const handleDownload = async () => {
  if (!publication.value) return

  if (!user.value) {
    await navigateTo('/register')
    return
  }

  if (!publication.value.bookFileUrl) {
    downloadMessage.value = 'Файл книги ще не завантажено.'
    return
  }

  isDownloading.value = true
  downloadMessage.value = ''

  try {
    await recordDownload(user.value.uid, publication.value.id)
    window.open(publication.value.bookFileUrl, '_blank')

    await loadPublicationById(publication.value.id)
    downloadMessage.value = 'Завантаження книги розпочато.'
  } catch (error) {
    console.error(error)
    downloadMessage.value = 'Не вдалося розпочати завантаження книги.'
  } finally {
    isDownloading.value = false
  }
}
</script>
