export interface ListDbModel {
    list_id: number;
    name: string;
    tenant_id: string;
}

export interface ListModel extends ListDbModel {
    clone(): ListModel;
}

export function ListModel(
    name: string,
    tenant_id: string
): ListModel;

export function ListModel(
    list_id: number,
    name: string,
    tenant_id: string
): ListModel;

export function ListModel(...args: unknown[]): ListModel {
    if (args.length == 2) {
        args.unshift(0);
    }

    return _ListModel(...args as [number, string, string]);
}

function _ListModel(list_id: number, name: string, tenant_id: string): ListModel {
    const obj: ListModel = {
        list_id: list_id,
        name: name,
        tenant_id: tenant_id,
        clone: clone
    };

    obj.clone = obj.clone.bind(obj);
    return obj;
}

function clone(this: ListModel): ListModel {
    const obj: ListModel = {
        list_id: this.list_id,
        name: this.name,
        tenant_id: this.tenant_id,
        clone: clone,
    }

    obj.clone = clone.bind(obj);
    return obj;
}
