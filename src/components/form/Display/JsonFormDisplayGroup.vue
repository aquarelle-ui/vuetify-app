<template>
    <div v-if="modelProxy != null && items != null && items.length> 0" class="json-form-display-group">
        <json-form-display-element v-for="control in items"
                                   :key="control.id || $uniqueObjectId(control)"
                                   :model="modelProxy"
                                   :files="files"
                                   :control="control"
        ></json-form-display-element>
    </div>
</template>
<script>
    import JsonFormDisplayElement from "./JsonFormDisplayElement";

    export default {
        name: 'json-form-display-group',
        components: {JsonFormDisplayElement},
        props: {
            items: {type: Array, required: false},
            model: {type: [Object, Array], default: null},
            name: {type: [String, Number], required: false, default: null},
            files: {type: Object, default: null}
        },
        computed: {
            hasName()
            {
                return this.name != null && this.name !== '';
            },
            modelProxy()
            {
                if (this.model == null) {
                    return null;
                }
                return this.hasName ? this.model[this.name] : this.model;
            }
        }
    }
</script>