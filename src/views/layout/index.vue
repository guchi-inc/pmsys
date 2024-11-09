<script setup>
import { computed } from 'vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import sidebar from '@/views/layout/components/Sidebar/index.vue'
import { sidebarStore } from '@/store/app'
import { TagsView } from './components'
import { configStore } from '@/store/config'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const sbStore = sidebarStore()

const classObj = computed(() => {
    return {
        hideSidebar: !sbStore.status,
        openSidebar: sbStore.status,
        withoutAnimation: sbStore.animation,
        mobile: sbStore.device === 'mobile'
    }
})
document.title = configStore().name
</script>
<template>
    <el-config-provider :locale="zhCn" :size="configStore().size">
        <div class="app-wrapper" :class="classObj">
            <sidebar class="sidebar-container" />
            <div class="main-container hasTagsView">
                <div class="fixedHeader">
                    <navbar />
                    <tags-view />
                </div>
                <app-main />
            </div>
        </div>
    </el-config-provider>
</template>

<style lang="scss" scoped>
// @import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {
    // @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
    padding: 0;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}

.mobile .fixed-header {
    width: 100%;
}
</style>