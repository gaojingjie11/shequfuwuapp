import { BASE_URL } from './request';
import {
    chooseSingleImage,
    compressImage,
    isPermissionDeniedError,
    isUserCancelError
} from './media';

function confirmAction(title, content) {
    return new Promise((resolve) => {
        uni.showModal({
            title,
            content,
            success: (res) => resolve(!!res.confirm),
            fail: () => resolve(false)
        });
    });
}

function promptPaymentPassword(options = {}) {
    const title = options.title || '支付验证';
    const placeholder = options.placeholder || '请输入登录密码';

    return new Promise((resolve) => {
        uni.showModal({
            title,
            editable: true,
            placeholderText: placeholder,
            success: (res) => {
                if (!res.confirm) {
                    resolve('');
                    return;
                }
                resolve((res.content || '').trim());
            },
            fail: () => resolve('')
        });
    });
}

function uploadFaceImage(filePath) {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync('token');
        const header = {};
        if (token) {
            header.Authorization = `Bearer ${token}`;
        }

        uni.uploadFile({
            url: `${BASE_URL}/upload`,
            filePath,
            name: 'file',
            header,
            success: (res) => {
                let data = {};
                try {
                    data = JSON.parse(res.data || '{}');
                } catch (e) {
                    reject(new Error('人脸上传响应解析失败'));
                    return;
                }

                if (res.statusCode >= 200 && res.statusCode < 300 && data.code === 200) {
                    const imageURL = data?.data?.url || data?.url || (typeof data?.data === 'string' ? data.data : '');
                    if (!imageURL) {
                        reject(new Error('上传成功但未返回图片地址'));
                        return;
                    }
                    resolve(imageURL);
                    return;
                }

                if (data.code === 401 || res.statusCode === 401) {
                    uni.removeStorageSync('token');
                    uni.redirectTo({ url: '/pages/auth/login' });
                }
                reject(new Error(data.msg || '人脸上传失败'));
            },
            fail: (err) => reject(err || new Error('人脸上传失败'))
        });
    });
}

async function promptPaymentAuth(options = {}) {
    const title = options.title || '支付验证';
    const passwordPlaceholder = options.passwordPlaceholder || '请输入登录密码';
    const allowFace = options.allowFace !== false;
    const faceRegistered = !!options.faceRegistered;

    const method = await new Promise((resolve) => {
        const itemList = allowFace ? ['密码支付', '刷脸支付'] : ['密码支付'];
        uni.showActionSheet({
            itemList,
            success: (res) => resolve(Number(res.tapIndex)),
            fail: () => resolve(-1)
        });
    });

    if (method < 0) {
        return null;
    }

    if (method === 0 || !allowFace) {
        const password = await promptPaymentPassword({
            title,
            placeholder: passwordPlaceholder
        });
        if (!password) {
            return null;
        }
        return { pay_type: 'password', password };
    }

    if (!faceRegistered) {
        uni.showToast({
            title: '当前账号未录入人脸，请先在个人中心录入',
            icon: 'none'
        });
        return null;
    }

    let prepareErrorMessage = '';
    try {
        uni.showLoading({ title: '拍照并上传中', mask: true });
        const filePath = await chooseSingleImage({
            sourceType: ['camera'],
            sizeType: ['compressed']
        });
        const compressedPath = await compressImage(filePath, 70);
        const faceImageURL = await uploadFaceImage(compressedPath);
        return { pay_type: 'face', face_image_url: faceImageURL };
    } catch (err) {
        if (isUserCancelError(err)) {
            return null;
        }
        if (isPermissionDeniedError(err)) {
            prepareErrorMessage = '未获得摄像头权限，请在系统设置中打开相机权限';
            return null;
        }
        prepareErrorMessage = err?.message || '刷脸支付准备失败';
        return null;
    } finally {
        uni.hideLoading();
        if (prepareErrorMessage) {
            uni.showToast({
                title: prepareErrorMessage,
                icon: 'none'
            });
        }
    }
}

export default {
    confirmAction,
    promptPaymentPassword,
    promptPaymentAuth
};
