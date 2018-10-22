import JsonFormDisplay from "../JsonFormDisplay";

import Text from "./text";
import Textarea from "./textarea";
import Tel from "./tel";
import Email from "./email";
import Url from "./url";
import Hidden from "./hidden";
import Color from "./color";
import Combobox from "./combobox";
import Chips from "./chips";
import File from "./file";
import Checkbox from "./checkbox";
import Group from "./group";
import Tabs from "./tabs";
import Select from "./select";
import Variant from "./variant";
import Repeat from "./repeat";
import RepeatVariants from "./repeat-variants";
import GroupRepeat from "./group-repeat";
import GroupRepeatVariants from "./group-repeat-variants";

JsonFormDisplay.addElementControl('text', Text);
JsonFormDisplay.addElementControl('password', Text);
JsonFormDisplay.addElementControl('number', Text);
JsonFormDisplay.addElementControl('slider', Text);
JsonFormDisplay.addElementControl('ipv4', Text);
JsonFormDisplay.addElementControl('ipv6', Text);

JsonFormDisplay.addElementControl('hidden', Hidden);
JsonFormDisplay.addElementControl('uuid', Hidden);

JsonFormDisplay.addElementControl('textarea', Textarea);
JsonFormDisplay.addElementControl('tel', Tel);
JsonFormDisplay.addElementControl('email', Email);
JsonFormDisplay.addElementControl('url', Url);

JsonFormDisplay.addElementControl('color', Color);
JsonFormDisplay.addElementControl('combobox', Combobox);
JsonFormDisplay.addElementControl('chips', Chips);

JsonFormDisplay.addElementControl('file', File);

JsonFormDisplay.addElementControl('checkbox', Checkbox);
JsonFormDisplay.addElementControl('switch', Checkbox);

JsonFormDisplay.addElementControl('group', Group);
JsonFormDisplay.addElementControl('switch-group', Group);
JsonFormDisplay.addElementControl('row', Group);
JsonFormDisplay.addElementControl('col', Group);

JsonFormDisplay.addElementControl('tabs', Tabs);
JsonFormDisplay.addElementControl('select', Select);
JsonFormDisplay.addElementControl('select-group', {
    extends: Select,
    computed: {
        isGrouped()
        {
            return true;
        }
    }
});
JsonFormDisplay.addElementControl('radio', {
    extends: Select,
    computed: {
        isMultiple()
        {
            return false;
        }
    }
});
JsonFormDisplay.addElementControl('checkbox-multi', {
    extends: Select,
    computed: {
        isMultiple()
        {
            return true;
        }
    }
});
JsonFormDisplay.addElementControl('date', {
    extends: Text,
    methods: {
        formatValue(value)
        {
            try {
                return (new Date(value)).toLocaleDateString(this.$intl.language || 'en');
            } catch (e) {
                return value;
            }
        }
    }
});
JsonFormDisplay.addElementControl('time', Text);
JsonFormDisplay.addElementControl('date-time', {
    extends: Text,
    methods: {
        formatValue(value)
        {
            try {
                const v = value.split('T');
                return (new Date(v[0])).toLocaleDateString(this.$intl.language || 'en') + ' ' + v[1];
            } catch (e) {
                return value;
            }
        }
    }
});

JsonFormDisplay.addElementControl('range', {
    extends: Text,
    methods: {
        formatValue(value)
        {
            return value.join(' - ');
        }
    }
});

JsonFormDisplay.addElementControl('variant', Variant);
JsonFormDisplay.addElementControl('repeat', Repeat);
JsonFormDisplay.addElementControl('repeat-variants', RepeatVariants);
JsonFormDisplay.addElementControl('group-repeat', GroupRepeat);
JsonFormDisplay.addElementControl('group-repeat-variants', GroupRepeatVariants);
