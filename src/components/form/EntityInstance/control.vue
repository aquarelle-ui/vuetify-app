<template>
    <v-select
            v-model="model[name]"
            :error-messages="allErrors"

            :label="$intl.translate(display.title)"
            :hint="$intl.translate(display.hint)"
            :placeholder="$intl.translate(display.placeholder)"
            :prepend-icon="$controlIcon(display.prependIcon)"
            :append-icon="$controlIcon(display.appendIcon)"

            :multiple="config.multiple || false"
            :required="config.required"

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
                <letter-avatar :text="data.item[titleProp] || ''"></letter-avatar>
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
            </v-list-tile-content>
        </template>
    </v-select>
</template>
<script>
    import {JsonFormElementMixin} from "@aquarelle/json-form";
    import {VSelectFixed} from "@aquarelle/vuetify-json-form";
    import {LetterAvatar} from "../../misc";
    import Loaders from "../../../Loaders";

    export default {
        name: 'entity-instance-control',
        mixins: [JsonFormElementMixin],
        components: {
            'v-select': VSelectFixed,
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
            valueProp() {
                return this.config.valueProp || 'id';
            }
        }
    }
</script>
