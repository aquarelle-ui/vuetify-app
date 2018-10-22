<template>
    <div>
        <span class="subheading font-weight-bold" v-if="title != null">{{$intl.translate(title)}}: </span>
        <slot>
            <span v-if="link == null">{{value}}</span>
            <a v-else :href="link" target="_blank">{{value}}</a>
        </slot>
    </div>
</template>
<script>
    export default {
        props: {
            title: {type: [String, Object], required: false},
            value: {type: String, default: null},
            link: {type: String, default: null}
        }
    }
</script>