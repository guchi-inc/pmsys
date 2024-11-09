import { defineStore } from 'pinia'
import { reactive } from 'vue';
export const tagsViewStore = defineStore('tagsView', () => {
    const state = reactive({
        visitedViews: [],
        cachedViews: []
    })

    const actions = {
        addVisitedView: (view) => {
            if (state.visitedViews.some(v => v.path === view.path)) return
            state.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || 'no-name'
                })
            )
        },
        addCachedView: (view) => {
            if (state.cachedViews.includes(view.name)) return
            if (!view.meta.noCache) {
                state.cachedViews.push(view.name)
            }
        },
        addView: (view) => {
            if (state.visitedViews.length > 8) {
                const index = state.cachedViews.indexOf(state.visitedViews[1].name)
                state.cachedViews.splice(index, 1)
                state.visitedViews.splice(1, 1)
                console.log("views: ", state.visitedViews, state.cachedViews)
            }
            actions.addVisitedView(view)
            actions.addCachedView(view)
        },
        delVisitedView: (view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
        },
        delCachedView: (view) => {
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews.splice(index, 1)
                    break
                }
            }
        },
        delView: (view) => {
            actions.delVisitedView(view)
            actions.delCachedView(view)
        },
        delOthersViews: (view) => {
            actions.delOthersCachedViews(view)
            actions.delOthersVisitedViews(view)
        },
        delOthersVisitedViews: (view) => {
            state.visitedViews = state.visitedViews.filter(v => {
                return v.meta.affix || v.path === view.path
            })
        },
        delOthersCachedViews: (view) => {
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews = state.cachedViews.slice(index, index + 1)
                    break
                }
            }
        },
        delAllViews: () => {
            actions.delAllVisitedViews()
            actions.delAllCachedViews()
        },
        delAllVisitedViews: () => {
            const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
            state.visitedViews = affixTags
        },
        delAllCachedViews: () => {
            state.cachedViews = []
        },
        updateVisitedView: (view) => {
            for (let v of state.visitedViews) {
                if (v.path === view.path) {
                    v = Object.assign(v, view)
                    break
                }
            }
        }
    }

    return {
        state,
        actions
    }
})