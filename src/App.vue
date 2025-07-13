<script setup lang="ts"></script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <span class="navbar-brand">Hashi Algorithm</span>
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
