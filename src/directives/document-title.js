const directive = {
    inserted: (el, binding) => document.title = binding.value,
    update: (el, binding) => document.title = binding.value
};

function install(Vue) {
    Vue.directive('title', directive)
}

export {directive};
export default install;