import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import importResolver from "rollup-plugin-import-resolver";
import VuePlugin from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import svg from 'rollup-plugin-svg'
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const NAME = 'Aquarelle.VuetifyApp';
const MAIN = 'src/index.js';

const GLOBALS = {
    'vue': 'Vue',
    'vuetify': 'Vuetify',
    'vue-router': 'VueRouter',
    'quill': 'Quill',
    'highlightjs': 'hljs',
    'ace-builds': 'ace',
    '@aquarelle/intl': 'Aquarelle.Intl',
    '@aquarelle/json-form': 'Aquarelle.JsonForm',
    '@aquarelle/vuetify-json-form': 'Aquarelle.VuetifyJsonForm',
};

const EXTERNAL = Object.keys(GLOBALS);

const resolver = importResolver({extensions: ['.js', '.vue']});
const vuePlugin = VuePlugin({css: false, template: {isProduction: true}});

export default [
    {
        input: MAIN,
        output: {
            name: NAME,
            file: pkg.browser,
            format: 'umd',
            globals: GLOBALS
        },
        external: EXTERNAL,
        plugins: [resolve(), commonjs(), resolver, css(), svg(), vuePlugin, terser()]
    },
    {
        input: MAIN,
        external: EXTERNAL,
        plugins: [resolver, css(), svg(), vuePlugin],
        output: [
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'es'}
        ]
    }
];