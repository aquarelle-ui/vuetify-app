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
            title() {
                if (this.display.title){
                    return this.display.title;
                }
                if (this.name) {
                    return '(' + this.name + ')';
                }
            },
            value() {
                const v = this.modelProxy;
                if (v == null) {
                    return v;
                }
                return v + '';
            }
        }
    }
</script>