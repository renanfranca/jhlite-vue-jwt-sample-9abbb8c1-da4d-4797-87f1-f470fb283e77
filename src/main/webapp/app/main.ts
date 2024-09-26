import { createApp } from 'vue';
import AppVue from './AppVue.vue';
import router from './router';
// jhipster-needle-main-ts-import

const app = createApp(AppVue);
app.use(router);
//TODO: use the provideForAuth function
//TODO: localStorage should be provided too
// jhipster-needle-main-ts-provider
app.mount('#app');
