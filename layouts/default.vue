<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 py-8">
      <div class="container-app">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
