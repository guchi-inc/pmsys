<script setup>
import { computed, ref } from 'vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import { userStore } from '@/store/user'
import { $success, $error } from '@/utils/message'
import { wsmsgStore } from '@/store/wsmsg'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = userStore()
const wsmsg = wsmsgStore()
const wsmsgVisible = ref(false)
import {
    Platform, Search, House, BellFilled, SwitchButton, RefreshLeft, Sunny, MoonNight
} from '@element-plus/icons-vue'
import { sidebarStore } from '@/store/app'
import { configStore } from '@/store/config'
const confStore = configStore()
const isDark = computed(() => confStore.isDark())
const sbStore = sidebarStore()
const loading = ref(false);
const toggleSideBar = () => {
    sbStore.toggleSideBar()
}
// 计算出子菜单
const menuName = ref()
const searchMenu = computed(() => {
    const retmenu = []
    Object.keys(user.menu).forEach(el => {
        const item = user.menu[el]
        if (item['sub']) {
            item['sub'].forEach(e => {
                retmenu.push(e)
            })
        } else {
            retmenu.push(item['main'])
        }
    });
    console.log('retmenu = ', retmenu)
    return retmenu;
})
const theme = () => {
    const html = document.querySelector('html');
    confStore.toggleDark()
    console.log('isDark theme = ', confStore.theme)
    html.className = confStore.theme;
}
// 默认切换一次主题
console.log('isDark = ', isDark)
if (confStore.isDark()) { const html = document.querySelector('html'); html.className = 'dark' }
const clear = () => {
    loading.value = true;
    user.clear().then(() => {
        $success("缓存刷新成功！");
    }).catch(err => {
        $error(err);
    }).finally(() => {
        loading.value = false;
    })
}
const logout = () => {
    loading.value = true;
    user.logout().then(() => {
        $success("退出成功");
        window.location.reload();
    }).catch(err => {
        $error(err);
    }).finally(() => {
        loading.value = false;
    })
}
const ws = wsmsg.connect(confStore.msg_server)
</script>
<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sbStore.status" class="hamburger-container"
            @toggleClick="toggleSideBar" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <div class="right-menu">
            <el-menu mode="horizontal" :ellipsis="false">
                <el-menu-item>
                    <el-select v-model="menuName" filterable remote remote-show-suffix placeholder="搜索功能菜单"
                        :suffix-icon="Search" @change="(value) => {
                            console.log('点击了，', value)
                            router.push(value)
                        }">
                        <el-option v-for="item in searchMenu" :key="item" :label="item['description']"
                            :value="'/' + item['menu_name']"></el-option>
                    </el-select>
                </el-menu-item>
                <el-menu-item v-if="user.monitor" index="resource" @click="() => { router.push('/resource') }">
                    <el-icon>
                        <Platform />
                    </el-icon>
                    系统结构
                </el-menu-item>
                <el-menu-item index="home" @click="() => { router.push('/home') }">
                    <el-icon>
                        <House />
                    </el-icon>
                </el-menu-item>
                <el-menu-item index="bell" @click="() => {
                    console.log('click bell:', wsmsg.wsmsg);
                    wsmsgVisible = true
                }">
                    <el-badge :value="wsmsg.wsmsg.length" class="item" style="line-height: 20px">
                        <el-icon>
                            <BellFilled />
                        </el-icon>
                    </el-badge>
                </el-menu-item>
                <el-sub-menu index="size" class="size w-[60px]">
                    <template #title>
                        <el-icon>
                            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                                <path fill="currentColor"
                                    d="M0 54.857h54.796v18.286H36.531V128H18.265V73.143H0V54.857zm127.857-36.571H91.935V128H72.456V18.286H36.534V0h91.326l-.003 18.286z" />
                            </svg>
                        </el-icon>
                    </template>
                    <el-menu-item index="sizeLarge" @click="() => confStore.toggleSize('large')" align="center"><el-text
                            size="large">大</el-text></el-menu-item>
                    <el-menu-item index="sizeMedium" @click="() => confStore.toggleSize('default')"
                        align="center"><el-text size="default">中</el-text></el-menu-item>
                    <el-menu-item index="sizeSmall" @click="() => confStore.toggleSize('small')" align="center"><el-text
                            size="small">小</el-text></el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="0">
                    <template #title>欢迎您，{{ user.name }}</template>
                    <el-menu-item index="theme" @click="theme" align="center">
                        <el-icon>
                            <Sunny v-if="isDark" />
                            <MoonNight v-else />
                        </el-icon>切换主题
                    </el-menu-item>
                    <el-menu-item index="clear" @click="clear" align="center">
                        <el-icon>
                            <RefreshLeft />
                        </el-icon>刷新缓存
                    </el-menu-item>
                    <el-menu-item index="logout" @click="logout" align="center">
                        <el-icon>
                            <SwitchButton />
                        </el-icon>退出登录
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </div>
    </div>
    <!-- <div class="navbar"></div> -->
    <el-dialog v-model="wsmsgVisible" title="消息中心" width="800">
        <el-table :data="wsmsg.wsmsg">
            <el-table-column type="index" label="序号" width="150" />
            <el-table-column property="topic" label="主题" width="150" />
            <el-table-column property="data.action" label="行动" width="150" />
            <el-table-column property="data.detail" label="详情" width="150" />
            <el-table-column property="data.operator" label="操作人" width="150" />
        </el-table>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="danger" @click="() => {
                    // wsmsgVisible = false
                    wsmsg.clearWsmsg()
                }">
                    清空
                </el-button>
                <el-button @click="wsmsgVisible = false">返回</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        @apply h-full leading-none focus:outline-none absolute top-0 right-0;

        .el-menu {
            @apply border-none;
            height: 50px;
        }

        :deep(.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title) {
            border-bottom: none;
            color: var(--el-menu-text-color);
        }

        .right-menu-item {
            @apply h-full inline-block px-3 text-2xl pt-6 align-text-bottom;

            color: #5a5e66;


            &.hover-effect {
                @apply cursor-pointer hover:bg-gray-200;
                transition: background .3s;
            }
        }

        .search-style {
            @apply pt-4;
        }

        .avatar-container {
            margin-right: 30px;
            @apply pt-0;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }

    :deep(.size.el-sub-menu .el-sub-menu__icon-arrow) {
        display: none;
    }
}

.dark .navbar {
    background: transparent;
    box-shadow: 0 1px 4px rgba(255, 234, 214, .08);
}

:deep(.el-select .el-input .el-select__caret.is-reverse) {
    transform: none;
}

:deep(.el-menu-item.is-active) {
    color: var(--el-menu-text-color) !important;
    border-bottom: none !important;
}

:deep(.el-menu--horizontal>.el-menu-item) {
    border-bottom: none !important;
}
</style>