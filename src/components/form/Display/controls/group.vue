<template>
    <div v-if="modelProxy != null">
        <div v-if="display.title != null" class="font-weight-bold">
            {{$intl.translate(display.title)}}
        </div>
        <json-form-display-group :files="files" :items="groupItems" :model="model" :name="name"></json-form-display-group>
    </div>
</template>
<script>
    import JsonFormDisplayElementMixin from "../JsonFormDisplayElementMixin";
    import JsonFormDisplayGroup from "../JsonFormDisplayGroup";
    import JsonFormDisplay from "../JsonFormDisplay";

    export default {
        components: {JsonFormDisplayGroup},
        mixins: [JsonFormDisplayElementMixin],
        computed: {
            groupItems() {
                if (this.items == null) {
                    return null;
                }
                return JsonFormDisplay.parseControlList(this.items);
            }
        }
    }
</script>