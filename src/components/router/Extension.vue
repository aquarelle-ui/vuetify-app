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

        <router-view></router-view>
    </app-layout>
</template>
<script>
    import {AppUser, AppExtensions, AppMenu, AppLayout} from "../app";

    export default {
        name: 'extension-route',
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