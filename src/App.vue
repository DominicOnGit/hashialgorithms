<script setup lang="ts">
import { computed } from 'vue';
import { Levels } from './Title-Screen/services/levels';
import { useRoute } from 'vue-router';

const levels = Levels;
levels.sort((a, b) => a.number - b.number);
const route = useRoute();

const level = computed(() => {
  return route.params.level;
});
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <span class="navbar-brand">Hashi Algorithm</span>
        <span v-if="level != null" class="navbar-text">Level {{ level }}</span>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <RouterLink class="nav-link" exactActiveClass="active" to="/">Levels</RouterLink>
            <RouterLink
              v-for="level in levels"
              :key="level.number"
              class="nav-link"
              exactActiveClass="active"
              :to="`/play/${level.number}`"
              >{{ 'Lv' + level.number }}</RouterLink
            >
          </div>
        </div>
      </div>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
