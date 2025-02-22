import { EventEmitter, ChangeDetectorRef, AfterContentInit, TemplateRef, QueryList } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/api";
import * as i4 from "primeng/icons/times";
export declare class InplaceDisplay {
    static ɵfac: i0.ɵɵFactoryDeclaration<InplaceDisplay, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InplaceDisplay, "p-inplaceDisplay", never, {}, {}, never, ["*"], false, never>;
}
export declare class InplaceContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<InplaceContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InplaceContent, "p-inplaceContent", never, {}, {}, never, ["*"], false, never>;
}
export declare class Inplace implements AfterContentInit {
    cd: ChangeDetectorRef;
    active: boolean;
    closable: boolean;
    disabled: boolean;
    preventClick: boolean;
    style: any;
    styleClass: string;
    closeIcon: string;
    templates: QueryList<any>;
    onActivate: EventEmitter<any>;
    onDeactivate: EventEmitter<any>;
    hover: boolean;
    displayTemplate: TemplateRef<any>;
    contentTemplate: TemplateRef<any>;
    closeIconTemplate: TemplateRef<any>;
    constructor(cd: ChangeDetectorRef);
    ngAfterContentInit(): void;
    onActivateClick(event: any): void;
    onDeactivateClick(event: any): void;
    activate(event?: Event): void;
    deactivate(event?: Event): void;
    onKeydown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Inplace, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Inplace, "p-inplace", never, { "active": "active"; "closable": "closable"; "disabled": "disabled"; "preventClick": "preventClick"; "style": "style"; "styleClass": "styleClass"; "closeIcon": "closeIcon"; }, { "onActivate": "onActivate"; "onDeactivate": "onDeactivate"; }, ["templates"], ["[pInplaceDisplay]", "[pInplaceContent]"], false, never>;
}
export declare class InplaceModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<InplaceModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InplaceModule, [typeof Inplace, typeof InplaceDisplay, typeof InplaceContent], [typeof i1.CommonModule, typeof i2.ButtonModule, typeof i3.SharedModule, typeof i4.TimesIcon], [typeof Inplace, typeof InplaceDisplay, typeof InplaceContent, typeof i2.ButtonModule, typeof i3.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InplaceModule>;
}
