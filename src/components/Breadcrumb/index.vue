<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const levelList = ref([]);

const isDashboard = (route) => {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}
const getBreadcrumb = () => {
  // only show routes with meta.title
  console.log(route)
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]

  if (!isDashboard(first)) {
    matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched)
  }
  console.log("matched = ", matched)

  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}
getBreadcrumb()

watch(route, (route) => {
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noredirect' || index == levelList.length - 1" class="no-redirect">{{
        item.meta.title
      }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
