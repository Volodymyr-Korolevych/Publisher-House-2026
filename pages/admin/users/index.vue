<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-semibold">Користувачі</h1>
        <p class="mt-2 text-slate-500">Стартова сторінка для списку користувачів. У наступних TASK тут можна додати зміну ролей і редагування профілів.</p>
      </div>

      <div class="card p-6">
        <div class="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
          Поточний стартовий шаблон уже містить колекцію <code>users</code> у Firestore. На цьому етапі сторінка підготовлена як місце для подальшого TASK-розширення.
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
})
</script>
