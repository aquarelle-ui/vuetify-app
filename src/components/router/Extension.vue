<template>
    <app-layout>
        <app-menu slot="app-left-drawer" :items="menus"></app-menu>

        <template slot="app-right-drawer">
            <app-user :user="appInfo.user"></app-user>
            <app-extensions :items="vendors"></app-extensions>
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
        },
        computed: {
            vendors() {
                let vendors = [];
                const all = this.appInfo.app.getAllVendors();

                for (const p in all) {
                    if (!all.hasOwnProperty(p)) {
                        continue;
                    }
                    const vendor = all[p];
                    if (!this.hasPermissions(vendor.permissions || [])) {
                        continue;
                    }
                    const extensions = this.getVendorExtensions(vendor.name);
                    if (extensions.length === 0) {
                        continue;
                    }
                    vendors.push({
                        name: vendor.name,
                        title: vendor.title || vendor.name,
                        description: vendor.description || null,
                        icon: vendor.icon || null,
                        extensions,
                    });
                }

                return vendors;
            },
            hrefPrefix() {
                return '/' + this.appInfo.vendor + '/' + this.appInfo.extension + '/';
            },
            menus() {
                const app = this.appInfo.app.getVendorExtension(this.appInfo.vendor, this.appInfo.extension);

                if (!app || !app.menu || app.menu.length === 0) {
                    return [];
                }
                const menu = [];

                app.menu.map(region => {
                    if (!this.hasPermissions(region.permissions)) {
                        return;
                    }
                    const items = [];

                    if (region.items && region.items.length > 0) {
                        region.items.map(item => {
                            if (!this.hasPermissions(item.permissions)) {
                                return;
                            }
                            items.push({
                                title: item.title || null,
                                description: item.description || null,
                                icon: item.icon || null,
                                permissions: item.permissions || [],
                                href: this.hrefPrefix + (item.href || '')
                            });
                        });
                    }

                    if (items.length === 0) {
                        return;
                    }

                    menu.push({
                        title: region.title || null,
                        permissions: region.permissions || [],
                        icon: region.icon || null,
                        items: items,
                    });
                });

                return menu;
            },
        },
        methods: {
            hasPermissions(perm) {
                return this.appInfo.user.hasPermission(perm);
            },
            getVendorExtensions(vendor)
            {
                const filtered = [];
                this.appInfo.app.getAllVendorExtensions(vendor).map(ext => {
                    // Check permissions
                    if (!this.hasPermissions(ext.permissions)) {
                        return;
                    }
                    if (ext.menu.length > 0) {
                        const hasItems = ext.menu.some(region => {
                            if (!this.hasPermissions(region.permissions)) {
                                return false;
                            }
                            return region.items.some(item => this.hasPermissions(item.permissions));
                        });
                        if (!hasItems) {
                            return;
                        }
                    }

                    const item = {
                        vendor: ext.vendor,
                        name: ext.name,
                        title: ext.title,
                        description: ext.description,
                        icon: ext.icon,
                        href: '/' + ext.vendor + '/' + ext.name
                    };

                    filtered.push(item);
                });

                return filtered;
            }
        }
    };
</script>