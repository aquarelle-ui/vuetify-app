<template>
    <div :class="avatarClass">
        <span :class="textClass">{{letter}}</span>
    </div>
</template>
<script>
    const mainKeys = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green",
        "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "brown", "blue-grey", "grey"];

    const secondaryKeys = ["", "lighten-2", "lighten-1", "darken-1", "darken-2", "accent-2", "accent-3", "accent-4"];
    const mkl = mainKeys.length;
    const skl = secondaryKeys.length;

    export default {
        name: "letter-avatar",
        props: {
            text: {
                type: String,
                required: true
            },
            lettersCount: {
                type: Number,
                default: 1
            },
            toUpper: {
                type: Boolean,
                default: true
            },
            textClass: {
                type: String,
                default: "white--text headline"
            },
            squared: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            avatarClass() {
                const alpha = this.text.charCodeAt(0);
                const omega = this.text.charCodeAt(this.text.length - 1);
                const cls = ['letter-avatar'];
                if (this.squared) {
                    cls.push('squared');
                }
                cls.push(mainKeys[alpha % mkl]);
                cls.push(secondaryKeys[omega % skl]);
                return cls.join(' ').trim();
            },
            letter() {
                const l = this.text.substring(0, this.lettersCount);
                return this.toUpper ? l.toUpperCase() : l;
            }
        }
    }
</script>
<style>
    .letter-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .letter-avatar.squared {
        border-radius: 5% !important;
    }
</style>