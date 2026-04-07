<template>
  <section>
    <div class="card p-6">
      <h1 class="page-title">Профіль користувача</h1>
      <p class="page-subtitle">Персональні дані авторизованого користувача.</p>

      <div v-if="user" class="mt-6 grid gap-4 sm:grid-cols-2">
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
          <p class="mt-1 font-medium uppercase text-slate-900">{{ user.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, initAuth } = useAuth()

if (process.client) {
  initAuth()
}
</script>
