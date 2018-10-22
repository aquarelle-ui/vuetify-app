<template>
    <json-form-display-item-wrapper :title="display.title">
        <template v-if="value != null">
            <div v-for="(file, index) in value" :key="index">
                <template v-if="file.url != null">
                    <a :href="file.url" target="_blank">{{file.name}}</a>
                </template>
                <template v-else>
                    {{file.name}}
                </template>
                ({{file.size}} bytes) ({{file.type}})
            </div>
        </template>
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
                if (Array.isArray(v)) {
                    return v.map(file => this.files[file] || null).filter(file => file != null);
                }
                return this.files.hasOwnProperty(v) ? [v] : null;
            }
        }
    }
</script>