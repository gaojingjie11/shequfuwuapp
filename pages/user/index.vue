<template>
<view class="user-page">
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
          <view :class="'stat-val status-' + (userInfo.status)">{{userInfo.status === 1 ? '正常' : '异常'}}</view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="unlogin-view" @tap="goToLogin">
        <image class="avatar" src="/assets/icons/user.png"></image>
        <view class="login-text">点击登录/注册</view>
      </view>
    </template>
  </view>

  <view class="menu-grid">
    <navigator url="/pages/order/list" class="menu-item card">
      <view class="menu-icon">📝</view>
      <view>我的订单</view>
    </navigator>

    <navigator url="/pages/user/favorites" class="menu-item card">
      <view class="menu-icon">❤️</view>
      <view>我的收藏</view>
    </navigator>

    <navigator url="/pages/service/index" open-type="switchTab" class="menu-item card">
      <view class="menu-icon">🛠️</view>
      <view>社区服务</view>
    </navigator>

    <navigator v-if="showAIReportEntry" url="/pages/admin/ai-report/index" class="menu-item card">
      <view class="menu-icon">📊</view>
      <view>AI报表</view>
    </navigator>

    <view class="menu-item card" @tap="handleLogout" v-if="userInfo">
      <view class="menu-icon">🚪</view>
      <view>退出登录</view>
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
/* pages/user/index.wxss */
.user-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.user-header {
  background: #fff;
  padding: 48rpx;
  border-radius: 24rpx;
  margin-bottom: 48rpx;
}

.user-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 48rpx;
}

.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  margin-right: 32rpx;
  background: #eee;
}

.info-col {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.name {
  font-size: 40rpx;
  font-weight: 600;
  margin-right: 16rpx;
  color: #333;
}

.role-tag {
  font-size: 20rpx;
  border: 2rpx solid #00b894;
  color: #00b894;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.mobile {
  font-size: 28rpx;
  color: #999;
}

.stats-row {
  display: flex;
  border-top: 2rpx solid #f0f0f0;
  padding-top: 40rpx;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.stat-val {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.unlogin-view {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.login-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
}

.menu-item {
  background: #fff;
  padding: 48rpx;
  border-radius: 24rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  font-size: 64rpx;
  margin-bottom: 24rpx;
}

</style>
