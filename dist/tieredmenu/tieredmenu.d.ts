import { ElementRef, Renderer2, OnDestroy, ChangeDetectorRef, EventEmitter, QueryList, AfterContentInit, TemplateRef } from '@angular/core';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { MenuItem, OverlayService, PrimeNGConfig } from 'primeng/api';
import { AnimationEvent } from '@angular/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/icons/angleright";
import * as i6 from "primeng/api";
export declare class TieredMenuSub implements OnDestroy {
    private document;
    el: ElementRef;
    renderer: Renderer2;
    private cd;
    tieredMenu: TieredMenu;
    item: MenuItem;
    root: boolean;
    autoDisplay: boolean;
    autoZIndex: boolean;
    baseZIndex: number;
    mobileActive: boolean;
    popup: boolean;
    get parentActive(): boolean;
    set parentActive(value: boolean);
    sublistViewChild: ElementRef;
    leafClick: EventEmitter<any>;
    keydownItem: EventEmitter<any>;
    _parentActive: boolean;
    documentClickListener: VoidFunction | null;
    menuHoverActive: boolean;
    activeItem: any;
    constructor(document: Document, el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, tieredMenu: TieredMenu);
    onItemClick(event: any, item: any): void;
    onItemMouseEnter(event: any, item: any): void;
    onLeafClick(): void;
    onItemKeyDown(event: any, item: MenuItem): void;
    positionSubmenu(): void;
    findNextItem(item: any): any;
    findPrevItem(item: any): any;
    onChildItemKeyDown(event: any): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TieredMenuSub, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TieredMenuSub, "p-tieredMenuSub", never, { "item": "item"; "root": "root"; "autoDisplay": "autoDisplay"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "mobileActive": "mobileActive"; "popup": "popup"; "parentActive": "parentActive"; }, { "leafClick": "leafClick"; "keydownItem": "keydownItem"; }, never, never, false, never>;
}
export declare class TieredMenu implements AfterContentInit, OnDestroy {
    private document;
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    overlayService: OverlayService;
    model: MenuItem[];
    popup: boolean;
    style: any;
    styleClass: string;
    appendTo: any;
    autoZIndex: boolean;
    baseZIndex: number;
    autoDisplay: boolean;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    onShow: EventEmitter<any>;
    onHide: EventEmitter<any>;
    templates: QueryList<any>;
    submenuIconTemplate: TemplateRef<any>;
    parentActive: boolean;
    container: HTMLDivElement;
    documentClickListener: VoidFunction | null;
    documentResizeListener: VoidFunction | null;
    preventDocumentDefault: boolean;
    scrollHandler: ConnectedOverlayScrollHandler | null;
    target: any;
    visible: boolean;
    relativeAlign: boolean;
    private window;
    constructor(document: Document, el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, config: PrimeNGConfig, overlayService: OverlayService);
    ngAfterContentInit(): void;
    toggle(event: any): void;
    show(event: any): void;
    onOverlayClick(event: any): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    alignOverlay(): void;
    onOverlayAnimationEnd(event: AnimationEvent): void;
    appendOverlay(): void;
    restoreOverlayAppend(): void;
    moveOnTop(): void;
    hide(): void;
    onWindowResize(): void;
    onLeafClick(): void;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    onOverlayHide(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TieredMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TieredMenu, "p-tieredMenu", never, { "model": "model"; "popup": "popup"; "style": "style"; "styleClass": "styleClass"; "appendTo": "appendTo"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "autoDisplay": "autoDisplay"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; }, { "onShow": "onShow"; "onHide": "onHide"; }, ["templates"], never, false, never>;
}
export declare class TieredMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TieredMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TieredMenuModule, [typeof TieredMenu, typeof TieredMenuSub], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.RippleModule, typeof i4.TooltipModule, typeof i5.AngleRightIcon, typeof i6.SharedModule], [typeof TieredMenu, typeof i2.RouterModule, typeof i4.TooltipModule, typeof i6.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TieredMenuModule>;
}
