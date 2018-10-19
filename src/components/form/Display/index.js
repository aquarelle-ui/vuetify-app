import JsonFormDisplay from "./JsonFormDisplay";
import JsonFormDisplayControl from "./JsonFormDisplay";

export {JsonFormDisplay, JsonFormDisplayControl};

export {default as JsonFormDisplayElement} from "./JsonFormDisplayElement";
export {default as JsonFormDisplayElementMixin} from "./JsonFormDisplayElementMixin";
export {default as JsonFormDisplayGroup} from "./JsonFormDisplayGroup";

//export * from "./controls";

import KeyValue from "./controls/key-value";

const GenericKeyValue = new JsonFormDisplayControl(KeyValue);

JsonFormDisplay.addControl('text', GenericKeyValue);
JsonFormDisplay.addControl('textarea', GenericKeyValue);
JsonFormDisplay.addControl('number', GenericKeyValue);
JsonFormDisplay.addControl('tel', GenericKeyValue);
