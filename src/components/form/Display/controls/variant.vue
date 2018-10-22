<template>
    <v-card flat v-if="variant != null">
        <v-card-title>
            <div>
                <div class="headline">{{$intl.translate(display.title)}}</div>
                <span class="grey--text" v-if="variant.title != null">{{$intl.translate(variant.title)}}</span>
            </div>
        </v-card-title>
        <v-card-text class="pt-0">
            <json-form-display-group :files="files" :items="variant.items"
                                     :model="modelProxy"></json-form-display-group>
        </v-card-text>
    </v-card>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";
    import JsonFormDisplayGroup from "../JsonFormDisplayGroup";
    import JsonFormDisplay from "../JsonFormDisplay";

    export default {
        components: {JsonFormDisplayGroup},
        mixins: [JsonFormDisplayElementMixin],
        computed: {
            variantField()
            {
                return this.config.variantField || 'variant_name';
            },
            variantName()
            {
                if (!this.modelProxy) {
                    return null;
                }
                return this.modelProxy[this.variantField] || null;
            },
            variant()
            {
                if (!this.items) {
                    return null;
                }
                const vName = this.variantName;
                let variant = this.items.find(item => item.name === vName);
                if (!variant) {
                    return null;
                }

                return {
                    title: variant.title || null,
                    name: variant.name || null,
                    items: JsonFormDisplay.parseControlList(variant.items)
                };
            }
        }
    }
</script>