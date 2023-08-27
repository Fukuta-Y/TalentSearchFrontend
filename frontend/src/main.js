import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// vee-validateのグローバルチェック
import { defineRule } from 'vee-validate'

createApp(App).use(router).mount('#app')

// 必須チェック
defineRule("required", (value) => {
    if (!value || !value.length) {
        return `上記は必須項目です！`;
    }
    return true;
});