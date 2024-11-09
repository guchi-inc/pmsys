import router from './routers';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
// import { getToken } from '@/utils/auth'; // get token from cookie
import { userStore } from '@/store/user';
// import { ro } from 'element-plus/es/locale';
const whitelist = ['/login', '/404']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();
    const user = userStore();
    // determine whether the user has logged in
    const hasToken = user.token;
    // console.log('hasToken=', hasToken)
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/home' });
            NProgress.done();
        } else {
            // console.log('user.menu=', user.menu)
            // // 增加路由
            if (user.router.length == 0) {
                user.setRouter();
                // console.log('user.router=', user.router)
                user.router.forEach(item => {
                    // console.log('itemItem = ', item)
                    router.addRoute(item)
                })
                // console.log("router22 = ", to.path, router.getRoutes())
                // next({ ...to, replace: true });
                next({ path: to.path, replace: true })
            } else {
                // // determine whether the user has obtained his permission roles through getInfo
                // const hasRoles = store.getters.roles && store.getters.roles.length > 0;
                // if (hasRoles) {
                //     next();
                // } else {
                //     try {
                //         // get user info
                //         const { roles } = await store.dispatch('user/getInfo');
                //         // generate accessible routes map based on roles
                //         const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
                //         // dynamically add accessible routes
                //         router.addRoute(accessRoutes);
                //         // hack method to ensure that addRoutes is complete
                //         // set the replace: true, so the navigation will not leave a history record
                //         next({ ...to, replace: true });
                //     } catch (error) {
                //         // remove token and go to login page to re-login
                //         await store.dispatch('user/resetToken');
                //         ElMessage.error(error || 'Has Error');
                //         next(`/login?redirect=${to.path}`);
                //         NProgress.done();
                //     }
                // }
                next();
            }
        }
    } else {
        /* has no token*/
        // 在白名单里面
        if (whitelist.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});