<template>
    <v-icon v-if="isIcon" :style="{width: size + 'px', height: size + 'px'}" v-bind="$attrs">{{$controlIcon(source)}}</v-icon>
    <svg v-else-if="isURL && allowSvgFragments && isSvgFragment"
          xmlns="http://www.w3.org/2000/svg"
         :width="size" :height="size" :class="{'image-icon': true, 'squared': squared}" v-bind="$attrs">
            <use :xlink:href="src"></use>
    </svg>
    <v-icon v-else-if="embedSvgDoc && isSvgDocument" v-html="source" v-bind="$attrs"></v-icon>
    <img v-else-if="isURL" :style="{width: size + 'px', height: size + 'px'}"
         :class="{'image-icon': true, 'squared': squared}" :src="source" v-bind="$attrs">
    <letter-avatar v-else-if="letterFallback" :style="{width: size + 'px', height: size + 'px'}" :text="src"
                   :squared="squared" v-bind="$attrs"></letter-avatar>
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
    import Requestor from "../../loader/Requestor";

    const SVG_PATTERN = /^data\:image\/svg\+xml;base64,/i;
    const URL_PATTERN = /^(https?\:|data\:|\/)/i;
    const SVG_FRAGMENT = /^.*\.svg#[^#]*$/i;

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
            },
            size: {
                type: Number,
                default: 40
            },
            allowSvgFragments: {
                type: Boolean,
                default: true
            },
            embedSvgDoc: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            source() {
                let src = this.src;

                if (this.isIcon) {
                    return src.substring(1);
                }

                if (this.isSvgDocument) {
                    let svg = document.createElement('div');
                    svg.innerHTML = atob(src.substring(src.indexOf(',') + 1));
                    svg = svg.firstElementChild;

                    if (!svg.hasAttribute('xmlns')) {
                        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    }

                    if (this.embedSvgDoc) {
                        svg.classList.add('image-icon');
                        if (this.squared) {
                            svg.classList.add('squared');
                        }
                        svg.style.width = this.size + 'px';
                        svg.style.height = this.size + 'px';

                        return svg.outerHTML;
                    }

                    return 'data:image/svg+xml;base64,' + btoa(svg.outerHTML);
                }

                const base = Requestor.getBaseUrl();

                if (base && src.startsWith('/')) {
                    src = base + src;
                }

                return src;
            },
            isURL() {
                return URL_PATTERN.test(this.src);
            },
            isSvgDocument() {
                return SVG_PATTERN.test(this.src);
            },
            isSvgFragment() {
                return !this.src.startsWith('data:') && SVG_FRAGMENT.test(this.src);
            },
            isIcon() {
                return this.src.length > 0 && this.src[0] === '@';
            }
        }
    }
</script>