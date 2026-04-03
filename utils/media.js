function getErrorText(err) {
    return String(err?.errMsg || err?.message || '').toLowerCase();
}

function isNativeApp() {
    return typeof plus !== 'undefined';
}

function isAndroidApp() {
    if (!isNativeApp() || !plus.android) {
        return false;
    }

    const platform = (uni.getSystemInfoSync?.().platform || '').toLowerCase();
    return platform === 'android';
}

function isUserCancelError(err) {
    const text = getErrorText(err);
    return text.includes('cancel');
}

function isPermissionDeniedError(err) {
    const text = getErrorText(err);
    return text.includes('permission') || text.includes('auth') || text.includes('deny');
}

function requestAndroidPermissions(permissions = []) {
    return new Promise((resolve) => {
        if (!isAndroidApp() || !permissions.length) {
            resolve(true);
            return;
        }

        plus.android.requestPermissions(
            Array.from(new Set(permissions)),
            (result) => {
                const denied = [...(result.deniedAlways || []), ...(result.deniedPresent || [])];
                resolve(denied.length === 0);
            },
            () => resolve(false)
        );
    });
}

function ensureAppMediaPermission(sourceType = []) {
    const permissionList = [];

    if (sourceType.includes('camera')) {
        permissionList.push('android.permission.CAMERA');
    }

    if (sourceType.includes('album')) {
        permissionList.push('android.permission.READ_MEDIA_IMAGES');
        permissionList.push('android.permission.READ_EXTERNAL_STORAGE');
    }

    return requestAndroidPermissions(permissionList);
}

async function chooseSingleImage(options = {}) {
    const sourceType = Array.isArray(options.sourceType) && options.sourceType.length
        ? options.sourceType
        : ['album'];
    const sizeType = Array.isArray(options.sizeType) && options.sizeType.length
        ? options.sizeType
        : ['compressed'];

    const granted = await ensureAppMediaPermission(sourceType);
    if (!granted) {
        const permissionLabel = sourceType.includes('camera') && sourceType.includes('album')
            ? '相机和相册'
            : (sourceType.includes('camera') ? '相机' : '相册');
        throw new Error(`未获得${permissionLabel}权限，请在系统设置中开启后重试`);
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

        const chooseImage = () => {
            uni.chooseImage({
                count: 1,
                sourceType,
                sizeType,
                success: normalizeSuccess,
                fail: reject
            });
        };

        if (isNativeApp() || typeof uni.chooseMedia !== 'function') {
            chooseImage();
            return;
        }

        uni.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType,
            sizeType,
            success: normalizeSuccess,
            fail: () => chooseImage()
        });
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
    ensureAppMediaPermission,
    isPermissionDeniedError,
    isUserCancelError
};

export {
    chooseSingleImage,
    compressImage,
    ensureAppMediaPermission,
    isPermissionDeniedError,
    isUserCancelError
};

export default mediaUtils;
