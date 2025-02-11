import { AfterViewInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export interface TooltipOptions {
    tooltipLabel?: string;
    tooltipPosition?: string;
    tooltipEvent?: string;
    appendTo?: any;
    positionStyle?: string;
    tooltipStyleClass?: string;
    tooltipZIndex?: string;
    escape?: boolean;
    disabled?: boolean;
    showDelay?: number;
    hideDelay?: number;
    positionTop?: number;
    positionLeft?: number;
    life?: number;
    autoHide?: boolean;
    hideOnEscape?: boolean;
}
export declare class Tooltip implements AfterViewInit, OnDestroy {
    private platformId;
    el: ElementRef;
    zone: NgZone;
    config: PrimeNGConfig;
    private renderer;
    private changeDetector;
    tooltipPosition: string;
    tooltipEvent: string;
    appendTo: any;
    positionStyle: string;
    tooltipStyleClass: string;
    tooltipZIndex: string;
    escape: boolean;
    showDelay: number;
    hideDelay: number;
    life: number;
    positionTop: number;
    positionLeft: number;
    autoHide: boolean;
    fitContent: boolean;
    hideOnEscape: boolean;
    text: string;
    get disabled(): boolean;
    set disabled(val: boolean);
    tooltipOptions: TooltipOptions;
    _tooltipOptions: TooltipOptions;
    _disabled: boolean;
    container: any;
    styleClass: string;
    tooltipText: any;
    showTimeout: any;
    hideTimeout: any;
    active: boolean;
    mouseEnterListener: Function;
    mouseLeaveListener: Function;
    containerMouseleaveListener: Function;
    clickListener: Function;
    focusListener: Function;
    blurListener: Function;
    scrollHandler: any;
    resizeListener: any;
    constructor(platformId: any, el: ElementRef, zone: NgZone, config: PrimeNGConfig, renderer: Renderer2, changeDetector: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnChanges(simpleChange: SimpleChanges): void;
    isAutoHide(): boolean;
    onMouseEnter(e: Event): void;
    onMouseLeave(e: any): void;
    onFocus(e: Event): void;
    onBlur(e: Event): void;
    onInputClick(e: Event): void;
    onPressEscape(): void;
    activate(): void;
    deactivate(): void;
    create(): void;
    bindContainerMouseleaveListener(): void;
    unbindContainerMouseleaveListener(): void;
    show(): void;
    hide(): void;
    updateText(): void;
    align(): void;
    getHostOffset(): {
        left: any;
        top: any;
    };
    alignRight(): void;
    alignLeft(): void;
    alignTop(): void;
    alignBottom(): void;
    setOption(option: TooltipOptions): void;
    getOption(option: string): any;
    getTarget(el: any): any;
    preAlign(position: string): void;
    isOutOfBounds(): boolean;
    onWindowResize(e: Event): void;
    bindDocumentResizeListener(): void;
    unbindDocumentResizeListener(): void;
    bindScrollListener(): void;
    unbindScrollListener(): void;
    unbindEvents(): void;
    remove(): void;
    clearShowTimeout(): void;
    clearHideTimeout(): void;
    clearTimeouts(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Tooltip, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<Tooltip, "[pTooltip]", never, { "tooltipPosition": "tooltipPosition"; "tooltipEvent": "tooltipEvent"; "appendTo": "appendTo"; "positionStyle": "positionStyle"; "tooltipStyleClass": "tooltipStyleClass"; "tooltipZIndex": "tooltipZIndex"; "escape": "escape"; "showDelay": "showDelay"; "hideDelay": "hideDelay"; "life": "life"; "positionTop": "positionTop"; "positionLeft": "positionLeft"; "autoHide": "autoHide"; "fitContent": "fitContent"; "hideOnEscape": "hideOnEscape"; "text": "pTooltip"; "disabled": "tooltipDisabled"; "tooltipOptions": "tooltipOptions"; }, {}, never, never, false, never>;
}
export declare class TooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TooltipModule, [typeof Tooltip], [typeof i1.CommonModule], [typeof Tooltip]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TooltipModule>;
}
