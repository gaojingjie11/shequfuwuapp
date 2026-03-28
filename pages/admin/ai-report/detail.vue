<template>
<view class="page">
  <view v-if="loading" class="state-tip">加载中...</view>

  <view v-if="!loading && report" class="content">
    <view class="meta card">
      <view class="meta-row"><text class="label">生成时间：</text><text>{{report.created_at_text}}</text></view>
      <view class="meta-row"><text class="label">新增报修：</text><text>{{report.repair_new_count || 0}}</text></view>
      <view class="meta-row"><text class="label">未处理报修：</text><text>{{report.repair_pending_count || 0}}</text></view>
      <view class="meta-row"><text class="label">新增访客：</text><text>{{report.visitor_new_count || 0}}</text></view>
      <view class="meta-row"><text class="label">物业收缴：</text><text>￥{{report.property_paid_amount_text}}</text></view>
    </view>

    <view class="report-body card">
      <view class="section-title">AI 报告正文</view>
      <rich-text class="report-rich" :nodes="reportHtml"></rich-text>
      <view v-if="!reportHtml && reportText" class="fallback-wrap">
        <text class="report-text">{{reportText}}</text>
      </view>
    </view>
  </view>

  <view v-if="!loading && !report" class="state-tip">未找到报表</view>
</view>

</template>

<script>
import { createPage } from '@/common/page-compat.js';
import pageDef from './detail.page.js';

export default createPage(pageDef);
</script>

<style>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.meta {
  margin-bottom: 24rpx;
}

.meta-row {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 2rpx solid #f1f1f1;
  font-size: 28rpx;
}

.meta-row:last-child {
  border-bottom: none;
}

.label {
  width: 192rpx;
  color: #666;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.report-rich {
  display: block;
}

.fallback-wrap {
  margin-top: 20rpx;
}

.report-text {
  color: #333;
  font-size: 28rpx;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
}

.state-tip {
  text-align: center;
  color: #999;
  font-size: 26rpx;
  padding: 40rpx 0;
}

</style>
