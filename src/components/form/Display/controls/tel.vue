<template>
    <json-form-display-item-wrapper :title="display.title" :value="value" :link="link"></json-form-display-item-wrapper>
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
                    return v;
                }
                return v + '';
            },
            link() {
                const v = this.value;
                if (v == null) {
                    return v;
                }
                return 'tel:'
            }
        }
    }
</script>