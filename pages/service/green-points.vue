<template>
  <view class="green-points-page page-shell">
    <view class="hero-card">
      <view class="hero-copy">
        <view class="hero-title">绿色积分中心</view>
        <view class="hero-desc">上传垃圾分类图片，识别后自动发放积分奖励，并参与社区积分排行。</view>
      </view>
      <view class="hero-stats">
        <view class="stat-card">
          <view class="stat-label">当前积分</view>
          <view class="stat-value">{{ safeUserInfo.green_points || 0 }}</view>
        </view>
        <view class="stat-card">
          <view class="stat-label">账户余额</view>
          <view class="stat-value">¥{{ safeUserInfo.balance || 0 }}</view>
        </view>
      </view>
    </view>

    <view class="card upload-card">
      <view class="section-head">
        <view class="section-title">上传分类图片</view>
        <view class="section-subtitle">支持相册选择和直接拍照</view>
      </view>

      <view v-if="imagePath" class="preview-wrap">
        <image class="preview-image" :src="imagePath" mode="aspectFit" />
      </view>
      <view v-else class="empty-preview">
        <text class="empty-preview-icon">图片</text>
        <text class="empty-preview-text">请选择垃圾分类图片或直接拍照</text>
      </view>

      <view class="btn-row">
        <button class="btn btn-secondary" @tap="chooseImage">选择图片</button>
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
        <view class="result-text">积分余额：{{ recognitionResult.green_points || safeUserInfo.green_points || 0 }}</view>
      </view>

      <view v-else-if="recognitionError" class="result-box result-box-error">
        <view class="result-title result-title-error">本次识别未完成</view>
        <view class="result-text result-text-error">{{ recognitionError }}</view>
        <view class="result-tip">建议重新拍摄清晰、完整的垃圾照片后再试。</view>
      </view>
    </view>

    <view class="card leaderboard-card">
      <view class="section-head">
        <view class="section-title">绿色积分排行榜</view>
        <view class="section-subtitle">看看社区里谁最环保</view>
      </view>

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
          <view class="rank-info">
            <view class="rank-name">{{ item.nickname || item.username || '匿名用户' }}</view>
            <view class="rank-note">绿色生活积极参与者</view>
          </view>
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
  padding: 24rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at right top, rgba(71, 113, 155, 0.14), transparent 30%),
    linear-gradient(180deg, #f8fbff 0%, #f4f7fb 42%, #f4f7fb 100%);
}

.hero-card {
  padding: 36rpx;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #2d597b 0%, #346c99 58%, #4b88b9 100%);
  color: #fff;
  box-shadow: 0 18rpx 42rpx rgba(28, 56, 84, 0.16);
}

.hero-title {
  font-size: 42rpx;
  font-weight: 700;
}

.hero-desc {
  margin-top: 14rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}

.hero-stats {
  display: flex;
  gap: 18rpx;
  margin-top: 28rpx;
}

.stat-card {
  flex: 1;
  padding: 20rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.74);
}

.stat-value {
  margin-top: 10rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.upload-card,
.leaderboard-card {
  margin-top: 24rpx;
}

.section-head {
  margin-bottom: 18rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.section-subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
}

.preview-wrap,
.empty-preview {
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.preview-wrap {
  background: #f3f7fb;
  border: 2rpx solid var(--border-color);
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
  border: 2rpx dashed #d5e1ee;
  background: linear-gradient(180deg, #f9fbfd 0%, #f3f7fb 100%);
}

.empty-preview-icon {
  font-size: 48rpx;
  color: var(--text-tertiary);
}

.empty-preview-text {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
}

.btn-row {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}

.btn-row .btn {
  flex: 1;
}

.result-box {
  margin-top: 22rpx;
  padding: 20rpx 22rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #eef5fc 0%, #f7fbff 100%);
  border: 2rpx solid #dbe7f4;
}

.result-box-error {
  background: linear-gradient(180deg, #fff5f4 0%, #fffaf9 100%);
  border-color: #f0d0cb;
}

.result-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--primary-color);
}

.result-title-error {
  color: #c45b52;
}

.result-text {
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: var(--text-secondary);
}

.result-text-error {
  color: #8f4a43;
}

.result-tip {
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #a26a62;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 2rpx solid #eef2f6;
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
  width: 72rpx;
  height: 72rpx;
  margin-right: 18rpx;
  border-radius: 50%;
  background: #edf2f7;
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-name {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.rank-note {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.rank-score {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--primary-color);
}

.loading,
.empty {
  padding: 32rpx 0 12rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--text-tertiary);
}
</style>
