import __dep1 from '../../api/user';
import __dep2 from '../../api/auth';

const { getUserInfo } = __dep1;
const { logout } = __dep2;

export default {
    data: {
        userInfo: null,
        showAIReportEntry: false,
        roleMap: {
            admin: '管理员',
            store: '商户',
            property: '物业',
            user: '居民'
        }
    },

    onShow() {
        this.fetchUserInfo();
    },

    async fetchUserInfo() {
        const token = uni.getStorageSync('token');
        if (!token) {
            this.setData({
                userInfo: null,
                showAIReportEntry: false
            });
            return;
        }

        try {
            const res = await getUserInfo();
            const role = (res && res.role) || '';
            this.setData({
                userInfo: res || null,
                showAIReportEntry: role === 'admin' || role === 'property'
            });
        } catch (e) {
            console.error(e);
        }
    },

    handleLogout() {
        uni.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: async (res) => {
                if (!res.confirm) return;
                try {
                    await logout();
                } catch (e) {
                    // ignore
                }

                uni.removeStorageSync('token');
                this.setData({
                    userInfo: null,
                    showAIReportEntry: false
                });
                uni.reLaunch({ url: '/pages/auth/login' });
            }
        });
    },

    goToLogin() {
        uni.navigateTo({ url: '/pages/auth/login' });
    }
};
