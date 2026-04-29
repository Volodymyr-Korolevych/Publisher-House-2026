<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="label" for="title">Назва книги</label>
        <input id="title" v-model="form.title" type="text" class="input" required>
      </div>

      <div>
        <label class="label" for="author">Автор</label>
        <input id="author" v-model="form.author" type="text" class="input" required>
      </div>
    </div>

    <div>
      <label class="label" for="description">Короткий опис</label>
      <textarea id="description" v-model="form.description" class="input min-h-[110px]" required />
    </div>

    <div>
      <label class="label" for="categoryId">Категорія</label>
      <select id="categoryId" v-model="form.categoryId" class="input" required>
        <option value="" disabled>Оберіть категорію</option>
        <option v-for="item in categories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>

    <div class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p class="label mb-2">Обкладинка книги</p>

      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <label class="btn-secondary cursor-pointer">
          Оберіть зображення
          <input class="hidden" type="file" accept="image/png,image/jpeg,image/webp,image/jpg"
            @change="handleCoverChange">
        </label>

        <span class="text-sm text-slate-600">
          {{ selectedCoverName || 'Файл не вибрано' }}
        </span>
      </div>

      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn-primary" :disabled="!selectedCoverFile || isUploadingCover"
          @click="handleCoverUpload">
          {{ isUploadingCover ? 'Завантаження...' : 'Завантажити обкладинку' }}
        </button>
      </div>

      <p v-if="coverUploadMessage" class="text-sm text-slate-600">
        {{ coverUploadMessage }}
      </p>

      <p v-if="coverUploadError" class="text-sm text-red-600">
        {{ coverUploadError }}
      </p>

      <div v-if="form.coverImage"
        class="w-full max-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div class="aspect-[2/3]">
          <img :src="form.coverImage" alt="Попередній перегляд обкладинки" class="h-full w-full object-cover">
        </div>
      </div>
    </div>

    <div class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p class="label mb-2">PDF-файл книги</p>

      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <label class="btn-secondary cursor-pointer">
          Оберіть PDF-файл
          <input class="hidden" type="file" accept="application/pdf" @change="handleBookChange">
        </label>

        <span class="text-sm text-slate-600">
          {{ selectedBookName || form.bookFileName || 'Файл не вибрано' }}
        </span>
      </div>

      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn-primary" :disabled="!selectedBookFile || isUploadingBook"
          @click="handleBookUpload">
          {{ isUploadingBook ? 'Завантаження...' : 'Завантажити PDF' }}
        </button>
      </div>

      <p v-if="bookUploadMessage" class="text-sm text-slate-600">
        {{ bookUploadMessage }}
      </p>

      <p v-if="bookUploadError" class="text-sm text-red-600">
        {{ bookUploadError }}
      </p>

      <p v-if="form.bookFileName" class="text-sm text-slate-700">
        Поточний файл: <span class="font-medium">{{ form.bookFileName }}</span>
      </p>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <div class="flex flex-wrap gap-3">
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? submitLoadingText : submitText }}
      </button>

      <button type="button" class="btn-secondary" @click="$emit('cancel')">
        Скасувати
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CategoryItem } from '~/composables/useCategories'
import type { PublicationItem } from '~/composables/usePublications'

const props = withDefaults(defineProps<{
  categories: CategoryItem[]
  initialData?: Partial<PublicationItem> | null
  submitText?: string
  submitLoadingText?: string
}>(), {
  initialData: null,
  submitText: 'Зберегти',
  submitLoadingText: 'Збереження...'
})

const emit = defineEmits<{
  submit: [payload: Omit<PublicationItem, 'id'>]
  cancel: []
}>()

const { uploadCover, uploadBook } = useStorageUpload()

const form = reactive<Omit<PublicationItem, 'id'>>({
  title: props.initialData?.title || '',
  author: props.initialData?.author || '',
  description: props.initialData?.description || '',
  categoryId: props.initialData?.categoryId || '',
  coverImage: props.initialData?.coverImage || '',
  bookFileUrl: props.initialData?.bookFileUrl || '',
  bookFileName: props.initialData?.bookFileName || '',
  downloadsCount: Number(props.initialData?.downloadsCount || 0),
  ratingAverage: Number(props.initialData?.ratingAverage || 0),
  ratingsCount: Number(props.initialData?.ratingsCount || 0),
  createdAt: props.initialData?.createdAt || null
})

const loading = ref(false)
const errorMessage = ref('')

const selectedCoverFile = ref<File | null>(null)
const selectedCoverName = ref('')
const isUploadingCover = ref(false)
const coverUploadMessage = ref('')
const coverUploadError = ref('')

const selectedBookFile = ref<File | null>(null)
const selectedBookName = ref('')
const isUploadingBook = ref(false)
const bookUploadMessage = ref('')
const bookUploadError = ref('')

watch(
  () => props.initialData,
  (value) => {
    form.title = value?.title || ''
    form.author = value?.author || ''
    form.description = value?.description || ''
    form.categoryId = value?.categoryId || ''
    form.coverImage = value?.coverImage || ''
    form.bookFileUrl = value?.bookFileUrl || ''
    form.bookFileName = value?.bookFileName || ''
    form.downloadsCount = Number(value?.downloadsCount || 0)
    form.ratingAverage = Number(value?.ratingAverage || 0)
    form.ratingsCount = Number(value?.ratingsCount || 0)
    form.createdAt = value?.createdAt || null
  },
  { deep: true }
)

const handleCoverChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  coverUploadError.value = ''
  coverUploadMessage.value = ''

  if (!file) return

  selectedCoverFile.value = file
  selectedCoverName.value = file.name
}

const handleCoverUpload = async () => {
  coverUploadError.value = ''
  coverUploadMessage.value = ''

  if (!selectedCoverFile.value) {
    coverUploadError.value = 'Спочатку оберіть зображення.'
    return
  }

  isUploadingCover.value = true
  coverUploadMessage.value = 'Зображення завантажується...'

  try {
    form.coverImage = await uploadCover(selectedCoverFile.value)
    coverUploadMessage.value = 'Обкладинку успішно завантажено.'
  } catch (error: any) {
    coverUploadError.value = error?.message || 'Не вдалося завантажити обкладинку.'
  } finally {
    isUploadingCover.value = false
  }
}

const handleBookChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  bookUploadError.value = ''
  bookUploadMessage.value = ''

  if (!file) return

  if (file.type !== 'application/pdf') {
    bookUploadError.value = 'Будь ласка, оберіть файл PDF.'
    return
  }

  selectedBookFile.value = file
  selectedBookName.value = file.name
}

const handleBookUpload = async () => {
  bookUploadError.value = ''
  bookUploadMessage.value = ''

  if (!selectedBookFile.value) {
    bookUploadError.value = 'Спочатку оберіть PDF-файл.'
    return
  }

  isUploadingBook.value = true
  bookUploadMessage.value = 'PDF-файл завантажується...'

  try {
    form.bookFileUrl = await uploadBook(selectedBookFile.value)
    form.bookFileName = selectedBookFile.value.name
    bookUploadMessage.value = 'PDF-файл успішно завантажено.'
  } catch (error: any) {
    bookUploadError.value = error?.message || 'Не вдалося завантажити PDF-файл.'
  } finally {
    isUploadingBook.value = false
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = 'Вкажіть назву книги.'
    return
  }

  if (!form.author.trim()) {
    errorMessage.value = 'Вкажіть автора.'
    return
  }

  if (!form.description.trim()) {
    errorMessage.value = 'Вкажіть короткий опис.'
    return
  }

  if (!form.categoryId) {
    errorMessage.value = 'Оберіть категорію.'
    return
  }

  if (!form.coverImage.trim()) {
    errorMessage.value = 'Завантажте обкладинку книги.'
    return
  }

  if (!form.bookFileUrl.trim() || !form.bookFileName.trim()) {
    errorMessage.value = 'Завантажте PDF-файл книги.'
    return
  }

  loading.value = true

  try {
    emit('submit', {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      coverImage: form.coverImage.trim(),
      bookFileUrl: form.bookFileUrl.trim(),
      bookFileName: form.bookFileName.trim(),
      downloadsCount: form.downloadsCount || 0,
      ratingAverage: form.ratingAverage || 0,
      ratingsCount: form.ratingsCount || 0,
      createdAt: form.createdAt || null
    })
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 300)
  }
}
</script>