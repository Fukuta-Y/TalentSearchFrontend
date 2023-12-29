import { createRouter, createWebHistory } from 'vue-router'
import TalentProgramJokenBaseForm from '../views/TalentProgramJoken/TalentProgramJokenBaseForm.vue'
import WeekTalentShutsuenBaseForm from '../views/SearchJoken/WeekTalentShutsuenBaseForm.vue'
import MenuBaseForm from '../views/MainMenu/MenuBaseForm.vue'
import ProgramShutsuenJokenBaseForm from '../views/ProgramShutsuenJoken/ProgramShutsuenJokenBaseForm.vue'
const routes = [
  {
    path: '/',
    name: 'main',
    component: MenuBaseForm
  },
  {
    path: '/WeekTalentShutsuenBaseForm',
    name: 'WeekTalentShutsuenTop',
    component: WeekTalentShutsuenBaseForm
  },
  {
    path: '/TalentProgramJokenBaseForm/:nentsuki/:shu/:talentId',
    name: 'TalentProgramJoken',
    component: TalentProgramJokenBaseForm,
    props: route => ({ nentsuki: route.params.nentsuki, shu: route.params.shu, talentId: route.params.talentId })
  },
  {
    path: '/ProgramShutsuenJokenBaseForm/:programId/:onairDay/:nentsuki/:shu',
    name: 'ProgramShutsuenJoken',
    component: ProgramShutsuenJokenBaseForm,
    props: route => ({ programId: route.params.programId, onairDay: route.params.onairDay, nentsuki: route.params.nentsuki, shu: route.params.shu })
  },
  {
    path: '/WeekTalentShutsuenBaseForm/:nentsuki/:shu/:talentName',
    name: 'WeekTalentShutsuenTalentName',
    component: WeekTalentShutsuenBaseForm,
    props: route => ({ nentsuki: route.params.nentsuki, shu: route.params.shu, talentName: route.params.talentName })
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
