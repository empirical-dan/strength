import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth';
import { useSetsStore } from 'src/stores/sets';
import { useProfileStore } from 'src/stores/profile';
import { AuthError } from '@supabase/supabase-js';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  router.beforeEach(async (to) => {
    const auth = useAuthStore();
    if (to.name === '/') {
      return { name: 'home' };
    }

    if (
      // make sure the user is authenticated
      // ❗️ Avoid an infinite redirect
      to.name !== 'login' &&
      to.name !== 'register' &&
      !(await auth.getSession())
    ) {
      // redirect the user to the Registration page
      console.log('auth.getSession() === false');
      console.log('redirecting to Registration page');
      return { name: 'register' };
    }
    if (to.name === 'login' && (await auth.getSession())) {
      console.log('Already logged in.');
      console.log('redirecting to homepage');
      return { name: 'home' };
    }
    if (to.name === 'register' && (await auth.getSession())) {
      console.log('Already logged in.');
      console.log('redirecting to homepage');
      return { name: 'home' };
    }
  });

  router.beforeResolve(async (to) => {
    if (to.meta.requiresSets) {
      const sets = useSetsStore();
      try {
        await sets.loadSets();
      } catch (error) {
        console.log(error);
        if (error instanceof AuthError) {
          // ... handle the error and then cancel the navigation
          return false;
        } else {
          // unexpected error, cancel the navigation and pass the error to the global handler
          throw error;
        }
      }
    }

    if (to.meta.requiresProfile) {
      const profile = useProfileStore();
      try {
        await profile.loadProfile();
      } catch (error) {
        console.log(error);
        if (error instanceof AuthError) {
          // ... handle the error and then cancel the navigation
          return false;
        } else {
          // unexpected error, cancel the navigation and pass the error to the global handler
          throw error;
        }
      }
    }
  });

  return router;
});
