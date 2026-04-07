<template>
  <div class="mx-auto max-w-xl">
    <div class="card p-6 sm:p-8">
      <h1 class="text-2xl font-semibold">Вхід</h1>
      <p class="mt-2 text-sm text-slate-500">Увійди як користувач або адміністратор після налаштування Firebase.</p>

      <div v-if="!isConfigured" class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Firebase ще не налаштований. Заповни `.env` за зразком із `.env.example`.
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-2 block text-sm font-medium">Email</label>
          <input v-model="email" type="email" class="form-input" required />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Пароль</label>
          <input v-model="password" type="password" class="form-input" required />
        </div>
        <button class="btn-primary w-full" type="submit">Увійти</button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-sm text-rose-600">{{ errorMessage }}</p>
      <p class="mt-4 text-sm text-slate-500">
        Немає акаунта?
        <NuxtLink to="/register" class="font-medium text-brand-700">Зареєструватися</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const { isConfigured } = useFirebase()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const submit = async () => {
  errorMessage.value = ''
  try {
    await login(email.value, password.value)
    await navigateTo('/profile')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не вдалося увійти.'
  }
}
</script>
