<template>
  <div class="min-h-screen bg-slate-100">
    <div class="container-page py-8">
      <div class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar />
        <div class="card p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
