import request, { BASE_URL } from '../utils/request';

function normalizeGreenPointsUploadError(message, fallback = '识别失败，请稍后重试') {
    const text = String(message || '').trim();
    if (!text) return fallback;

    if (/timeout|timed out|超时/i.test(text)) {
        return '识别超时，请稍后再试';
    }

    if (/network|request failed|upload.*fail|socket|网络/i.test(text)) {
        return '上传失败，请检查网络后重试';
    }

    if (/parse|json|unexpected token|响应/i.test(text)) {
        return '识别服务响应异常，请稍后重试';
    }

    if (/unsupported|invalid image|bad image|corrupt|格式|文件|图片无效/i.test(text)) {
        return '图片格式或内容无效，请重新拍摄或选择清晰图片';
    }

    if (/no object|not detect|not detected|cannot recognize|unrecognized|识别失败|未识别|无法识别|没有识别到/i.test(text)) {
        return '未识别到可分类垃圾，请上传清晰、完整的垃圾照片';
    }

    if (/ai|model|service unavailable|internal|server error|系统繁忙|服务异常|服务错误/i.test(text)) {
        return '识别服务暂时不可用，请稍后重试';
    }

    return fallback;
}

function createUploadError(message, extra = {}) {
    const rawMessage = String(message || '').trim();
    return {
        ...extra,
        rawMessage,
        userMessage: normalizeGreenPointsUploadError(rawMessage, extra.fallback)
    };
}

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
                    reject(createUploadError('parse response failed', { cause: e }));
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

                reject(
                    createUploadError(data.msg || data.message || 'upload failed', {
                        code: data.code,
                        statusCode: res.statusCode,
                        response: data
                    })
                );
            },
            fail: (err) => {
                reject(
                    createUploadError(err && (err.errMsg || err.message || 'network error'), {
                        cause: err
                    })
                );
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
    getGreenPointsLeaderboard,
    normalizeGreenPointsUploadError
};

export { uploadGarbageImage, getGreenPointsLeaderboard, normalizeGreenPointsUploadError };
