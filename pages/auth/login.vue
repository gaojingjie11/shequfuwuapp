<template>
<view class="login-page">
  <view class="login-container">
    <view class="card login-card">
      <view class="login-title">欢迎回来</view>
      <view class="login-subtitle">登录智慧社区</view>

      <view class="tabs">
        <view :class="'tab-item ' + (loginType === 'password' ? 'active' : '')" @tap="switchTab" data-type="password">密码登录</view>
        <view :class="'tab-item ' + (loginType === 'code' ? 'active' : '')" @tap="switchTab" data-type="code">验证码登录</view>
      </view>

      <view class="login-form">
        <template v-if="loginType === 'password'">
          <view class="form-group">
            <text class="label">手机号/用户名</text>
            <input class="input" type="text" placeholder="请输入手机号/用户名" @input="onInput" data-field="mobile" :value="mobile" />
          </view>
          <view class="form-group">
            <text class="label">密码</text>
            <input class="input" type="password" placeholder="请输入密码" @input="onInput" data-field="password" :value="password" />
          </view>
        </template>

        <template v-else>
           <view class="form-item" v-if="loginType === 'code'">
      <view class="input-wrap">
        <text class="label">手机号</text>
        <input class="input" type="number" placeholder="请输入手机号" placeholder-class="placeholder" @input="onInput" data-field="mobile" :value="mobile" />
      </view>
      <view class="input-wrap">
        <text class="label">验证码</text>
        <input class="input" type="number" placeholder="请输入验证码" placeholder-class="placeholder" @input="onInput" data-field="code" :value="code" />
        <view :class="'code-btn ' + (timer > 0 ? 'disabled' : '')" @tap="sendCode">
          {{timer > 0 ? timer + 's' : '获取验证码'}}
        </view>
      </view>
    </view>
        </template>
        
        <view class="form-footer">
          <text class="link" @tap="goToRegister">还没有账号？注册</text>
        </view>

        <button class="btn btn-primary btn-lg mt-md" @tap="handleLogin" :loading="loading">登录</button>
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
/* pages/auth/login.wxss */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #55efc4 0%, #74b9ff 100%);
  padding: 40rpx;
}

.login-container {
  width: 100%;
}

.code-btn {
  font-size: 28rpx;
  color: #fff;
  background: #07c160;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  white-space: nowrap;
  min-width: 160rpx;
  text-align: center;
}

.code-btn.disabled {
  background: #ccc;
  color: #999;
}

.login-title {
  font-size: 48rpx;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16rpx;
  color: #2d3436;
}

.login-subtitle {
  text-align: center;
  color: #636e72;
  margin-bottom: 64rpx;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  border-bottom: 2rpx solid #eee;
  margin-bottom: 40rpx;
}

.tab-item {
  padding: 20rpx 40rpx;
  color: #666;
  border-bottom: 4rpx solid transparent;
  font-size: 30rpx;
}

.tab-item.active {
  color: #00b894;
  border-bottom-color: #00b894;
  font-weight: bold;
}

.form-group {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #2d3436;
  margin-bottom: 16rpx;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

.link {
  color: #00b894;
  font-size: 28rpx;
}

</style>
