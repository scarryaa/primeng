import { AnimationEvent } from '@angular/animations';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnInit, QueryList, Renderer2, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FilterService, OverlayOptions, PrimeNGConfig, SelectItem } from 'primeng/api';
import { Overlay } from 'primeng/overlay';
import { Scroller, ScrollerOptions } from 'primeng/scroller';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/overlay";
import * as i3 from "primeng/api";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/ripple";
import * as i6 from "primeng/scroller";
import * as i7 from "primeng/autofocus";
import * as i8 from "primeng/icons/times";
import * as i9 from "primeng/icons/chevrondown";
import * as i10 from "primeng/icons/search";
export declare const DROPDOWN_VALUE_ACCESSOR: any;
export interface DropdownFilterOptions {
    filter?: (value?: any) => void;
    reset?: () => void;
}
export declare class DropdownItem {
    option: SelectItem;
    selected: boolean;
    _label: string;
    label: string;
    disabled: boolean;
    visible: boolean;
    itemSize: number;
    template: TemplateRef<any>;
    onClick: EventEmitter<any>;
    onOptionClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DropdownItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DropdownItem, "p-dropdownItem", never, { "option": "option"; "selected": "selected"; "label": "label"; "disabled": "disabled"; "visible": "visible"; "itemSize": "itemSize"; "template": "template"; }, { "onClick": "onClick"; }, never, never, false, never>;
}
export declare class Dropdown implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, ControlValueAccessor {
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    zone: NgZone;
    filterService: FilterService;
    config: PrimeNGConfig;
    scrollHeight: string;
    filter: boolean;
    name: string;
    style: any;
    panelStyle: any;
    styleClass: string;
    panelStyleClass: string;
    readonly: boolean;
    required: boolean;
    editable: boolean;
    appendTo: any;
    tabindex: number;
    placeholder: string;
    filterPlaceholder: string;
    filterLocale: string;
    inputId: string;
    selectId: string;
    dataKey: string;
    filterBy: string;
    autofocus: boolean;
    resetFilterOnHide: boolean;
    dropdownIcon: string;
    optionLabel: string;
    optionValue: string;
    optionDisabled: string;
    optionGroupLabel: string;
    optionGroupChildren: string;
    autoDisplayFirst: boolean;
    group: boolean;
    showClear: boolean;
    emptyFilterMessage: string;
    emptyMessage: string;
    lazy: boolean;
    virtualScroll: boolean;
    virtualScrollItemSize: number;
    virtualScrollOptions: ScrollerOptions;
    overlayOptions: OverlayOptions;
    ariaFilterLabel: string;
    ariaLabel: string;
    ariaLabelledBy: string;
    filterMatchMode: string;
    maxlength: number;
    tooltip: string;
    tooltipPosition: string;
    tooltipPositionStyle: string;
    tooltipStyleClass: string;
    autofocusFilter: boolean;
    overlayDirection: string;
    onChange: EventEmitter<any>;
    onFilter: EventEmitter<any>;
    onFocus: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    onClick: EventEmitter<any>;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    onClear: EventEmitter<any>;
    onLazyLoad: EventEmitter<any>;
    containerViewChild: ElementRef;
    filterViewChild: ElementRef;
    accessibleViewChild: ElementRef;
    editableInputViewChild: ElementRef;
    itemsViewChild: ElementRef;
    scroller: Scroller;
    overlayViewChild: Overlay;
    templates: QueryList<any>;
    private _disabled;
    get disabled(): boolean;
    set disabled(_disabled: boolean);
    _itemSize: number;
    get itemSize(): number;
    set itemSize(val: number);
    _autoZIndex: boolean;
    get autoZIndex(): boolean;
    set autoZIndex(val: boolean);
    _baseZIndex: number;
    get baseZIndex(): number;
    set baseZIndex(val: number);
    _showTransitionOptions: string;
    get showTransitionOptions(): string;
    set showTransitionOptions(val: string);
    _hideTransitionOptions: string;
    get hideTransitionOptions(): string;
    set hideTransitionOptions(val: string);
    itemsWrapper: HTMLDivElement;
    itemTemplate: TemplateRef<any>;
    groupTemplate: TemplateRef<any>;
    loaderTemplate: TemplateRef<any>;
    selectedItemTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    filterTemplate: TemplateRef<any>;
    footerTemplate: TemplateRef<any>;
    emptyFilterTemplate: TemplateRef<any>;
    emptyTemplate: TemplateRef<any>;
    dropdownIconTemplate: TemplateRef<any>;
    clearIconTemplate: TemplateRef<any>;
    filterIconTemplate: TemplateRef<any>;
    filterOptions: DropdownFilterOptions;
    selectedOption: any;
    _options: any[];
    value: any;
    onModelChange: Function;
    onModelTouched: Function;
    optionsToDisplay: any[];
    hover: boolean;
    focused: boolean;
    overlayVisible: boolean;
    optionsChanged: boolean;
    panel: HTMLDivElement;
    dimensionsUpdated: boolean;
    hoveredItem: any;
    selectedOptionUpdated: boolean;
    _filterValue: string;
    searchValue: string;
    searchIndex: number;
    searchTimeout: any;
    previousSearchChar: string;
    currentSearchChar: string;
    preventModelTouched: boolean;
    id: string;
    labelId: string;
    listId: string;
    constructor(el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, zone: NgZone, filterService: FilterService, config: PrimeNGConfig);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    get options(): any[];
    set options(val: any[]);
    get filterValue(): string;
    set filterValue(val: string);
    ngAfterViewInit(): void;
    get label(): string;
    get emptyMessageLabel(): string;
    get emptyFilterMessageLabel(): string;
    get filled(): boolean;
    get isVisibleClearIcon(): boolean;
    updateEditableLabel(): void;
    getOptionLabel(option: any): any;
    getOptionValue(option: any): any;
    isOptionDisabled(option: any): any;
    getOptionGroupLabel(optionGroup: any): any;
    getOptionGroupChildren(optionGroup: any): any;
    onItemClick(event: any): void;
    selectItem(event: any, option: any): void;
    ngAfterViewChecked(): void;
    writeValue(value: any): void;
    resetFilter(): void;
    updateSelectedOption(val: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    onMouseclick(event: any): void;
    isInputClick(event: any): boolean;
    isEmpty(): boolean;
    onEditableInputFocus(event: any): void;
    onEditableInputChange(event: any): void;
    show(): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    hide(): void;
    onInputFocus(event: any): void;
    onInputBlur(event: any): void;
    findPrevEnabledOption(index: any): any;
    findNextEnabledOption(index: any): any;
    onKeydown(event: KeyboardEvent, search: boolean): void;
    search(event: KeyboardEvent): void;
    searchOption(index: any): any;
    searchOptionInRange(start: any, end: any): any;
    searchOptionWithinGroup(index: any): any;
    findOptionIndex(val: any, opts: any[]): number;
    findOptionGroupIndex(val: any, opts: any[]): any;
    findOption(val: any, opts: any[], inGroup?: boolean): SelectItem;
    onFilterInputChange(event: any): void;
    activateFilter(): void;
    applyFocus(): void;
    focus(): void;
    clear(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Dropdown, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Dropdown, "p-dropdown", never, { "scrollHeight": "scrollHeight"; "filter": "filter"; "name": "name"; "style": "style"; "panelStyle": "panelStyle"; "styleClass": "styleClass"; "panelStyleClass": "panelStyleClass"; "readonly": "readonly"; "required": "required"; "editable": "editable"; "appendTo": "appendTo"; "tabindex": "tabindex"; "placeholder": "placeholder"; "filterPlaceholder": "filterPlaceholder"; "filterLocale": "filterLocale"; "inputId": "inputId"; "selectId": "selectId"; "dataKey": "dataKey"; "filterBy": "filterBy"; "autofocus": "autofocus"; "resetFilterOnHide": "resetFilterOnHide"; "dropdownIcon": "dropdownIcon"; "optionLabel": "optionLabel"; "optionValue": "optionValue"; "optionDisabled": "optionDisabled"; "optionGroupLabel": "optionGroupLabel"; "optionGroupChildren": "optionGroupChildren"; "autoDisplayFirst": "autoDisplayFirst"; "group": "group"; "showClear": "showClear"; "emptyFilterMessage": "emptyFilterMessage"; "emptyMessage": "emptyMessage"; "lazy": "lazy"; "virtualScroll": "virtualScroll"; "virtualScrollItemSize": "virtualScrollItemSize"; "virtualScrollOptions": "virtualScrollOptions"; "overlayOptions": "overlayOptions"; "ariaFilterLabel": "ariaFilterLabel"; "ariaLabel": "ariaLabel"; "ariaLabelledBy": "ariaLabelledBy"; "filterMatchMode": "filterMatchMode"; "maxlength": "maxlength"; "tooltip": "tooltip"; "tooltipPosition": "tooltipPosition"; "tooltipPositionStyle": "tooltipPositionStyle"; "tooltipStyleClass": "tooltipStyleClass"; "autofocusFilter": "autofocusFilter"; "overlayDirection": "overlayDirection"; "disabled": "disabled"; "itemSize": "itemSize"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; "options": "options"; "filterValue": "filterValue"; }, { "onChange": "onChange"; "onFilter": "onFilter"; "onFocus": "onFocus"; "onBlur": "onBlur"; "onClick": "onClick"; "onShow": "onShow"; "onHide": "onHide"; "onClear": "onClear"; "onLazyLoad": "onLazyLoad"; }, ["templates"], never, false, never>;
}
export declare class DropdownModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DropdownModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DropdownModule, [typeof Dropdown, typeof DropdownItem], [typeof i1.CommonModule, typeof i2.OverlayModule, typeof i3.SharedModule, typeof i4.TooltipModule, typeof i5.RippleModule, typeof i6.ScrollerModule, typeof i7.AutoFocusModule, typeof i8.TimesIcon, typeof i9.ChevronDownIcon, typeof i10.SearchIcon], [typeof Dropdown, typeof i2.OverlayModule, typeof i3.SharedModule, typeof i6.ScrollerModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DropdownModule>;
}
