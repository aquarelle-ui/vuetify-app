<template>
    <app-layout ref="layout">
        <app-menu slot="app-right-drawer"
                  :user="appInfo.user"
                  :app="appInfo.app"
                  :vendor="appInfo.vendor"
                  :extension="appInfo.extension">
        </app-menu>

        <template slot="app-left-drawer">
            <app-user :user="appInfo.user"></app-user>
            <v-text-field v-model.trim="search" label="Search..." append-icon="search" clearable solo hide-details flat></v-text-field>
            <app-search-results v-show="search != null && search !== ''" :app="appInfo.app" :search="search"></app-search-results>
            <app-extensions v-show="search == null || search === ''" :user="appInfo.user" :app="appInfo.app" :current-vendor="appInfo.vendor"></app-extensions>
        </template>
        <v-content>
            <v-layout :style="{height: contentHeight}">
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
    import AppSearchResults from "./AppSearchResults";

    export default {
        name: 'app-extension-route',
        components: {
            AppMenu,
            AppExtensions,
            AppUser,
            AppLayout,
            AppSearchResults
        },
        props: {
            appInfo: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                search: null,
                contentHeight: '100%'
            };
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
                    this.contentHeight = height - layout.$refs.toolbar.computedHeight;
                } else {
                    this.contentHeight = height;
                }
            }
        }
    }
</script>