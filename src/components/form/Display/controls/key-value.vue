<template>
    <div>{{title}}: {{value}}</div>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";

    export default {
        mixins: [JsonFormDisplayElementMixin],
        computed: {
            title() {
                if (this.display.title == null) {
                    return null;
                }
                return this.$intl.translate(this.display.title);
            },
            value() {
                return this.modelProxy;
            }
        }
    }
</script>