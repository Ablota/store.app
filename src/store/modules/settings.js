const state = () => ({
	sourceAge: 6,
	assetsAge: 24,
});

const mutations = {
	setSourceAge(state, age) {
		state.sourceAge = age;
	},
	setAssetsAge(state, age) {
		state.assetsAge = age;
	},
};

export default {
	namespaced: true,
	state,
	mutations,
};
