import { AnimationEvent } from '@angular/animations';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { OverlayOptions, OverlayService, PrimeNGConfig, TreeNode } from 'primeng/api';
import { Overlay } from 'primeng/overlay';
import { Tree } from 'primeng/tree';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/overlay";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/api";
import * as i5 from "primeng/tree";
import * as i6 from "primeng/icons/search";
import * as i7 from "primeng/icons/times";
import * as i8 from "primeng/icons/chevrondown";
export declare const TREESELECT_VALUE_ACCESSOR: any;
export declare class TreeSelect implements AfterContentInit {
    config: PrimeNGConfig;
    cd: ChangeDetectorRef;
    el: ElementRef;
    overlayService: OverlayService;
    type: string;
    inputId: string;
    scrollHeight: string;
    disabled: boolean;
    metaKeySelection: boolean;
    display: string;
    selectionMode: string;
    tabindex: string;
    ariaLabelledBy: string;
    placeholder: string;
    panelClass: string;
    panelStyle: any;
    panelStyleClass: string;
    containerStyle: object;
    containerStyleClass: string;
    labelStyle: object;
    labelStyleClass: string;
    overlayOptions: OverlayOptions;
    emptyMessage: string;
    appendTo: any;
    filter: boolean;
    filterBy: string;
    filterMode: string;
    filterPlaceholder: string;
    filterLocale: string;
    filterInputAutoFocus: boolean;
    propagateSelectionDown: boolean;
    propagateSelectionUp: boolean;
    showClear: boolean;
    resetFilterOnHide: boolean;
    get options(): any[];
    set options(options: any[]);
    templates: QueryList<any>;
    containerEl: ElementRef;
    focusInput: ElementRef;
    filterViewChild: ElementRef;
    treeViewChild: Tree;
    panelEl: ElementRef;
    overlayViewChild: Overlay;
    onNodeExpand: EventEmitter<any>;
    onNodeCollapse: EventEmitter<any>;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    onClear: EventEmitter<any>;
    onFilter: EventEmitter<any>;
    onNodeUnselect: EventEmitter<any>;
    onNodeSelect: EventEmitter<any>;
    _showTransitionOptions: string;
    get showTransitionOptions(): string;
    set showTransitionOptions(val: string);
    _hideTransitionOptions: string;
    get hideTransitionOptions(): string;
    set hideTransitionOptions(val: string);
    filteredNodes: TreeNode[];
    filterValue: string;
    serializedValue: any[];
    valueTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    emptyTemplate: TemplateRef<any>;
    footerTemplate: TemplateRef<any>;
    clearIconTemplate: TemplateRef<any>;
    triggerIconTemplate: TemplateRef<any>;
    filterIconTemplate: TemplateRef<any>;
    closeIconTemplate: TemplateRef<any>;
    itemTogglerIconTemplate: TemplateRef<any>;
    itemCheckboxIconTemplate: TemplateRef<any>;
    itemLoadingIconTemplate: TemplateRef<any>;
    focused: boolean;
    overlayVisible: boolean;
    selfChange: boolean;
    value: any;
    expandedNodes: any[];
    _options: any[];
    templateMap: any;
    onModelChange: Function;
    onModelTouched: Function;
    constructor(config: PrimeNGConfig, cd: ChangeDetectorRef, el: ElementRef, overlayService: OverlayService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    onSelectionChange(event: any): void;
    onClick(event: any): void;
    onKeyDown(event: any): void;
    onFilterInput(event: any): void;
    show(): void;
    hide(event?: any): void;
    clear(event: any): void;
    checkValue(): boolean;
    resetFilter(): void;
    updateTreeState(): void;
    updateTreeBranchState(node: any, path: any, selectedNodes: any): void;
    expandPath(expandedNodes: any): void;
    nodeExpand(event: any): void;
    nodeCollapse(event: any): void;
    resetExpandedNodes(): void;
    resetPartialSelected(nodes?: any[]): void;
    findSelectedNodes(node: any, keys: any, selectedNodes: any): void;
    isSelected(node: TreeNode): boolean;
    findIndexInSelection(node: TreeNode): number;
    onSelect(node: any): void;
    onUnselect(node: any): void;
    onFocus(): void;
    onBlur(): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    containerClass(): {
        'p-treeselect p-component p-inputwrapper': boolean;
        'p-treeselect-chip': boolean;
        'p-disabled': boolean;
        'p-focus': boolean;
    };
    labelClass(): {
        'p-treeselect-label': boolean;
        'p-placeholder': boolean;
        'p-treeselect-label-empty': boolean;
    };
    get emptyValue(): boolean;
    get emptyOptions(): boolean;
    get label(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeSelect, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TreeSelect, "p-treeSelect", never, { "type": "type"; "inputId": "inputId"; "scrollHeight": "scrollHeight"; "disabled": "disabled"; "metaKeySelection": "metaKeySelection"; "display": "display"; "selectionMode": "selectionMode"; "tabindex": "tabindex"; "ariaLabelledBy": "ariaLabelledBy"; "placeholder": "placeholder"; "panelClass": "panelClass"; "panelStyle": "panelStyle"; "panelStyleClass": "panelStyleClass"; "containerStyle": "containerStyle"; "containerStyleClass": "containerStyleClass"; "labelStyle": "labelStyle"; "labelStyleClass": "labelStyleClass"; "overlayOptions": "overlayOptions"; "emptyMessage": "emptyMessage"; "appendTo": "appendTo"; "filter": "filter"; "filterBy": "filterBy"; "filterMode": "filterMode"; "filterPlaceholder": "filterPlaceholder"; "filterLocale": "filterLocale"; "filterInputAutoFocus": "filterInputAutoFocus"; "propagateSelectionDown": "propagateSelectionDown"; "propagateSelectionUp": "propagateSelectionUp"; "showClear": "showClear"; "resetFilterOnHide": "resetFilterOnHide"; "options": "options"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; }, { "onNodeExpand": "onNodeExpand"; "onNodeCollapse": "onNodeCollapse"; "onShow": "onShow"; "onHide": "onHide"; "onClear": "onClear"; "onFilter": "onFilter"; "onNodeUnselect": "onNodeUnselect"; "onNodeSelect": "onNodeSelect"; }, ["templates"], never, false, never>;
}
export declare class TreeSelectModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeSelectModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TreeSelectModule, [typeof TreeSelect], [typeof i1.CommonModule, typeof i2.OverlayModule, typeof i3.RippleModule, typeof i4.SharedModule, typeof i5.TreeModule, typeof i6.SearchIcon, typeof i7.TimesIcon, typeof i8.ChevronDownIcon], [typeof TreeSelect, typeof i2.OverlayModule, typeof i4.SharedModule, typeof i5.TreeModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TreeSelectModule>;
}
