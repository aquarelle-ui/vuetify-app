import {default as Control} from "./control.vue";
import {JsonForm} from "@aquarelle/json-form";
import Parser from "./Parser";

Control.install = function (Vue) {
    Vue.component(Control.name, Control);
    JsonForm.addControl('entity-type', new Parser(Control.name, null));
};

export {Parser as EntityTypeParser};
export {Control as EntityTypeControl};
