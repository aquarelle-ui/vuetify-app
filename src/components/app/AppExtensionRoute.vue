<template>
    <app-layout ref="layout">
        <app-menu slot="app-left-drawer"
                  :user="appInfo.user"
                  :app="appInfo.app"
                  :vendor="appInfo.vendor"
                  :extension="appInfo.extension">
        </app-menu>

        <template slot="app-right-drawer">
            <app-user :user="appInfo.user"></app-user>
            <app-extensions :user="appInfo.user" :app="appInfo.app" :current-vendor="appInfo.vendor"></app-extensions>
        </template>
        <v-content>
            <v-layout :style="{height: toolbarHeight}">
                <router-view></router-view>
            </v-layout>
        </v-content>
    </app-layout>
</template>
<script>
    import AppUser from "./AppUser";
    import AppExtensions from "./AppExtensions";
    import AppMenu from "./AppMenu";
    import AppLayout from "./AppLayout";

    export default {
        name: 'app-extension-route',
        components: {
            AppMenu,
            AppExtensions,
            AppUser,
            AppLayout
        },
        data() {
            return {
                toolbarHeight: undefined
            };
        },
        props: {
            appInfo: {
                type: Object,
                required: true
            }
        },
        watch: {
            '$vuetify.breakpoint.height'(value) {
                this.refreshToolbarHeight(value);
            }
        },
        mounted() {
            this.refreshToolbarHeight(this.$vuetify.breakpoint.height);
        },
        methods: {
            refreshToolbarHeight(height)
            {
                const layout = this.$refs.layout;
                if (layout && layout.$refs.toolbar) {
                    this.toolbarHeight = height - layout.$refs.toolbar.computedHeight;
                } else {
                    this.toolbarHeight = height;
                }
            }
        }
    }
</script>