/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzExtParentTreeItem, AzExtTreeItem } from "vscode-azureextensionui";
import { ILocalItem, LocalRootTreeItemBase } from "./LocalRootTreeItemBase";
import { CommonProperty } from "./settings/CommonProperties";

export abstract class LocalGroupTreeItemBase<TItem extends ILocalItem, TProperty extends string | CommonProperty> extends AzExtParentTreeItem {
    public parent: LocalRootTreeItemBase<TItem, TProperty>;
    public group: string;
    private _items: TItem[];

    public constructor(parent: LocalRootTreeItemBase<TItem, TProperty>, group: string, items: TItem[]) {
        super(parent);
        this.group = group;
        this._items = items;
    }

    public get label(): string {
        return this.group;
    }

    public get id(): string {
        return this.group + '|LocalGroup'; // Add suffix to ensure this id doesn't coincidentally overlap with a non-grouped item
    }

    public get maxCreatedTime(): number {
        return Math.max(...this._items.map(i => i.createdTime));
    }

    public async loadMoreChildrenImpl(_clearCache: boolean): Promise<AzExtTreeItem[]> {
        return this._items.map(i => new this.parent.childType(this, i));
    }

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public compareChildrenImpl(ti1: AzExtTreeItem, ti2: AzExtTreeItem): number {
        return this.parent.compareChildrenImpl(ti1, ti2);
    }
}
