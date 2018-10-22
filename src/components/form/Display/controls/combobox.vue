<template>
    <json-form-display-item-wrapper :title="display.title">
        <span v-if="!config.multiple">{{value}}</span>
        <div v-else-if="modelProxy != null">
            <v-chip v-for="(item, index) in modelProxy" :key="index">{{item}}</v-chip>
        </div>
    </json-form-display-item-wrapper>
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
            }
        }
    }
</script>