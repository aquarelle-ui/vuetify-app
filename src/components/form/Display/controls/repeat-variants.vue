<template>
    <v-card flat v-if="modelProxy != null">
        <v-card-title>
            <div class="headline">{{$intl.translate(display.title)}}</div>
        </v-card-title>
        <v-card-text class="pt-0">
            <template v-for="(model, index) in modelProxy">
                <v-divider v-if="index !== 0"></v-divider>
                <div class="grey--text">{{index + 1}}. {{$intl.translate(variants[model[variantField]].title)}}</div>
                <json-form-display-group :files="files" :items="variants[model[variantField]].items"
                                         :model="model"></json-form-display-group>
            </template>
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
            variants()
            {

                if (!this.items) {
                    return null;
                }

                const variants = {};
                this.items.map(item => {
                   variants[item.name] = {
                       title: item.title || null,
                       name: item.name,
                       items: JsonFormDisplay.parseControlList(item.items),
                   };
                });
                return variants;
            }
        }
    }
</script>