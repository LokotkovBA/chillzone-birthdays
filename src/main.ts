import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import './index.css';
import router from './router';
import { clerkPlugin } from 'vue-clerk';
import { env } from './utils/env';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(clerkPlugin, {
    publishableKey: env.VITE_CLERK_PUBLISHABLE_KEY,
});
app.use(createPinia());
app.use(router);

app.mount('#app');
