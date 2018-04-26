<template>
    <v-content>
        <app-toolbar :title="title" :back="back">
            <slot name="toolbar"></slot>
        </app-toolbar>
        <v-layout v-if="loading" fill-height justify-center align-center>
            <v-progress-circular indeterminate color="secondary"></v-progress-circular>
        </v-layout>
        <slot v-else></slot>
        <app-notifier ref="notifier"></app-notifier>
    </v-content>
</template>
<script>
    import AppToolbar from "./AppToolbar";
    import AppNotifier from "./AppNotifier";

    export default {
        name: 'app-page',
        components: {AppToolbar, AppNotifier},
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
        },
        computed: {
            notifier() {
                return this.$refs.notifier;
            }
        },
        methods: {
            notify(type, message, timeout = 3000)
            {
                this.notifier.show(type, message, timeout);
            }
        }
    };
</script>