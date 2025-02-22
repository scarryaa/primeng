import { EventEmitter, ElementRef, AfterContentInit, QueryList, TemplateRef } from '@angular/core';
import { BlockableUI } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
import * as i3 from "primeng/icons/minus";
import * as i4 from "primeng/icons/plus";
import * as i5 from "primeng/api";
export declare class Fieldset implements AfterContentInit, BlockableUI {
    private el;
    legend: string;
    toggleable: boolean;
    collapsed: boolean;
    collapsedChange: EventEmitter<any>;
    onBeforeToggle: EventEmitter<any>;
    onAfterToggle: EventEmitter<any>;
    style: any;
    styleClass: string;
    transitionOptions: string;
    templates: QueryList<any>;
    animating: boolean;
    headerTemplate: TemplateRef<any>;
    contentTemplate: TemplateRef<any>;
    collapseIconTemplate: TemplateRef<any>;
    expandIconTemplate: TemplateRef<any>;
    constructor(el: ElementRef);
    id: string;
    ngAfterContentInit(): void;
    toggle(event: any): boolean;
    expand(event: any): void;
    collapse(event: any): void;
    getBlockableElement(): HTMLElement;
    onToggleDone(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Fieldset, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Fieldset, "p-fieldset", never, { "legend": "legend"; "toggleable": "toggleable"; "collapsed": "collapsed"; "style": "style"; "styleClass": "styleClass"; "transitionOptions": "transitionOptions"; }, { "collapsedChange": "collapsedChange"; "onBeforeToggle": "onBeforeToggle"; "onAfterToggle": "onAfterToggle"; }, ["templates"], ["p-header", "*"], false, never>;
}
export declare class FieldsetModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<FieldsetModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<FieldsetModule, [typeof Fieldset], [typeof i1.CommonModule, typeof i2.RippleModule, typeof i3.MinusIcon, typeof i4.PlusIcon], [typeof Fieldset, typeof i5.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<FieldsetModule>;
}
