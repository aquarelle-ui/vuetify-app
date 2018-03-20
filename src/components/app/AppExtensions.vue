<template>
    <v-list v-bind="$attrs" two-line>
        <v-list-tile v-for="item in items" :key="item.href" :to="item.href">
            <v-list-tile-action>
                <v-icon v-if="!!item.icon">{{$controlIcon(item.icon)}}</v-icon>
                <letter-avatar v-else :text="$intl.translate(item.title)"></letter-avatar>
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
    import LetterAvatar from "../misc/LetterAvatar";

    export default {
        components: {LetterAvatar},
        name: 'app-extensions',
        props: {
            items: {
                type: Array,
                default: () => ([])
            }
        }
    };
</script>
