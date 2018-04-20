<template>
    <v-container>
        <h1>Welcome</h1>
        <v-layout row wrap>
            <app-user :user="$user"></app-user>
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
        </v-layout>
    </v-container>
</template>
<script>
    import App from "../../App";
    import AppUser from "./AppUser";
    import ImageIcon from "../misc/ImageIcon";

    export default {
        name: 'app-dashboard',
        components: {ImageIcon, AppUser},
        methods: {
            vendors() {
                let vendors = [];
                const all = App.getAllVendors();

                for (const p in all) {
                    if (!all.hasOwnProperty(p)) {
                        continue;
                    }
                    const vendor = all[p];
                    if (!this.hasPermissions(vendor.permissions || [])) {
                        continue;
                    }
                    if (!this.hasExtPermissions(vendor.name)) {
                        continue;
                    }
                    vendors.push({
                        name: vendor.name,
                        title: vendor.title || vendor.name,
                        description: vendor.description || null,
                        icon: vendor.icon || null,
                        url: vendor.url
                    });
                }
                return vendors;
            },
            hasPermissions(perm) {
                return this.$user.hasPermission(perm);
            },
            hasExtPermissions(vendor)
            {
                return App.getAllVendorExtensions(vendor).map(ext => {
                    // Check permissions
                    if (!this.hasPermissions(ext.permissions)) {
                        return;
                    }
                    if (ext.menu.length === 0) {
                        return true;
                    }
                    return ext.menu.some(region => {
                        if (!this.hasPermissions(region.permissions)) {
                            return false;
                        }
                        return region.items.some(item => this.hasPermissions(item.permissions));
                    });
                });
            }
        }
    };
</script>