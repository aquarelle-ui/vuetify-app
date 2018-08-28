import {EntityCreateForm, EntityEditForm, EntityListForm} from "../components/form";
import {permissionRoute} from "./router";

export function entityCreateRoute(name, props, permissions = [], options = {})
{
    return permissionRoute({
        path: name,
        component: EntityCreateForm,
        props()
        {
            return props;
        },
        ...options
    }, permissions);
}

export function entityEditRoute(name, props, permissions = [], idParam = 'entityInstanceId', options = {})
{
    return permissionRoute({
        path: ':' + idParam + '([a-zA-Z0-9-:]{3,32})' + '/' + name,
        component: EntityEditForm,
        props(route)
        {
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
        props()
        {
            return props;
        },
        ...options
    }, permissions);
}