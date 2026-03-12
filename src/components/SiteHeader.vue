<template>
  <header class="bg-white border-b border-neutral-100 sticky top-0 z-50">
    <!-- Top bar -->
    <div class="border-b border-neutral-100 py-2 px-6 md:px-12 hidden md:flex items-center justify-between">
      <span class="section-label text-neutral-400">Est. 2024</span>
      <span class="font-display text-xs italic text-neutral-400">Fashion. Culture. Identity.</span>
      <span class="section-label text-neutral-400">Paris · New York · Milan</span>
    </div>

    <!-- Main nav -->
    <div class="px-6 md:px-12 py-5 flex items-center justify-between">
      <!-- Left nav -->
      <nav class="hidden md:flex items-center gap-8">
        <RouterLink to="/blog" class="nav-link">Journal</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
      </nav>

      <!-- Logo -->
      <RouterLink to="/" class="absolute left-1/2 -translate-x-1/2">
        <h1 class="font-display text-3xl font-light tracking-widest uppercase select-none">
          Maison
        </h1>
      </RouterLink>

      <!-- Right nav -->
      <nav class="hidden md:flex items-center gap-8 ml-auto">
        <a href="https://instagram.com" target="_blank" class="nav-link">Instagram</a>
      </nav>

      <!-- Mobile menu button -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden ml-auto p-1"
        aria-label="Toggle menu"
      >
        <div class="w-6 flex flex-col gap-1.5">
          <span :class="['block h-px bg-neutral-900 transition-all duration-200', menuOpen ? 'rotate-45 translate-y-2.5' : '']"></span>
          <span :class="['block h-px bg-neutral-900 transition-all duration-200', menuOpen ? 'opacity-0' : '']"></span>
          <span :class="['block h-px bg-neutral-900 transition-all duration-200', menuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
        </div>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden border-t border-neutral-100 bg-white px-6 py-8 space-y-6">
        <RouterLink to="/" class="nav-link block" @click="menuOpen = false">Home</RouterLink>
        <RouterLink to="/blog" class="nav-link block" @click="menuOpen = false">Journal</RouterLink>
        <RouterLink to="/about" class="nav-link block" @click="menuOpen = false">About</RouterLink>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
