<template>
  <view class="green-points-page">
    <view class="hero card">
      <view class="hero-title">绿色积分中心</view>
      <view class="hero-desc">上传垃圾分类图片，识别后自动发放积分奖励。</view>
      <view class="hero-stats">
        <view class="stat">
          <view class="stat-label">当前积分</view>
          <view class="stat-value">{{ safeUserInfo.green_points || 0 }}</view>
        </view>
        <view class="stat">
          <view class="stat-label">账户余额</view>
          <view class="stat-value">¥{{ safeUserInfo.balance || 0 }}</view>
        </view>
      </view>
    </view>

    <view class="upload-card card">
      <view class="section-title">上传垃圾分类图片</view>
      <view v-if="imagePath" class="preview-wrap">
        <image class="preview-image" :src="imagePath" mode="aspectFit" />
      </view>
      <view v-else class="empty-preview">
        <text class="empty-preview-icon">📷</text>
        <text class="empty-preview-text">请选择相册图片或直接拍照</text>
      </view>

      <view class="btn-row">
        <button class="btn btn-light" @tap="chooseImage">选择图片</button>
        <button
          class="btn btn-primary"
          @tap="submitImage"
          :loading="uploading"
          :disabled="!imagePath || uploading"
        >
          识别并领取积分
        </button>
      </view>

      <view v-if="recognitionResult" class="result-box">
        <view class="result-title">本次奖励 {{ recognitionResult.points || 0 }} 积分</view>
        <view class="result-text">{{ recognitionResult.reason || '识别完成' }}</view>
        <view class="result-text">
          积分余额：{{ recognitionResult.green_points || safeUserInfo.green_points || 0 }}
        </view>
      </view>
    </view>

    <view class="leaderboard-card card">
      <view class="section-title">绿色积分排行榜</view>
      <view v-if="loadingLeaderboard" class="loading">加载中...</view>
      <template v-else-if="leaderboard.length > 0">
        <view
          v-for="(item, index) in leaderboard"
          :key="item.id || index"
          class="rank-item"
        >
          <view class="rank-no">#{{ item.rank || index + 1 }}</view>
          <image
            class="rank-avatar"
            :src="item.avatar || '/assets/icons/user.png'"
            mode="aspectFill"
          />
          <view class="rank-name">{{ item.nickname || item.username || '匿名用户' }}</view>
          <view class="rank-score">{{ item.points || 0 }} 分</view>
        </view>
      </template>
      <view v-else class="empty">暂无排行榜数据</view>
    </view>
  </view>
</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './green-points.page.js';

export default createPage({
  ...pageDef,
  computed: {
    safeUserInfo() {
      return this.userInfo || {};
    }
  }
});
</script>

<style>
.green-points-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(42, 157, 143, 0.12), transparent 28%),
    linear-gradient(180deg, #f3f8f6 0%, #f7f8fa 28%, #f7f8fa 100%);
  padding: 24rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.hero,
.upload-card,
.leaderboard-card {
  border-radius: 28rpx;
}

.hero {
  background: linear-gradient(135deg, #10b981 0%, #0ea5a3 55%, #2f80ed 100%);
  color: #ffffff;
  overflow: hidden;
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  right: -80rpx;
  top: -40rpx;
  width: 260rpx;
  height: 260rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.hero-title {
  position: relative;
  z-index: 1;
  font-size: 42rpx;
  font-weight: 700;
}

.hero-desc {
  position: relative;
  z-index: 1;
  margin-top: 12rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
}

.hero-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 18rpx;
  margin-top: 28rpx;
}

.stat {
  flex: 1;
  padding: 18rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
}

.stat-value {
  margin-top: 10rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.upload-card,
.leaderboard-card {
  margin-top: 24rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.06);
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #18222f;
}

.preview-wrap,
.empty-preview {
  margin-top: 18rpx;
  width: 100%;
  height: 340rpx;
  border-radius: 22rpx;
  overflow: hidden;
}

.preview-wrap {
  background: #f4f7f9;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed #d8e1e8;
  background: linear-gradient(180deg, #f9fbfc 0%, #f4f7f9 100%);
}

.empty-preview-icon {
  font-size: 56rpx;
}

.empty-preview-text {
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #7b8794;
}

.btn-row {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.btn-row .btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  border: none;
}

.btn-light {
  color: #157f68;
  background: #ecfdf5;
}

.btn-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #10b981 0%, #0ea5a3 100%);
}

.result-box {
  margin-top: 22rpx;
  padding: 18rpx 20rpx;
  border-radius: 20rpx;
  background: linear-gradient(180deg, #f0fdf4 0%, #ecfeff 100%);
  border: 1rpx solid #b7f0d2;
}

.result-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #157f68;
}

.result-text {
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #51606f;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eef2f6;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-no {
  width: 84rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #94a3b8;
}

.rank-avatar {
  width: 64rpx;
  height: 64rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: #edf2f7;
}

.rank-name {
  flex: 1;
  font-size: 27rpx;
  color: #1f2937;
}

.rank-score {
  font-size: 26rpx;
  font-weight: 700;
  color: #0f9f77;
}

.loading,
.empty {
  padding: 28rpx 0 12rpx;
  text-align: center;
  font-size: 24rpx;
  color: #94a3b8;
}
</style>
