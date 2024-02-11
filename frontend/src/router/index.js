import { createRouter, createWebHistory } from 'vue-router'
import WeekTalentShutsuenBaseForm from '../views/WeekTalentShutsuen/WeekTalentShutsuenBaseForm.vue'
import TalentDetailBaseForm from '../views/TalentDetail/TalentDetailBaseForm.vue'
import ProgramDetailBaseForm from '../views/ProgramDetail/ProgramDetailBaseForm.vue'
import MenuBaseForm from '../views/MainMenu/MenuBaseForm.vue'
import ProgramTorokuKoshinBaseForm from '../views/ProgramTorokuKoshin/ProgramTorokuKoshinBaseForm.vue'
import TalentTorokuKoshinBaseForm from '../views/TalentTorokuKoshin/TalentTorokuKoshinBaseForm.vue'
import NetsukiShuKanriTorokuKoshinBaseForm from '../views/NetsukiShuKanriTorokuKoshin/NetsukiShuKanriTorokuKoshinBaseForm.vue'
import OnAirKanriTorokuKoshinBaseForm from '../views/OnAirKanriTorokuKoshin/OnAirKanriTorokuKoshinBaseForm.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MenuBaseForm
  },
  {
    path: '/WeekTalentShutsuenBaseForm/1',
    name: 'WeekTalentShutsuenTop',
    component: WeekTalentShutsuenBaseForm,
  },
  {
    path: '/WeekTalentShutsuenBaseForm/:nentsuki/:shu/:talentName/:mode',
    name: 'WeekTalentShutsuen',
    component: WeekTalentShutsuenBaseForm,
    props: route => ({ nentsuki: route.params.nentsuki, shu: route.params.shu, talentName: route.params.talentName, mode: route.params.mode || '2' })
  },
  {
    path: '/TalentDetailBaseForm/:nentsuki/:shu/:talentId',
    name: 'TalentDetail',
    component: TalentDetailBaseForm,
    props: route => ({ nentsuki: route.params.nentsuki, shu: route.params.shu, talentId: route.params.talentId })
  },
  {
    path: '/ProgramDetailBaseForm/:programId/:onAirDay/:nentsuki/:shu',
    name: 'ProgramDetail',
    component: ProgramDetailBaseForm,
    props: route => ({ programId: route.params.programId, onAirDay: route.params.onAirDay, nentsuki: route.params.nentsuki, shu: route.params.shu })
  },
  {
    path: '/ProgramTorokuKoshinBaseForm',
    name: 'ProgramTorokuKoshinTop',
    component: ProgramTorokuKoshinBaseForm
  },
  {
    path: '/ProgramTorokuKoshinBaseForm/:programId',
    name: 'ProgramTorokuKoshin',
    component: ProgramTorokuKoshinBaseForm,
    props: route => ({ programId: route.params.programId })
  },
  {
    path: '/TalentTorokuKoshinBaseForm',
    name: 'TalentTorokuKoshinTop',
    component: TalentTorokuKoshinBaseForm
  },
  {
    path: '/TalentTorokuKoshinBaseForm/:talentId',
    name: 'TalentTorokuKoshin',
    component: TalentTorokuKoshinBaseForm,
    props: route => ({ talentId: route.params.talentId })
  },
  {
    path: '/NetsukiShuKanriTorokuKoshinBaseForm/:mode?/:nentsuki?/:shu?',
    name: 'NetsukiShuKanriTorokuKoshin',
    component: NetsukiShuKanriTorokuKoshinBaseForm,
    props: route => ({ mode: route.params.mode || '1', nentsuki: route.params.nentsuki || '', shu: route.params.shu || ''  })
  },
  {
    path: '/OnAirKanriTorokuKoshinBaseForm',
    name: 'OnAirKanriTorokuKoshin',
    component: OnAirKanriTorokuKoshinBaseForm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
