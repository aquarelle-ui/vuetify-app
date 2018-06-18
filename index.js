import Vue from "vue";
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import VuetifyJsonForm from '@aquarelle/vuetify-json-form';
import {DOMPortal, DocumentTitle, User, EntityTypeControl, EntityInstanceControl, Router, AppRoot, AppDashboard} from "./src"

Vue.use(DocumentTitle);
Vue.use(DOMPortal);
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VuetifyJsonForm);
Vue.use(EntityTypeControl);
Vue.use(EntityInstanceControl);

Vue.prototype.$user = User;

User.setLoaderUrl('/api/aquarelle/users/users');

Router.addRoutes([
    {
        path: '/',
        component: AppDashboard
    }
]);

export * from "./src";

const AppConfig = {
    el: '#app',
    router: Router,
    render(h) {
        return h(AppRoot)
    }
};

export default AppConfig;
