<template>
  <section>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="page-title">Користувачі системи</h1>
        <p class="page-subtitle">
          Перегляд зареєстрованих користувачів із бази даних Firestore.
        </p>
      </div>

      <button class="btn-secondary" @click="handleReload">
        Оновити список
      </button>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <div class="card p-5">
        <p class="text-sm text-slate-500">Усього користувачів</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ users.length }}</p>
      </div>

      <div class="card p-5">
        <p class="text-sm text-slate-500">Адміністраторів</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ adminCount }}</p>
      </div>

      <div class="card p-5">
        <p class="text-sm text-slate-500">Звичайних користувачів</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ userCount }}</p>
      </div>
    </div>

    <div class="mt-6 card p-4">
      <label class="label" for="search">Пошук користувача</label>
      <input
        id="search"
        v-model="search"
        type="text"
        class="input"
        placeholder="Введіть ім’я або email"
      >
    </div>

    <div v-if="filteredUsers.length" class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Ім’я</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Роль</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">Дата створення</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredUsers"
            :key="item.id"
            class="border-t border-slate-200"
          >
            <td class="px-4 py-3 text-slate-900">
              {{ item.name || 'Не вказано' }}
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ item.email || 'Не вказано' }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  item.role === 'admin'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700'
                ]"
              >
                {{ formatUserRole(item.role) }}
              </span>
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ formatCreatedAt(item.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="mt-6 card p-8 text-center text-slate-500">
      Користувачів не знайдено.
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { users, loadUsers, formatUserRole, formatCreatedAt } = useUsers()

const search = ref('')

await loadUsers()

const filteredUsers = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return users.value

  return users.value.filter((item) =>
    item.name.toLowerCase().includes(query) ||
    item.email.toLowerCase().includes(query)
  )
})

const adminCount = computed(() => {
  return users.value.filter((item) => item.role === 'admin').length
})

const userCount = computed(() => {
  return users.value.filter((item) => item.role === 'user').length
})

const handleReload = async () => {
  await loadUsers()
}
</script>
