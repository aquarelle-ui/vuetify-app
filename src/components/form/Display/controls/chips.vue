<template>
    <json-form-display-item-wrapper :title="display.title">
        <div v-if="modelProxy != null">
            <v-chip v-for="(item, index) in modelProxy" :key="index">{{item}}</v-chip>
        </div>
    </json-form-display-item-wrapper>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";
    import JsonFormDisplayItemWrapper from "../JsonFormDisplayItemWrapper";

    export default {
        components: {JsonFormDisplayItemWrapper},
        mixins: [JsonFormDisplayElementMixin]
    }
</script>