import Vue from "vue";
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import VuetifyJsonForm from '@aquarelle/vuetify-json-form';
import {DOMPortal, User, EntityTypeControl, EntityInstanceControl, Router, AppRoot} from "./src"

Vue.use(DOMPortal);
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VuetifyJsonForm);
Vue.use(EntityTypeControl);
Vue.use(EntityInstanceControl);
Vue.directive('title', {
    inserted: (el, binding) => document.title = binding.value,
    update: (el, binding) => document.title = binding.value
});
Vue.prototype.$user = User;

export * from "./src";
export default (new Vue({
    el: '#app',
    router: Router,
    render(h) {
        return h(AppRoot)
    }
}));
