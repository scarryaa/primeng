import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { ObjectUtils, ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
export const OVERLAY_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Overlay),
    multi: true
};
const showOverlayContentAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{showTransitionParams}}')]);
const hideOverlayContentAnimation = animation([animate('{{hideTransitionParams}}', style({ transform: '{{transform}}', opacity: 0 }))]);
export class Overlay {
    constructor(document, platformId, el, renderer, config, overlayService, zone) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.config = config;
        this.overlayService = overlayService;
        this.zone = zone;
        this.visibleChange = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onAnimationStart = new EventEmitter();
        this.onAnimationDone = new EventEmitter();
        this._visible = false;
        this.modalVisible = false;
        this.isOverlayClicked = false;
        this.isOverlayContentClicked = false;
        this.transformOptions = {
            default: 'scaleY(0.8)',
            center: 'scale(0.7)',
            top: 'translate3d(0px, -100%, 0px)',
            'top-start': 'translate3d(0px, -100%, 0px)',
            'top-end': 'translate3d(0px, -100%, 0px)',
            bottom: 'translate3d(0px, 100%, 0px)',
            'bottom-start': 'translate3d(0px, 100%, 0px)',
            'bottom-end': 'translate3d(0px, 100%, 0px)',
            left: 'translate3d(-100%, 0px, 0px)',
            'left-start': 'translate3d(-100%, 0px, 0px)',
            'left-end': 'translate3d(-100%, 0px, 0px)',
            right: 'translate3d(100%, 0px, 0px)',
            'right-start': 'translate3d(100%, 0px, 0px)',
            'right-end': 'translate3d(100%, 0px, 0px)'
        };
        this.window = this.document.defaultView;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible && !this.modalVisible) {
            this.modalVisible = true;
        }
    }
    get mode() {
        return this._mode || this.overlayOptions?.mode;
    }
    set mode(value) {
        this._mode = value;
    }
    get style() {
        return ObjectUtils.merge(this._style, this.modal ? this.overlayResponsiveOptions?.style : this.overlayOptions?.style);
    }
    set style(value) {
        this._style = value;
    }
    get styleClass() {
        return ObjectUtils.merge(this._styleClass, this.modal ? this.overlayResponsiveOptions?.styleClass : this.overlayOptions?.styleClass);
    }
    set styleClass(value) {
        this._styleClass = value;
    }
    get contentStyle() {
        return ObjectUtils.merge(this._contentStyle, this.modal ? this.overlayResponsiveOptions?.contentStyle : this.overlayOptions?.contentStyle);
    }
    set contentStyle(value) {
        this._contentStyle = value;
    }
    get contentStyleClass() {
        return ObjectUtils.merge(this._contentStyleClass, this.modal ? this.overlayResponsiveOptions?.contentStyleClass : this.overlayOptions?.contentStyleClass);
    }
    set contentStyleClass(value) {
        this._contentStyleClass = value;
    }
    get target() {
        const value = this._target || this.overlayOptions?.target;
        return value === undefined ? '@prev' : value;
    }
    set target(value) {
        this._target = value;
    }
    get appendTo() {
        return this._appendTo || this.overlayOptions?.appendTo;
    }
    set appendTo(value) {
        this._appendTo = value;
    }
    get autoZIndex() {
        const value = this._autoZIndex || this.overlayOptions?.autoZIndex;
        return value === undefined ? true : value;
    }
    set autoZIndex(value) {
        this._autoZIndex = value;
    }
    get baseZIndex() {
        const value = this._baseZIndex || this.overlayOptions?.baseZIndex;
        return value === undefined ? 0 : value;
    }
    set baseZIndex(value) {
        this._baseZIndex = value;
    }
    get showTransitionOptions() {
        const value = this._showTransitionOptions || this.overlayOptions?.showTransitionOptions;
        return value === undefined ? '.12s cubic-bezier(0, 0, 0.2, 1)' : value;
    }
    set showTransitionOptions(value) {
        this._showTransitionOptions = value;
    }
    get hideTransitionOptions() {
        const value = this._hideTransitionOptions || this.overlayOptions?.hideTransitionOptions;
        return value === undefined ? '.1s linear' : value;
    }
    set hideTransitionOptions(value) {
        this._hideTransitionOptions = value;
    }
    get listener() {
        return this._listener || this.overlayOptions?.listener;
    }
    set listener(value) {
        this._listener = value;
    }
    get responsive() {
        return this._responsive || this.overlayOptions?.responsive;
    }
    set responsive(val) {
        this._responsive = val;
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
    }
    get modal() {
        if (isPlatformBrowser(this.platformId)) {
            return this.mode === 'modal' || (this.overlayResponsiveOptions && this.window?.matchMedia(this.overlayResponsiveOptions.media?.replace('@media', '') || `(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches);
        }
    }
    get overlayMode() {
        return this.mode || (this.modal ? 'modal' : 'overlay');
    }
    get overlayOptions() {
        return { ...this.config?.overlayOptions, ...this.options }; // TODO: Improve performance
    }
    get overlayResponsiveOptions() {
        return { ...this.overlayOptions?.responsive, ...this.responsive }; // TODO: Improve performance
    }
    get overlayResponsiveDirection() {
        return this.overlayResponsiveOptions?.direction || 'center';
    }
    get overlayEl() {
        return this.overlayViewChild?.nativeElement;
    }
    get contentEl() {
        return this.contentViewChild?.nativeElement;
    }
    get targetEl() {
        return DomHandler.getTargetElement(this.target, this.el?.nativeElement);
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                // TODO: new template types may be added.
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    show(overlay, isFocus = false) {
        this.onVisibleChange(true);
        this.handleEvents('onShow', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        isFocus && DomHandler.focus(this.targetEl);
        this.modal && DomHandler.addClass(this.document?.body, 'p-overflow-hidden');
    }
    hide(overlay, isFocus = false) {
        if (!this.visible) {
            return;
        }
        else {
            this.onVisibleChange(false);
            this.handleEvents('onHide', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
            isFocus && DomHandler.focus(this.targetEl);
            this.modal && DomHandler.removeClass(this.document?.body, 'p-overflow-hidden');
        }
    }
    alignOverlay() {
        !this.modal && DomHandler.alignOverlay(this.overlayEl, this.targetEl, this.appendTo);
    }
    onVisibleChange(visible) {
        this._visible = visible;
        this.visibleChange.emit(visible);
    }
    onOverlayClick(event) {
        this.isOverlayClicked = true;
    }
    onOverlayContentClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.targetEl
        });
        this.isOverlayContentClicked = true;
    }
    onOverlayContentAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.handleEvents('onBeforeShow', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                if (this.autoZIndex) {
                    ZIndexUtils.set(this.overlayMode, this.overlayEl, this.baseZIndex + this.config?.zIndex[this.overlayMode]);
                }
                DomHandler.appendOverlay(this.overlayEl, this.appendTo === 'body' ? this.document.body : this.appendTo, this.appendTo);
                this.alignOverlay();
                break;
            case 'void':
                this.handleEvents('onBeforeHide', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                this.modal && DomHandler.addClass(this.overlayEl, 'p-component-overlay-leave');
                break;
        }
        this.handleEvents('onAnimationStart', event);
    }
    onOverlayContentAnimationDone(event) {
        const container = this.overlayEl || event.element.parentElement;
        switch (event.toState) {
            case 'visible':
                this.show(container, true);
                this.bindListeners();
                break;
            case 'void':
                this.hide(container, true);
                this.unbindListeners();
                DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
                ZIndexUtils.clear(container);
                this.modalVisible = false;
                break;
        }
        this.handleEvents('onAnimationDone', event);
    }
    handleEvents(name, params) {
        this[name].emit(params);
        this.options && this.options[name] && this.options[name](params);
        this.config?.overlayOptions && (this.config?.overlayOptions)[name] && (this.config?.overlayOptions)[name](params);
    }
    bindListeners() {
        this.bindScrollListener();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindDocumentKeyboardListener();
    }
    unbindListeners() {
        this.unbindScrollListener();
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindDocumentKeyboardListener();
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.targetEl, (event) => {
                const valid = this.listener ? this.listener(event, { type: 'scroll', mode: this.overlayMode, valid: true }) : true;
                valid && this.hide(event, true);
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                const isTargetClicked = this.targetEl && (this.targetEl.isSameNode(event.target) || (!this.isOverlayClicked && this.targetEl.contains(event.target)));
                const isOutsideClicked = !isTargetClicked && !this.isOverlayContentClicked;
                const valid = this.listener ? this.listener(event, { type: 'outside', mode: this.overlayMode, valid: event.which !== 3 && isOutsideClicked }) : isOutsideClicked;
                valid && this.hide(event);
                this.isOverlayClicked = this.isOverlayContentClicked = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                const valid = this.listener ? this.listener(event, { type: 'resize', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                valid && this.hide(event, true);
            });
        }
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    bindDocumentKeyboardListener() {
        if (this.documentKeyboardListener) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            this.documentKeyboardListener = this.renderer.listen(this.window, 'keydown', (event) => {
                if (!this.overlayOptions.hideOnEscape || event.keyCode !== 27) {
                    return;
                }
                const valid = this.listener ? this.listener(event, { type: 'keydown', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                if (valid) {
                    this.zone.run(() => {
                        this.hide(event, true);
                    });
                }
            });
        });
    }
    unbindDocumentKeyboardListener() {
        if (this.documentKeyboardListener) {
            this.documentKeyboardListener();
            this.documentKeyboardListener = null;
        }
    }
    ngOnDestroy() {
        this.hide(this.overlayEl, true);
        if (this.overlayEl) {
            DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
            ZIndexUtils.clear(this.overlayEl);
        }
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.unbindListeners();
    }
}
Overlay.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Overlay, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
Overlay.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Overlay, selector: "p-overlay", inputs: { visible: "visible", mode: "mode", style: "style", styleClass: "styleClass", contentStyle: "contentStyle", contentStyleClass: "contentStyleClass", target: "target", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", listener: "listener", responsive: "responsive", options: "options" }, outputs: { visibleChange: "visibleChange", onBeforeShow: "onBeforeShow", onShow: "onShow", onBeforeHide: "onBeforeHide", onHide: "onHide", onAnimationStart: "onAnimationStart", onAnimationDone: "onAnimationDone" }, host: { classAttribute: "p-element" }, providers: [OVERLAY_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], ngImport: i0, template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick($event)"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: [".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Overlay, decorators: [{
            type: Component,
            args: [{ selector: 'p-overlay', template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick($event)"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [OVERLAY_VALUE_ACCESSOR], host: {
                        class: 'p-element'
                    }, styles: [".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }, { type: i0.NgZone }]; }, propDecorators: { visible: [{
                type: Input
            }], mode: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], contentStyle: [{
                type: Input
            }], contentStyleClass: [{
                type: Input
            }], target: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], listener: [{
                type: Input
            }], responsive: [{
                type: Input
            }], options: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], onBeforeShow: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onBeforeHide: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onAnimationStart: [{
                type: Output
            }], onAnimationDone: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }] } });
export class OverlayModule {
}
OverlayModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: OverlayModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OverlayModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: OverlayModule, declarations: [Overlay], imports: [CommonModule, SharedModule], exports: [Overlay, SharedModule] });
OverlayModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: OverlayModule, imports: [CommonModule, SharedModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: OverlayModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [Overlay, SharedModule],
                    declarations: [Overlay]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9vdmVybGF5L292ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQWtCLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUUsT0FBTyxFQUVILHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBR1IsTUFBTSxFQUNOLFdBQVcsRUFJWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ3BCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sRUFBa0UsYUFBYSxFQUE0QixZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEosT0FBTyxFQUFFLDZCQUE2QixFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4RSxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUV6RCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBUTtJQUN2QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3RDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQUcsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENB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dHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciwgdXNlQW5pbWF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBmb3J3YXJkUmVmLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBOZ1pvbmUsXG4gICAgT25EZXN0cm95LFxuICAgIE91dHB1dCxcbiAgICBQTEFURk9STV9JRCxcbiAgICBRdWVyeUxpc3QsXG4gICAgUmVuZGVyZXIyLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgT3ZlcmxheU1vZGVUeXBlLCBPdmVybGF5T3B0aW9ucywgT3ZlcmxheVNlcnZpY2UsIFByaW1lTkdDb25maWcsIFByaW1lVGVtcGxhdGUsIFJlc3BvbnNpdmVPdmVybGF5T3B0aW9ucywgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIsIERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBPYmplY3RVdGlscywgWkluZGV4VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IE9WRVJMQVlfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPdmVybGF5KSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcblxuY29uc3Qgc2hvd092ZXJsYXlDb250ZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uKFtzdHlsZSh7IHRyYW5zZm9ybTogJ3t7dHJhbnNmb3JtfX0nLCBvcGFjaXR5OiAwIH0pLCBhbmltYXRlKCd7e3Nob3dUcmFuc2l0aW9uUGFyYW1zfX0nKV0pO1xuXG5jb25zdCBoaWRlT3ZlcmxheUNvbnRlbnRBbmltYXRpb24gPSBhbmltYXRpb24oW2FuaW1hdGUoJ3t7aGlkZVRyYW5zaXRpb25QYXJhbXN9fScsIHN0eWxlKHsgdHJhbnNmb3JtOiAne3t0cmFuc2Zvcm19fScsIG9wYWNpdHk6IDAgfSkpXSk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1vdmVybGF5JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICAqbmdJZj1cIm1vZGFsVmlzaWJsZVwiXG4gICAgICAgICAgICAjb3ZlcmxheVxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICdwLW92ZXJsYXkgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktbW9kYWwgcC1jb21wb25lbnQtb3ZlcmxheSBwLWNvbXBvbmVudC1vdmVybGF5LWVudGVyJzogbW9kYWwsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1jZW50ZXInOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS10b3AnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3RvcCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS10b3Atc3RhcnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3RvcC1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS10b3AtZW5kJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICd0b3AtZW5kJyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWJvdHRvbSc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWJvdHRvbS1zdGFydCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnYm90dG9tLXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWJvdHRvbS1lbmQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2JvdHRvbS1lbmQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktbGVmdCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnbGVmdCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1sZWZ0LXN0YXJ0JzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdsZWZ0LXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWxlZnQtZW5kJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdsZWZ0LWVuZCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1yaWdodCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAncmlnaHQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktcmlnaHQtc3RhcnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3JpZ2h0LXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LXJpZ2h0LWVuZCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAncmlnaHQtZW5kJ1xuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25PdmVybGF5Q2xpY2soJGV2ZW50KVwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAqbmdJZj1cInZpc2libGVcIlxuICAgICAgICAgICAgICAgICNjb250ZW50XG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiY29udGVudFN0eWxlXCJcbiAgICAgICAgICAgICAgICBbY2xhc3NdPVwiY29udGVudFN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIidwLW92ZXJsYXktY29udGVudCdcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJvbk92ZXJsYXlDb250ZW50Q2xpY2soJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW0BvdmVybGF5Q29udGVudEFuaW1hdGlvbl09XCJ7IHZhbHVlOiAndmlzaWJsZScsIHBhcmFtczogeyBzaG93VHJhbnNpdGlvblBhcmFtczogc2hvd1RyYW5zaXRpb25PcHRpb25zLCBoaWRlVHJhbnNpdGlvblBhcmFtczogaGlkZVRyYW5zaXRpb25PcHRpb25zLCB0cmFuc2Zvcm06IHRyYW5zZm9ybU9wdGlvbnNbbW9kYWwgPyBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA6ICdkZWZhdWx0J10gfSB9XCJcbiAgICAgICAgICAgICAgICAoQG92ZXJsYXlDb250ZW50QW5pbWF0aW9uLnN0YXJ0KT1cIm9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25TdGFydCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoQG92ZXJsYXlDb250ZW50QW5pbWF0aW9uLmRvbmUpPVwib25PdmVybGF5Q29udGVudEFuaW1hdGlvbkRvbmUoJGV2ZW50KVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB7IG1vZGU6IG92ZXJsYXlNb2RlIH0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ292ZXJsYXlDb250ZW50QW5pbWF0aW9uJywgW3RyYW5zaXRpb24oJzplbnRlcicsIFt1c2VBbmltYXRpb24oc2hvd092ZXJsYXlDb250ZW50QW5pbWF0aW9uKV0pLCB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbdXNlQW5pbWF0aW9uKGhpZGVPdmVybGF5Q29udGVudEFuaW1hdGlvbildKV0pXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHByb3ZpZGVyczogW09WRVJMQVlfVkFMVUVfQUNDRVNTT1JdLFxuICAgIHN0eWxlVXJsczogWycuL292ZXJsYXkuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE92ZXJsYXkgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcbiAgICB9XG4gICAgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLl92aXNpYmxlICYmICF0aGlzLm1vZGFsVmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG1vZGUoKTogT3ZlcmxheU1vZGVUeXBlIHwgc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGUgfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8ubW9kZTtcbiAgICB9XG4gICAgc2V0IG1vZGUodmFsdWU6IE92ZXJsYXlNb2RlVHlwZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl9tb2RlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlscy5tZXJnZSh0aGlzLl9zdHlsZSwgdGhpcy5tb2RhbCA/IHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zPy5zdHlsZSA6IHRoaXMub3ZlcmxheU9wdGlvbnM/LnN0eWxlKTtcbiAgICB9XG4gICAgc2V0IHN0eWxlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc3R5bGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc3R5bGVDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fc3R5bGVDbGFzcywgdGhpcy5tb2RhbCA/IHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zPy5zdHlsZUNsYXNzIDogdGhpcy5vdmVybGF5T3B0aW9ucz8uc3R5bGVDbGFzcyk7XG4gICAgfVxuICAgIHNldCBzdHlsZUNsYXNzKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc3R5bGVDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBjb250ZW50U3R5bGUoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLm1lcmdlKHRoaXMuX2NvbnRlbnRTdHlsZSwgdGhpcy5tb2RhbCA/IHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zPy5jb250ZW50U3R5bGUgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5jb250ZW50U3R5bGUpO1xuICAgIH1cbiAgICBzZXQgY29udGVudFN0eWxlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fY29udGVudFN0eWxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGNvbnRlbnRTdHlsZUNsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlscy5tZXJnZSh0aGlzLl9jb250ZW50U3R5bGVDbGFzcywgdGhpcy5tb2RhbCA/IHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zPy5jb250ZW50U3R5bGVDbGFzcyA6IHRoaXMub3ZlcmxheU9wdGlvbnM/LmNvbnRlbnRTdHlsZUNsYXNzKTtcbiAgICB9XG4gICAgc2V0IGNvbnRlbnRTdHlsZUNsYXNzKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fY29udGVudFN0eWxlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgdGFyZ2V0KCk6IGFueSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fdGFyZ2V0IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LnRhcmdldDtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAnQHByZXYnIDogdmFsdWU7XG4gICAgfVxuICAgIHNldCB0YXJnZXQodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl90YXJnZXQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYXBwZW5kVG8oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGVuZFRvIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmFwcGVuZFRvO1xuICAgIH1cbiAgICBzZXQgYXBwZW5kVG8odmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9hcHBlbmRUbyA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBhdXRvWkluZGV4KCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2F1dG9aSW5kZXggfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8uYXV0b1pJbmRleDtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB0cnVlIDogdmFsdWU7XG4gICAgfVxuICAgIHNldCBhdXRvWkluZGV4KHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2F1dG9aSW5kZXggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYmFzZVpJbmRleCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2Jhc2VaSW5kZXggfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8uYmFzZVpJbmRleDtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogdmFsdWU7XG4gICAgfVxuICAgIHNldCBiYXNlWkluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fYmFzZVpJbmRleCA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzaG93VHJhbnNpdGlvbk9wdGlvbnMoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9zaG93VHJhbnNpdGlvbk9wdGlvbnMgfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8uc2hvd1RyYW5zaXRpb25PcHRpb25zO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcuMTJzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgc2hvd1RyYW5zaXRpb25PcHRpb25zKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2hvd1RyYW5zaXRpb25PcHRpb25zID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGhpZGVUcmFuc2l0aW9uT3B0aW9ucygpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2hpZGVUcmFuc2l0aW9uT3B0aW9ucyB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5oaWRlVHJhbnNpdGlvbk9wdGlvbnM7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gJy4xcyBsaW5lYXInIDogdmFsdWU7XG4gICAgfVxuICAgIHNldCBoaWRlVHJhbnNpdGlvbk9wdGlvbnModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9oaWRlVHJhbnNpdGlvbk9wdGlvbnMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbGlzdGVuZXIoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/Lmxpc3RlbmVyO1xuICAgIH1cbiAgICBzZXQgbGlzdGVuZXIodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCByZXNwb25zaXZlKCk6IFJlc3BvbnNpdmVPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zaXZlIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LnJlc3BvbnNpdmU7XG4gICAgfVxuICAgIHNldCByZXNwb25zaXZlKHZhbDogUmVzcG9uc2l2ZU92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNpdmUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG9wdGlvbnMoKTogT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICB9XG4gICAgc2V0IG9wdGlvbnModmFsOiBPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gdmFsO1xuICAgIH1cblxuICAgIEBPdXRwdXQoKSB2aXNpYmxlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3c6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkhpZGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQW5pbWF0aW9uU3RhcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQW5pbWF0aW9uRG9uZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBAVmlld0NoaWxkKCdvdmVybGF5Jykgb3ZlcmxheVZpZXdDaGlsZDogRWxlbWVudFJlZiB8IHVuZGVmaW5lZDtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50Vmlld0NoaWxkOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgX3Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9tb2RlOiBPdmVybGF5TW9kZVR5cGUgfCBzdHJpbmc7XG5cbiAgICBfc3R5bGU6IGFueTtcblxuICAgIF9zdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBfY29udGVudFN0eWxlOiBhbnk7XG5cbiAgICBfY29udGVudFN0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIF90YXJnZXQ6IGFueTtcblxuICAgIF9hcHBlbmRUbzogJ2JvZHknIHwgSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBfYXV0b1pJbmRleDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIF9iYXNlWkluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgICBfc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBfaGlkZVRyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBfbGlzdGVuZXI6IGFueTtcblxuICAgIF9yZXNwb25zaXZlOiBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQ7XG5cbiAgICBfb3B0aW9uczogT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQ7XG5cbiAgICBtb2RhbFZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGlzT3ZlcmxheUNsaWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGlzT3ZlcmxheUNvbnRlbnRDbGlja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBzY3JvbGxIYW5kbGVyOiBhbnk7XG5cbiAgICBkb2N1bWVudENsaWNrTGlzdGVuZXI6IGFueTtcblxuICAgIGRvY3VtZW50UmVzaXplTGlzdGVuZXI6IGFueTtcblxuICAgIHByaXZhdGUgZG9jdW1lbnRLZXlib2FyZExpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgcHJpdmF0ZSB3aW5kb3c6IFdpbmRvdyB8IG51bGw7XG5cbiAgICBwcm90ZWN0ZWQgdHJhbnNmb3JtT3B0aW9uczogYW55ID0ge1xuICAgICAgICBkZWZhdWx0OiAnc2NhbGVZKDAuOCknLFxuICAgICAgICBjZW50ZXI6ICdzY2FsZSgwLjcpJyxcbiAgICAgICAgdG9wOiAndHJhbnNsYXRlM2QoMHB4LCAtMTAwJSwgMHB4KScsXG4gICAgICAgICd0b3Atc3RhcnQnOiAndHJhbnNsYXRlM2QoMHB4LCAtMTAwJSwgMHB4KScsXG4gICAgICAgICd0b3AtZW5kJzogJ3RyYW5zbGF0ZTNkKDBweCwgLTEwMCUsIDBweCknLFxuICAgICAgICBib3R0b206ICd0cmFuc2xhdGUzZCgwcHgsIDEwMCUsIDBweCknLFxuICAgICAgICAnYm90dG9tLXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKDBweCwgMTAwJSwgMHB4KScsXG4gICAgICAgICdib3R0b20tZW5kJzogJ3RyYW5zbGF0ZTNkKDBweCwgMTAwJSwgMHB4KScsXG4gICAgICAgIGxlZnQ6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMHB4LCAwcHgpJyxcbiAgICAgICAgJ2xlZnQtc3RhcnQnOiAndHJhbnNsYXRlM2QoLTEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgICdsZWZ0LWVuZCc6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMHB4LCAwcHgpJyxcbiAgICAgICAgcmlnaHQ6ICd0cmFuc2xhdGUzZCgxMDAlLCAwcHgsIDBweCknLFxuICAgICAgICAncmlnaHQtc3RhcnQnOiAndHJhbnNsYXRlM2QoMTAwJSwgMHB4LCAwcHgpJyxcbiAgICAgICAgJ3JpZ2h0LWVuZCc6ICd0cmFuc2xhdGUzZCgxMDAlLCAwcHgsIDBweCknXG4gICAgfTtcblxuICAgIGdldCBtb2RhbCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdtb2RhbCcgfHwgKHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zICYmIHRoaXMud2luZG93Py5tYXRjaE1lZGlhKHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zLm1lZGlhPy5yZXBsYWNlKCdAbWVkaWEnLCAnJykgfHwgYChtYXgtd2lkdGg6ICR7dGhpcy5vdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnMuYnJlYWtwb2ludH0pYCkubWF0Y2hlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgb3ZlcmxheU1vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGUgfHwgKHRoaXMubW9kYWwgPyAnbW9kYWwnIDogJ292ZXJsYXknKTtcbiAgICB9XG5cbiAgICBnZXQgb3ZlcmxheU9wdGlvbnMoKTogT3ZlcmxheU9wdGlvbnMge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLmNvbmZpZz8ub3ZlcmxheU9wdGlvbnMsIC4uLnRoaXMub3B0aW9ucyB9OyAvLyBUT0RPOiBJbXByb3ZlIHBlcmZvcm1hbmNlXG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucygpOiBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLm92ZXJsYXlPcHRpb25zPy5yZXNwb25zaXZlLCAuLi50aGlzLnJlc3BvbnNpdmUgfTsgLy8gVE9ETzogSW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgIH1cblxuICAgIGdldCBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zPy5kaXJlY3Rpb24gfHwgJ2NlbnRlcic7XG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlFbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3ZlcmxheVZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBnZXQgY29udGVudEVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIGdldCB0YXJnZXRFbCgpIHtcbiAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuZ2V0VGFyZ2V0RWxlbWVudCh0aGlzLnRhcmdldCwgdGhpcy5lbD8ubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSxcbiAgICAgICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHJpdmF0ZSBjb25maWc6IFByaW1lTkdDb25maWcsXG4gICAgICAgIHB1YmxpYyBvdmVybGF5U2VydmljZTogT3ZlcmxheVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICAgKSB7XG4gICAgICAgIHRoaXMud2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldztcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzPy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogbmV3IHRlbXBsYXRlIHR5cGVzIG1heSBiZSBhZGRlZC5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93KG92ZXJsYXk/OiBIVE1MRWxlbWVudCwgaXNGb2N1czogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlKHRydWUpO1xuICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25TaG93JywgeyBvdmVybGF5OiBvdmVybGF5IHx8IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG5cbiAgICAgICAgaXNGb2N1cyAmJiBEb21IYW5kbGVyLmZvY3VzKHRoaXMudGFyZ2V0RWwpO1xuICAgICAgICB0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5kb2N1bWVudD8uYm9keSwgJ3Atb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgaGlkZShvdmVybGF5PzogSFRNTEVsZW1lbnQsIGlzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2UoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uSGlkZScsIHsgb3ZlcmxheTogb3ZlcmxheSB8fCB0aGlzLm92ZXJsYXlFbCwgdGFyZ2V0OiB0aGlzLnRhcmdldEVsLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlIH0pO1xuICAgICAgICAgICAgaXNGb2N1cyAmJiBEb21IYW5kbGVyLmZvY3VzKHRoaXMudGFyZ2V0RWwpO1xuICAgICAgICAgICAgdGhpcy5tb2RhbCAmJiBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuZG9jdW1lbnQ/LmJvZHksICdwLW92ZXJmbG93LWhpZGRlbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxpZ25PdmVybGF5KCkge1xuICAgICAgICAhdGhpcy5tb2RhbCAmJiBEb21IYW5kbGVyLmFsaWduT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy50YXJnZXRFbCwgdGhpcy5hcHBlbmRUbyk7XG4gICAgfVxuXG4gICAgb25WaXNpYmxlQ2hhbmdlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIHRoaXMudmlzaWJsZUNoYW5nZS5lbWl0KHZpc2libGUpO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuaXNPdmVybGF5Q2xpY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q29udGVudENsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2UuYWRkKHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLnRhcmdldEVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaXNPdmVybGF5Q29udGVudENsaWNrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25CZWZvcmVTaG93JywgeyBvdmVybGF5OiB0aGlzLm92ZXJsYXlFbCwgdGFyZ2V0OiB0aGlzLnRhcmdldEVsLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5zZXQodGhpcy5vdmVybGF5TW9kZSwgdGhpcy5vdmVybGF5RWwsIHRoaXMuYmFzZVpJbmRleCArIHRoaXMuY29uZmlnPy56SW5kZXhbdGhpcy5vdmVybGF5TW9kZV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknID8gdGhpcy5kb2N1bWVudC5ib2R5IDogdGhpcy5hcHBlbmRUbywgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnbk92ZXJsYXkoKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25CZWZvcmVIaWRlJywgeyBvdmVybGF5OiB0aGlzLm92ZXJsYXlFbCwgdGFyZ2V0OiB0aGlzLnRhcmdldEVsLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbCAmJiBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMub3ZlcmxheUVsLCAncC1jb21wb25lbnQtb3ZlcmxheS1sZWF2ZScpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25BbmltYXRpb25TdGFydCcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlDb250ZW50QW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5vdmVybGF5RWwgfHwgZXZlbnQuZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQudG9TdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAndmlzaWJsZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93KGNvbnRhaW5lciwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndm9pZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKGNvbnRhaW5lciwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy50YXJnZXRFbCwgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIoY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25BbmltYXRpb25Eb25lJywgZXZlbnQpO1xuICAgIH1cblxuICAgIGhhbmRsZUV2ZW50cyhuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55KSB7XG4gICAgICAgICh0aGlzIGFzIGFueSlbbmFtZV0uZW1pdChwYXJhbXMpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgJiYgKHRoaXMub3B0aW9ucyBhcyBhbnkpW25hbWVdICYmICh0aGlzLm9wdGlvbnMgYXMgYW55KVtuYW1lXShwYXJhbXMpO1xuICAgICAgICB0aGlzLmNvbmZpZz8ub3ZlcmxheU9wdGlvbnMgJiYgKHRoaXMuY29uZmlnPy5vdmVybGF5T3B0aW9ucyBhcyBhbnkpW25hbWVdICYmICh0aGlzLmNvbmZpZz8ub3ZlcmxheU9wdGlvbnMgYXMgYW55KVtuYW1lXShwYXJhbXMpO1xuICAgIH1cblxuICAgIGJpbmRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHVuYmluZExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudEtleWJvYXJkTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBiaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBuZXcgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIodGhpcy50YXJnZXRFbCwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZCA9IHRoaXMubGlzdGVuZXIgPyB0aGlzLmxpc3RlbmVyKGV2ZW50LCB7IHR5cGU6ICdzY3JvbGwnLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlLCB2YWxpZDogdHJ1ZSB9KSA6IHRydWU7XG5cbiAgICAgICAgICAgICAgICB2YWxpZCAmJiB0aGlzLmhpZGUoZXZlbnQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgdW5iaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAnY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1RhcmdldENsaWNrZWQgPSB0aGlzLnRhcmdldEVsICYmICh0aGlzLnRhcmdldEVsLmlzU2FtZU5vZGUoZXZlbnQudGFyZ2V0KSB8fCAoIXRoaXMuaXNPdmVybGF5Q2xpY2tlZCAmJiB0aGlzLnRhcmdldEVsLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc091dHNpZGVDbGlja2VkID0gIWlzVGFyZ2V0Q2xpY2tlZCAmJiAhdGhpcy5pc092ZXJsYXlDb250ZW50Q2xpY2tlZDtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZCA9IHRoaXMubGlzdGVuZXIgPyB0aGlzLmxpc3RlbmVyKGV2ZW50LCB7IHR5cGU6ICdvdXRzaWRlJywgbW9kZTogdGhpcy5vdmVybGF5TW9kZSwgdmFsaWQ6IGV2ZW50LndoaWNoICE9PSAzICYmIGlzT3V0c2lkZUNsaWNrZWQgfSkgOiBpc091dHNpZGVDbGlja2VkO1xuXG4gICAgICAgICAgICAgICAgdmFsaWQgJiYgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzT3ZlcmxheUNsaWNrZWQgPSB0aGlzLmlzT3ZlcmxheUNvbnRlbnRDbGlja2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLndpbmRvdywgJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ3Jlc2l6ZScsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUsIHZhbGlkOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCkgfSkgOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCk7XG5cbiAgICAgICAgICAgICAgICB2YWxpZCAmJiB0aGlzLmhpZGUoZXZlbnQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudEtleWJvYXJkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMud2luZG93LCAna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5vdmVybGF5T3B0aW9ucy5oaWRlT25Fc2NhcGUgfHwgZXZlbnQua2V5Q29kZSAhPT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ2tleWRvd24nLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlLCB2YWxpZDogIURvbUhhbmRsZXIuaXNUb3VjaERldmljZSgpIH0pIDogIURvbUhhbmRsZXIuaXNUb3VjaERldmljZSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKGV2ZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEtleWJvYXJkTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLm92ZXJsYXlFbCwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheUVsKSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmFwcGVuZE92ZXJsYXkodGhpcy5vdmVybGF5RWwsIHRoaXMudGFyZ2V0RWwsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5vdmVybGF5RWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVuYmluZExpc3RlbmVycygpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBTaGFyZWRNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtPdmVybGF5LCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW092ZXJsYXldXG59KVxuZXhwb3J0IGNsYXNzIE92ZXJsYXlNb2R1bGUge31cbiJdfQ==