<script setup>
import { ref, onMounted } from 'vue'

import { target1, target2, target3, chart_monitor, indexNumberArr } from '@/utils/chart'
import { $success, $error } from '@/utils/message'
import floating from './floating.vue'
import { userStore } from '@/store/user'
const user = userStore()
const loading = ref(false);
onMounted(() => {
    chart_monitor(true);
})
function logout() {
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
</script>
<template>
    <div class="dashboard-container">
        <div class="dashboard-editor-container">
            <el-row :gutter="20" v-for="(item, index) in indexNumberArr" :key="index">
                <el-col :span="4" v-for="(jtem, jndex) in item" :key="jndex" class="text-center">
                    <div class="grid-content p-8" :class="[
                        jtem.range === 0 && jtem.type === 1 ? 'guid-home-day' : '',
                        jtem.range === 365 && jtem.type === 1 ? 'guid-home-year' : ''
                    ]">
                        <div class="text-xl">
                            <!-- <textTip :content="jtem.title || '--'" from="1" :pattern="true"></textTip> -->
                            <!-- <i :class="'el-icon-info'"></i> -->
                            {{ jtem.title || '--' }}
                        </div>
                        <div class="text-3xl mt-5">￥{{ jtem.count || 0 }}</div>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content-2">
                        <div class="text-2xl pb-2">线性图</div>
                        <div ref="target1" style="height: 300px"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content-2">
                        <div class="text-2xl pb-2">柱状图</div>
                        <div ref="target2" style="height: 300px"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content-2">
                        <div class="text-2xl pb-2">饼图</div>
                        <div ref="target3" style="height: 300px"></div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- <floating style="position: fixed; width: 32px; height: 32px; right: 20px; top: 93%"></floating> -->
    </div>
    <div id="el-main-footer" class="row-bg">
        <el-row>
            <el-col :span="3" class="text-center border-r">
                <el-button link type="primary">权限：V1管理员</el-button>
            </el-col>
            <el-col :span="3" class="text-center border-r">
                <el-button link type="success">用户：{{ user.name }}</el-button>
            </el-col>
            <el-col :span="3" class="text-center border-r">
                <el-tooltip class="item" effect="dark" content="退出登录，更换账户" placement="bottom-start">
                    <el-button link type="warning" @click="logout">更换账户</el-button>
                </el-tooltip>
            </el-col>
            <el-col :span="3" :offset="4" class="text-center border-r">
            </el-col>
            <el-col :span="3" class="text-center border-r relative">
                <el-button link style="cursor: pointer">联系管理员</el-button>
                <floating style="position: absolute; width: 32px; height: 32px; right: 10px; top: 0"></floating>
            </el-col>
            <el-col :span="5" class="text-right">©2021-2030 管理平台V1.0</el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/mixin.scss';

.dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    // @apply rounded-xl;
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    @apply bg-white;
    border-radius: 4px;
    min-width: 170px;
    min-height: 100px;

    // display: flex;
    // align-self: center;
    .flex {
        // @include flex(space-between, center);
    }

    &-2 {
        @apply bg-white p-5;
        border-radius: 4px;
        // height: 280px;
    }

    &-3 {
        height: 90px;

        .el-col:first-child & {
            // @include flex(flex-start, center);
        }

        .el-col:last-child & {
            // @include flex(flex-end, center);
        }
    }
}

.row-bg {
    // padding: 10px 0 !important;
    background-color: #f9fafc !important;
}

.dark {
    .dashboard-editor-container {
        background-color: transparent; //#303133;
    }

    .grid-content,
    .grid-content-2 {
        background-color: #363637;
    }

    .row-bg {
        background-color: #303133 !important;
        border-top-color: #363637 !important;
        box-shadow: 0 1px 0 0 #999 inset !important;
    }
}

.hideSidebar {
    #el-main-footer {
        .el-row {
            width: calc(100% - 54px);
        }
    }
}
</style>