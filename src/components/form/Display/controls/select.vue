<template>
    <json-form-display-item-wrapper v-if="value != null && value.length > 0" :title="display.title">
        <v-chip v-for="(item, index) in value" :key="index">{{item}}</v-chip>
    </json-form-display-item-wrapper>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";
    import JsonFormDisplayItemWrapper from "../JsonFormDisplayItemWrapper";

    export default {
        components: {JsonFormDisplayItemWrapper},
        mixins: [JsonFormDisplayElementMixin],
        computed: {
            value()
            {
                let v = this.modelProxy;
                if (v === undefined) {
                    v = null;
                }
                const items = this.items;
                if (items == null) {
                    return null;
                }

                return this.findValue(v, items);
            },
            isMultiple()
            {
                return !!this.config.multiple;
            },
            isGrouped()
            {
                return false;
            }
        },
        methods: {
            findValue(v, items)
            {
                if (this.isMultiple) {
                    if (!Array.isArray(v)) {
                        return null;
                    }
                    return v
                        .map(item => this.formatItem(this.findItem(item, items)))
                        .filter(item => item != null);
                }

                v = this.formatItem(this.findItem(v, items));
                if (v == null) {
                    return null;
                }
                return [v];
            },
            findItem(v, items)
            {
                if (this.isGrouped) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i] && Array.isArray(items[i].items)) {
                            const f = items[i].items.find(item => this.$equals(v, item.value));
                            if (f !== undefined) {
                                return f;
                            }
                        }
                    }
                    return null;
                }
                return items.find(item => this.$equals(v, item.value));
            },
            formatItem(item)
            {
                if (item == null) {
                    return null;
                }
                return item.title || item.value || null;
            }
        }
    }
</script>