import request from '../utils/request';


export default {
    // 获取评论列表
    getCommentList(params) {
        return request({
            url: '/comments',
            method: 'GET',
            data: params
        });
    },

    // 发表评论
    createComment(data) {
        return request({
            url: '/comment/create',
            method: 'POST',
            data
        });
    }
};
