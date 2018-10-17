<template>
    <div class="my-2">
        <control-label :text="$intl.translate(display.title)" :has-error="allErrors.length > 0"
                       :required="config.required"></control-label>
        <ace-editor class="mt-1" ref="editor" v-model="code" lang="json"
                    @input="onCode($event)" @syntax-error="hasSyntaxError = $event"></ace-editor>
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
            return {code: null, hasSyntaxError: false};
        },
        created() {
            this.code = JSON.stringify(this.modelProxy, null, 2);
            this.addValidation('syntax', () => !this.hasSyntaxError, {
                text: 'Syntax error',
                key: 'validation.code-syntax'
            });
        },
        beforeDestroy()
        {
            this.addValidation('syntax', null);
        },
        methods: {
            onCode(code)
            {
                let data = null;
                try {
                    data = JSON.parse(code);
                } catch (e) {
                    this.hasSyntaxError = true;
                    this.validate();
                    return;
                }

                if (Array.isArray(data)) {
                    this.hasSyntaxError = false;
                    this.$set(this.model, this.name, data);
                } else {
                    this.hasSyntaxError = true;
                }

                this.validate();
            }
        }
    }
</script>