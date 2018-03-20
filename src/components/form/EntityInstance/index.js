import {default as Control} from "./control.vue";
import {JsonForm} from "@aquarelle/json-form";
import Parser from "./Parser";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('entity-instance', new Parser(Control.name, null));
};

export {Parser as EntityInstanceParser};
export {Control as EntityInstanceControl};
