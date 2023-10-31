import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import { createPinia } from 'pinia';
import GameScreen from './GameScreen.vue';
import TestScreen from './TestScreen.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: GameScreen },
  { path: '/test', component: TestScreen }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

createApp(App).use(createPinia()).use(router).mount('#app');
