<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" placeholder="Назва" class="input" />
    <input v-model="form.author" placeholder="Автор" class="input" />
    <textarea v-model="form.description" placeholder="Опис" class="input"/>

    <label class="label">Обкладинка</label>
    <input type="file" @change="uploadCoverFile" />

    <label class="label">PDF книга</label>
    <input type="file" accept="application/pdf" @change="uploadBookFile" />

    <button class="btn-primary mt-4">
      Зберегти
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['submit'])
const { uploadCover, uploadBook } = useStorageUpload()

const form = reactive({
  title: '',
  author: '',
  description: '',
  coverImage: '',
  bookFileUrl: '',
  bookFileName: ''
})

const uploadCoverFile = async (e) => {
  const file = e.target.files[0]
  form.coverImage = await uploadCover(file)
}

const uploadBookFile = async (e) => {
  const file = e.target.files[0]
  form.bookFileUrl = await uploadBook(file)
  form.bookFileName = file.name
}

const submit = () => {
  emit('submit', form)
}
</script>
