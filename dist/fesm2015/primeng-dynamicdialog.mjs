import * as i0 from '@angular/core';
import { Directive, PLATFORM_ID, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, SkipSelf, Optional, ViewChild, NgModule, Injectable } from '@angular/core';
import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';
import * as i4 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import * as i3 from 'primeng/api';
import { SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import { TimesIcon } from 'primeng/icons/times';
import { WindowMaximizeIcon } from 'primeng/icons/windowmaximize';
import { WindowMinimizeIcon } from 'primeng/icons/windowminimize';
import { Subject } from 'rxjs';

class DynamicDialogContent {
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}
DynamicDialogContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogContent, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
DynamicDialogContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: DynamicDialogContent, selector: "[pDynamicDialogContent]", host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pDynamicDialogContent]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; } });

class DynamicDialogConfig {
}

class DynamicDialogRef {
    constructor() {
        this._onClose = new Subject();
        this.onClose = this._onClose.asObservable();
        this._onDestroy = new Subject();
        this.onDestroy = this._onDestroy.asObservable();
        this._onDragStart = new Subject();
        this.onDragStart = this._onDragStart.asObservable();
        this._onDragEnd = new Subject();
        this.onDragEnd = this._onDragEnd.asObservable();
        this._onResizeInit = new Subject();
        this.onResizeInit = this._onResizeInit.asObservable();
        this._onResizeEnd = new Subject();
        this.onResizeEnd = this._onResizeEnd.asObservable();
        this._onMaximize = new Subject();
        this.onMaximize = this._onMaximize.asObservable();
    }
    close(result) {
        this._onClose.next(result);
    }
    destroy() {
        this._onDestroy.next(null);
    }
    dragStart(event) {
        this._onDragStart.next(event);
    }
    dragEnd(event) {
        this._onDragEnd.next(event);
    }
    resizeInit(event) {
        this._onResizeInit.next(event);
    }
    resizeEnd(event) {
        this._onResizeEnd.next(event);
    }
    maximize(value) {
        this._onMaximize.next(value);
    }
}

const showAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{transition}}', style({ transform: 'none', opacity: 1 }))]);
const hideAnimation = animation([animate('{{transition}}', style({ transform: '{{transform}}', opacity: 0 }))]);
class DynamicDialogComponent {
    constructor(document, platformId, componentFactoryResolver, cd, renderer, config, dialogRef, zone, primeNGConfig, parentDialog) {
        this.document = document;
        this.platformId = platformId;
        this.componentFactoryResolver = componentFactoryResolver;
        this.cd = cd;
        this.renderer = renderer;
        this.config = config;
        this.dialogRef = dialogRef;
        this.zone = zone;
        this.primeNGConfig = primeNGConfig;
        this.parentDialog = parentDialog;
        this.visible = true;
        this._style = {};
        this.transformOptions = 'scale(0.7)';
    }
    get minX() {
        return this.config.minX ? this.config.minX : 0;
    }
    get minY() {
        return this.config.minY ? this.config.minY : 0;
    }
    get keepInViewport() {
        return this.config.keepInViewport;
    }
    get maximizable() {
        return this.config.maximizable;
    }
    get maximizeIcon() {
        return this.config.maximizeIcon;
    }
    get minimizeIcon() {
        return this.config.minimizeIcon;
    }
    get style() {
        return this._style;
    }
    get position() {
        return this.config.position;
    }
    set style(value) {
        if (value) {
            this._style = Object.assign({}, value);
            this.originalStyle = value;
        }
    }
    get parent() {
        const domElements = Array.from(this.document.getElementsByClassName('p-dialog'));
        if (domElements.length > 1) {
            return domElements.pop();
        }
    }
    ngAfterViewInit() {
        this.loadChildComponent(this.childComponentType);
        this.cd.detectChanges();
    }
    loadChildComponent(componentType) {
        var _a;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        let viewContainerRef = (_a = this.insertionPoint) === null || _a === void 0 ? void 0 : _a.viewContainerRef;
        viewContainerRef === null || viewContainerRef === void 0 ? void 0 : viewContainerRef.clear();
        this.componentRef = viewContainerRef === null || viewContainerRef === void 0 ? void 0 : viewContainerRef.createComponent(componentFactory);
    }
    moveOnTop() {
        if (this.config.autoZIndex !== false) {
            ZIndexUtils.set('modal', this.container, (this.config.baseZIndex || 0) + this.primeNGConfig.zIndex.modal);
            this.wrapper.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
        }
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container.parentElement;
                this.moveOnTop();
                if (this.parent) {
                    this.unbindGlobalListeners();
                }
                this.bindGlobalListeners();
                if (this.config.modal !== false) {
                    this.enableModality();
                }
                this.focus();
                break;
            case 'void':
                if (this.wrapper && this.config.modal !== false) {
                    DomHandler.addClass(this.wrapper, 'p-component-overlay-leave');
                }
                break;
        }
    }
    onAnimationEnd(event) {
        if (event.toState === 'void') {
            this.onContainerDestroy();
            this.dialogRef.destroy();
        }
    }
    onContainerDestroy() {
        this.unbindGlobalListeners();
        if (this.container && this.config.autoZIndex !== false) {
            ZIndexUtils.clear(this.container);
        }
        if (this.config.modal !== false) {
            this.disableModality();
        }
        this.container = null;
    }
    close() {
        this.visible = false;
        this.cd.markForCheck();
    }
    hide() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }
    enableModality() {
        if (this.config.closable !== false && this.config.dismissableMask) {
            this.maskClickListener = this.renderer.listen(this.wrapper, 'mousedown', (event) => {
                if (this.wrapper && this.wrapper.isSameNode(event.target)) {
                    this.hide();
                }
            });
        }
        if (this.config.modal !== false) {
            DomHandler.addClass(this.document.body, 'p-overflow-hidden');
        }
    }
    disableModality() {
        if (this.wrapper) {
            if (this.config.dismissableMask) {
                this.unbindMaskClickListener();
            }
            if (this.config.modal !== false) {
                DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
            }
            if (!this.cd.destroyed) {
                this.cd.detectChanges();
            }
        }
    }
    onKeydown(event) {
        // tab
        if (event.which === 9) {
            event.preventDefault();
            let focusableElements = DomHandler.getFocusableElements(this.container);
            if (focusableElements && focusableElements.length > 0) {
                if (!focusableElements[0].ownerDocument.activeElement) {
                    focusableElements[0].focus();
                }
                else {
                    let focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
                    if (event.shiftKey) {
                        if (focusedIndex == -1 || focusedIndex === 0)
                            focusableElements[focusableElements.length - 1].focus();
                        else
                            focusableElements[focusedIndex - 1].focus();
                    }
                    else {
                        if (focusedIndex == -1 || focusedIndex === focusableElements.length - 1)
                            focusableElements[0].focus();
                        else
                            focusableElements[focusedIndex + 1].focus();
                    }
                }
            }
        }
    }
    focus() {
        const focusable = DomHandler.getFocusableElements(this.container);
        if (focusable && focusable.length > 0) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => focusable[0].focus(), 5);
            });
        }
    }
    maximize() {
        this.maximized = !this.maximized;
        if (this.maximized) {
            DomHandler.addClass(this.document.body, 'p-overflow-hidden');
        }
        else {
            DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
        }
        this.dialogRef.maximize({ maximized: this.maximized });
    }
    initResize(event) {
        if (this.config.resizable) {
            this.resizing = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            DomHandler.addClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.resizeInit(event);
        }
    }
    onResize(event) {
        if (this.resizing) {
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let containerWidth = DomHandler.getOuterWidth(this.container);
            let containerHeight = DomHandler.getOuterHeight(this.container);
            let contentHeight = DomHandler.getOuterHeight(this.contentViewChild.nativeElement);
            let newWidth = containerWidth + deltaX;
            let newHeight = containerHeight + deltaY;
            let minWidth = this.container.style.minWidth;
            let minHeight = this.container.style.minHeight;
            let offset = this.container.getBoundingClientRect();
            let viewport = DomHandler.getViewport();
            let hasBeenDragged = !parseInt(this.container.style.top) || !parseInt(this.container.style.left);
            if (hasBeenDragged) {
                newWidth += deltaX;
                newHeight += deltaY;
            }
            if ((!minWidth || newWidth > parseInt(minWidth)) && offset.left + newWidth < viewport.width) {
                this._style.width = newWidth + 'px';
                this.container.style.width = this._style.width;
            }
            if ((!minHeight || newHeight > parseInt(minHeight)) && offset.top + newHeight < viewport.height) {
                this.contentViewChild.nativeElement.style.height = contentHeight + newHeight - containerHeight + 'px';
                if (this._style.height) {
                    this._style.height = newHeight + 'px';
                    this.container.style.height = this._style.height;
                }
            }
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }
    resizeEnd(event) {
        if (this.resizing) {
            this.resizing = false;
            DomHandler.removeClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.resizeEnd(event);
        }
    }
    initDrag(event) {
        if (DomHandler.hasClass(event.target, 'p-dialog-header-icon') || DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
            return;
        }
        if (this.config.draggable) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            this.container.style.margin = '0';
            DomHandler.addClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.dragStart(event);
        }
    }
    onDrag(event) {
        if (this.dragging) {
            let containerWidth = DomHandler.getOuterWidth(this.container);
            let containerHeight = DomHandler.getOuterHeight(this.container);
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let offset = this.container.getBoundingClientRect();
            let leftPos = offset.left + deltaX;
            let topPos = offset.top + deltaY;
            let viewport = DomHandler.getViewport();
            this.container.style.position = 'fixed';
            if (this.keepInViewport) {
                if (leftPos >= this.minX && leftPos + containerWidth < viewport.width) {
                    this._style.left = leftPos + 'px';
                    this.lastPageX = event.pageX;
                    this.container.style.left = leftPos + 'px';
                }
                if (topPos >= this.minY && topPos + containerHeight < viewport.height) {
                    this._style.top = topPos + 'px';
                    this.lastPageY = event.pageY;
                    this.container.style.top = topPos + 'px';
                }
            }
            else {
                this.lastPageX = event.pageX;
                this.container.style.left = leftPos + 'px';
                this.lastPageY = event.pageY;
                this.container.style.top = topPos + 'px';
            }
        }
    }
    endDrag(event) {
        if (this.dragging) {
            this.dragging = false;
            DomHandler.removeClass(this.document.body, 'p-unselectable-text');
            this.dialogRef.dragEnd(event);
            this.cd.detectChanges();
        }
    }
    resetPosition() {
        this.container.style.position = '';
        this.container.style.left = '';
        this.container.style.top = '';
        this.container.style.margin = '';
    }
    bindDocumentDragListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.documentDragListener = this.renderer.listen(this.document, 'mousemove', this.onDrag.bind(this));
            });
        }
    }
    bindDocumentDragEndListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.documentDragEndListener = this.renderer.listen(this.document, 'mouseup', this.endDrag.bind(this));
            });
        }
    }
    unbindDocumentDragEndListener() {
        if (this.documentDragEndListener) {
            this.documentDragEndListener();
            this.documentDragListener = null;
        }
    }
    unbindDocumentDragListener() {
        if (this.documentDragListener) {
            this.documentDragListener();
            this.documentDragListener = null;
        }
    }
    bindDocumentResizeListeners() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.documentResizeListener = this.renderer.listen(this.document, 'mousemove', this.onResize.bind(this));
                this.documentResizeEndListener = this.renderer.listen(this.document, 'mouseup', this.resizeEnd.bind(this));
            });
        }
    }
    unbindDocumentResizeListeners() {
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
            this.documentResizeListener = null;
            this.documentResizeEndListener = null;
        }
    }
    bindGlobalListeners() {
        if (this.parentDialog) {
            this.parentDialog.unbindDocumentKeydownListener();
        }
        this.bindDocumentKeydownListener();
        if (this.config.closeOnEscape !== false && this.config.closable !== false) {
            this.bindDocumentEscapeListener();
        }
        if (this.config.resizable) {
            this.bindDocumentResizeListeners();
        }
        if (this.config.draggable) {
            this.bindDocumentDragListener();
            this.bindDocumentDragEndListener();
        }
    }
    unbindGlobalListeners() {
        this.unbindDocumentKeydownListener();
        this.unbindDocumentEscapeListener();
        this.unbindDocumentResizeListeners();
        this.unbindDocumentDragListener();
        this.unbindDocumentDragEndListener();
        if (this.parentDialog) {
            this.parentDialog.bindDocumentKeydownListener();
        }
    }
    bindDocumentKeydownListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.documentKeydownListener) {
                return;
            }
            else {
                this.zone.runOutsideAngular(() => {
                    this.documentKeydownListener = this.renderer.listen(this.document, 'keydown', this.onKeydown.bind(this));
                });
            }
        }
    }
    unbindDocumentKeydownListener() {
        if (this.documentKeydownListener) {
            this.documentKeydownListener();
            this.documentKeydownListener = null;
        }
    }
    bindDocumentEscapeListener() {
        const documentTarget = this.maskViewChild ? this.maskViewChild.nativeElement.ownerDocument : 'document';
        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.which == 27) {
                if (parseInt(this.container.style.zIndex) == ZIndexUtils.getCurrent()) {
                    this.hide();
                }
            }
        });
    }
    unbindDocumentEscapeListener() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }
    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }
    ngOnDestroy() {
        this.onContainerDestroy();
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }
}
DynamicDialogComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogComponent, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ComponentFactoryResolver }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: DynamicDialogConfig }, { token: DynamicDialogRef }, { token: i0.NgZone }, { token: i3.PrimeNGConfig }, { token: DynamicDialogComponent, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.Component });
DynamicDialogComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: DynamicDialogComponent, selector: "p-dynamicDialog", host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "insertionPoint", first: true, predicate: DynamicDialogContent, descendants: true }, { propertyName: "maskViewChild", first: true, predicate: ["mask"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }, { propertyName: "headerViewChild", first: true, predicate: ["titlebar"], descendants: true }], ngImport: i0, template: `
        <div
            #mask
            [ngClass]="{
                'p-dialog-mask': true,
                'p-component-overlay p-component-overlay-enter p-dialog-mask-scrollblocker': config.modal !== false,
                'p-dialog-left': position === 'left',
                'p-dialog-right': position === 'right',
                'p-dialog-top': position === 'top',
                'p-dialog-bottom': position === 'bottom',
                'p-dialog-top-left': position === 'topleft' || position === 'top-left',
                'p-dialog-top-right': position === 'topright' || position === 'top-right',
                'p-dialog-bottom-left': position === 'bottomleft' || position === 'bottom-left',
                'p-dialog-bottom-right': position === 'bottomright' || position === 'bottom-right'
            }"
            [class]="config.maskStyleClass"
        >
            <div
                #container
                [ngClass]="{ 'p-dialog p-dynamic-dialog p-component': true, 'p-dialog-rtl': config.rtl, 'p-dialog-resizable': config.resizable, 'p-dialog-draggable': config.draggable, 'p-dialog-maximized': maximized }"
                [ngStyle]="config.style"
                [class]="config.styleClass"
                [@animation]="{ value: 'visible', params: { transform: transformOptions, transition: config.transitionOptions || '150ms cubic-bezier(0, 0, 0.2, 1)' } }"
                (@animation.start)="onAnimationStart($event)"
                (@animation.done)="onAnimationEnd($event)"
                role="dialog"
                *ngIf="visible"
                [style.width]="config.width"
                [style.height]="config.height"
            >
                <div *ngIf="config.resizable" class="p-resizable-handle" style="z-index: 90;" (mousedown)="initResize($event)"></div>
                <div #titlebar class="p-dialog-header" (mousedown)="initDrag($event)" *ngIf="config.showHeader === false ? false : true">
                    <span class="p-dialog-title">{{ config.header }}</span>
                    <div class="p-dialog-header-icons">
                        <button *ngIf="config.maximizable" type="button" [ngClass]="{ 'p-dialog-header-icon p-dialog-header-maximize p-link': true }" (click)="maximize()" (keydown.enter)="maximize()" tabindex="-1" pRipple>
                            <span class="p-dialog-header-maximize-icon" [ngClass]="maximized ? minimizeIcon : maximizeIcon"></span>
                            <WindowMaximizeIcon *ngIf="!maximized && !maximizeIcon" [styleClass]="'p-dialog-header-maximize-icon'" />
                            <WindowMinimizeIcon *ngIf="maximized && !minimizeIcon" [styleClass]="'p-dialog-header-maximize-icon'" />
                        </button>
                        <button [ngClass]="'p-dialog-header-icon p-dialog-header-maximize p-link'" type="button" (click)="hide()" (keydown.enter)="hide()" *ngIf="config.closable !== false">
                            <TimesIcon [styleClass]="'p-dialog-header-close-icon'" />
                        </button>
                    </div>
                </div>
                <div #content class="p-dialog-content" [ngStyle]="config.contentStyle">
                    <ng-template pDynamicDialogContent></ng-template>
                </div>
                <div class="p-dialog-footer" *ngIf="config.footer">
                    {{ config.footer }}
                </div>
            </div>
        </div>
    `, isInline: true, styles: [".p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:flex;flex-direction:column;pointer-events:auto;max-height:90%;transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto;flex-grow:1}.p-dialog-header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.p-dialog-draggable .p-dialog-header{cursor:move}.p-dialog-footer{flex-shrink:0}.p-dialog .p-dialog-header-icons{display:flex;align-items:center}.p-dialog .p-dialog-header-icon{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-top .p-dialog,.p-dialog-bottom .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top-left .p-dialog,.p-dialog-top-right .p-dialog,.p-dialog-bottom-left .p-dialog,.p-dialog-bottom-right .p-dialog{margin:.75rem;transform:translateZ(0)}.p-dialog-maximized{transition:none;transform:none;width:100vw!important;height:100vh!important;top:0!important;left:0!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{flex-grow:1}.p-dialog-left{justify-content:flex-start}.p-dialog-right{justify-content:flex-end}.p-dialog-top{align-items:flex-start}.p-dialog-top-left{justify-content:flex-start;align-items:flex-start}.p-dialog-top-right{justify-content:flex-end;align-items:flex-start}.p-dialog-bottom{align-items:flex-end}.p-dialog-bottom-left{justify-content:flex-start;align-items:flex-end}.p-dialog-bottom-right{justify-content:flex-end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:flex;align-items:center}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i4.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return WindowMaximizeIcon; }), selector: "WindowMaximizeIcon" }, { kind: "component", type: i0.forwardRef(function () { return WindowMinimizeIcon; }), selector: "WindowMinimizeIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }, { kind: "directive", type: i0.forwardRef(function () { return DynamicDialogContent; }), selector: "[pDynamicDialogContent]" }], animations: [trigger('animation', [transition('void => visible', [useAnimation(showAnimation)]), transition('visible => void', [useAnimation(hideAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'p-dynamicDialog', template: `
        <div
            #mask
            [ngClass]="{
                'p-dialog-mask': true,
                'p-component-overlay p-component-overlay-enter p-dialog-mask-scrollblocker': config.modal !== false,
                'p-dialog-left': position === 'left',
                'p-dialog-right': position === 'right',
                'p-dialog-top': position === 'top',
                'p-dialog-bottom': position === 'bottom',
                'p-dialog-top-left': position === 'topleft' || position === 'top-left',
                'p-dialog-top-right': position === 'topright' || position === 'top-right',
                'p-dialog-bottom-left': position === 'bottomleft' || position === 'bottom-left',
                'p-dialog-bottom-right': position === 'bottomright' || position === 'bottom-right'
            }"
            [class]="config.maskStyleClass"
        >
            <div
                #container
                [ngClass]="{ 'p-dialog p-dynamic-dialog p-component': true, 'p-dialog-rtl': config.rtl, 'p-dialog-resizable': config.resizable, 'p-dialog-draggable': config.draggable, 'p-dialog-maximized': maximized }"
                [ngStyle]="config.style"
                [class]="config.styleClass"
                [@animation]="{ value: 'visible', params: { transform: transformOptions, transition: config.transitionOptions || '150ms cubic-bezier(0, 0, 0.2, 1)' } }"
                (@animation.start)="onAnimationStart($event)"
                (@animation.done)="onAnimationEnd($event)"
                role="dialog"
                *ngIf="visible"
                [style.width]="config.width"
                [style.height]="config.height"
            >
                <div *ngIf="config.resizable" class="p-resizable-handle" style="z-index: 90;" (mousedown)="initResize($event)"></div>
                <div #titlebar class="p-dialog-header" (mousedown)="initDrag($event)" *ngIf="config.showHeader === false ? false : true">
                    <span class="p-dialog-title">{{ config.header }}</span>
                    <div class="p-dialog-header-icons">
                        <button *ngIf="config.maximizable" type="button" [ngClass]="{ 'p-dialog-header-icon p-dialog-header-maximize p-link': true }" (click)="maximize()" (keydown.enter)="maximize()" tabindex="-1" pRipple>
                            <span class="p-dialog-header-maximize-icon" [ngClass]="maximized ? minimizeIcon : maximizeIcon"></span>
                            <WindowMaximizeIcon *ngIf="!maximized && !maximizeIcon" [styleClass]="'p-dialog-header-maximize-icon'" />
                            <WindowMinimizeIcon *ngIf="maximized && !minimizeIcon" [styleClass]="'p-dialog-header-maximize-icon'" />
                        </button>
                        <button [ngClass]="'p-dialog-header-icon p-dialog-header-maximize p-link'" type="button" (click)="hide()" (keydown.enter)="hide()" *ngIf="config.closable !== false">
                            <TimesIcon [styleClass]="'p-dialog-header-close-icon'" />
                        </button>
                    </div>
                </div>
                <div #content class="p-dialog-content" [ngStyle]="config.contentStyle">
                    <ng-template pDynamicDialogContent></ng-template>
                </div>
                <div class="p-dialog-footer" *ngIf="config.footer">
                    {{ config.footer }}
                </div>
            </div>
        </div>
    `, animations: [trigger('animation', [transition('void => visible', [useAnimation(showAnimation)]), transition('visible => void', [useAnimation(hideAnimation)])])], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:flex;flex-direction:column;pointer-events:auto;max-height:90%;transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto;flex-grow:1}.p-dialog-header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.p-dialog-draggable .p-dialog-header{cursor:move}.p-dialog-footer{flex-shrink:0}.p-dialog .p-dialog-header-icons{display:flex;align-items:center}.p-dialog .p-dialog-header-icon{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-top .p-dialog,.p-dialog-bottom .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top-left .p-dialog,.p-dialog-top-right .p-dialog,.p-dialog-bottom-left .p-dialog,.p-dialog-bottom-right .p-dialog{margin:.75rem;transform:translateZ(0)}.p-dialog-maximized{transition:none;transform:none;width:100vw!important;height:100vh!important;top:0!important;left:0!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{flex-grow:1}.p-dialog-left{justify-content:flex-start}.p-dialog-right{justify-content:flex-end}.p-dialog-top{align-items:flex-start}.p-dialog-top-left{justify-content:flex-start;align-items:flex-start}.p-dialog-top-right{justify-content:flex-end;align-items:flex-start}.p-dialog-bottom{align-items:flex-end}.p-dialog-bottom-left{justify-content:flex-start;align-items:flex-end}.p-dialog-bottom-right{justify-content:flex-end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:flex;align-items:center}\n"] }]
        }], ctorParameters: function () {
        return [{ type: Document, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: i0.ComponentFactoryResolver }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: DynamicDialogConfig }, { type: DynamicDialogRef }, { type: i0.NgZone }, { type: i3.PrimeNGConfig }, { type: DynamicDialogComponent, decorators: [{
                        type: SkipSelf
                    }, {
                        type: Optional
                    }] }];
    }, propDecorators: { insertionPoint: [{
                type: ViewChild,
                args: [DynamicDialogContent]
            }], maskViewChild: [{
                type: ViewChild,
                args: ['mask']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], headerViewChild: [{
                type: ViewChild,
                args: ['titlebar']
            }] } });
class DynamicDialogModule {
}
DynamicDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DynamicDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogModule, declarations: [DynamicDialogComponent, DynamicDialogContent], imports: [CommonModule, WindowMaximizeIcon, WindowMinimizeIcon, TimesIcon, SharedModule], exports: [SharedModule] });
DynamicDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogModule, imports: [CommonModule, WindowMaximizeIcon, WindowMinimizeIcon, TimesIcon, SharedModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DynamicDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, WindowMaximizeIcon, WindowMinimizeIcon, TimesIcon, SharedModule],
                    declarations: [DynamicDialogComponent, DynamicDialogContent],
                    entryComponents: [DynamicDialogComponent],
                    exports: [SharedModule]
                }]
        }] });

class DynamicDialogInjector {
    constructor(_parentInjector, _additionalTokens) {
        this._parentInjector = _parentInjector;
        this._additionalTokens = _additionalTokens;
    }
    get(token, notFoundValue, flags) {
        const value = this._additionalTokens.get(token);
        if (value)
            return value;
        return this._parentInjector.get(token, notFoundValue);
    }
}

class DialogService {
    constructor(componentFactoryResolver, appRef, injector, document) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.injector = injector;
        this.document = document;
        this.dialogComponentRefMap = new Map();
    }
    open(componentType, config) {
        const dialogRef = this.appendDialogComponentToBody(config);
        this.dialogComponentRefMap.get(dialogRef).instance.childComponentType = componentType;
        return dialogRef;
    }
    appendDialogComponentToBody(config) {
        const map = new WeakMap();
        map.set(DynamicDialogConfig, config);
        const dialogRef = new DynamicDialogRef();
        map.set(DynamicDialogRef, dialogRef);
        const sub = dialogRef.onClose.subscribe(() => {
            this.dialogComponentRefMap.get(dialogRef).instance.close();
        });
        const destroySub = dialogRef.onDestroy.subscribe(() => {
            this.removeDialogComponentFromBody(dialogRef);
            destroySub.unsubscribe();
            sub.unsubscribe();
        });
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicDialogComponent);
        const componentRef = componentFactory.create(new DynamicDialogInjector(this.injector, map));
        this.appRef.attachView(componentRef.hostView);
        const domElem = componentRef.hostView.rootNodes[0];
        this.document.body.appendChild(domElem);
        this.dialogComponentRefMap.set(dialogRef, componentRef);
        return dialogRef;
    }
    removeDialogComponentFromBody(dialogRef) {
        if (!dialogRef || !this.dialogComponentRefMap.has(dialogRef)) {
            return;
        }
        const dialogComponentRef = this.dialogComponentRefMap.get(dialogRef);
        this.appRef.detachView(dialogComponentRef.hostView);
        dialogComponentRef.destroy();
        this.dialogComponentRefMap.delete(dialogRef);
    }
}
DialogService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DialogService, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
DialogService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DialogService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DialogService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: Document, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }];
    } });

/**
 * Generated bundle index. Do not edit.
 */

export { DialogService, DynamicDialogComponent, DynamicDialogConfig, DynamicDialogInjector, DynamicDialogModule, DynamicDialogRef };
//# sourceMappingURL=primeng-dynamicdialog.mjs.map
