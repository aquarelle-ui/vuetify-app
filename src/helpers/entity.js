import {EntityCreateForm, EntityEditForm, EntityListForm} from "../components/form";
import {permissionRoute} from "./router";

export function entityCreateRoute(name, props, permissions = [], options = {})
{
    return permissionRoute({
        path: name,
        component: EntityCreateForm,
        props(route)
        {
            if (typeof props === 'function') {
                return props(route);
            }
            return props;
        },
        ...options
    }, permissions);
}

export function entityEditRoute(name, props, permissions = [], idParam = 'entityInstanceId', options = {}, regex = '[a-zA-Z0-9-:]{3,32}')
{
    let path = ':' + idParam + '(' + regex + ')';
    if (name != null && name !== '') {
        path += '/' + name;
    }
    return permissionRoute({
        path: path,
        component: EntityEditForm,
        props(route)
        {
            if (typeof props === 'function') {
                return props(route, route.params[idParam]);
            }
            return {...props, id: route.params[idParam]};
        },
        ...options
    }, permissions);
}

export function entityListRoute(name, props, permissions = [], options = {})
{
    return permissionRoute({
        path: name,
        component: EntityListForm,
        props(route)
        {
            if (typeof props === 'function') {
                return props(route);
            }
            return props;
        },
        ...options
    }, permissions);
}