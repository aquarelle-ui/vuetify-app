<template>
    <v-autocomplete
            v-model="model[name]"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"
            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :box="display.appearance === 'box'"
            :solo="display.appearance === 'solo'"
            :solo-inverted="display.appearance === 'solo-inverted'"
            :outline="display.appearance === 'outline'"
            :flat="!!display.flat"

            :multiple="config.multiple || false"

            hide-selected

            autocomplete
            clearable

            :items="loadedItems"
            :item-value="valueProp"
            :item-text="titleProp"

            :value-comparator="$equals"
            :loading="loading"
            :disabled="loading"
    >
        <template slot="selection" slot-scope="data">
            <template>
                <span class="ml-1 mr-1">{{data.item[titleProp]}}</span>
            </template>
        </template>
        <template slot="item" slot-scope="data">
            <v-list-tile-avatar>
                <letter-avatar :text="data.item[titleProp] || ''"></letter-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>
                    {{data.item[titleProp]}}
                </v-list-tile-title>
                <v-list-tile-sub-title v-if="!display.hideType">
                    {{data.item.behavior ? data.item.type + ':' + data.item.behavior : data.item.type}}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title v-else>
                    {{data.item[descriptionProp] || ''}}
                </v-list-tile-sub-title>
            </v-list-tile-content>
        </template>
    </v-autocomplete>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {LetterAvatar} from "../../misc";
    import Loaders from "../../../Loaders";

    export default {
        name: 'entity-instance-control',
        mixins: [JsonFormElementMixin],
        components: {
            LetterAvatar
        },
        data() {
            return {
                loading: true,
                loadedItems: []
            };
        },
        created() {
            this.refresh();
        },
        methods: {
            refresh() {
                this.loading = true;
                const loader = this.loader;
                if (loader) {
                    this.loader.cached(this.config.cacheKey).then(data => {
                        this.loadedItems = data.collection;
                        this.loading = false;
                        this.reset();
                    });
                }
            }
        },
        computed: {
            loader() {
                return Loaders.get(this.config.entity);
            },
            titleProp() {
                return this.config.titleProp || 'title';
            },
            descriptionProp() {
                return this.config.descriptionProp || 'description';
            },
            valueProp() {
                return this.config.valueProp || 'id';
            }
        }
    }
</script>
