<template>
    <img v-if="isURL" :class="{'image-icon': true, 'squared': squared}" :src="source" v-bind="$attrs">
    <letter-avatar v-else-if="letterFallback" :text="src" :squared="squared" v-bind="$attrs"></letter-avatar>
</template>
<style>
    .image-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .image-icon.squared {
        border-radius: 5% !important;
    }
</style>
<script>
    import LetterAvatar from "./LetterAvatar";

    const SVG = /^\s*\<svg(\s|\>)/i;
    const URL = /^(https?\:|data\:|\/)/i;

    export default {
        name: 'image-icon',
        components: {LetterAvatar},
        props: {
            src: {
                type: String,
                default: ''
            },
            letterFallback: {
                type: Boolean,
                default: true
            },
            squared: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            source() {
                let src = this.src;
                if (SVG.test(src)) {
                    if (src.indexOf('xmlns="http://www.w3.org/2000/svg"') === -1) {
                        src = src.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
                    }
                    return 'data:image/svg+xml;base64,' + btoa(src);
                }
                return src;
            },
            isURL() {
                return URL.test(this.source);
            }
        }
    }
</script>