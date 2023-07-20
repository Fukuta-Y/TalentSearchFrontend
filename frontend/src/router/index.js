import { createRouter, createWebHistory } from 'vue-router'
//import SearchList from '../views/SearchList/SearchListBaseForm.vue'
import TalentProgramJokenBaseForm from '../views/TalentProgramJoken/TalentProgramJokenBaseForm.vue'
import WeekTalentShutsuenBaseForm from '../views/SearchJoken/WeekTalentShutsuenBaseForm.vue'
const routes = [
  {
    path: '/',
    name: 'main',
    component: WeekTalentShutsuenBaseForm
  },
  {
    path: '/TalentProgramJokenBaseForm/:nentsuki/:shu/:talentId',
    name: 'TalentProgramJoken',
    component: TalentProgramJokenBaseForm,
    props: route => ({ nentsuki: route.params.nentsuki, shu: route.params.shu, talentId: route.params.talentId })
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
