<template>
    <v-card flat v-if="modelProxy != null && modelProxy.length > 0 && repeatItems != null && repeatItems.length > 0">
        <v-card-title>
            <div class="headline">{{$intl.translate(display.title)}}</div>
        </v-card-title>
        <v-card-text class="pt-0">
            <template v-for="(model, index) in modelProxy">
                <v-divider v-if="index !== 0"></v-divider>
                <json-form-display-group :files="files" :items="repeatItems"
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
            repeatItems() {
                if (this.items == null) {
                    return null;
                }
                return JsonFormDisplay.parseControlList(this.items);
            }
        }
    }
</script>