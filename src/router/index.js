// src/router/index.js

import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import AboutPage from '../views/AboutPage.vue'; // Ensure the paths are correct
import HospitalForm from '../views/HospitalForm.vue'; // Import HospitalForm component
import ConfirmForm from '../views/ConfirmForm.vue';
import HospitalList from '@/views/HospitalList.vue';
import EditForm from '../views/EditForm.vue';
import RidesToday from '../views/RidesToday.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import BusSchedule from '@/views/BusSchedules.vue';
import TaxiUsers from '@/views/TaxiUsers.vue';
import TaxiUsersPublic from '@/views/TaxiUsersPublic.vue';
import DriverView from '@/views/DriverView.vue';
import TranslatorView from '@/views/TranslatorView.vue';
import PrivacyPage from '@/views/PrivacyPage.vue';
import Cookies from 'js-cookie';  // Import js-cookie to access the token from cookies
import AllAppointments from '@/views/AllAppointments.vue';
import ResetPasswordRequest from '@/views/ResetPasswordRequest.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';


const routes = [
  {
    path: '/',
    name: 'HospitalList',
    component: HospitalList,

  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "login", }
      ]
    }
  },
  {
    path: '/privacy',
    name: 'PrivacyPage',
    component: PrivacyPage,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "privacy" }
      ]
    }
  },
  {
    path: '/registrer',
    name: 'RegisterUser',
    component: () => import('@/views/Register.vue'),
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "register" }
      ]
    }
  },
  {
    path: '/reset-password-request',
    name: 'ResetPasswordRequest',
    component: ResetPasswordRequest,
    meta: {
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPasswordView',
    component: ResetPasswordView,
    meta: {
    }
  },
  {
    path: '/hospital/:id', // Dynamic route for HospitalForm with :id as a parameter
    name: 'HospitalForm',
    component: HospitalForm,
    props: true, // Pass the route parameters as props to the component
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "hospitals", link: "/hospitaler" },
        { name: "hospitalform" }
      ]
    }
  },
  {
    path: '/bekraeft',
    name: 'ConfirmForm',
    component: ConfirmForm,
    props: route => ({
      formData: route.params.formData,
      busTime: route.params.busTime
    }),
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "hospitals", link: "/hospitaler" },
        { name: "confirmform" },
      ]

    }
  },
  {
    path: '/alle-aftaler',
    name: 'AllAppointments',
    component: AllAppointments,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "ridestoday" }
      ]
    }
  },
  {
    path: '/dagens',
    name: 'RidesToday',
    component: RidesToday,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "ridestoday" }
      ],
      hideHeaderFooter: false
    }
  },
  {
    path: '/info/dagens',
    name: 'RidesTodayInfo',
    component: RidesToday,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "ridestoday" }
      ],
      hideHeaderFooter: true
    }
  },
  {
    path: '/edit/:userId',
    name: 'EditForm',
    component: EditForm,
    props: true,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "edit" }
      ]
    }

  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage, // Reference the correct component
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "about" }
      ]
    }
  },
  {
    path: '/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      requiresStaff: true,
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard" }
      ]
    },
  },
  {
    path: '/info/bus-plan',
    name: 'BusScheduleInfo',
    component: BusSchedule,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "schedules" }
      ],
      hideFooter: true,
      useAltHeader: true,
      hideBreadcrumbs: true
    }
  },
  {
    path: '/bus-plan',
    name: 'BusSchedule',
    component: BusSchedule,
    meta: {
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "schedules" }
      ],
      hideHeaderFooter: false
    }
  },
  {
    path: '/taxa-patienter',
    name: 'TaxiUsers',
    component: TaxiUsers,
    meta: {
      requiresStaff: true,
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "taxi" }
      ]
    },
  },
  {
    path: '/med-taxa',
    name: 'TaxiUsersPublic',
    component: TaxiUsersPublic,
    meta: {
      requiresStaff: false,
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "taxi" }
      ],
      hideHeaderFooter: false
    },
  },
  {
    path: '/info/med-taxa',
    name: 'TaxiUsersPublicInfo',
    component: TaxiUsersPublic,
    meta: {
      requiresStaff: false,
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "taxi" }
      ],
      hideHeaderFooter: true
    },
  },
  {
    path: '/tolke',
    name: 'TranslatorView',
    component: TranslatorView,
    meta: {
      requiresStaff: true,
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "translators" }
      ]
    },
  },
  {
    path: '/busdriver',
    name: 'DriverView',
    component: DriverView,
    meta: {
      requiresStaff: true,
      breadcrumbs: [
        { name: "home", link: "/" },
        { name: "dashboard", link: "/dashboard" },
        { name: "drivers" }
      ]

    },
  }
];

const isDevelopment = process.env.NODE_ENV === 'development';

const router = createRouter({
  history: isDevelopment ? createWebHashHistory() : createWebHistory(process.env.BASE_URL),
  routes,
  parseQuery: (query) => Object.fromEntries(new URLSearchParams(query)),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});


router.beforeEach((to, from, next) => {
  // Check if the route requires staff permissions
  if (to.matched.some(record => record.meta.requiresStaff)) {
    const token = Cookies.get('auth_token');  // Get the token from cookies
    console.log('Auth Token:', Cookies.get('auth_token'));

    if (!token) {
      // If no token is found, redirect to the login page
      return next('/login');
    } else {
      // Verify token and user role if necessary (optional)
      next();
    }
  } else {
    // If route does not require authentication, just proceed
    next();
  }
});

export default router;
