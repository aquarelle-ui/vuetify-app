import JsonFormDisplayGroup from "./JsonFormDisplayGroup";
import JsonFormDisplay from "./JsonFormDisplay";

export default {
    props: {
        items: {type: Array, required: false},
        model: {type: [Object, Array], default: null},
        files: {type: Object, default: null},
        multiStep: {type: Boolean, default: false}
    },
    render(h)
    {
        if (this.items == null || this.items.length === 0) {
            return null;
        }

        let items = this.items;
        if (this.multiStep) {
            items = [{control: 'tabs', items: items}];
        }
        items = JsonFormDisplay.parseControlList(items);

        return h(JsonFormDisplayGroup, {
            props: {
                items: items,
                files: this.files,
                model: this.model || {},
            }
        });
    }
}