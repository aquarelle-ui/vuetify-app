<template>
    <v-app>
        <v-card flat>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Welcome to Aquarelle</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu offset-x max-width="320">
                    <v-btn icon slot="activator"><v-icon>person</v-icon></v-btn>
                    <app-user style="width: 320px" :user="$user"></app-user>
                </v-menu>
            </v-toolbar>
            <app-extensions :user="$user" :app="app" always-open></app-extensions>
        </v-card>
    </v-app>
</template>
<script>
    import App from "../../App";
    import AppExtensions from "./AppExtensions";
    import AppUser from "./AppUser";
    import ImageIcon from "../misc/ImageIcon";

    export default {
        name: 'app-dashboard',
        components: {ImageIcon, AppUser, AppExtensions},
        computed: {
            app() {
                return App;
            }
        },
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
                        url: vendor.url,
                        extensions: App.getAllVendorExtensions(vendor.name)
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