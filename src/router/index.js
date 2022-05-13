import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import TeachersPage from '../views/TeachersView.vue'
import StudentView from '../views/StudentView.vue'
import ClassesView from '../views/ClassesView.vue'
import SubjectView from '../views/SubjectsView.vue'
import InvoicesView from '../views/InvoicesView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  // {
  //   path: '/teachers',
  //   name: 'teachers',
  //   component: TeachersPage,
  // },
  {
    path: '/students',
    name: 'students',
    component: StudentView,
  },
  {
    path: '/classes',
    name: 'classes',
    component: ClassesView,
  },
  {
    path: '/subjects',
    name: 'subjects',
    component: SubjectView,
  },
  {
    path: '/bills',
    name: 'invoices',
    component: InvoicesView,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
