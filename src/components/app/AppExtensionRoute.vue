<template>
    <app-layout>
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
            <v-layout style="height: calc(100% - 64px)">
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
        props: {
            appInfo: {
                type: Object,
                required: true
            }
        }
    };
</script>