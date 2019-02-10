<template>
    <div class="ace-editor" v-bind="$attrs"></div>
</template>
<style>
    .ace-editor {
        width: 100%;
        min-height: 1px;
    }

    .ace-editor .ace_gutter, .ace-editor .ace_scrollbar {
        z-index: 2;
    }
</style>
<script>
    import ace from "ace-builds";

    export default {
        name: 'ace-editor',
        props: {
            value: {type: String, default: '', required: false},
            lang: {type: String, default: 'html', required: false},
            theme: {type: String, default: null, required: false},
            options: {type: Object, default: () => ({minLines: 5, maxLines: 20, tabSize: 2}), required: false}
        },
        data()
        {
            return {
                editor: null,
                hasSyntaxError: false,
                check: () => {
                    this.hasSyntaxError = this.editor.getSession().getAnnotations().some(annot => {
                        return annot.type === 'error';
                    });
                },
                onChange: () => {
                    this.$emit('input', this.editor.getValue());
                }
            };
        },
        mounted()
        {
            const editor = this.editor = ace.edit(this.$el);
            editor.$blockScrolling = Infinity;
            editor.getSession().setMode('ace/mode/' + this.lang);
            editor.setTheme('ace/theme/' + (this.theme || this.defaultTheme));
            editor.setOptions(this.options);
            editor.setValue(this.value || '', 1);

            editor.on('change', this.onChange);
            editor.on('blur', this.check);
            editor.getSession().on('changeAnnotation', this.check);
        },

        beforeDestroy()
        {
            const editor = this.editor;

            editor.getSession().off('changeAnnotation', this.check);
            editor.off('blur', this.check);
            editor.off('change', this.onChange);

            editor.getSession().destroy();
            editor.destroy();

            const el = this.$el;

            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }

            this.hasSyntaxError = false;
            this.editor = null;
        },
        watch: {
            theme(theme)
            {
                const editor = this.editor;
                editor && editor.setTheme('ace/theme/' + (theme || this.defaultTheme));
            },
            value(val)
            {
                const editor = this.editor;
                if (!editor) {
                    return;
                }

                const cursor = editor.selection.getCursor();
                editor.setValue(val || '');
                editor.clearSelection();
                editor.gotoLine(cursor.row + 1, cursor.column);
            },
            lang(val)
            {
                const editor = this.editor;
                editor && editor.getSession().setMode('ace/mode/' + val);
            },
            options(val)
            {
                const editor = this.editor;
                editor && editor.setOptions(val);
            },
            hasSyntaxError(value) {
                this.$emit('syntax-error', value);
            }
        },
        computed: {
            defaultTheme() {
                return this.$vuetify.dark ? 'twilight' : 'chrome';
            }
        }
    };
</script>