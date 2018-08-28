import {default as RichtextControl} from "./control.vue";
import {JsonForm, StringControlParser} from "@aquarelle/json-form";

RichtextControl.install = function () {
    JsonForm.addControl('richtext', new StringControlParser(RichtextControl));
};

export default RichtextControl;
