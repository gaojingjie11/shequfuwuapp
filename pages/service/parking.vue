<template>
<view class="container">
  <view class="header-card card">
    <view class="title">我的车位</view>
    <view :class="'status-badge ' + (parkingList.length > 0 ? 'status-has' : 'status-none')">
      {{parkingList.length > 0 ? '已分配 ' + parkingList.length + ' 个' : '未分配'}}
    </view>
  </view>

  <template v-if="parkingList.length > 0">
    <template v-for="(item, index) in parkingList" :key="item.id">
        <view class="info-card card">
        <view class="info-item">
            <text class="label">车位编号</text>
            <text class="value">{{item.parking_no || '未知编号'}}</text>
        </view>
        <view class="info-item">
            <text class="label">区域位置</text>
            <text class="value">{{item.location || '地面车位'}}</text>
        </view>
        <view class="info-item">
            <text class="label">绑定车辆</text>
            <text class="value">{{item.car_plate || '暂无'}}</text>
        </view>
        <!-- Always show bind/modify button -->
         <view class="footer-btn">
            <button class="bind-btn" type="primary" size="mini" @tap="showBindModal" :data-id="item.id">{{item.car_plate ? '修改绑定' : '绑定车辆'}}</button>
        </view>
        </view>
    </template>
  </template>

  <template v-else>
    <view class="empty-state">
      <image src="/assets/icons/service.png" mode="widthFix" class="empty-icon"></image>
      <view class="empty-text">您名下暂无车位信息</view>
      <view class="empty-sub">请联系物业管理处办理车位租赁/购买</view>
    </view>
  </template>
</view>

<template v-if="showModal">
  <view class="modal-mask" @tap="closeModal"></view>
  <view class="modal-content">
    <view class="modal-title">绑定车辆</view>
    <input class="modal-input" placeholder="请输入车牌号 (如: 京A88888)" @input="onInput" :value="plate_number" :focus="showModal" />
    <view class="modal-footer">
      <button class="btn-cancel" @tap="closeModal">取消</button>
      <button class="btn-confirm" @tap="handleBindConfirm">确定</button>
    </view>
  </view>
</template>

</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './parking.page.js';

export default createPage(pageDef);
</script>

<style>
.container {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.status-badge {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.status-has {
  background: #e1f3d8;
  color: #67c23a;
}

.status-none {
  background: #f4f4f5;
  color: #909399;
}

.info-card {
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.bind-section {
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.input {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.bind-btn {
  width: 100%;
}

.footer-btn {
  text-align: right;
  border-top: 1rpx solid #f5f5f5;
  padding-top: 20rpx;
  margin-top: 10rpx;
}

.empty-state {
  text-align: center;
  padding-top: 100rpx;
}

.empty-icon {
  width: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.empty-sub {
  font-size: 24rpx;
  color: #999;
}

/* Modal Styles */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 100;
  backdrop-filter: blur(4rpx);
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  z-index: 101;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.15);
}

.modal-title {
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  color: #333;
}

.modal-input {
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 24rpx; /* Horizontal padding only */
  margin-bottom: 40rpx;
  background: #f9f9f9;
  font-size: 30rpx;
  color: #333;
  height: 88rpx; /* Explicit height */
  line-height: 88rpx; /* Center vertically */
  box-sizing: border-box; /* Ensure padding doesn't affect total height */
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  font-size: 30rpx;
  padding: 20rpx 0;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: #07c160;
  color: #fff;
}

</style>
