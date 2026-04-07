<template>
  <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
    <div>
      <p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Навчальний дипломний проєкт
      </p>
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Web-сайт для інтернет-видавництва
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Платформа для перегляду електронних публікацій, роботи з каталогом,
        авторизації користувачів та адміністрування контенту.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink to="/publications" class="btn-primary">Перейти до каталогу</NuxtLink>
        <NuxtLink to="/register" class="btn-secondary">Створити обліковий запис</NuxtLink>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="mb-4 text-xl font-semibold text-slate-900">Основні можливості</h2>
      <ul class="space-y-3 text-sm text-slate-600">
        <li>• каталог публікацій</li>
        <li>• пошук і перегляд матеріалів</li>
        <li>• реєстрація та авторизація</li>
        <li>• ролі користувачів</li>
        <li>• адміністративна частина</li>
        <li>• CRUD для публікацій і категорій</li>
      </ul>
    </div>
  </section>
</template>
