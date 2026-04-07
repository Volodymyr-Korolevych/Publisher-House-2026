<template>
  <section class="mx-auto max-w-md">
    <div class="card p-6 sm:p-8">
      <h1 class="page-title">Реєстрація</h1>
      <p class="page-subtitle">Створіть обліковий запис користувача для роботи із сайтом.</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="label" for="name">Ім’я</label>
          <input id="name" v-model="form.name" type="text" class="input" required>
        </div>

        <div>
          <label class="label" for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="input" required>
        </div>

        <div>
          <label class="label" for="password">Пароль</label>
          <input id="password" v-model="form.password" type="password" class="input" required minlength="6">
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Створення облікового запису...' : 'Зареєструватися' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password
    })

    await navigateTo('/profile')
  } catch (error: any) {
    errorMessage.value = error?.message || 'Не вдалося створити обліковий запис.'
  } finally {
    loading.value = false
  }
}
</script>
