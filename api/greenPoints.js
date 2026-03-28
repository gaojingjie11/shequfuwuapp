import request, { BASE_URL } from '../utils/request';

function uploadGarbageImage(filePath) {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync('token');
        const header = {};
        if (token) {
            header.Authorization = `Bearer ${token}`;
        }

        uni.uploadFile({
            url: `${BASE_URL}/green-points/upload-garbage`,
            filePath,
            name: 'file',
            header,
            success: (res) => {
                let data = null;
                try {
                    data = JSON.parse(res.data || '{}');
                } catch (e) {
                    uni.showToast({ title: '响应解析失败', icon: 'none' });
                    reject(e);
                    return;
                }

                if (res.statusCode >= 200 && res.statusCode < 300 && data.code === 200) {
                    resolve(data.data);
                    return;
                }

                if (data.code === 401 || res.statusCode === 401) {
                    uni.removeStorageSync('token');
                    uni.redirectTo({ url: '/pages/auth/login' });
                }

                uni.showToast({
                    title: data.msg || '上传失败',
                    icon: 'none'
                });
                reject(data);
            },
            fail: (err) => {
                uni.showToast({ title: '网络错误', icon: 'none' });
                reject(err);
            }
        });
    });
}

function getGreenPointsLeaderboard(params) {
    return request({
        url: '/green-points/leaderboard',
        method: 'GET',
        data: params
    });
}

export default {
    uploadGarbageImage,
    getGreenPointsLeaderboard
};
