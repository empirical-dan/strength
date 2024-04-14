import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/HomePage.vue'),
        meta: { requiresAuth: true, requiresProfile: true },
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegistrationPage.vue'),
      },
      {
        path: 'sets',
        name: 'sets',
        component: () => import('pages/SetsPage.vue'),
        meta: { requiresAuth: true, requiresProfile: true, requiresSets: true },
      },
      {
        path: 'modifiers',
        name: 'modifiers',
        component: () => import('pages/ModifiersPage.vue'),
        meta: { requiresAuth: true, requiresModifiers: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
