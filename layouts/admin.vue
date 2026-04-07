<template>
  <div class="min-h-screen bg-slate-100">
    <AppHeader />
    <div class="container-app py-8">
      <div class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar />
        <div class="min-w-0">
          <slot />
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>
