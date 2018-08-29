import Vue from "vue";
import VueRouter from 'vue-router';
import Loaders from "./Loaders";
import User from "./User";
import {AppDashboard} from "./components";
import AppComponent from "./AppComponent";

const Router = new VueRouter();


export {Router, Loaders};

const App = new Vue({
    router: Router,
    propsData: {
        user: User,
        router: Router,
        loaders: Loaders
    },
    ...AppComponent
});


Router.addRoutes([
    {
        path: '/',
        component: AppDashboard,
        props()
        {
            return {app: App}
        }
    }
]);

export default App;