<template>
    <div v-if="filtered.length === 0" class="text-xs-center caption">
        {{empty}}
    </div>
    <v-list v-else v-bind="$attrs" two-line>
        <v-list-tile v-for="item in filtered" :key="item.href" @click="goto(item.href)">
            <v-list-tile-action>
                <v-icon v-if="item.icon != null">{{$controlIcon(item.icon)}}</v-icon>
                <image-icon v-else :src="$intl.translate(item.title)"></image-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>
                    {{$intl.translate(item.title)}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                    {{$intl.translate(item.description)}}
                </v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>
<script>
    import ImageIcon from "../misc/ImageIcon";

    export default {
        components: {ImageIcon},
        name: 'app-search-results',
        props: {
            app: {
                type: Object,
                required: true
            },
            search: {
                type: String,
                required: false,
                default: ''
            },
            empty: {
                type: String,
                default: 'No results'
            }
        },
        computed: {
            filtered()
            {
                let search = this.search;
                if (search == null || search === '') {
                    return this.items;
                }

                search = search.toLowerCase();

                return this.items.filter(item => {
                    if (item.title !== '' && item.title.toLowerCase().indexOf(search) !== -1) {
                        return true;
                    }
                    if (item.description !== '' && item.description.toLowerCase().indexOf(search) !== -1) {
                        return true;
                    }
                    return false;
                });
            },
            items()
            {
                let allItems = [];

                const all = this.app.vendors;
                for (const p in all) {
                    if (!all.hasOwnProperty(p)) {
                        continue;
                    }

                    const vendor = all[p];
                    if (!this.hasPermissions(vendor.permissions || [])) {
                        continue;
                    }

                    this.app.getAllVendorExtensions(vendor.name).map(ext => {
                        if (!ext.menu || ext.menu.length === 0) {
                            return;
                        }

                        if (!this.hasPermissions(ext.permissions)) {
                            return;
                        }

                        ext.menu.map(category => {
                            if (!category.items || category.items.length === 0) {
                                return;
                            }
                            if (!this.hasPermissions(category.permissions)) {
                                return;
                            }

                            let categoryItems = category.items
                                .filter(item => this.hasPermissions(item.permissions))
                                .map(item => {
                                    return {
                                        vendor: ext.vendor,
                                        extension: {
                                            title: ext.title || '',
                                            icon: ext.icon || null,
                                            description: ext.description || '',
                                            href: '/' + ext.vendor + '/' + ext.name,
                                        },
                                        category: category.title,
                                        title: item.title || '',
                                        description: item.description || '',
                                        icon: item.icon || null,
                                        href: '/' + ext.vendor + '/' + ext.name + '/' + (item.href || ''),
                                    };
                                });

                            if (categoryItems.length > 0) {
                                allItems = allItems.concat(categoryItems);
                            }
                        });
                    });
                }

                return allItems;
            },
        },
        methods: {
            hasPermissions(perm)
            {
                if (perm == null) {
                    return true;
                }
                return this.app.user.hasPermission(perm);
            },
            goto(href)
            {
                this.$router.push(href);
            }
        }
    }
</script>