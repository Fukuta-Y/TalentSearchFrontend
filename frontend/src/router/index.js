import { createRouter, createWebHistory } from 'vue-router'
import TalentProgramJokenBaseForm from '../views/TalentProgramJoken/TalentProgramJokenBaseForm.vue'
import WeekTalentShutsuenBaseForm from '../views/SearchJoken/WeekTalentShutsuenBaseForm.vue'
import MenuBaseForm from '../views/MainMenu/MenuBaseForm.vue'
import ProgramShutsuenJokenBaseForm from '../views/ProgramShutsuenJoken/ProgramShutsuenJokenBaseForm.vue'
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
    path: '/ProgramShutsuenJokenBaseForm/:programId/:onAirDay/:nentsuki/:shu',
    name: 'ProgramShutsuenJoken',
    component: ProgramShutsuenJokenBaseForm,
    props: route => ({ programId: route.params.programId, onAirDay: route.params.onAirDay, nentsuki: route.params.nentsuki, shu: route.params.shu })
  },
  {
    path: '/WeekTalentShutsuenBaseForm/:nentsuki/:shu/:talentName',
    name: 'WeekTalentShutsuen',
    component: WeekTalentShutsuenBaseForm,
    props: route => ({ nentsuki: route.params.nentsuki, shu: route.params.shu, talentName: route.params.talentName })
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
    path: '/NetsukiShuKanriTorokuKoshinBaseForm/:mode?',  // パラメータがオプショナルになるように変更
    name: 'NetsukiShuKanriTorokuKoshin',
    component: NetsukiShuKanriTorokuKoshinBaseForm,
    props: route => ({ mode: route.params.mode || '1' })
  },
  {
    path: '/OnAirKanriTorokuKoshinBaseForm/:mode?',  // パラメータがオプショナルになるように変更
    name: 'OnAirKanriTorokuKoshin',
    component: OnAirKanriTorokuKoshinBaseForm,
    props: route => ({ mode: route.params.mode || '1' })
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
