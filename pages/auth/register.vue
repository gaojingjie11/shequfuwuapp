<template>
<view class="login-page page-shell">
  <view class="login-hero">
    <view class="hero-title">创建账户</view>
    <view class="hero-subtitle">加入智享生活，开启便捷社区服务</view>
  </view>

  <view class="login-container">
    <view class="card login-card">
      <view class="login-title">注册新账号</view>
      <view class="login-subtitle">填写基本信息即可完成注册</view>

      <view class="login-form">
        <view class="form-group">
          <text class="label">手机号</text>
          <input class="input" type="number" placeholder="请输入手机号" @input="onInput" data-field="mobile" :value="mobile" />
        </view>

        <view class="form-group">
          <text class="label">真实姓名</text>
          <input class="input" type="text" placeholder="请输入真实姓名" @input="onInput" data-field="real_name" :value="real_name" />
        </view>

        <view class="form-group">
          <text class="label">登录密码</text>
          <input class="input" type="password" placeholder="请输入至少 6 位密码" @input="onInput" data-field="password" :value="password" maxlength="20" />
        </view>

        <view class="form-footer">
          <text class="link" @tap="goToLogin">已有账号？返回登录</text>
        </view>

        <button class="btn btn-primary btn-lg login-btn" @tap="handleRegister" :loading="loading">注册</button>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './register.page.js';

export default createPage(pageDef);
</script>

<style>
@import "./login.wxss";
</style>
