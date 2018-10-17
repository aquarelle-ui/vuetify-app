<template>
    <div class="my-2">
        <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0"
                       :required="config.required"></control-label>
        <ace-editor ref="editor" v-model="model[name]" :options="config.editor" :lang="config.lang"
                    @input="validate()" @syntax-error="hasSyntaxError = $event"></ace-editor>
        <block-error :error="allErrors.length > 0 ? allErrors[0] : undefined"></block-error>
    </div>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {BlockError, ControlLabel} from "@aquarelle/vuetify-json-form";
    import {AceEditor} from "../../editor";

    export default {
        components: {AceEditor, BlockError, ControlLabel},
        mixins: [JsonFormElementMixin],
        data() {
            return {hasSyntaxError: false};
        },
        created()
        {
            this.addValidation('syntax', () => !this.hasSyntaxError, {
                text: 'Syntax error',
                key: 'validation.code-syntax'
            });
        },
        beforeDestroy()
        {
            this.addValidation('syntax', null);
        }
    }
</script>