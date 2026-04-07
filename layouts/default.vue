<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />
    <main class="py-8">
      <div class="container-page">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
