<template>
    <json-form-display-item-wrapper :title="display.title" :value="value"></json-form-display-item-wrapper>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";
    import JsonFormDisplayItemWrapper from "../JsonFormDisplayItemWrapper";

    export default {
        components: {JsonFormDisplayItemWrapper},
        mixins: [JsonFormDisplayElementMixin],
        computed: {
            value() {
                const v = this.modelProxy;
                if (v == null) {
                    return null;
                }
                return this.formatValue(v);
            }
        },
        methods: {
            formatValue(v) {
                return v + '';
            }
        }
    }
</script>