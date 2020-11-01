import AboutPage from '../pages/about.vue';
import IndexPage from '../pages/index.vue';
import HomePage from '../pages/home.vue';
import CategoriesPage from '../pages/categories.vue';
import CategoryPage from '../pages/category.vue';
import SourcesPage from '../pages/sources.vue';
import SourcePage from '../pages/source.vue';
import AppPage from '../pages/app.vue';
import ManagerPage from '../pages/manager.vue';
import NotFoundPage from '../pages/404.vue';

const routes = [
	{
		path: '/',
		component: IndexPage,
		tabs: [
			{
				path: '/',
				id: 'home',
				component: HomePage,
			},
			{
				path: '/categories/',
				id: 'categories',
				component: CategoriesPage,
			},
			{
				path: '/sources/',
				id: 'sources',
				component: SourcesPage,
			},
			{
				path: '/manager/',
				id: 'manager',
				component: ManagerPage,
			},
		],
	},
	{
		path: '/categories/:categoryId/',
		component: CategoryPage,
	},
	{
		path: '/sources/:sourceId/',
		component: SourcePage,
		name: 'source',
	},
	{
		path: '/sources/:sourceId/categories/:categoryId/',
		component: CategoryPage,
	},
	{
		path: '/sources/:sourceId/apps/:appId/',
		component: AppPage,
		name: 'app',
	},
	{
		path: '/sources/apps/search/',
		component: CategoryPage,
	},
	{
		path: '/about/',
		panel: {
			component: AboutPage,
		},
		options: {
			history: false,
			pushState: false,
		},
	},
	{
		path: '(.*)',
		component: NotFoundPage,
	},
];

export default routes;
