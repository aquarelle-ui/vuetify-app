<template>
    <v-layout v-if="loading" fill-height justify-center align-center>
        <v-progress-circular indeterminate color="secondary"></v-progress-circular>
    </v-layout>
    <v-layout column v-else fill-height>
        <slot></slot>
    </v-layout>
</template>
<script>
    export default {
        name: 'content-loader',
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        }
    }
</script>