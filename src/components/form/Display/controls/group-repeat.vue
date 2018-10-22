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
                    <json-form-display-group :files="files" :items="repeatItems"
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
                if (regions === null || this.modelProxy == null || this.repeatItems == null || this.repeatItems.length === 0) {
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
            repeatItems() {
                if (this.items == null) {
                    return null;
                }
                return JsonFormDisplay.parseControlList(this.items);
            }
        }
    }
</script>