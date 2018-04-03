<template>
    <v-list v-bind="$attrs" two-line>
        <v-list-group v-for="vendor in items" :key="vendor.name" v-model="active">
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
            <v-list-tile v-for="item in vendor.extensions" :key="item.href" :to="item.href">
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
            items: {
                type: Array,
                default: () => ([])
            }
        },
        data()
        {
            return {
                active: true
            }
        }
    };
</script>
