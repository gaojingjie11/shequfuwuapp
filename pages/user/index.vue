<template>
<view class="user-page page-shell">
  <view class="profile-hero">
    <view class="container">
      <view class="profile-title">个人中心</view>
      <view class="profile-subtitle">账户信息与常用功能</view>
    </view>
  </view>

  <view class="container profile-main">
    <view class="user-header card">
      <template v-if="userInfo">
        <view class="user-info-row">
          <image class="avatar" :src="userInfo.avatar || '/assets/icons/user.png'" mode="aspectFill"></image>
          <view class="info-col">
            <view class="name-row">
              <text class="name">{{userInfo.real_name || userInfo.username}}</text>
              <view class="role-tag">{{roleMap[userInfo.role] || '居民'}}</view>
            </view>
            <text class="mobile">{{userInfo.mobile}}</text>
          </view>
        </view>

        <view class="stats-row">
          <view class="stat-item">
            <view class="stat-label">余额</view>
            <view class="stat-val">￥{{userInfo.balance || 0}}</view>
          </view>
          <view class="stat-item">
            <view class="stat-label">绿色积分</view>
            <view class="stat-val">{{userInfo.green_points || 0}}</view>
          </view>
          <view class="stat-item">
            <view class="stat-label">状态</view>
            <view class="stat-val">{{userInfo.status === 1 ? '正常' : '异常'}}</view>
          </view>
        </view>
      </template>

      <template v-else>
        <view class="unlogin-view" @tap="goToLogin">
          <image class="avatar" src="/assets/icons/user.png"></image>
          <view class="login-text">点击登录 / 注册</view>
        </view>
      </template>
    </view>

    <view class="menu-grid">
      <navigator url="/pages/order/list" class="menu-item card">
        <view class="menu-icon">🛍</view>
        <view class="menu-title">我的订单</view>
      </navigator>

      <navigator url="/pages/user/favorites" class="menu-item card">
        <view class="menu-icon">⭐</view>
        <view class="menu-title">我的收藏</view>
      </navigator>

      <navigator url="/pages/service/index" open-type="switchTab" class="menu-item card">
        <view class="menu-icon">🧭</view>
        <view class="menu-title">社区服务</view>
      </navigator>

      <navigator v-if="userInfo" url="/pages/user/face-register" class="menu-item card">
        <view class="menu-icon">📷</view>
        <view class="menu-title">人脸录入</view>
        <view :class="'face-status ' + (userInfo.face_registered ? 'is-registered' : 'is-unregistered')">
          {{userInfo.face_registered ? '已录入' : '未录入'}}
        </view>
      </navigator>

      <navigator v-if="showAIReportEntry" url="/pages/admin/ai-report/index" class="menu-item card">
        <view class="menu-icon">📊</view>
        <view class="menu-title">AI 报表</view>
      </navigator>

      <view v-if="userInfo" class="menu-item card" @tap="handleLogout">
        <view class="menu-icon">🚪</view>
        <view class="menu-title">退出登录</view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './index.page.js';

export default createPage(pageDef);
</script>

<style>
.user-page {
  min-height: 100vh;
  padding-bottom: 44rpx;
}

.profile-hero {
  background: linear-gradient(135deg, #2d597b 0%, #376f9f 68%, #4c87b8 100%);
  color: #fff;
  padding: 56rpx 0 40rpx;
}

.profile-title {
  font-size: 48rpx;
  font-weight: 700;
}

.profile-subtitle {
  margin-top: 12rpx;
  font-size: 26rpx;
  opacity: 0.92;
}

.profile-main {
  margin-top: 20rpx;
}

.user-header {
  padding: 36rpx;
}

.user-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}

.avatar {
  width: 136rpx;
  height: 136rpx;
  border-radius: 50%;
  margin-right: 28rpx;
  background: #e8eef5;
  border: 4rpx solid #eef3f8;
}

.info-col {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.name {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.role-tag {
  font-size: 22rpx;
  color: var(--primary-color);
  background: var(--primary-soft);
  border-radius: 999rpx;
  padding: 4rpx 16rpx;
}

.mobile {
  margin-top: 12rpx;
  display: block;
  font-size: 26rpx;
  color: var(--text-secondary);
}

.stats-row {
  display: flex;
  padding-top: 28rpx;
  border-top: 2rpx solid var(--border-color);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.stat-val {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.unlogin-view {
  display: flex;
  align-items: center;
  padding: 8rpx 0;
}

.login-text {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.menu-item {
  margin-bottom: 0;
  text-align: center;
  padding: 36rpx 24rpx;
  min-height: 232rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.menu-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.face-status {
  margin-top: 16rpx;
  font-size: 22rpx;
  padding: 4rpx 18rpx;
  border-radius: 999rpx;
}

.face-status.is-registered {
  color: #0f7a58;
  background: #e8f8f1;
}

.face-status.is-unregistered {
  color: #a36a00;
  background: #fff7e7;
}
</style>
