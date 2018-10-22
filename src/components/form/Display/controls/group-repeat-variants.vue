<template>
    <v-card flat v-if="hasItems">
        <v-card-title>
            <div class="headline">{{$intl.translate(display.title)}}</div>
        </v-card-title>
        <v-card-text v-for="region in regions" class="pt-0" :key="region.name">
            <template v-if="modelProxy[region.name] && modelProxy[region.name].length > 0">
                <div class="subheading">{{$intl.translate(region.title)}}</div>
                <template v-for="(model, index) in modelProxy[region.name]">
                    <v-divider v-if="index !== 0"></v-divider>
                    <div class="grey--text">{{index + 1}}. {{$intl.translate(variants[model[variantField]].title)}}</div>
                    <json-form-display-group :files="files" :items="variants[model[variantField]].items"
                                             :model="model"></json-form-display-group>
                </template>
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
            hasItems() {
                const regions = this.regions;
                if (regions === null || this.modelProxy == null) {
                    return false;
                }
                for (let i = 0; i < regions.length; i++) {
                    if (regions[i] && regions[i].name && this.modelProxy[regions[i].name] && this.modelProxy[regions[i].name].length > 0) {
                        return true
                    }
                }
                return false;
            },
            regions() {
                if (!this.config.regions) {
                    return null;
                }
                return this.config.regions;
            },
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