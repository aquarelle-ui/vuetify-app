<template>
    <v-list two-line>
        <v-list-tile v-for="item in vendors()" avatar :key="item.name" :to="item.url">
            <v-list-tile-avatar>
                <image-icon :src="item.icon || item.title"></image-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
                <v-list-tile-sub-title>{{item.description}}</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>
<script>
    import App from "../../App";
    import ImageIcon from "../misc/ImageIcon";

    export default {
        name: 'app-dashboard',
        components: {ImageIcon},
        methods: {
            vendors()
            {
                return App.getAllVendors();
            }
        }
    };
</script>