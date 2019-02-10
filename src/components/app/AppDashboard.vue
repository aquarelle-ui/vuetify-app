<template>
    <app>
        <v-card flat>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Welcome to Aquarelle</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu offset-x max-width="320">
                    <v-btn icon slot="activator"><v-icon>person</v-icon></v-btn>
                    <app-user style="width: 320px" :user="app.user"></app-user>
                </v-menu>
            </v-toolbar>
            <v-text-field v-model.trim="search" label="Search..." append-icon="search" clearable solo hide-details flat></v-text-field>
            <app-search-results v-show="search != null && search !== ''" :app="app" :search="search"></app-search-results>
            <app-extensions v-show="search == null || search === ''" :app="app" always-open></app-extensions>
        </v-card>
    </app>
</template>
<script>
    import AppExtensions from "./AppExtensions";
    import AppUser from "./AppUser";
    import AppSearchResults from "./AppSearchResults";
    import App from "./App";
    import {ImageIcon} from "../misc";

    export default {
        name: 'app-dashboard',
        components: {ImageIcon, AppUser, AppExtensions, AppSearchResults, App},
        props: {
            app: {type: Object, required: true}
        },
        data() {
            return {search: null};
        },
        methods: {
            vendors() {
                let vendors = [];
                const all = this.app.getAllVendors();

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
                        extensions: this.app.getAllVendorExtensions(vendor.name)
                    });
                }
                return vendors;
            },
            hasPermissions(perm) {
                return this.app.user.hasPermission(perm);
            },
            hasExtPermissions(vendor)
            {
                return this.app.getAllVendorExtensions(vendor).map(ext => {
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