<template>
  <div v-if="book">
    <h1>{{ book.title }}</h1>
    <p>{{ book.author }}</p>
    <p>{{ book.description }}</p>

    <p>Завантажень: {{ book.downloadsCount }}</p>
    <p>Рейтинг: {{ book.ratingAverage }}</p>

    <button @click="handleDownload" class="btn-primary">
      Завантажити книгу
    </button>
  </div>
</template>

<script setup>
const route = useRoute()
const { publications, loadPublications } = usePublications()
const { user } = useAuth()

await loadPublications()

const book = computed(() =>
  publications.value.find(p => p.id === route.params.id)
)

const handleDownload = () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  window.open(book.value.bookFileUrl, '_blank')
}
</script>
