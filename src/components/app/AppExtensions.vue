<template>
    <v-list v-bind="$attrs" two-line>
        <v-list-group v-for="vendor in vendors" :key="vendor.name" :value="alwaysOpen || vendor.name === currentVendor">
            <v-list-tile slot="activator">
                <v-list-tile-action>
                    <image-icon :src="vendor.icon || $intl.translate(vendor.title)"></image-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{$intl.translate(vendor.title)}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                        {{$intl.translate(vendor.description)}}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="item in vendor.extensions" :key="item.href" :to="item.extHref">
                <v-list-tile-action>
                    <image-icon :src="item.icon || $intl.translate(item.title)"></image-icon>
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
        </v-list-group>
    </v-list>
</template>
<script>
    import ImageIcon from "../misc/ImageIcon";

    export default {
        components: {ImageIcon},
        name: 'app-extensions',
        props: {
            currentVendor: {
                type: String,
                default: null
            },
            app: {
                type: Object,
                required: true
            },
            alwaysOpen: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            vendors() {
                let vendors = [];
                const all = this.app.vendors;

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
        },
        methods: {
            hasPermissions(perm) {
                return this.app.user.hasPermission(perm);
            },
            getVendorExtensions(vendor) {
                const filtered = [];
                this.app.getAllVendorExtensions(vendor).map(ext => {
                    // Check permissions
                    if (!this.hasPermissions(ext.permissions)) {
                        return;
                    }
                    if (!ext.menu || ext.menu.length === 0) {
                        return;
                    }

                    let href = '';
                    const hasItems = ext.menu.some(region => {
                        if (!region.items || region.items.length === 0 || !this.hasPermissions(region.permissions)) {
                            return false;
                        }
                        return region.items.some(item => {
                            if (this.hasPermissions(item.permissions)) {
                                href = item.href || '';
                                return true;
                            }
                            return false;
                        });
                    });

                    if (!hasItems) {
                        return;
                    }

                    let extHref = '/' + ext.vendor + '/' + ext.name;

                    const item = {
                        vendor: ext.vendor,
                        name: ext.name,
                        title: ext.title,
                        description: ext.description,
                        icon: ext.icon,
                        extHref: extHref,
                        href: extHref + '/' + href,
                    };

                    filtered.push(item);
                });
                return filtered;
            }
        }
    };
</script>
