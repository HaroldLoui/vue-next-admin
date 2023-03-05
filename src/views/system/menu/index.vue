<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
				<el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddMenu('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增菜单
				</el-button>
			</div>
			<el-table
				:data="state.tableData.data"
				v-loading="state.tableData.loading"
				style="width: 100%"
				row-key="path"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column label="菜单名称" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.meta.icon" />
						<span class="ml10">{{ $t(scope.row.meta.title) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
				<el-table-column label="组件路径" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.component }}</span>
					</template>
				</el-table-column>
				<el-table-column label="权限标识" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.meta.roles }}</span>
					</template>
				</el-table-column>
				<el-table-column label="排序" show-overflow-tooltip width="80">
					<template #default="scope">
						{{ scope.row.menuSort }}
					</template>
				</el-table-column>
				<el-table-column label="类型" show-overflow-tooltip width="80">
					<template #default="scope">
						<el-tag type="success" size="small">{{ scope.row.xx }}菜单</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="170">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenAddMenu('add', scope.row)">新增</el-button>
						<el-button size="small" text type="primary" @click="onOpenEditMenu('edit', scope.row)">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRoutesList } from '/@/stores/routesList';
import { setBackEndControlRefreshRoutes, backEndComponent } from '/@/router/backEnd';
import { useMenuApi } from '/@/api/menu/index';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/system/menu/dialog.vue'));
// 使用api接口
const menuApi = useMenuApi();

// 定义变量内容
const stores = useRoutesList();
const menuDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as RouteRecordRaw[],
		loading: true,
	},
});

/**
 * 获取路由数据
 */
const getTableData = async () => {
	state.tableData.loading = true;
	// 查询菜单列表数据
	const res = await menuApi.getList();
	if (res.code === 200) {
		// 构造动态路由
		const dynamicRoutes = await backEndComponent(res.data);
		stores.setRoutesList(dynamicRoutes);
		state.tableData.data = dynamicRoutes;
	}
	state.tableData.loading = false;
};

/**
 * 打开新增菜单弹窗
 * @param type edit/add
 */
const onOpenAddMenu = (type: string, row?: RouteRecordRaw) => {
	menuDialogRef.value.openDialog(type, row);
};

/**
 * 打开编辑菜单弹窗
 * @param type edit/add
 * @param row 当前行数据
 */
const onOpenEditMenu = (type: string, row: RouteRecordRaw) => {
	menuDialogRef.value.openDialog(type, row);
};

/**
 * 删除当前行
 * @param row 当前行数据
 */
const onTabelRowDel = (row: RouteRecordRaw) => {
	if (row.children && row.children?.length > 0) {
		deleteMenuOrForce('此操作将永久删除当前路由及其所有子路由, 是否继续?', deleteMenuForce, row);
	} else {
		deleteMenuOrForce('此操作将永久删除当前路由, 是否继续?', deleteMenu, row);
	}
};

/**
 * 删除或者强制删除当前菜单
 */
const deleteMenuOrForce = (title: string, fn: Function, row: RouteRecordRaw) => {
	ElMessageBox.confirm(title, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await fn(row);
			if (res.code === 200) {
				ElMessage.success(res.msg);
				// 刷新菜单
				await setBackEndControlRefreshRoutes();
				// 刷新表格数据
				getTableData();
			} else {
				ElMessage.warning(res.msg);
			}
		})
		.catch(() => {});
};

/**
 * 调用删除菜单方法
 * @param row 当前行数据
 */
const deleteMenu = (row: any) => {
	return menuApi.deleteMenu(row.id);
};

/**
 * 调用强制删除菜单方法（会删除所有子菜单）
 * @param row 当前行数据
 */
const deleteMenuForce = (row: any) => {
	return menuApi.deleteMenuForce(row.id);
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>
