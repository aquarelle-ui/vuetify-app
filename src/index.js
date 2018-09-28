import Vue from "vue";
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import {default as VuetifyJsonForm, BlockForm, StepperForm, DialogForms} from '@aquarelle/vuetify-json-form';
import Intl from '@aquarelle/intl';
import {DOMPortalDirective, DocumentTitleDirective} from "./directives";
import {EntityTypeControl, EntityInstanceControl, RichtextControl, CodeControl, JsonFormControlsControl} from "./components/form";
import {ImageIcon, LetterAvatar, ContentLoader} from "./components";
import App from "./App"
import User from "./User";

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.component(ImageIcon.name, ImageIcon);
Vue.component(LetterAvatar.name, LetterAvatar);
Vue.component(ContentLoader.name, ContentLoader);
Vue.use(Intl);
Vue.use(VuetifyJsonForm);

Vue.component(BlockForm.name, BlockForm);
Vue.component(StepperForm.name, StepperForm);
Vue.component(DialogForms.name, DialogForms);

Vue.use(DocumentTitleDirective);
Vue.use(DOMPortalDirective);

Vue.use(EntityTypeControl);
Vue.use(EntityInstanceControl);
Vue.use(CodeControl);
Vue.use(RichtextControl);
Vue.use(JsonFormControlsControl);


Vue.prototype.$app = App;
Vue.prototype.$user = User;

export * from "./helpers";
export * from "./components";
export * from "./errors";
export * from "./loader";
export * from "./mixins";
export * from "./directives";
export {Router, Loaders} from "./App";
export {App};




