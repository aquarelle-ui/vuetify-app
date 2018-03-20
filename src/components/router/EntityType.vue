<template>
    <router-view :entity-name="entityName" :entity-loader="entityLoader"></router-view>
</template>
<script>
    import Loaders from "../../Loaders";

    export default {
        name: 'entity-type-route',
        props: {
            entityName: {
                type: String,
                required: true
            }
        },
        computed: {
            entityLoader() {
                return Loaders.get(this.entityName);
            }
        }
    }
</script>