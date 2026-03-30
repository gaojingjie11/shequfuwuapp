function getErrorText(err) {
    return String(err?.errMsg || err?.message || '').toLowerCase();
}

function isUserCancelError(err) {
    const text = getErrorText(err);
    return text.includes('cancel');
}

function isPermissionDeniedError(err) {
    const text = getErrorText(err);
    return text.includes('permission') || text.includes('auth') || text.includes('deny');
}

function ensureAppCameraPermission() {
    return new Promise((resolve) => {
        if (typeof plus === 'undefined' || !plus.android) {
            resolve(true);
            return;
        }

        const platform = (uni.getSystemInfoSync?.().platform || '').toLowerCase();
        if (platform !== 'android') {
            resolve(true);
            return;
        }

        plus.android.requestPermissions(
            ['android.permission.CAMERA'],
            (result) => {
                const denied = [...(result.deniedAlways || []), ...(result.deniedPresent || [])];
                resolve(denied.length === 0);
            },
            () => resolve(false)
        );
    });
}

async function chooseSingleImage(options = {}) {
    const sourceType = Array.isArray(options.sourceType) && options.sourceType.length
        ? options.sourceType
        : ['album'];
    const sizeType = Array.isArray(options.sizeType) && options.sizeType.length
        ? options.sizeType
        : ['compressed'];

    if (sourceType.includes('camera')) {
        const granted = await ensureAppCameraPermission();
        if (!granted) {
            throw new Error('未获得摄像头权限，请在系统设置中允许相机访问');
        }
    }

    return new Promise((resolve, reject) => {
        const normalizeSuccess = (res) => {
            const mediaPath = res?.tempFiles?.[0]?.tempFilePath;
            const imagePath = Array.isArray(res?.tempFilePaths) ? res.tempFilePaths[0] : '';
            const filePath = mediaPath || imagePath || '';
            if (!filePath) {
                reject(new Error('未获取到图片'));
                return;
            }
            resolve(filePath);
        };

        const chooseImageFallback = () => {
            uni.chooseImage({
                count: 1,
                sourceType,
                sizeType,
                success: normalizeSuccess,
                fail: reject
            });
        };

        if (typeof uni.chooseMedia === 'function') {
            uni.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType,
                sizeType,
                success: normalizeSuccess,
                fail: chooseImageFallback
            });
            return;
        }

        chooseImageFallback();
    });
}

function compressImage(filePath, quality = 70) {
    return new Promise((resolve) => {
        if (typeof uni.compressImage !== 'function') {
            resolve(filePath);
            return;
        }

        uni.compressImage({
            src: filePath,
            quality,
            success: (res) => resolve(res?.tempFilePath || filePath),
            fail: () => resolve(filePath)
        });
    });
}

const mediaUtils = {
    chooseSingleImage,
    compressImage,
    ensureAppCameraPermission,
    isPermissionDeniedError,
    isUserCancelError
};

export {
    chooseSingleImage,
    compressImage,
    ensureAppCameraPermission,
    isPermissionDeniedError,
    isUserCancelError
};

export default mediaUtils;
