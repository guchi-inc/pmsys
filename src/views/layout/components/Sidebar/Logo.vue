<script setup>
import logo from '@/assets/logo.png'
const props = defineProps({
    collapse: Boolean,
    title: {
        type: String,
        default: '管理平台'
    },
    logo: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <div class="sidebar-logo-container" :class="{ /*'collapse': collapse,*/ 'text-center': collapse }">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 v-else class="sidebar-title">{{ title }} </h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 class="sidebar-title">{{ title }} </h1>
            </router-link>
        </transition>
    </div>
</template>
<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    @apply opacity-0;
}

.sidebar-logo-container {
    @apply relative w-full overflow-hidden;
    height: 50px;
    line-height: 50px;
    text-align: center;

    & .sidebar-logo-link {
        @apply h-full w-full;

        &>img {
            @apply inline;
        }

        & .sidebar-logo {
            @apply align-middle;
            width: 32px;
            height: 32px;
            margin-right: 6px;
        }

        & .sidebar-title {
            @apply inline-block m-0 font-semibold align-middle;
            color: #fff;
            line-height: 50px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        }
    }

    // &.collapse {
    //     .sidebar-logo {
    //         @apply mr-0;
    //     }
    // }
}
</style>