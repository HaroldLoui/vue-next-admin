import request from '/@/utils/request';

/**
 * 以下为模拟接口地址，gitee 的不通，就换自己的真实接口地址
 *
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 后端控制菜单模拟json，路径在 https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 */
export function useMenuApi() {
	return {
		getList: (params?: object) => {
			return request({
				url: '/sys/menu/list',
				method: 'get',
				params,
			});
		},
		saveMenu: (data?: object) => {
			return request({
				url: '/sys/menu/save',
				method: 'post',
				data: data,
			});
		},
		updateMenu: (data?: object) => {
			return request({
				url: '/sys/menu/update',
				method: 'put',
				data: data,
			});
		},
		deleteMenu: (id: string) => {
			return request({
				url: `/sys/menu/delete?id=${id}`,
				method: 'delete',
			});
		},
		deleteMenuForce: (id: string) => {
			return request({
				url: `/sys/menu/deleteForce?id=${id}`,
				method: 'delete',
			});
		},
	};
}
