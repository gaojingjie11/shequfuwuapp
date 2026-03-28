<template>
<view class="chat-page">
  <view class="chat-header card">
    <view class="chat-title">🤖 智慧社区助手</view>
    <view class="chat-desc">支持通知总结、报修创建、商品下单与支付。</view>
  </view>

  <view class="chat-card card">
    <scroll-view class="chat-history" scroll-y="true" :scroll-into-view="lastMessageId">
      <template v-for="(item, index) in messages" :key="index">
        <view :id="'msg-' + (index)" :class="'message-item ' + (item.role)">
          <view class="avatar">{{item.role === 'user' ? '我' : (item.role === 'assistant' ? 'AI' : '!')}}</view>
          <view class="content-wrap">
            <view class="bubble">{{item.content}}</view>
            <view class="time">{{item.time}}</view>
          </view>
        </view>
      </template>

      <view v-if="loading" class="message-item assistant">
        <view class="avatar">AI</view>
        <view class="content-wrap">
          <view class="bubble">正在思考中...</view>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <textarea
        class="input-box"
        :value="inputContent"
        placeholder="请输入你的问题..."
        maxlength="1000"
        auto-height
        @input="onInput"
      />
      <button class="btn btn-primary send-btn" @tap="handleSend" :loading="loading" :disabled="loading">发送</button>
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
.chat-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.chat-header {
  margin-bottom: 16rpx;
}

.chat-title {
  font-size: 36rpx;
  font-weight: 700;
}

.chat-desc {
  margin-top: 8rpx;
  color: #666;
  font-size: 24rpx;
}

.chat-card {
  padding: 0;
  overflow: hidden;
}

.chat-history {
  height: 900rpx;
  background: #fafafa;
  padding: 20rpx;
}

.message-item {
  display: flex;
  margin-bottom: 20rpx;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f4ff;
  color: #333;
  font-size: 20rpx;
}

.message-item.assistant .avatar {
  background: #ecfff3;
}

.message-item.system .avatar {
  background: #fff0f0;
}

.content-wrap {
  max-width: 72%;
  margin: 0 12rpx;
}

.bubble {
  padding: 16rpx;
  border-radius: 12rpx;
  background: #fff;
  border: 1rpx solid #eee;
  font-size: 28rpx;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.message-item.user .bubble {
  background: #00b894;
  color: #fff;
  border-color: #00b894;
}

.message-item.system .bubble {
  background: #fff0f0;
  color: #d93025;
  border-color: #ffd6d6;
}

.time {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #999;
}

.message-item.user .time {
  text-align: right;
}

.input-area {
  border-top: 1rpx solid #eee;
  padding: 16rpx 16rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
}

.input-box {
  width: 100%;
  min-height: 120rpx;
  max-height: 260rpx;
  border: 1rpx solid #e6e6e6;
  border-radius: 12rpx;
  padding: 14rpx;
  font-size: 28rpx;
  background: #fafafa;
}

.send-btn {
  margin-top: 14rpx;
}

</style>
