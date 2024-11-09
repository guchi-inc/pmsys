<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './Logo.vue'
import variables from '@/assets/styles/variables.module.scss?module'
import { sidebarStore } from '@/store/app'
console.log("variables = ", variables)
import { userStore } from '@/store/user'
const user = userStore()
import { configStore } from '@/store/config'
const menuColors = computed(() => {
    return configStore().isDark() ?
        { bg: variables.menuBgDark, text: variables.menuTextDark, activeText: variables.menuActiveTextDark } :
        { bg: variables.menuBg, text: variables.menuText, activeText: variables.menuActiveText }
})
import {
    Histogram, Present, Notebook, ShoppingCart, ShoppingCartFull, Box, Memo, Platform, Coin, Opportunity,
    Grid, TrendCharts, ShoppingBag, Goods, Tickets, Document, Setting, User
} from '@element-plus/icons-vue'
const icons = [
    Histogram, Present, ShoppingCart, ShoppingCartFull, Memo, Platform, Coin, Opportunity,
    Grid, TrendCharts, ShoppingBag, Tickets, Setting, User, Notebook, Box, Goods, Document
]
const sbStore = sidebarStore()

const activeMenu = computed(() => {
    const route = useRoute()
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu
    }
    return path
})

const isCollapse = computed(() => {
    console.log("sidebar.opened = ", sbStore.status)
    return !sbStore.status
})
const showLogo = ref(true)
</script>
<template>
    <div class="has-logo">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :collapse="isCollapse" :collapse-transition="false" :default-active="activeMenu"
                :unique-opened="true" router :background-color="menuColors.bg" :text-color="menuColors.text"
                :active-text-color="menuColors.activeText">
                <template v-for="(menu, number, index) in user.menu">
                    <el-sub-menu v-if="menu.sub" :index="'/' + menu.main.menu_name" :key="index">
                        <template #title>
                            <el-icon>
                                <component :is="icons[index]" />
                            </el-icon>
                            <span>{{ menu.main.description }}</span>
                        </template>
                        <el-menu-item v-for="(sub, subIndex) in menu.sub" :index="'/' + sub.menu_name" :key="subIndex">
                            <el-icon>
                                <Notebook />
                            </el-icon>
                            <template #title>{{ sub.description }}</template>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="'/' + menu.main.menu_name" class="submenu-title-noDropdown">
                        <el-icon>
                            <component :is="icons[index]" />
                        </el-icon>
                        <template #title>{{ menu.main.description }}</template>
                    </el-menu-item>
                </template>
                <!--  -->
            </el-menu>
        </el-scrollbar>
    </div>
</template>