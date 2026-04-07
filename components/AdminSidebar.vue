<template>
  <aside class="card p-4">
    <h2 class="mb-4 text-lg font-semibold text-slate-900">Адміністративна панель</h2>
    <nav class="flex flex-col gap-2">
      <NuxtLink to="/admin" class="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">Огляд</NuxtLink>
      <NuxtLink to="/admin/publications" class="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">Публікації</NuxtLink>
      <NuxtLink to="/admin/categories" class="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">Категорії</NuxtLink>
      <NuxtLink to="/admin/users" class="rounded-xl px-3 py-2 text-sm hover:bg-slate-100">Користувачі</NuxtLink>
    </nav>
  </aside>
</template>
