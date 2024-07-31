// import { useAuthStore, useAuthFakeStore } from "@/state/pinia";
export default [
  {
    path: "/",
    name: "default",
    meta: { title: "Dashboard", authRequired: true },
    component: () => import("../views/home")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/login"),
    meta: {
      title: "Login",
      beforeResolve(routeTo, routeFrom, next) {
        // const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        const auth = localStorage.getItem("user");
        if (auth) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      }
    }
  },
  {
    path: "/auth/register",
    name: "Register",
    component: () => import("../views/account/register"),
    meta: {
      title: "Register",
      beforeResolve(routeTo, routeFrom, next) {
        // const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        const auth = localStorage.getItem("user");
        if (auth) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      }
    }
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../views/account/forgot-password"),
    meta: {
      title: "Forgot password",
      // beforeResolve(routeTo, routeFrom, next) {
      //   const auth = useAuthStore();
      //   // If the user is already logged in
      //   // if (store.getters["auth/loggedIn"]) {
      //   if (auth.loggedIn) {
      //     // Redirect to the home page instead
      //     next({ name: "default" });
      //   } else {
      //     // Continue to the login page
      //     next();
      //   }
      // }
    }
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../views/account/logout"),
    meta: {
      title: "Logout",
      authRequired: true,
      // beforeResolve(routeTo, routeFrom, next) {
      //   const auth = useAuthStore();
      //   const authFake = useAuthFakeStore();

      //   if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
      //     auth.logOut();
      //   } else {
      //     authFake.logout();
      //   }
      //   const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
      //     route.push("/login")
      //   );
      //   // Navigate back to previous page, or home as a fallback
      //   next(
      //     authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom }
      //   );
      // }
    }
  },
  //** Penanganan 404 **/
  {
    path: "/404",
    name: "404",
    meta: { title: "404 Error Page" },
    component: require("../views/utility/404").default
  },
  {
    path: "/:pathMatch(.*)*",
    meta: { title: "404 Error Page" },
    component: require("../views/utility/404").default
  },
  //** End Penanganan 404 **/
  //** Super Admin **/
  {
    path: '/sa/user',
    meta: { title: 'Role Management', authRequired: true, },
    component: () =>
        import ('../views/users/user.vue'),
  },
  {
    path: '/sa/menu',
    meta: { title: 'Menu Setting', authRequired: true, },
    component: () =>
        import ('../views/setting/index.vue'),
  },
  //** End Super Admin **/
  //** Admin **/
  {
    path: '/admin/hasilDapo',
    meta: { title: 'Hasil Dapodik', authRequired: true, },
    component: () =>
        import ('../views/dashboard/dapodik/hasilDapo.vue'),
  },
  {
    path: '/admin/spm',
    meta: { title: 'Komite', authRequired: true, },
    component: () =>
        import ('../views/dashboard/komite/komite.vue'),
  },
  //** End Admin **/
  //** Guru **/
  
  {
    path: '/guru/ijin',
    meta: { title: 'Guru', authRequired: true, },
    component: () =>
        import ('../views/guru/ijin/index.vue'),
  },
  //** End Guru **/
];
