<template>
    <json-form-display-item-wrapper :title="display.title">
        <v-icon small :color="modelProxy ? 'green' : 'red'">{{modelProxy ? 'check' : 'clear'}}</v-icon>
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