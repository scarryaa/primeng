import { AfterViewInit, OnDestroy, ElementRef, NgZone, ChangeDetectorRef, AfterContentInit, QueryList, TemplateRef, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare class ScrollPanel implements AfterViewInit, AfterContentInit, OnDestroy {
    private platformId;
    el: ElementRef;
    zone: NgZone;
    cd: ChangeDetectorRef;
    private document;
    private renderer;
    style: any;
    styleClass: string;
    containerViewChild: ElementRef;
    contentViewChild: ElementRef;
    xBarViewChild: ElementRef;
    yBarViewChild: ElementRef;
    templates: QueryList<any>;
    scrollYRatio: number;
    scrollXRatio: number;
    timeoutFrame: any;
    initialized: boolean;
    lastPageY: number;
    lastPageX: number;
    isXBarClicked: boolean;
    isYBarClicked: boolean;
    contentTemplate: TemplateRef<any>;
    windowResizeListener: VoidFunction | null;
    contentScrollListener: VoidFunction | null;
    mouseEnterListener: VoidFunction | null;
    xBarMouseDownListener: VoidFunction | null;
    yBarMouseDownListener: VoidFunction | null;
    documentMouseMoveListener: VoidFunction | null;
    documentMouseUpListener: VoidFunction | null;
    constructor(platformId: any, el: ElementRef, zone: NgZone, cd: ChangeDetectorRef, document: Document, renderer: Renderer2);
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    calculateContainerHeight(): void;
    moveBar(): void;
    onYBarMouseDown(e: MouseEvent): void;
    bindDocumentMouseListeners(): void;
    unbindDocumentMouseListeners(): void;
    onXBarMouseDown(e: MouseEvent): void;
    onDocumentMouseMove(e: MouseEvent): void;
    onMouseMoveForXBar(e: MouseEvent): void;
    onMouseMoveForYBar(e: MouseEvent): void;
    scrollTop(scrollTop: number): void;
    onDocumentMouseUp(e: Event): void;
    requestAnimationFrame(f: Function): void;
    unbindListeners(): void;
    ngOnDestroy(): void;
    refresh(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollPanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScrollPanel, "p-scrollPanel", never, { "style": "style"; "styleClass": "styleClass"; }, {}, ["templates"], ["*"], false, never>;
}
export declare class ScrollPanelModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollPanelModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ScrollPanelModule, [typeof ScrollPanel], [typeof i1.CommonModule], [typeof ScrollPanel]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ScrollPanelModule>;
}
