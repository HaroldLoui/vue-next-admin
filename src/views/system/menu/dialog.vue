<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" @close="closeDialog">
			<el-form ref="ruleFormRef" :model="state.ruleForm" size="default" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级菜单">
							<el-cascader
								:options="state.menuData"
								:props="{ checkStrictly: true, value: 'id', label: 'title' }"
								placeholder="请选择上级菜单"
								clearable
								class="w100"
								v-model="state.ruleForm.menuSuperior"
							>
								<template #default="{ node, data }">
									<span>{{ data.title }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单类型">
							<el-radio-group v-model="state.ruleForm.menuType">
								<el-radio label="menu">菜单</el-radio>
								<el-radio label="btn">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单名称">
							<el-input v-model="state.ruleForm.meta.title" placeholder="格式：message.router.xxx" clearable></el-input>
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'menu'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由名称">
								<el-input v-model="state.ruleForm.name" placeholder="路由中的 name 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由路径">
								<el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="重定向">
								<el-input v-model="state.ruleForm.redirect" placeholder="请输入路由重定向" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="菜单图标">
								<IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.meta.icon" />
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="组件路径">
								<el-input v-model="state.ruleForm.componentAlias" placeholder="组件路径" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="链接地址">
								<el-input
									v-model="state.ruleForm.meta.isLink"
									placeholder="外链/内嵌时链接地址（http:xxx.com）"
									clearable
									:disabled="!state.ruleForm.isLink"
								>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识">
								<el-select v-model="state.ruleForm.meta.roles" multiple placeholder="取角色管理" clearable class="w100">
									<el-option label="admin" value="admin"></el-option>
									<el-option label="common" value="common"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="state.ruleForm.menuType === 'btn'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识">
								<el-input v-model="state.ruleForm.btnPower" placeholder="请输入权限标识" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单排序">
							<el-input-number v-model="state.ruleForm.menuSort" controls-position="right" placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'menu'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否隐藏">
								<el-radio-group v-model="state.ruleForm.meta.isHide">
									<el-radio :label="true">隐藏</el-radio>
									<el-radio :label="false">不隐藏</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="页面缓存">
								<el-radio-group v-model="state.ruleForm.meta.isKeepAlive">
									<el-radio :label="true">缓存</el-radio>
									<el-radio :label="false">不缓存</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否固定">
								<el-radio-group v-model="state.ruleForm.meta.isAffix">
									<el-radio :label="true">固定</el-radio>
									<el-radio :label="false">不固定</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否外链">
								<el-radio-group v-model="state.ruleForm.isLink" :disabled="state.ruleForm.meta.isIframe">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否内嵌">
								<el-radio-group v-model="state.ruleForm.meta.isIframe" @change="onSelectIframeChange">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { defineAsyncComponent, reactive, onMounted, ref, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { i18n } from '/@/i18n/index';
import { setBackEndControlRefreshRoutes } from '/@/router/backEnd';
import { useMenuApi } from '/@/api/menu/index';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const ruleFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const state = reactive({
	// 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
	ruleForm: {
		id: '',
		parentId: '',
		menuSuperior: [] as string[], // 上级菜单
		menuType: 'menu', // 菜单类型
		name: '', // 路由名称
		component: '', // 组件路径
		componentAlias: '', // 组件路径
		isLink: false, // 是否外链
		menuSort: 0, // 菜单排序
		path: '', // 路由路径
		redirect: '', // 路由重定向，有子集 children 时
		meta: {
			title: '', // 菜单名称
			icon: '', // 菜单图标
			isHide: false, // 是否隐藏
			isKeepAlive: true, // 是否缓存
			isAffix: false, // 是否固定
			isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
			isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
			roles: '', // 权限标识，取角色管理
		},
		btnPower: '', // 菜单类型为按钮时，权限标识
	},
	menuData: [] as RouteItems, // 上级菜单数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});
// 定义api接口
const menuApi = useMenuApi();

/**
 * 获取 pinia 中的路由
 */
const getMenuData = (routes: RouteItems) => {
	const arr: RouteItems = [];
	routes.map((val: RouteItem) => {
		val['title'] = i18n.global.t(val.meta?.title as string);
		arr.push({ ...val });
		if (val.children) {
			getMenuData(val.children);
		}
	});
	return arr;
};

/**
 * 打开弹窗
 * @param type edit/add
 * @param row 传入进来的数据
 */
const openDialog = (type: string, row?: any) => {
	// 加载上级菜单
	state.menuData = getMenuData(routesList.value);
	if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '修改菜单';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增菜单';
		state.dialog.submitTxt = '新 增';
		// 在当前行进行新增表示给当前菜单添加子菜单
		if (row) {
			const parentId = row.id;
			let menuSuperior: string[] = [];
			Object.assign(menuSuperior, row.menuSuperior);
			state.ruleForm.menuSuperior = menuSuperior;
			state.ruleForm.menuSuperior.push(parentId);
		}
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
};

/**
 * 关闭弹窗
 */
const closeDialog = () => {
	state.dialog.isShowDialog = false;
	nextTick(() => {
		// 清空表单
		resetForm();
	});
};

/**
 * 是否内嵌下拉改变
 */
const onSelectIframeChange = () => {
	if (state.ruleForm.meta.isIframe) {
		state.ruleForm.isLink = true;
	} else {
		state.ruleForm.isLink = false;
	}
};

/**
 * 取消
 */
const onCancel = () => {
	closeDialog();
};

/**
 * 提交
 */
const onSubmit = () => {
	const data = form2Data();
	if (state.dialog.type === 'add') {
		saveMenu(data);
	} else {
		updateMenu(data);
	}
};

/**
 * 调用新增菜单接口
 */
const saveMenu = async (data: object) => {
	const res = await menuApi.saveMenu(data);
	if (res.code === 200) {
		// 关闭弹窗
		closeDialog();
		// 刷新菜单
		await setBackEndControlRefreshRoutes();
		// 发送refresh事件
		emit('refresh');
	}
};

/**
 * 调用修改菜单按钮
 */
const updateMenu = async (data: object) => {
	const res = await menuApi.updateMenu(data);
	if (res.code === 200) {
		// 关闭弹窗
		closeDialog();
		// 刷新菜单
		await setBackEndControlRefreshRoutes();
		// 发送refresh事件
		emit('refresh');
	}
};

/**
 * 将form表单内容转为api接口所需要的格式
 */
const form2Data = () => {
	const form = state.ruleForm;
	let data = {
		id: form.id,
		parentId: form.menuSuperior[form.menuSuperior.length - 1] || 0,
		type: form.menuType === 'menu' ? 0 : 1,
		name: form.name,
		component: form.componentAlias,
		isLink: form.isLink,
		sort: form.menuSort,
		path: form.path,
		redirect: form.redirect,
		title: form.meta.title,
		icon: form.meta.icon,
		isHide: form.meta.isHide,
		link: form.meta.isLink,
		isAffix: form.meta.isAffix,
		isKeepAlive: form.meta.isKeepAlive,
		isIframe: form.meta.isIframe,
		roles: form.meta.roles.toString(),
	};
	return data;
};

// 页面加载时
onMounted(() => {
	state.menuData = getMenuData(routesList.value);
});

// 清空表单及验证
const resetForm = () => {
	state.ruleForm.id = '';
	state.ruleForm.parentId = '';
	state.ruleForm.menuSuperior = [];
	state.ruleForm.menuType = 'menu';
	state.ruleForm.name = '';
	state.ruleForm.component = '';
	state.ruleForm.componentAlias = '';
	state.ruleForm.isLink = false;
	state.ruleForm.menuSort = 0;
	state.ruleForm.path = '';
	state.ruleForm.redirect = '';
	state.ruleForm.meta.title = '';
	state.ruleForm.meta.icon = '';
	state.ruleForm.meta.isHide = false;
	state.ruleForm.meta.isKeepAlive = true;
	state.ruleForm.meta.isAffix = false;
	state.ruleForm.meta.isLink = '';
	state.ruleForm.meta.isIframe = false;
	state.ruleForm.meta.roles = '';
	state.ruleForm.btnPower = '';
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
