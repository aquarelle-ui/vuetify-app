<template>
    <component :is="control.element"
               :model="model"
               :files="files"
               :name="control.name || null"
               :display="control.display || {}"
               :config="control.config || {}"
               :items="control.items || null"
    ></component>
</template>
<script>
    export default {
        name: 'json-form-display-element',
        props: {
            control: {type: Object, required: true},
            model: {type: [Object, Array], required: false},
            files: {type: Object, default: null}
        }
    }
</script>