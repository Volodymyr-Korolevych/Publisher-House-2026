<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold">Профіль користувача</h1>
        <p class="mt-2 text-slate-500">Базова сторінка профілю. У наступних TASK тут можна додати редагування облікових даних та історію активності.</p>
      </div>
    </div>

    <div class="card p-6">
      <div v-if="!isConfigured" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Firebase ще не налаштований, тому профіль працює як заглушка.
      </div>

      <div v-else-if="profile" class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-slate-500">Ім'я</p>
          <p class="mt-1 font-medium">{{ profile.name }}</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">Email</p>
          <p class="mt-1 font-medium">{{ profile.email }}</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">Роль</p>
          <p class="mt-1 font-medium">{{ profile.role }}</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">Створено</p>
          <p class="mt-1 font-medium">{{ profile.createdAt }}</p>
        </div>
      </div>

      <div v-else class="text-sm text-slate-600">
        Увійди в систему, щоб побачити свої дані.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { init, profile } = useAuth()
const { isConfigured } = useFirebase()

onMounted(async () => {
  await init()
})
</script>
