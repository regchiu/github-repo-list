<template>
  <div class="app-card">
    <slot></slot>
  </div>
</template>

<style scoped>
@import '@/assets/base.css';

.app-card {
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 12px;
}

.app-card:hover {
  border-color: var(--color-border-hover);
}
</style>
