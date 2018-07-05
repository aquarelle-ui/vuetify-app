<template>
    <v-list v-bind="$attrs" two-line>
        <template v-for="region in menus">
            <v-subheader>{{$intl.translate(region.title)}}</v-subheader>
            <v-list-tile v-for="item in region.items" :key="item.href" :to="item.href">
                <v-list-tile-action>
                    <v-icon>{{$controlIcon(item.icon)}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{$intl.translate(item.title)}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="item.description !== null">
                        {{$intl.translate(item.description)}}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
    </v-list>
</template>
<script>
    export default {
        name: 'app-menu',
        props: {
            user: {
                type: Object,
                required: true
            },
            app: {
                type: Object,
                required: true
            },
            vendor: {
                type: String
            },
            extension: {
                type: String
            }
        },
        computed: {
            menus() {
                const app = this.app.getVendorExtension(this.vendor, this.extension);

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
            hrefPrefix() {
                return '/' + this.vendor + '/' + this.extension + '/';
            }
        },
        methods: {
            hasPermissions(perm) {
                return this.user.hasPermission(perm);
            }
        }
    }
</script>
