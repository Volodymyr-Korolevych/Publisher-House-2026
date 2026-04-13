<template>
  <section class="space-y-6">
    <div class="card p-6">
      <h1 class="page-title">Профіль користувача</h1>
      <p class="page-subtitle">Персональні дані та перелік завантажених книг.</p>

      <div v-if="user" class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-sm text-slate-500">Ім’я</p>
          <p class="mt-1 font-medium text-slate-900">{{ user.name || 'Не вказано' }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-sm text-slate-500">Email</p>
          <p class="mt-1 font-medium text-slate-900">{{ user.email }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-sm text-slate-500">Роль</p>
          <p class="mt-1 font-medium text-slate-900">{{ user.role === 'admin' ? 'Адміністратор' : 'Користувач' }}</p>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-slate-900">Завантажені книги</h2>
        <p class="mt-2 text-sm text-slate-600">
          Тут відображаються книги, які ви вже завантажили, та можливість виставити рейтинг.
        </p>
      </div>

      <div v-if="profileBooks.length" class="space-y-4">
        <div
          v-for="item in profileBooks"
          :key="item.record.id"
          class="rounded-2xl border border-slate-200 p-4"
        >
          <div class="grid gap-4 md:grid-cols-[90px_minmax(0,1fr)_220px] md:items-start">
            <div class="h-28 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
              <img
                v-if="item.publication?.coverImage"
                :src="item.publication.coverImage"
                :alt="item.publication.title"
                class="h-full w-full object-cover"
              >
              <div v-else class="flex h-full items-center justify-center text-xs text-slate-400">
                Без обкладинки
              </div>
            </div>

            <div class="min-w-0">
              <h3 class="text-lg font-semibold text-slate-900">
                {{ item.publication?.title || 'Книгу не знайдено' }}
              </h3>

              <p class="mt-1 text-sm text-slate-600">
                {{ item.publication?.author || 'Автор не вказаний' }}
              </p>

              <p class="mt-3 text-sm text-slate-500">
                Дата завантаження:
                <span class="font-medium text-slate-700">
                  {{ formatDate(item.record.downloadedAt) }}
                </span>
              </p>
            </div>

            <div>
              <label class="label" :for="`rating-${item.record.id}`">Мій рейтинг</label>

              <select
                :id="`rating-${item.record.id}`"
                class="input"
                :value="item.record.rating ?? ''"
                @change="handleRatingChange(item.record.publicationId, $event)"
              >
                <option value="">Оберіть оцінку</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <p class="mt-2 text-xs text-slate-500">
                Оцінювати можна лише книги, які ви вже завантажили.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
        Ви ще не завантажували жодної книги.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, initAuth } = useAuth()
const { publications, loadPublications } = usePublications()
const { userBooks, loadUserBooks, setRating } = useUserBooks()

if (process.client) {
  initAuth()
}

await loadPublications()

if (user.value?.uid) {
  await loadUserBooks(user.value.uid)
}

watch(
  () => user.value?.uid,
  async (uid) => {
    if (uid) {
      await loadUserBooks(uid)
    }
  },
  { immediate: false }
)

const profileBooks = computed(() => {
  return userBooks.value.map((record) => ({
    record,
    publication: publications.value.find((item) => item.id === record.publicationId) || null
  }))
})

const formatDate = (value: any) => {
  if (!value) return '—'

  try {
    if (typeof value?.toDate === 'function') {
      return new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(value.toDate())
    }

    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return '—'
  }
}

const handleRatingChange = async (publicationId: string, event: Event) => {
  if (!user.value?.uid) return

  const target = event.target as HTMLSelectElement
  const value = Number(target.value)

  if (!value || value < 1 || value > 5) return

  try {
    await setRating(user.value.uid, publicationId, value)
    await loadPublications()
  } catch (error) {
    console.error(error)
    alert('Не вдалося зберегти рейтинг.')
  }
}
</script>
