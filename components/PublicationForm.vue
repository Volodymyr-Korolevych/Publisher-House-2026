<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label class="label" for="title">Назва публікації</label>
        <input id="title" v-model="form.title" type="text" class="input" required>
      </div>

      <div>
        <label class="label" for="author">Автор</label>
        <input id="author" v-model="form.author" type="text" class="input" required>
      </div>
    </div>

    <div>
      <label class="label" for="description">Короткий опис</label>
      <textarea
        id="description"
        v-model="form.description"
        class="input min-h-[110px]"
        required
      />
    </div>

    <div>
      <label class="label" for="content">Текст публікації</label>
      <textarea
        id="content"
        v-model="form.content"
        class="input min-h-[260px]"
        required
      />
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
      <div>
        <p class="label mb-2">Обкладинка книги</p>

        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <label class="btn-secondary cursor-pointer">
            Оберіть зображення
            <input
              class="hidden"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              @change="handleFileChange"
            >
          </label>

          <span class="text-sm text-slate-600">
            {{ selectedFileName || 'Файл не вибрано' }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="btn-primary"
          :disabled="!selectedFile || isUploading"
          @click="handleUpload"
        >
          {{ isUploading ? 'Завантаження...' : 'Завантажити обкладинку' }}
        </button>

        <button
          v-if="previewImage"
          type="button"
          class="btn-secondary"
          @click="removeSelectedImage"
        >
          Видалити вибране зображення
        </button>
      </div>

      <p v-if="uploadMessage" class="text-sm text-slate-600">
        {{ uploadMessage }}
      </p>

      <p v-if="uploadError" class="text-sm text-red-600">
        {{ uploadError }}
      </p>

      <div v-if="previewImage" class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          :src="previewImage"
          alt="Попередній перегляд обкладинки"
          class="h-56 w-full object-cover"
        >
      </div>
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

const { uploadPublicationCover } = useStorageUpload()

const form = reactive<Omit<PublicationItem, 'id'>>({
  title: props.initialData?.title || '',
  author: props.initialData?.author || '',
  description: props.initialData?.description || '',
  content: props.initialData?.content || '',
  categoryId: props.initialData?.categoryId || '',
  coverImage: props.initialData?.coverImage || '',
  createdAt: props.initialData?.createdAt || null
})

const loading = ref(false)
const errorMessage = ref('')
const uploadError = ref('')
const uploadMessage = ref('')
const isUploading = ref(false)
const selectedFile = ref<File | null>(null)
const selectedFileName = ref('')
const localPreviewUrl = ref('')

const previewImage = computed(() => {
  return localPreviewUrl.value || form.coverImage || ''
})

watch(
  () => props.initialData,
  (value) => {
    form.title = value?.title || ''
    form.author = value?.author || ''
    form.description = value?.description || ''
    form.content = value?.content || ''
    form.categoryId = value?.categoryId || ''
    form.coverImage = value?.coverImage || ''
    form.createdAt = value?.createdAt || null
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
  }
})

const handleFileChange = (event: Event) => {
  uploadError.value = ''
  uploadMessage.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Будь ласка, оберіть файл зображення.'
    return
  }

  selectedFile.value = file
  selectedFileName.value = file.name

  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
  }

  localPreviewUrl.value = URL.createObjectURL(file)
}

const handleUpload = async () => {
  uploadError.value = ''
  uploadMessage.value = ''

  if (!selectedFile.value) {
    uploadError.value = 'Спочатку оберіть зображення.'
    return
  }

  isUploading.value = true
  uploadMessage.value = 'Зображення завантажується до Firebase Storage...'

  try {
    const result = await uploadPublicationCover(selectedFile.value)
    form.coverImage = result.url
    uploadMessage.value = 'Обкладинку успішно завантажено.'
  } catch (error: any) {
    uploadError.value = error?.message || 'Не вдалося завантажити обкладинку.'
  } finally {
    isUploading.value = false
  }
}

const removeSelectedImage = () => {
  selectedFile.value = null
  selectedFileName.value = ''
  uploadError.value = ''
  uploadMessage.value = ''
  form.coverImage = ''

  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
    localPreviewUrl.value = ''
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = 'Вкажіть назву публікації.'
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

  if (!form.content.trim()) {
    errorMessage.value = 'Вкажіть текст публікації.'
    return
  }

  if (!form.categoryId) {
    errorMessage.value = 'Оберіть категорію.'
    return
  }

  loading.value = true

  try {
    emit('submit', {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      categoryId: form.categoryId,
      coverImage: form.coverImage.trim(),
      createdAt: form.createdAt || null
    })
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 300)
  }
}
</script>
