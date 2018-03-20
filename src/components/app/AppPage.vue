<template>
    <v-content>
        <app-toolbar :title="title" :back="back">
            <slot name="toolbar"></slot>
        </app-toolbar>
        <v-layout v-if="loading" fill-height justify-center align-center>
            <v-progress-circular indeterminate color="secondary"></v-progress-circular>
        </v-layout>
        <slot v-else></slot>
    </v-content>
</template>
<script>
    import AppToolbar from "./AppToolbar";

    export default {
        name: 'app-page',
        components: {AppToolbar},
        props: {
            title: {
                type: String,
                default: ''
            },
            back: {
                type: String,
                default: ''
            },
            loading: {
                type: Boolean,
                default: false
            }
        }
    };
</script>