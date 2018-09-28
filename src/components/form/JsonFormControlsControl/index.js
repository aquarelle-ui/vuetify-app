import {default as JsonFormControlsControl} from "./control.vue";
import {JsonForm, ArrayControlParser} from "@aquarelle/json-form";

JsonFormControlsControl.install = function () {
    JsonForm.addControl('json-form-controls', new ArrayControlParser(JsonFormControlsControl));
};

export default JsonFormControlsControl;
