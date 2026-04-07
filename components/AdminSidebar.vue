<template>
  <aside class="card p-4">
    <h2 class="mb-4 text-lg font-semibold">Адмін-панель</h2>
    <div class="space-y-2">
      <NuxtLink to="/admin" class="block rounded-xl px-4 py-3 hover:bg-slate-100">Огляд</NuxtLink>
      <NuxtLink to="/admin/publications" class="block rounded-xl px-4 py-3 hover:bg-slate-100">Публікації</NuxtLink>
      <NuxtLink to="/admin/categories" class="block rounded-xl px-4 py-3 hover:bg-slate-100">Категорії</NuxtLink>
      <NuxtLink to="/admin/users" class="block rounded-xl px-4 py-3 hover:bg-slate-100">Користувачі</NuxtLink>
      <NuxtLink to="/" class="block rounded-xl px-4 py-3 hover:bg-slate-100">На сайт</NuxtLink>
    </div>
  </aside>
</template>
