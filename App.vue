<script>
export default {
  onLaunch() {
    const logs = uni.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    uni.setStorageSync('logs', logs);
  },
  globalData: {
    userInfo: null
  }
};
</script>

<style>
page {
  --primary-color: #2d597b;
  --primary-light: #47719b;
  --primary-dark: #224560;
  --primary-soft: #edf4fb;

  --secondary-color: #276193;
  --secondary-light: #e8f1fb;

  --success-color: #1f9d72;
  --warning-color: #d08700;
  --danger-color: #d94848;
  --info-color: #2f80ed;

  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --text-tertiary: #9ca3af;
  --text-white: #ffffff;

  --bg-page: #f4f7fb;
  --bg-card: #ffffff;
  --bg-muted: #eef3f8;

  --border-color: #e3eaf2;
  --border-strong: #d1dbe7;

  --radius-xs: 16rpx;
  --radius-sm: 24rpx;
  --radius-md: 32rpx;
  --radius-lg: 40rpx;

  --space-xs: 12rpx;
  --space-sm: 20rpx;
  --space-md: 32rpx;
  --space-lg: 44rpx;
  --space-xl: 60rpx;

  --shadow-soft: 0 8rpx 28rpx rgba(28, 56, 84, 0.08);
  --shadow-hover: 0 18rpx 42rpx rgba(28, 56, 84, 0.12);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: var(--text-primary);
  background: var(--bg-page);
  line-height: 1.6;
  padding-bottom: env(safe-area-inset-bottom);
}

view,
text,
image,
navigator,
input,
button,
textarea,
scroll-view {
  box-sizing: border-box;
}

.page-shell {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f7fb 40%, #f4f7fb 100%);
}

.container {
  box-sizing: border-box;
  width: 100%;
  padding: 0 var(--space-md);
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 2rpx solid var(--border-color);
  box-shadow: var(--shadow-soft);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.badge-primary {
  color: var(--primary-color);
  background: var(--primary-soft);
}

.badge-success {
  color: var(--success-color);
  background: #e9f8f2;
}

.badge-warning {
  color: var(--warning-color);
  background: #fff8e8;
}

.badge-danger {
  color: var(--danger-color);
  background: #ffefef;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  min-height: 84rpx;
  padding: 0 32rpx;
  border-radius: var(--radius-sm);
  font-size: 28rpx;
  font-weight: 600;
  border: 2rpx solid transparent;
}

.btn::after {
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  color: var(--text-white);
}

.btn-secondary {
  background: #eef3f8;
  color: var(--primary-color);
  border-color: #d6e1ec;
}

.btn-danger {
  background: #fff1f1;
  color: var(--danger-color);
  border-color: #ffd8d8;
}

.btn-lg {
  width: 100%;
}

.input {
  width: 100%;
  min-height: 88rpx;
  padding: 20rpx 24rpx;
  border: 2rpx solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: #f9fbfd;
  font-size: 28rpx;
  color: var(--text-primary);
}

.title-1 {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.title-2 {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.text-subtle {
  color: var(--text-secondary);
}

.text-muted {
  color: var(--text-tertiary);
}

.safe-bottom {
  padding-bottom: calc(env(safe-area-inset-bottom) + 12rpx);
}
</style>
