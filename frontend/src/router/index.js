import { createRouter, createWebHistory } from 'vue-router'
import SearchList from '../views/SearchList/SearchListBaseForm.vue'
import SearchJokenBaseForm from '../views/SearchJoken/SearchJokenBaseForm.vue'
const routes = [
  {
    path: '/',
    name: 'main',
    component: SearchJokenBaseForm
  },
  {
    path: '/SearchListBaseForm/:name/:seibetsu/:address',
    name: 'SearchListBaseForm',
    component: SearchList,
    props: route => ({ name: route.params.name, seibetsu: route.params.seibetsu, address: route.params.address })
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
