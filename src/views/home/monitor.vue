<script setup>
import { ref, onMounted } from 'vue'

import { target0, chart_monitor } from '@/utils/chart'
onMounted(() => {
    chart_monitor(false);
})
</script>
<template>
    <div class="dashboard-container">
        <div class="dashboard-editor-container">
            <div ref="target0" style="padding:10px;min-height:600px;height:calc(100vh - 284px)"></div>
        </div>
    </div>
</template>