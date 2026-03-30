<template>
<view class="face-register-page page-shell">
  <view class="card status-card" v-if="userInfo">
    <view class="title-row">
      <text class="title">当前人脸状态</text>
      <view :class="'status-tag ' + (userInfo.face_registered ? 'is-registered' : 'is-unregistered')">
        {{userInfo.face_registered ? '已录入' : '未录入'}}
      </view>
    </view>
    <view class="desc">
      录入后可在订单支付、物业缴费时选择刷脸支付。
    </view>
  </view>

  <view class="card action-card">
    <button class="capture-btn btn btn-primary" :loading="registering" :disabled="registering" @tap="handleRegisterFace">
      {{registering ? '录入中...' : (userInfo && userInfo.face_registered ? '重新录入人脸' : '立即录入人脸')}}
    </button>
    <view class="tip">请在光线充足环境下正对镜头拍照。</view>
  </view>
</view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './face-register.page.js';

export default createPage(pageDef);
</script>

<style>
.face-register-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 24rpx;
}

.status-card,
.action-card {
  margin-bottom: 24rpx;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.status-tag {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
}

.status-tag.is-registered {
  color: #1f9d72;
  background: #e9f8f2;
}

.status-tag.is-unregistered {
  color: #a36a00;
  background: #fff8e8;
}

.desc {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
}

.capture-btn {
  width: 100%;
}

.tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: var(--text-tertiary);
  text-align: center;
}
</style>
