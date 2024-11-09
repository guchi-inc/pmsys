import { createRouter, createWebHashHistory } from 'vue-router'

const layout = () => import('@/views/layout/index.vue')
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/login/index.vue')
        },
        {
            path: '/404',
            name: '404',
            component: layout,
            hidden: true,
            children: [
                {
                    path: '/:pathMatch(.*)*',
                    component: () => import('@/views/features/404.vue')
                }
            ]
        },
        {
            path: '/redirect',
            name: 'Redirect',
            component: layout,
            hidden: true,
            children: [
                {
                    path: '/redirect/:path(.*)',
                    component: () => import('@/views/features/redirect.vue')
                }
            ]
        },
    ]
});

export default router