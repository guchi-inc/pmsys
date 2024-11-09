<script setup>
import { ref, reactive, watch, computed, onMounted, getCurrentInstance } from 'vue'

import router from '@/router/routers'
import { useRoute } from 'vue-router'
import { tagsViewStore } from '@/store/tagsview'
import { Close } from '@element-plus/icons-vue'
import path from 'path-browserify'
const routes = router.getRoutes()
console.log("routes:", routes)
const route = useRoute()
const { proxy } = getCurrentInstance()
console.log("proxy", proxy);
const tagsView = tagsViewStore()

const tagsMenu = reactive({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: {}
})

const tagRef = ref()
const visitedViews = computed(() => {
  return tagsView.state.visitedViews
})
const isActive = (rt) => {
  return rt.path === route.path
}
const filterAffixTags = (routes, basePath = '/') => {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
const initTags = () => {
  const affixTags = filterAffixTags(routes)
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      console.log("tag=====", tag)
      // this.$store.dispatch('tagsView/addVisitedView', tag)
      tagsView.actions.addVisitedView(tag)
    }
  }
}
const addTags = () => {
  const { name } = route
  // console.log("name:", name)
  if (name) {
    // this.$store.dispatch('tagsView/addView', this.$route)
    tagsView.actions.addView(route)
    console.log("tagsView:", tagsView);
  }
  return false
}

const toLastView = (visitedViews, view) => {
  // console.log("xxxxxxxxxx", visitedViews.value.slice(-1))
  const latestView = visitedViews.value.slice(-1)[0]
  console.log("latestView = ", latestView)
  if (latestView) {
    router.push(latestView)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
const moveToCurrentTag = () => {
  const tags = tagRef.value
  console.log("tags:", tags)
  proxy.$nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === route.path) {
        // this.$refs.scrollPane.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          // this.$store.dispatch('tagsView/updateVisitedView', this.$route)
          tagsView.actions.updateVisitedView(route)
        }
        break
      }
    }
  })
}

const openMenu = (tag, e) => {
  console.log("openMenu:", tag, e)
  const menuMinWidth = 105
  const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy.$el.offsetWidth // container width
  console.log("offsetLeft:", offsetLeft, offsetWidth)
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const left = e.clientX - offsetLeft + 15 // 15: margin right
  if (left > maxLeft) {
    tagsMenu.left = maxLeft
  } else {
    tagsMenu.left = left
  }

  tagsMenu.top = e.clientY
  tagsMenu.visible = true
  tagsMenu.selectedTag = tag
}
const closeMenu = () => {
  tagsMenu.visible = false
}

const closeSelectedTag = (view) => {
  tagsView.actions.delView(view)
  if (isActive(view)) {
    console.log("isActive...", visitedViews)
    toLastView(visitedViews, view)
  }
}

const closeOthersTags = () => {
  router.push(tagsMenu.selectedTag)
  tagsView.actions.delOthersViews(tagsMenu.selectedTag)
  moveToCurrentTag()
}

const closeAllTags = (view) => {
  console.log("====>", tagsView.state.affixTags, view.path)
  tagsView.actions.delAllViews()
  // if (tagsView.state.affixTags.some(tag => tag.path === view.path)) {
  //   return
  // }
  toLastView(visitedViews, view)
}

const refreshSelectedTag = (view) => {
  // console.log("refreshSelectedTag", tagsView.state.cachedViews, tagsView.state.visitedViews)
  tagsView.actions.delCachedView(view)
  const { fullPath } = view
  proxy.$nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}


onMounted(() => {
  // console.log("onMounted")
  initTags()
  addTags()
})

watch(route, (val) => {
  console.log("route......", val)
  addTags()
  // moveToCurrentTag()
})

watch(() => tagsMenu.visible, (val) => {
  console.log("tagsMenu.visible", val)
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
</script>

<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link v-for="tag in visitedViews" ref="tagRef" :key="tag.path" :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)" @contextmenu.prevent.native="openMenu(tag, $event)">
        {{ tag.title }}
        <el-icon class="el-icon-close" v-if="!tag.meta.affix" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </div>
    <ul v-show="tagsMenu.visible" :style="{ left: tagsMenu.left + 'px', top: tagsMenu.top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(tagsMenu.selectedTag)">刷新</li>
      <li v-if="!(tagsMenu.selectedTag.meta && tagsMenu.selectedTag.meta.affix)"
        @click="closeSelectedTag(tagsMenu.selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(tagsMenu.selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 24px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 3px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}

.dark .tags-view-container {
  background: transparent;
  border-bottom-color: #363637 !important;

  .tags-view-wrapper {
    .tags-view-item {
      background-color: transparent;
      border-color: #333 !important;
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 18px;
      height: 18px;
      top: 1px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(.6);
        display: inline-block;
        // vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
