<template>
    <v-app>
        <v-navigation-drawer app fixed clipped v-model="leftDrawer">
            <slot name="app-left-drawer"></slot>
        </v-navigation-drawer>
        <v-navigation-drawer app right temporary v-model="rightDrawer">
            <slot name="app-right-drawer"></slot>
        </v-navigation-drawer>

        <v-toolbar style="z-index: 10" app fixed clipped-left clipped-right color="primary" dark>
            <v-toolbar-side-icon @click.stop="leftDrawer = !leftDrawer"></v-toolbar-side-icon>

            <v-toolbar-title id="app-title" class="ml-0"></v-toolbar-title>
            <v-spacer></v-spacer>
            <slot name="app-actions">
                <div id="app-actions"></div>
            </slot>
            <v-btn icon flat @click.stop="rightDrawer = !rightDrawer">
                <v-icon>{{actionIcon}}</v-icon>
            </v-btn>
        </v-toolbar>

        <slot></slot>
    </v-app>
</template>

<script>
    export default {
        name: "app-layout",
        data() {
            return {
                leftDrawer: null,
                rightDrawer: false
            }
        },
        props: {
            actionIcon: {
                type: String,
                default: 'apps'
            }
        },
    }
</script>
