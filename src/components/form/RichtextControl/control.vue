<template>
    <div>
        <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0"
                       :required="config.required"></control-label>
        <quill-editor
                v-model="model[name]"
                :placeholder="$intl.translate(display.placeholder)"
                :editor-modules="config.mode"
        >
        </quill-editor>
        <block-error :error="allErrors.length > 0 ? allErrors[0] : undefined"></block-error>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {BlockError, ControlLabel} from "@aquarelle/vuetify-json-form";
    import {QuillEditor} from "../../editor";

    export default {
        mixins: [JsonFormElementMixin],
        components: {ControlLabel, QuillEditor, BlockError}
    };
</script>