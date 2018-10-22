<template>
    <v-tabs v-if="modelProxy != null">
        <template v-for="tab in tabs">
            <v-tab :key="$uniqueObjectId(tab) + 'h'">{{$intl.translate(tab.title)}}</v-tab>
            <v-tab-item :key="$uniqueObjectId(tab) + 'c'">
                <json-form-display-group :files="files" :items="tab.items" :model="name == null ? model : modelProxy"
                                         :name="tab.name"></json-form-display-group>
            </v-tab-item>
        </template>
    </v-tabs>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";
    import JsonFormDisplayGroup from "../JsonFormDisplayGroup";
    import JsonFormDisplay from "../JsonFormDisplay";

    export default {
        components: {JsonFormDisplayGroup},
        mixins: [JsonFormDisplayElementMixin],
        computed: {
            tabs()
            {
                if (this.items == null) {
                    return null;
                }
                return this.items.map(item => {
                    return {
                        title: item.title || (item.display ? item.display.title : null),
                        name: item.name || null,
                        items: JsonFormDisplay.parseControlList(item.items)
                    };
                });
            }
        }
    }
</script>