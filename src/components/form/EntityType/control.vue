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

            clearable

            :items="loadedItems"
            :item-value="getValue"
            :item-text="titleProp"
            :item-avatar="iconProp"

            :value-comparator="$equals"
            :loading="loading"
            :disabled="loading"
    >
        <template slot="selection" slot-scope="data">
            <template>
                <image-icon :src="data.item[iconProp] || data.item[titleProp]" :squared="display.squared"></image-icon>
                <span class="ml-1 mr-1">{{data.item[titleProp]}}</span>
            </template>
        </template>
        <template slot="item" slot-scope="data">
            <v-list-tile-avatar>
                <image-icon :src="data.item[iconProp] || data.item[titleProp]" :squared="display.squared"></image-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>
                    {{data.item[titleProp]}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                    {{data.item[descriptionProp]}}
                    <small v-if="!display.hideType">({{data.item.behavior ? data.item.type + ':' + data.item.behavior : data.item.type}})</small>
                </v-list-tile-sub-title>
            </v-list-tile-content>
        </template>
    </v-autocomplete>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {ImageIcon} from "../../misc";
    import Loaders from "../../../Loaders";

    export default {
        name: 'entity-type-control',
        mixins: [JsonFormElementMixin],
        components: {
            ImageIcon
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
            getValue(item) {
                return {type: item.type, behavior: item.behavior};
            },
            refresh() {
                this.loading = true;
                const loader = this.loader;
                if (loader) {
                    this.loader.cached(this.config.cacheKey).then(data => {
                        this.loadedItems = this.translateItems(data);
                        this.loading = false;
                        this.reset();
                    });
                }
            },
            translateItems(items) {
                return items.map(item => {
                    item = {...item};
                    item[this.titleProp] = this.$intl.translate(item[this.titleProp]);
                    item[this.descriptionProp] = this.$intl.translate(item[this.descriptionProp]);
                    return item;
                });
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
            iconProp() {
                return this.config.iconProp || 'icon';
            }
        }
    }
</script>
