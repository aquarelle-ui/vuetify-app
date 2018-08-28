import {default as CodeControl} from "./control.vue";
import {JsonForm, StringControlParser} from "@aquarelle/json-form";

CodeControl.install = function () {
    JsonForm.addControl('code', new StringControlParser(CodeControl));
};

export default CodeControl;
