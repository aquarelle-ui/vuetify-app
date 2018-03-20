<template>
    <app-layout>
        <app-menu slot="app-left-drawer" :items="menus"></app-menu>

        <template slot="app-right-drawer">
            <app-user :user="appInfo.user"></app-user>
            <app-extensions :items="extensions"></app-extensions>
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
            extensions() {
                let extensions = [];
                const all = this.appInfo.app.getAllExtensions();
                for (const p in all) {
                    if (!all.hasOwnProperty(p)) {
                        continue;
                    }

                    const filtered = [];

                    all[p].map(app => {
                        // Check permissions
                        if (!this.hasPermissions(app.permissions)) {
                            return;
                        }
                        if (app.menu.length > 0) {
                            const hasItems = app.menu.some(region => {
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
                            vendor: app.vendor,
                            name: app.name,
                            title: app.title,
                            description: app.description,
                            icon: app.icon,
                            href: '/' + app.vendor + '/' + app.name
                        };

                        filtered.push(item);
                    });
                    if (filtered.length > 0) {
                        extensions = extensions.concat(filtered);
                    }
                }

                return extensions;
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
            }
        }
    };
</script>