<template>
<view class="login-page page-shell">
  <view class="login-hero">
    <view class="hero-title">智享生活</view>
    <view class="hero-subtitle">连接社区服务、邻里互动与便捷生活</view>
  </view>

  <view class="login-container">
    <view class="card login-card">
      <view class="login-title">欢迎登录</view>
      <view class="login-subtitle">选择登录方式进入社区应用</view>

      <view class="tabs">
        <view :class="'tab-item ' + (loginType === 'password' ? 'active' : '')" @tap="switchTab" data-type="password">密码登录</view>
        <view :class="'tab-item ' + (loginType === 'code' ? 'active' : '')" @tap="switchTab" data-type="code">验证码登录</view>
      </view>

      <view class="login-form">
        <template v-if="loginType === 'password'">
          <view class="form-group">
            <text class="label">手机号 / 用户名</text>
            <input class="input" type="text" placeholder="请输入手机号或用户名" @input="onInput" data-field="mobile" :value="mobile" />
          </view>
          <view class="form-group">
            <text class="label">密码</text>
            <input class="input" type="password" placeholder="请输入密码" @input="onInput" data-field="password" :value="password" />
          </view>
        </template>

        <template v-else>
          <view class="form-group">
            <text class="label">手机号</text>
            <input class="input" type="number" placeholder="请输入手机号" @input="onInput" data-field="mobile" :value="mobile" />
          </view>
          <view class="form-group">
            <text class="label">验证码</text>
            <view class="code-row">
              <input class="input code-input" type="number" placeholder="请输入验证码" @input="onInput" data-field="code" :value="code" />
              <view :class="'code-btn ' + (timer > 0 ? 'disabled' : '')" @tap="sendCode">
                {{timer > 0 ? timer + 's' : '获取验证码'}}
              </view>
            </view>
          </view>
        </template>

        <view class="form-footer">
          <text class="link" @tap="goToRegister">还没有账号？立即注册</text>
        </view>

        <button class="btn btn-primary btn-lg login-btn" @tap="handleLogin" :loading="loading">登录</button>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './login.page.js';

export default createPage(pageDef);
</script>

<style>
@import "./login.wxss";
</style>
