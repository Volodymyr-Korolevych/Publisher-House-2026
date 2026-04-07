<template>
  <section class="mx-auto max-w-md">
    <div class="card p-6 sm:p-8">
      <h1 class="page-title">Вхід</h1>
      <p class="page-subtitle">Увійдіть до системи, використовуючи електронну пошту та пароль.</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="label" for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="input" required>
        </div>

        <div>
          <label class="label" for="password">Пароль</label>
          <input id="password" v-model="form.password" type="password" class="input" required>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Виконується вхід...' : 'Увійти' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await login({
      email: form.email,
      password: form.password
    })

    await navigateTo('/profile')
  } catch (error: any) {
    errorMessage.value = error?.message || 'Не вдалося виконати вхід.'
  } finally {
    loading.value = false
  }
}
</script>
