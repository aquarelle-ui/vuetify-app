import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import VuetifyJsonForm from '@aquarelle/vuetify-json-form';
import {DOMPortal, User, EntityTypeControl, EntityInstanceControl} from "./src"

export default function (Vue) {
    Vue.use(DOMPortal);
    Vue.use(VueRouter);
    Vue.use(Vuetify);
    Vue.use(VuetifyJsonForm);
    Vue.use(EntityTypeControl);
    Vue.use(EntityInstanceControl);
    Vue.prototype.$user = User;
    Vue.directive('title', {
        inserted: (el, binding) => document.title = binding.value,
        update: (el, binding) => document.title = binding.value
    });
}
