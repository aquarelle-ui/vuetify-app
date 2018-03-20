<template>
    <v-list v-bind="$attrs" two-line>
        <template v-for="region in items">
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
            items: {
                type: Array,
                default: () => ([])
            }
        }
    }
</script>
