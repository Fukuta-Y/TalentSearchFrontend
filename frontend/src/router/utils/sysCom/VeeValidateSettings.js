import { defineRule, configure } from 'vee-validate'
// eslint-disable-next-line camelcase
import { required } from '@vee-validate/rules'
// vee-validateのグローバルチェック
import { defineRule } from 'vee-validate'

defineRule('required', required)

// vee-validateのグローバル defineRuleはmain.jsに記載する必要がある
// 必須チェック
defineRule('required', (value, name) => {
    if (!value) {
        return `${name}は必須項目です`
    }
    return true
})