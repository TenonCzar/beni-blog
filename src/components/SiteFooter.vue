<template>
  <footer class="border-t border-neutral-200 mt-24">
    <div class="px-6 md:px-12 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <!-- Brand -->
        <div>
          <h3 class="font-display text-4xl font-light tracking-widest uppercase mb-4">Maison</h3>
          <p class="text-neutral-500 text-sm leading-relaxed font-body font-light max-w-xs">
            A modern editorial on fashion, culture, and the art of living with intention.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <p class="section-label mb-6">Navigation</p>
          <nav class="space-y-3">
            <RouterLink to="/" class="block text-sm text-neutral-600 hover:text-[#FF6A00] transition-colors">Home</RouterLink>
            <RouterLink to="/blog" class="block text-sm text-neutral-600 hover:text-[#FF6A00] transition-colors">Journal</RouterLink>
            <RouterLink to="/about" class="block text-sm text-neutral-600 hover:text-[#FF6A00] transition-colors">About</RouterLink>
          </nav>
        </div>

        <!-- Contact -->
        <div>
          <p class="section-label mb-6">Connect</p>
          <div class="space-y-3">
            <a href="https://instagram.com" target="_blank" class="block text-sm text-neutral-600 hover:text-[#FF6A00] transition-colors">Instagram</a>
            <a href="https://pinterest.com" target="_blank" class="block text-sm text-neutral-600 hover:text-[#FF6A00] transition-colors">Pinterest</a>
            <a href="mailto:hello@maison.com" class="block text-sm text-neutral-600 hover:text-[#FF6A00] transition-colors">hello@maison.com</a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-neutral-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-neutral-400 font-mono">© {{ year }} MAISON. All rights reserved.</p>
        <p class="text-xs text-neutral-400 font-mono">Fashion. Culture. Identity.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
const year = new Date().getFullYear()
</script>
