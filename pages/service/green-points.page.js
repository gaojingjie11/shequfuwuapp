import __dep1 from '../../api/greenPoints';
import __dep2 from '../../api/user';
import __dep3 from '../../utils/media';

const { uploadGarbageImage, getGreenPointsLeaderboard, normalizeGreenPointsUploadError } = __dep1;
const { getUserInfo } = __dep2;
const { chooseSingleImage, isPermissionDeniedError, isUserCancelError } = __dep3;

function getRecognitionErrorMessage(error) {
    if (error && error.userMessage) {
        return error.userMessage;
    }

    return normalizeGreenPointsUploadError(
        error && (error.rawMessage || error.message || error.errMsg),
        '识别失败，请稍后重试'
    );
}

export default {
    data: {
        userInfo: {},
        imagePath: '',
        uploading: false,
        leaderboard: [],
        loadingLeaderboard: false,
        recognitionResult: null,
        recognitionError: ''
    },

    onShow() {
        this.loadPageData();
    },

    async loadPageData() {
        await Promise.all([this.loadUserInfo(), this.loadLeaderboard()]);
    },

    async loadUserInfo() {
        try {
            const res = await getUserInfo();
            this.setData({ userInfo: res || {} });
        } catch (e) {
            console.error(e);
            this.setData({ userInfo: {} });
        }
    },

    async loadLeaderboard() {
        this.setData({ loadingLeaderboard: true });
        try {
            const res = await getGreenPointsLeaderboard({ limit: 10 });
            this.setData({
                leaderboard: res.list || res || []
            });
        } catch (e) {
            console.error(e);
            this.setData({ leaderboard: [] });
        } finally {
            this.setData({ loadingLeaderboard: false });
        }
    },

    chooseImage() {
        chooseSingleImage({
            sourceType: ['album', 'camera'],
            sizeType: ['compressed']
        })
            .then((filePath) => {
                this.setData({
                    imagePath: filePath || '',
                    recognitionResult: null,
                    recognitionError: ''
                });
            })
            .catch((err) => {
                if (isUserCancelError(err)) return;
                console.error(err);
                uni.showToast({
                    title: isPermissionDeniedError(err)
                        ? '未获得摄像头权限，请在系统设置中开启相机权限'
                        : '选择图片失败，请稍后重试',
                    icon: 'none'
                });
            });
    },

    async submitImage() {
        if (!this.data.imagePath) {
            uni.showToast({ title: '请先选择图片', icon: 'none' });
            return;
        }
        if (this.data.uploading) return;

        this.setData({
            uploading: true,
            recognitionResult: null,
            recognitionError: ''
        });

        try {
            const res = await uploadGarbageImage(this.data.imagePath);
            this.setData({
                recognitionResult: res || null,
                recognitionError: ''
            });
            uni.showToast({
                title: `识别成功 +${(res && res.points) || 0}积分`,
                icon: 'success'
            });
            await Promise.all([this.loadUserInfo(), this.loadLeaderboard()]);
        } catch (e) {
            console.error(e);
            const message = getRecognitionErrorMessage(e);
            this.setData({
                recognitionResult: null,
                recognitionError: message
            });
            uni.showToast({
                title: message,
                icon: 'none'
            });
        } finally {
            this.setData({ uploading: false });
        }
    }
};
