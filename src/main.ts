import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import { createPinia } from 'pinia';
import GameScreen from './components/GameScreen.vue';
import TestScreen from './components/TestScreen.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import 'bootstrap-icons/font/bootstrap-icons.css';
import TitleScreen from './Title-Screen/components/TitleScreen.vue';
import StoryViewer from './Story/components/StoryViewer.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: TitleScreen },
  { path: '/play/:level', component: GameScreen },
  { path: '/story/:id', component: StoryViewer },
  { path: '/test', component: TestScreen }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

createApp(App).use(createPinia()).use(router).mount('#app');
