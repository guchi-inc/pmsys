<script setup>
import { onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'

import { tagsViewStore } from '@/store/tagsView'
const route = useRoute()
const tagsView = tagsViewStore()
const cachedViews = computed(() => {
    return tagsView.state.cachedViews
})
// console.log("route.path ", route.fullPath)
const key = computed(() => {
    return route.path
})
onBeforeMount(() => {
    console.log('onBeforeMount')
})
</script>
<template>
    <section class="app-main">

        <router-view :key="key" v-slot="{ Component }">
            <keep-alive :include="cachedViews">
                <component :is="Component"></component>
            </keep-alive>
        </router-view>

        <!-- <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view />
            </keep-alive>
        </transition> -->
        <!--:key="key" <div v-if="$store.state.settings.showFooter" id="el-main-footer">
            <span v-html="$store.state.settings.footerTxt" />
            <span> ⋅ </span>
            <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
        </div> -->
    </section>
</template>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header+.app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
        padding-top: 84px;
    }
}
</style>