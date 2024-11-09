<script setup>
import { ref } from 'vue'
import { $success, $error } from '@/utils/message'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { configStore } from '@/store/config'
import XXTEA from '@/utils/xxtea.js'
// configStore().getConfig()
import bg_light from '@/assets/bg_light.jpg'
import bg_dark from '@/assets/bg_dark.png'
const user = userStore()
const router = useRouter();
const confStore = configStore()
const redirect = router.currentRoute.value.query.redirect || "/";
user.clear()
const loginForm = ref({
    login_name: '',
    password: '',
    remember: false
})

// 处理记住密码
if (confStore.remember !== "") {
    const remember = XXTEA.decryptFromBase64(confStore.remember, confStore.key)
    console.log('remember :', remember)
    const json = JSON.parse(remember)
    loginForm.value = json
}

const loginFormRef = ref()
const loginForm_rulesList = ref({
    login_name: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    }],
    password: [{
        required: true,
        message: '请输入密码',
        trigger: 'blur'
    }]
})
const pwdRef = ref()
function nextFocus(event, form) {
    console.log('form', form)
    if (event.keyCode === 13) {
        form.focus()
    }
}

const loading = ref(false)
function handleLogin() {
    loginFormRef.value.validate((valid) => {
        if (valid) {
            loading.value = true

            user.login(loginForm.value).then(res => {
                if (res.code === 100000) {
                    $success(res.message)
                    console.log('router = ', router.getRoutes())
                    router.push(redirect)
                } else {
                    console.log('res = ', res)
                    $error({ message: res.message })
                }
            }).catch(err => {
                console.log('errerr = ', err)
                $error(err)
            }).finally(() => {
                loading.value = false
            })
        } else {
            return false
        }
    })
}
// console.log('host-url :', import.meta.env.VITE_SERVER_LOGIN)
const bg = confStore.isDark() ? bg_dark : bg_light
document.title = confStore.name
if (confStore.isDark()) { const html = document.querySelector('html'); html.className = 'dark' }
</script>
<template>
    <div class="login-container" :style="{ backgroundImage: `url(${bg})` }">
        <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="loginForm_rulesList">
            <div class="title-container">
                <h3 class="title text-center text-3xl font-bold m-8">{{ configStore().name }}</h3>
            </div>

            <el-form-item prop="login_name">
                <el-input size="large" placeholder="请输入用户名" name="login_name" type="text" v-model="loginForm.login_name"
                    clearable @keyup.native.enter="nextFocus($event, pwdRef)" />
            </el-form-item>

            <el-form-item prop="password">
                <el-input size="large" ref="pwdRef" placeholder="请输入密码" name="password" v-model="loginForm.password"
                    clearable show-password @keyup.native.enter="handleLogin" />
            </el-form-item>
            <el-checkbox v-model="loginForm.remember" style="color: #fff">记住密码</el-checkbox>
            <el-button size="large" type="primary" style="width: 100%; margin: 10px 0" :loading="loading"
                @click="handleLogin">登 录</el-button>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
$bg: #fff; //#45556d;
$dark_gray: #8897a1;
$light_gray: #e0dede;
$cursor: #fff;

.login-container {
    height: 100vh;
    min-height: 100%;
    width: 100%;
    // background-color: $bg;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;

        :deep(.el-form-item) {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        :v-deep(.el-input) {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;
            }
        }
    }

    :deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
        color: $cursor;
    }
}
</style>