import { ElementRef, EventEmitter, TemplateRef, QueryList } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/tieredmenu";
import * as i4 from "primeng/icons/chevrondown";
declare type SplitButtonIconPosition = 'left' | 'right';
export declare class SplitButton {
    model: MenuItem[];
    icon: string;
    iconPos: SplitButtonIconPosition;
    label: string;
    onClick: EventEmitter<any>;
    onDropdownClick: EventEmitter<any>;
    style: any;
    styleClass: string;
    menuStyle: any;
    menuStyleClass: string;
    disabled: boolean;
    tabindex: number;
    appendTo: any;
    dir: string;
    expandAriaLabel: string;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    containerViewChild: ElementRef;
    buttonViewChild: ElementRef;
    menu: TieredMenu;
    templates: QueryList<any>;
    contentTemplate: TemplateRef<any>;
    dropdownIconTemplate: TemplateRef<any>;
    ngAfterContentInit(): void;
    onDefaultButtonClick(event: Event): void;
    onDropdownButtonClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SplitButton, "p-splitButton", never, { "model": "model"; "icon": "icon"; "iconPos": "iconPos"; "label": "label"; "style": "style"; "styleClass": "styleClass"; "menuStyle": "menuStyle"; "menuStyleClass": "menuStyleClass"; "disabled": "disabled"; "tabindex": "tabindex"; "appendTo": "appendTo"; "dir": "dir"; "expandAriaLabel": "expandAriaLabel"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; }, { "onClick": "onClick"; "onDropdownClick": "onDropdownClick"; }, ["templates"], never, false, never>;
}
export declare class SplitButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SplitButtonModule, [typeof SplitButton], [typeof i1.CommonModule, typeof i2.ButtonModule, typeof i3.TieredMenuModule, typeof i4.ChevronDownIcon], [typeof SplitButton, typeof i2.ButtonModule, typeof i3.TieredMenuModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SplitButtonModule>;
}
export {};
