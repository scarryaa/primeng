import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, ViewChild, Output, ContentChildren, PLATFORM_ID, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import * as i1 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { ZIndexUtils, UniqueComponentId } from 'primeng/utils';
import { DomHandler } from 'primeng/dom';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChevronRightIcon } from 'primeng/icons/chevronright';
import { ChevronLeftIcon } from 'primeng/icons/chevronleft';
import { TimesIcon } from 'primeng/icons/times';
import { WindowMaximizeIcon } from 'primeng/icons/windowmaximize';
import { WindowMinimizeIcon } from 'primeng/icons/windowminimize';

class Galleria {
    constructor(document, element, cd, config) {
        this.document = document;
        this.element = element;
        this.cd = cd;
        this.config = config;
        this.fullScreen = false;
        this.numVisible = 3;
        this.showItemNavigators = false;
        this.showThumbnailNavigators = true;
        this.showItemNavigatorsOnHover = false;
        this.changeItemOnIndicatorHover = false;
        this.circular = false;
        this.autoPlay = false;
        this.transitionInterval = 4000;
        this.showThumbnails = true;
        this.thumbnailsPosition = 'bottom';
        this.verticalThumbnailViewPortHeight = '300px';
        this.showIndicators = false;
        this.showIndicatorsOnItem = false;
        this.indicatorsPosition = 'bottom';
        this.baseZIndex = 0;
        this.showTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.activeIndexChange = new EventEmitter();
        this.visibleChange = new EventEmitter();
        this._visible = false;
        this._activeIndex = 0;
        this.maskVisible = false;
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._activeIndex = activeIndex;
    }
    get visible() {
        return this._visible;
    }
    set visible(visible) {
        this._visible = visible;
        if (this._visible && !this.maskVisible) {
            this.maskVisible = true;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerFacet = item.template;
                    break;
                case 'footer':
                    this.footerFacet = item.template;
                    break;
                case 'indicator':
                    this.indicatorFacet = item.template;
                    break;
                case 'closeicon':
                    this.closeIconTemplate = item.template;
                    break;
                case 'itemnexticon':
                    this.itemNextIconTemplate = item.template;
                    break;
                case 'itempreviousicon':
                    this.itemPreviousIconTemplate = item.template;
                    break;
                case 'previousthumbnailicon':
                    this.previousThumbnailIconTemplate = item.template;
                    break;
                case 'nextthumbnailicon':
                    this.nextThumbnailIconTemplate = item.template;
                    break;
                case 'caption':
                    this.captionFacet = item.template;
                    break;
            }
        });
    }
    ngOnChanges(simpleChanges) {
        var _a;
        if (simpleChanges.value && ((_a = simpleChanges.value.currentValue) === null || _a === void 0 ? void 0 : _a.length) < this.numVisible) {
            this.numVisible = simpleChanges.value.currentValue.length;
        }
    }
    onMaskHide() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
    onActiveItemChange(index) {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.activeIndexChange.emit(index);
        }
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.enableModality();
                break;
            case 'void':
                DomHandler.addClass(this.mask.nativeElement, 'p-component-overlay-leave');
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                this.disableModality();
                break;
        }
    }
    enableModality() {
        DomHandler.addClass(this.document.body, 'p-overflow-hidden');
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.set('modal', this.mask.nativeElement, this.baseZIndex || this.config.zIndex.modal);
        }
    }
    disableModality() {
        DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
        this.maskVisible = false;
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.clear(this.mask.nativeElement);
        }
    }
    ngOnDestroy() {
        if (this.fullScreen) {
            DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
        }
        if (this.mask) {
            this.disableModality();
        }
    }
}
Galleria.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Galleria, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
Galleria.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Galleria, selector: "p-galleria", inputs: { activeIndex: "activeIndex", fullScreen: "fullScreen", id: "id", value: "value", numVisible: "numVisible", responsiveOptions: "responsiveOptions", showItemNavigators: "showItemNavigators", showThumbnailNavigators: "showThumbnailNavigators", showItemNavigatorsOnHover: "showItemNavigatorsOnHover", changeItemOnIndicatorHover: "changeItemOnIndicatorHover", circular: "circular", autoPlay: "autoPlay", transitionInterval: "transitionInterval", showThumbnails: "showThumbnails", thumbnailsPosition: "thumbnailsPosition", verticalThumbnailViewPortHeight: "verticalThumbnailViewPortHeight", showIndicators: "showIndicators", showIndicatorsOnItem: "showIndicatorsOnItem", indicatorsPosition: "indicatorsPosition", baseZIndex: "baseZIndex", maskClass: "maskClass", containerClass: "containerClass", containerStyle: "containerStyle", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", visible: "visible" }, outputs: { activeIndexChange: "activeIndexChange", visibleChange: "visibleChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "mask", first: true, predicate: ["mask"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div *ngIf="fullScreen; else windowed">
            <div *ngIf="maskVisible" #mask [ngClass]="{ 'p-galleria-mask p-component-overlay p-component-overlay-enter': true, 'p-galleria-visible': this.visible }" [class]="maskClass">
                <p-galleriaContent
                    *ngIf="visible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [numVisible]="numVisible"
                    (maskHide)="onMaskHide()"
                    (activeItemChange)="onActiveItemChange($event)"
                    [ngStyle]="containerStyle"
                ></p-galleriaContent>
            </div>
        </div>

        <ng-template #windowed>
            <p-galleriaContent [value]="value" [activeIndex]="activeIndex" [numVisible]="numVisible" (activeItemChange)="onActiveItemChange($event)"></p-galleriaContent>
        </ng-template>
    `, isInline: true, styles: [".p-galleria-content{display:flex;flex-direction:column}.p-galleria-item-wrapper{display:flex;flex-direction:column;position:relative}.p-galleria-item-container{position:relative;display:flex;height:100%}.p-galleria-item-nav{position:absolute;top:50%;margin-top:-.5rem;display:inline-flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-item-prev{left:0;border-top-left-radius:0;border-bottom-left-radius:0}.p-galleria-item-next{right:0;border-top-right-radius:0;border-bottom-right-radius:0}.p-galleria-item{display:flex;justify-content:center;align-items:center;height:100%;width:100%}.p-galleria-item-nav-onhover .p-galleria-item-nav{pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav{pointer-events:all;opacity:1}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav.p-disabled{pointer-events:none}.p-galleria-caption{position:absolute;bottom:0;left:0;width:100%}.p-galleria-thumbnail-wrapper{display:flex;flex-direction:column;overflow:auto;flex-shrink:0}.p-galleria-thumbnail-prev,.p-galleria-thumbnail-next{align-self:center;flex:0 0 auto;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-galleria-thumbnail-prev span,.p-galleria-thumbnail-next span{display:flex;justify-content:center;align-items:center}.p-galleria-thumbnail-container{display:flex;flex-direction:row}.p-galleria-thumbnail-items-container{overflow:hidden;width:100%}.p-galleria-thumbnail-items{display:flex}.p-galleria-thumbnail-item{overflow:auto;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.5}.p-galleria-thumbnail-item:hover{opacity:1;transition:opacity .3s}.p-galleria-thumbnail-item-current{opacity:1}.p-galleria-thumbnails-left .p-galleria-content,.p-galleria-thumbnails-right .p-galleria-content,.p-galleria-thumbnails-left .p-galleria-item-wrapper,.p-galleria-thumbnails-right .p-galleria-item-wrapper{flex-direction:row}.p-galleria-thumbnails-left p-galleriaitem,.p-galleria-thumbnails-top p-galleriaitem{order:2}.p-galleria-thumbnails-left p-galleriathumbnails,.p-galleria-thumbnails-top p-galleriathumbnails{order:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-container,.p-galleria-thumbnails-right .p-galleria-thumbnail-container{flex-direction:column;flex-grow:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-items,.p-galleria-thumbnails-right .p-galleria-thumbnail-items{flex-direction:column;height:100%}.p-galleria-thumbnails-left .p-galleria-thumbnail-wrapper,.p-galleria-thumbnails-right .p-galleria-thumbnail-wrapper{height:100%}.p-galleria-indicators{display:flex;align-items:center;justify-content:center}.p-galleria-indicator>button{display:inline-flex;align-items:center}.p-galleria-indicators-left .p-galleria-item-wrapper,.p-galleria-indicators-right .p-galleria-item-wrapper{flex-direction:row;align-items:center}.p-galleria-indicators-left .p-galleria-item-container,.p-galleria-indicators-top .p-galleria-item-container{order:2}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-top .p-galleria-indicators{order:1}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-right .p-galleria-indicators{flex-direction:column}.p-galleria-indicator-onitem .p-galleria-indicators{position:absolute;display:flex;z-index:1}.p-galleria-indicator-onitem.p-galleria-indicators-top .p-galleria-indicators{top:0;left:0;width:100%;align-items:flex-start}.p-galleria-indicator-onitem.p-galleria-indicators-right .p-galleria-indicators{right:0;top:0;height:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-bottom .p-galleria-indicators{bottom:0;left:0;width:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-left .p-galleria-indicators{left:0;top:0;height:100%;align-items:flex-start}.p-galleria-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:transparent;transition-property:background-color}.p-galleria-close{position:absolute;top:0;right:0;display:flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-mask .p-galleria-item-nav{position:fixed;top:50%;margin-top:-.5rem}.p-galleria-mask.p-galleria-mask-leave{background-color:transparent}.p-items-hidden .p-galleria-thumbnail-item{visibility:hidden}.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active{visibility:visible}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return GalleriaContent; }), selector: "p-galleriaContent", inputs: ["activeIndex", "value", "numVisible"], outputs: ["maskHide", "activeItemChange"] }], animations: [
        trigger('animation', [
            transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
            transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Galleria, decorators: [{
            type: Component,
            args: [{ selector: 'p-galleria', template: `
        <div *ngIf="fullScreen; else windowed">
            <div *ngIf="maskVisible" #mask [ngClass]="{ 'p-galleria-mask p-component-overlay p-component-overlay-enter': true, 'p-galleria-visible': this.visible }" [class]="maskClass">
                <p-galleriaContent
                    *ngIf="visible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [numVisible]="numVisible"
                    (maskHide)="onMaskHide()"
                    (activeItemChange)="onActiveItemChange($event)"
                    [ngStyle]="containerStyle"
                ></p-galleriaContent>
            </div>
        </div>

        <ng-template #windowed>
            <p-galleriaContent [value]="value" [activeIndex]="activeIndex" [numVisible]="numVisible" (activeItemChange)="onActiveItemChange($event)"></p-galleriaContent>
        </ng-template>
    `, animations: [
                        trigger('animation', [
                            transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
                            transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-galleria-content{display:flex;flex-direction:column}.p-galleria-item-wrapper{display:flex;flex-direction:column;position:relative}.p-galleria-item-container{position:relative;display:flex;height:100%}.p-galleria-item-nav{position:absolute;top:50%;margin-top:-.5rem;display:inline-flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-item-prev{left:0;border-top-left-radius:0;border-bottom-left-radius:0}.p-galleria-item-next{right:0;border-top-right-radius:0;border-bottom-right-radius:0}.p-galleria-item{display:flex;justify-content:center;align-items:center;height:100%;width:100%}.p-galleria-item-nav-onhover .p-galleria-item-nav{pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav{pointer-events:all;opacity:1}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav.p-disabled{pointer-events:none}.p-galleria-caption{position:absolute;bottom:0;left:0;width:100%}.p-galleria-thumbnail-wrapper{display:flex;flex-direction:column;overflow:auto;flex-shrink:0}.p-galleria-thumbnail-prev,.p-galleria-thumbnail-next{align-self:center;flex:0 0 auto;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-galleria-thumbnail-prev span,.p-galleria-thumbnail-next span{display:flex;justify-content:center;align-items:center}.p-galleria-thumbnail-container{display:flex;flex-direction:row}.p-galleria-thumbnail-items-container{overflow:hidden;width:100%}.p-galleria-thumbnail-items{display:flex}.p-galleria-thumbnail-item{overflow:auto;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.5}.p-galleria-thumbnail-item:hover{opacity:1;transition:opacity .3s}.p-galleria-thumbnail-item-current{opacity:1}.p-galleria-thumbnails-left .p-galleria-content,.p-galleria-thumbnails-right .p-galleria-content,.p-galleria-thumbnails-left .p-galleria-item-wrapper,.p-galleria-thumbnails-right .p-galleria-item-wrapper{flex-direction:row}.p-galleria-thumbnails-left p-galleriaitem,.p-galleria-thumbnails-top p-galleriaitem{order:2}.p-galleria-thumbnails-left p-galleriathumbnails,.p-galleria-thumbnails-top p-galleriathumbnails{order:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-container,.p-galleria-thumbnails-right .p-galleria-thumbnail-container{flex-direction:column;flex-grow:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-items,.p-galleria-thumbnails-right .p-galleria-thumbnail-items{flex-direction:column;height:100%}.p-galleria-thumbnails-left .p-galleria-thumbnail-wrapper,.p-galleria-thumbnails-right .p-galleria-thumbnail-wrapper{height:100%}.p-galleria-indicators{display:flex;align-items:center;justify-content:center}.p-galleria-indicator>button{display:inline-flex;align-items:center}.p-galleria-indicators-left .p-galleria-item-wrapper,.p-galleria-indicators-right .p-galleria-item-wrapper{flex-direction:row;align-items:center}.p-galleria-indicators-left .p-galleria-item-container,.p-galleria-indicators-top .p-galleria-item-container{order:2}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-top .p-galleria-indicators{order:1}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-right .p-galleria-indicators{flex-direction:column}.p-galleria-indicator-onitem .p-galleria-indicators{position:absolute;display:flex;z-index:1}.p-galleria-indicator-onitem.p-galleria-indicators-top .p-galleria-indicators{top:0;left:0;width:100%;align-items:flex-start}.p-galleria-indicator-onitem.p-galleria-indicators-right .p-galleria-indicators{right:0;top:0;height:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-bottom .p-galleria-indicators{bottom:0;left:0;width:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-left .p-galleria-indicators{left:0;top:0;height:100%;align-items:flex-start}.p-galleria-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:transparent;transition-property:background-color}.p-galleria-close{position:absolute;top:0;right:0;display:flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-mask .p-galleria-item-nav{position:fixed;top:50%;margin-top:-.5rem}.p-galleria-mask.p-galleria-mask-leave{background-color:transparent}.p-items-hidden .p-galleria-thumbnail-item{visibility:hidden}.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active{visibility:visible}\n"] }]
        }], ctorParameters: function () {
        return [{ type: Document, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }];
    }, propDecorators: { activeIndex: [{
                type: Input
            }], fullScreen: [{
                type: Input
            }], id: [{
                type: Input
            }], value: [{
                type: Input
            }], numVisible: [{
                type: Input
            }], responsiveOptions: [{
                type: Input
            }], showItemNavigators: [{
                type: Input
            }], showThumbnailNavigators: [{
                type: Input
            }], showItemNavigatorsOnHover: [{
                type: Input
            }], changeItemOnIndicatorHover: [{
                type: Input
            }], circular: [{
                type: Input
            }], autoPlay: [{
                type: Input
            }], transitionInterval: [{
                type: Input
            }], showThumbnails: [{
                type: Input
            }], thumbnailsPosition: [{
                type: Input
            }], verticalThumbnailViewPortHeight: [{
                type: Input
            }], showIndicators: [{
                type: Input
            }], showIndicatorsOnItem: [{
                type: Input
            }], indicatorsPosition: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], maskClass: [{
                type: Input
            }], containerClass: [{
                type: Input
            }], containerStyle: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], mask: [{
                type: ViewChild,
                args: ['mask']
            }], visible: [{
                type: Input
            }], activeIndexChange: [{
                type: Output
            }], visibleChange: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class GalleriaContent {
    constructor(galleria, cd, differs) {
        this.galleria = galleria;
        this.cd = cd;
        this.differs = differs;
        this.value = [];
        this.maskHide = new EventEmitter();
        this.activeItemChange = new EventEmitter();
        this.id = this.galleria.id || UniqueComponentId();
        this._activeIndex = 0;
        this.slideShowActive = true;
        this.differ = this.differs.find(this.galleria).create();
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._activeIndex = activeIndex;
    }
    ngDoCheck() {
        const changes = this.differ.diff(this.galleria);
        if ((changes === null || changes === void 0 ? void 0 : changes.forEachItem.length) > 0) {
            // Because we change the properties of the parent component,
            // and the children take our entity from the injector.
            // We can tell the children to redraw themselves when we change the properties of the parent component.
            // Since we have an onPush strategy
            this.cd.markForCheck();
        }
    }
    galleriaClass() {
        const thumbnailsPosClass = this.galleria.showThumbnails && this.getPositionClass('p-galleria-thumbnails', this.galleria.thumbnailsPosition);
        const indicatorPosClass = this.galleria.showIndicators && this.getPositionClass('p-galleria-indicators', this.galleria.indicatorsPosition);
        return (this.galleria.containerClass ? this.galleria.containerClass + ' ' : '') + (thumbnailsPosClass ? thumbnailsPosClass + ' ' : '') + (indicatorPosClass ? indicatorPosClass + ' ' : '');
    }
    startSlideShow() {
        this.interval = setInterval(() => {
            let activeIndex = this.galleria.circular && this.value.length - 1 === this.activeIndex ? 0 : this.activeIndex + 1;
            this.onActiveIndexChange(activeIndex);
            this.activeIndex = activeIndex;
        }, this.galleria.transitionInterval);
        this.slideShowActive = true;
    }
    stopSlideShow() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.slideShowActive = false;
    }
    getPositionClass(preClassName, position) {
        const positions = ['top', 'left', 'bottom', 'right'];
        const pos = positions.find((item) => item === position);
        return pos ? `${preClassName}-${pos}` : '';
    }
    isVertical() {
        return this.galleria.thumbnailsPosition === 'left' || this.galleria.thumbnailsPosition === 'right';
    }
    onActiveIndexChange(index) {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.activeItemChange.emit(this.activeIndex);
        }
    }
}
GalleriaContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaContent, deps: [{ token: Galleria }, { token: i0.ChangeDetectorRef }, { token: i0.KeyValueDiffers }], target: i0.ɵɵFactoryTarget.Component });
GalleriaContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: GalleriaContent, selector: "p-galleriaContent", inputs: { activeIndex: "activeIndex", value: "value", numVisible: "numVisible" }, outputs: { maskHide: "maskHide", activeItemChange: "activeItemChange" }, ngImport: i0, template: `
        <div
            [attr.id]="id"
            *ngIf="value && value.length > 0"
            [ngClass]="{
                'p-galleria p-component': true,
                'p-galleria-fullscreen': this.galleria.fullScreen,
                'p-galleria-indicator-onitem': this.galleria.showIndicatorsOnItem,
                'p-galleria-item-nav-onhover': this.galleria.showItemNavigatorsOnHover && !this.galleria.fullScreen
            }"
            [ngStyle]="!galleria.fullScreen ? galleria.containerStyle : {}"
            [class]="galleriaClass()"
        >
            <button *ngIf="galleria.fullScreen" type="button" class="p-galleria-close p-link" (click)="maskHide.emit()" pRipple>
                <TimesIcon *ngIf="!galleria.closeIconTemplate" [styleClass]="'p-galleria-close-icon'" />
                <ng-template *ngTemplateOutlet="galleria.closeIconTemplate"></ng-template>
            </button>
            <div *ngIf="galleria.templates && galleria.headerFacet" class="p-galleria-header">
                <p-galleriaItemSlot type="header" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
            <div class="p-galleria-content">
                <p-galleriaItem
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [circular]="galleria.circular"
                    [templates]="galleria.templates"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [showIndicators]="galleria.showIndicators"
                    [changeItemOnIndicatorHover]="galleria.changeItemOnIndicatorHover"
                    [indicatorFacet]="galleria.indicatorFacet"
                    [captionFacet]="galleria.captionFacet"
                    [showItemNavigators]="galleria.showItemNavigators"
                    [autoPlay]="galleria.autoPlay"
                    [slideShowActive]="slideShowActive"
                    (startSlideShow)="startSlideShow()"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaItem>

                <p-galleriaThumbnails
                    *ngIf="galleria.showThumbnails"
                    [containerId]="id"
                    [value]="value"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [activeIndex]="activeIndex"
                    [templates]="galleria.templates"
                    [numVisible]="numVisible"
                    [responsiveOptions]="galleria.responsiveOptions"
                    [circular]="galleria.circular"
                    [isVertical]="isVertical()"
                    [contentHeight]="galleria.verticalThumbnailViewPortHeight"
                    [showThumbnailNavigators]="galleria.showThumbnailNavigators"
                    [slideShowActive]="slideShowActive"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaThumbnails>
            </div>
            <div *ngIf="galleria.templates && galleria.footerFacet" class="p-galleria-footer">
                <p-galleriaItemSlot type="footer" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }, { kind: "component", type: i0.forwardRef(function () { return GalleriaItemSlot; }), selector: "p-galleriaItemSlot", inputs: ["templates", "index", "item", "type"] }, { kind: "component", type: i0.forwardRef(function () { return GalleriaItem; }), selector: "p-galleriaItem", inputs: ["circular", "value", "showItemNavigators", "showIndicators", "slideShowActive", "changeItemOnIndicatorHover", "autoPlay", "templates", "indicatorFacet", "captionFacet", "activeIndex"], outputs: ["startSlideShow", "stopSlideShow", "onActiveIndexChange"] }, { kind: "component", type: i0.forwardRef(function () { return GalleriaThumbnails; }), selector: "p-galleriaThumbnails", inputs: ["containerId", "value", "isVertical", "slideShowActive", "circular", "responsiveOptions", "contentHeight", "showThumbnailNavigators", "templates", "numVisible", "activeIndex"], outputs: ["onActiveIndexChange", "stopSlideShow"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaContent',
                    template: `
        <div
            [attr.id]="id"
            *ngIf="value && value.length > 0"
            [ngClass]="{
                'p-galleria p-component': true,
                'p-galleria-fullscreen': this.galleria.fullScreen,
                'p-galleria-indicator-onitem': this.galleria.showIndicatorsOnItem,
                'p-galleria-item-nav-onhover': this.galleria.showItemNavigatorsOnHover && !this.galleria.fullScreen
            }"
            [ngStyle]="!galleria.fullScreen ? galleria.containerStyle : {}"
            [class]="galleriaClass()"
        >
            <button *ngIf="galleria.fullScreen" type="button" class="p-galleria-close p-link" (click)="maskHide.emit()" pRipple>
                <TimesIcon *ngIf="!galleria.closeIconTemplate" [styleClass]="'p-galleria-close-icon'" />
                <ng-template *ngTemplateOutlet="galleria.closeIconTemplate"></ng-template>
            </button>
            <div *ngIf="galleria.templates && galleria.headerFacet" class="p-galleria-header">
                <p-galleriaItemSlot type="header" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
            <div class="p-galleria-content">
                <p-galleriaItem
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [circular]="galleria.circular"
                    [templates]="galleria.templates"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [showIndicators]="galleria.showIndicators"
                    [changeItemOnIndicatorHover]="galleria.changeItemOnIndicatorHover"
                    [indicatorFacet]="galleria.indicatorFacet"
                    [captionFacet]="galleria.captionFacet"
                    [showItemNavigators]="galleria.showItemNavigators"
                    [autoPlay]="galleria.autoPlay"
                    [slideShowActive]="slideShowActive"
                    (startSlideShow)="startSlideShow()"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaItem>

                <p-galleriaThumbnails
                    *ngIf="galleria.showThumbnails"
                    [containerId]="id"
                    [value]="value"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [activeIndex]="activeIndex"
                    [templates]="galleria.templates"
                    [numVisible]="numVisible"
                    [responsiveOptions]="galleria.responsiveOptions"
                    [circular]="galleria.circular"
                    [isVertical]="isVertical()"
                    [contentHeight]="galleria.verticalThumbnailViewPortHeight"
                    [showThumbnailNavigators]="galleria.showThumbnailNavigators"
                    [slideShowActive]="slideShowActive"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaThumbnails>
            </div>
            <div *ngIf="galleria.templates && galleria.footerFacet" class="p-galleria-footer">
                <p-galleriaItemSlot type="footer" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: Galleria }, { type: i0.ChangeDetectorRef }, { type: i0.KeyValueDiffers }]; }, propDecorators: { activeIndex: [{
                type: Input
            }], value: [{
                type: Input
            }], numVisible: [{
                type: Input
            }], maskHide: [{
                type: Output
            }], activeItemChange: [{
                type: Output
            }] } });
class GalleriaItemSlot {
    get item() {
        return this._item;
    }
    set item(item) {
        this._item = item;
        if (this.templates) {
            this.templates.forEach((item) => {
                if (item.getType() === this.type) {
                    switch (this.type) {
                        case 'item':
                        case 'caption':
                        case 'thumbnail':
                            this.context = { $implicit: this.item };
                            this.contentTemplate = item.template;
                            break;
                    }
                }
            });
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            if (item.getType() === this.type) {
                switch (this.type) {
                    case 'item':
                    case 'caption':
                    case 'thumbnail':
                        this.context = { $implicit: this.item };
                        this.contentTemplate = item.template;
                        break;
                    case 'indicator':
                        this.context = { $implicit: this.index };
                        this.contentTemplate = item.template;
                        break;
                    default:
                        this.context = {};
                        this.contentTemplate = item.template;
                        break;
                }
            }
        });
    }
}
GalleriaItemSlot.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaItemSlot, deps: [], target: i0.ɵɵFactoryTarget.Component });
GalleriaItemSlot.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: GalleriaItemSlot, selector: "p-galleriaItemSlot", inputs: { templates: "templates", index: "index", item: "item", type: "type" }, ngImport: i0, template: `
        <ng-container *ngIf="contentTemplate">
            <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaItemSlot, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaItemSlot',
                    template: `
        <ng-container *ngIf="contentTemplate">
            <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
        </ng-container>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], propDecorators: { templates: [{
                type: Input
            }], index: [{
                type: Input
            }], item: [{
                type: Input
            }], type: [{
                type: Input
            }] } });
class GalleriaItem {
    constructor(galleria) {
        this.galleria = galleria;
        this.circular = false;
        this.showItemNavigators = false;
        this.showIndicators = true;
        this.slideShowActive = true;
        this.changeItemOnIndicatorHover = true;
        this.autoPlay = false;
        this.startSlideShow = new EventEmitter();
        this.stopSlideShow = new EventEmitter();
        this.onActiveIndexChange = new EventEmitter();
        this._activeIndex = 0;
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._activeIndex = activeIndex;
    }
    get activeItem() {
        return this.value[this._activeIndex];
    }
    ngOnChanges({ autoPlay }) {
        if (autoPlay === null || autoPlay === void 0 ? void 0 : autoPlay.currentValue) {
            this.startSlideShow.emit();
        }
        if (autoPlay && autoPlay.currentValue === false) {
            this.stopTheSlideShow();
        }
    }
    next() {
        let nextItemIndex = this.activeIndex + 1;
        let activeIndex = this.circular && this.value.length - 1 === this.activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }
    prev() {
        let prevItemIndex = this.activeIndex !== 0 ? this.activeIndex - 1 : 0;
        let activeIndex = this.circular && this.activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }
    stopTheSlideShow() {
        if (this.slideShowActive && this.stopSlideShow) {
            this.stopSlideShow.emit();
        }
    }
    navForward(e) {
        this.stopTheSlideShow();
        this.next();
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e) {
        this.stopTheSlideShow();
        this.prev();
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    onIndicatorClick(index) {
        this.stopTheSlideShow();
        this.onActiveIndexChange.emit(index);
    }
    onIndicatorMouseEnter(index) {
        if (this.changeItemOnIndicatorHover) {
            this.stopTheSlideShow();
            this.onActiveIndexChange.emit(index);
        }
    }
    onIndicatorKeyDown(index) {
        this.stopTheSlideShow();
        this.onActiveIndexChange.emit(index);
    }
    isNavForwardDisabled() {
        return !this.circular && this.activeIndex === this.value.length - 1;
    }
    isNavBackwardDisabled() {
        return !this.circular && this.activeIndex === 0;
    }
    isIndicatorItemActive(index) {
        return this.activeIndex === index;
    }
}
GalleriaItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaItem, deps: [{ token: Galleria }], target: i0.ɵɵFactoryTarget.Component });
GalleriaItem.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: GalleriaItem, selector: "p-galleriaItem", inputs: { circular: "circular", value: "value", showItemNavigators: "showItemNavigators", showIndicators: "showIndicators", slideShowActive: "slideShowActive", changeItemOnIndicatorHover: "changeItemOnIndicatorHover", autoPlay: "autoPlay", templates: "templates", indicatorFacet: "indicatorFacet", captionFacet: "captionFacet", activeIndex: "activeIndex" }, outputs: { startSlideShow: "startSlideShow", stopSlideShow: "stopSlideShow", onActiveIndexChange: "onActiveIndexChange" }, usesOnChanges: true, ngImport: i0, template: `
        <div class="p-galleria-item-wrapper">
            <div class="p-galleria-item-container">
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-prev p-galleria-item-nav p-link': true, 'p-disabled': this.isNavBackwardDisabled() }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                >
                    <ChevronLeftIcon *ngIf="!galleria.itemPreviousIconTemplate" [styleClass]="'p-galleria-item-prev-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemPreviousIconTemplate"></ng-template>
                </button>
                <p-galleriaItemSlot type="item" [item]="activeItem" [templates]="templates" class="p-galleria-item"></p-galleriaItemSlot>
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-next p-galleria-item-nav p-link': true, 'p-disabled': this.isNavForwardDisabled() }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                >
                    <ChevronRightIcon *ngIf="!galleria.itemNextIconTemplate" [styleClass]="'p-galleria-item-next-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemNextIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-caption" *ngIf="captionFacet">
                    <p-galleriaItemSlot type="caption" [item]="activeItem" [templates]="templates"></p-galleriaItemSlot>
                </div>
            </div>
            <ul *ngIf="showIndicators" class="p-galleria-indicators p-reset">
                <li
                    *ngFor="let item of value; let index = index"
                    tabindex="0"
                    (click)="onIndicatorClick(index)"
                    (mouseenter)="onIndicatorMouseEnter(index)"
                    (keydown.enter)="onIndicatorKeyDown(index)"
                    [ngClass]="{ 'p-galleria-indicator': true, 'p-highlight': isIndicatorItemActive(index) }"
                >
                    <button type="button" tabIndex="-1" class="p-link" *ngIf="!indicatorFacet"></button>
                    <p-galleriaItemSlot type="indicator" [index]="index" [templates]="templates"></p-galleriaItemSlot>
                </li>
            </ul>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return ChevronRightIcon; }), selector: "ChevronRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return ChevronLeftIcon; }), selector: "ChevronLeftIcon" }, { kind: "component", type: i0.forwardRef(function () { return GalleriaItemSlot; }), selector: "p-galleriaItemSlot", inputs: ["templates", "index", "item", "type"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaItem',
                    template: `
        <div class="p-galleria-item-wrapper">
            <div class="p-galleria-item-container">
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-prev p-galleria-item-nav p-link': true, 'p-disabled': this.isNavBackwardDisabled() }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                >
                    <ChevronLeftIcon *ngIf="!galleria.itemPreviousIconTemplate" [styleClass]="'p-galleria-item-prev-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemPreviousIconTemplate"></ng-template>
                </button>
                <p-galleriaItemSlot type="item" [item]="activeItem" [templates]="templates" class="p-galleria-item"></p-galleriaItemSlot>
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-next p-galleria-item-nav p-link': true, 'p-disabled': this.isNavForwardDisabled() }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                >
                    <ChevronRightIcon *ngIf="!galleria.itemNextIconTemplate" [styleClass]="'p-galleria-item-next-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemNextIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-caption" *ngIf="captionFacet">
                    <p-galleriaItemSlot type="caption" [item]="activeItem" [templates]="templates"></p-galleriaItemSlot>
                </div>
            </div>
            <ul *ngIf="showIndicators" class="p-galleria-indicators p-reset">
                <li
                    *ngFor="let item of value; let index = index"
                    tabindex="0"
                    (click)="onIndicatorClick(index)"
                    (mouseenter)="onIndicatorMouseEnter(index)"
                    (keydown.enter)="onIndicatorKeyDown(index)"
                    [ngClass]="{ 'p-galleria-indicator': true, 'p-highlight': isIndicatorItemActive(index) }"
                >
                    <button type="button" tabIndex="-1" class="p-link" *ngIf="!indicatorFacet"></button>
                    <p-galleriaItemSlot type="indicator" [index]="index" [templates]="templates"></p-galleriaItemSlot>
                </li>
            </ul>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: Galleria }]; }, propDecorators: { circular: [{
                type: Input
            }], value: [{
                type: Input
            }], showItemNavigators: [{
                type: Input
            }], showIndicators: [{
                type: Input
            }], slideShowActive: [{
                type: Input
            }], changeItemOnIndicatorHover: [{
                type: Input
            }], autoPlay: [{
                type: Input
            }], templates: [{
                type: Input
            }], indicatorFacet: [{
                type: Input
            }], captionFacet: [{
                type: Input
            }], startSlideShow: [{
                type: Output
            }], stopSlideShow: [{
                type: Output
            }], onActiveIndexChange: [{
                type: Output
            }], activeIndex: [{
                type: Input
            }] } });
class GalleriaThumbnails {
    constructor(galleria, document, platformId, renderer, cd) {
        this.galleria = galleria;
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.cd = cd;
        this.isVertical = false;
        this.slideShowActive = false;
        this.circular = false;
        this.contentHeight = '300px';
        this.showThumbnailNavigators = true;
        this.onActiveIndexChange = new EventEmitter();
        this.stopSlideShow = new EventEmitter();
        this.startPos = null;
        this.thumbnailsStyle = null;
        this.sortedResponsiveOptions = null;
        this.totalShiftedItems = 0;
        this.page = 0;
        this._numVisible = 0;
        this.d_numVisible = 0;
        this._oldNumVisible = 0;
        this._activeIndex = 0;
        this._oldactiveIndex = 0;
    }
    get numVisible() {
        return this._numVisible;
    }
    set numVisible(numVisible) {
        this._numVisible = numVisible;
        this._oldNumVisible = this.d_numVisible;
        this.d_numVisible = numVisible;
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._oldactiveIndex = this._activeIndex;
        this._activeIndex = activeIndex;
    }
    ngOnInit() {
        this.createStyle();
        if (this.responsiveOptions) {
            this.bindDocumentListeners();
        }
    }
    ngAfterContentChecked() {
        let totalShiftedItems = this.totalShiftedItems;
        if ((this._oldNumVisible !== this.d_numVisible || this._oldactiveIndex !== this._activeIndex) && this.itemsContainer) {
            if (this._activeIndex <= this.getMedianItemIndex()) {
                totalShiftedItems = 0;
            }
            else if (this.value.length - this.d_numVisible + this.getMedianItemIndex() < this._activeIndex) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            }
            else if (this.value.length - this.d_numVisible < this._activeIndex && this.d_numVisible % 2 === 0) {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex() + 1;
            }
            else {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex();
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
            if (this.itemsContainer && this.itemsContainer.nativeElement) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            }
            if (this._oldactiveIndex !== this._activeIndex) {
                DomHandler.removeClass(this.itemsContainer.nativeElement, 'p-items-hidden');
                this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
            }
            this._oldactiveIndex = this._activeIndex;
            this._oldNumVisible = this.d_numVisible;
        }
    }
    ngAfterViewInit() {
        this.calculatePosition();
    }
    createStyle() {
        if (!this.thumbnailsStyle) {
            this.thumbnailsStyle = this.document.createElement('style');
            this.thumbnailsStyle.type = 'text/css';
            this.document.body.appendChild(this.thumbnailsStyle);
        }
        let innerHTML = `
            #${this.containerId} .p-galleria-thumbnail-item {
                flex: 1 0 ${100 / this.d_numVisible}%
            }
        `;
        if (this.responsiveOptions) {
            this.sortedResponsiveOptions = [...this.responsiveOptions];
            this.sortedResponsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                return -1 * result;
            });
            for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                let res = this.sortedResponsiveOptions[i];
                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.containerId} .p-galleria-thumbnail-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }
        this.thumbnailsStyle.innerHTML = innerHTML;
    }
    calculatePosition() {
        if (this.itemsContainer && this.sortedResponsiveOptions) {
            let windowWidth = window.innerWidth;
            let matchedResponsiveData = {
                numVisible: this._numVisible
            };
            for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                let res = this.sortedResponsiveOptions[i];
                if (parseInt(res.breakpoint, 10) >= windowWidth) {
                    matchedResponsiveData = res;
                }
            }
            if (this.d_numVisible !== matchedResponsiveData.numVisible) {
                this.d_numVisible = matchedResponsiveData.numVisible;
                this.cd.markForCheck();
            }
        }
    }
    getTabIndex(index) {
        return this.isItemActive(index) ? 0 : null;
    }
    navForward(e) {
        this.stopTheSlideShow();
        let nextItemIndex = this._activeIndex + 1;
        if (nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() && (-1 * this.totalShiftedItems < this.getTotalPageNumber() - 1 || this.circular)) {
            this.step(-1);
        }
        let activeIndex = this.circular && this.value.length - 1 === this._activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e) {
        this.stopTheSlideShow();
        let prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
        let diff = prevItemIndex + this.totalShiftedItems;
        if (this.d_numVisible - diff - 1 > this.getMedianItemIndex() && (-1 * this.totalShiftedItems !== 0 || this.circular)) {
            this.step(1);
        }
        let activeIndex = this.circular && this._activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onItemClick(index) {
        this.stopTheSlideShow();
        let selectedItemIndex = index;
        if (selectedItemIndex !== this._activeIndex) {
            const diff = selectedItemIndex + this.totalShiftedItems;
            let dir = 0;
            if (selectedItemIndex < this._activeIndex) {
                dir = this.d_numVisible - diff - 1 - this.getMedianItemIndex();
                if (dir > 0 && -1 * this.totalShiftedItems !== 0) {
                    this.step(dir);
                }
            }
            else {
                dir = this.getMedianItemIndex() - diff;
                if (dir < 0 && -1 * this.totalShiftedItems < this.getTotalPageNumber() - 1) {
                    this.step(dir);
                }
            }
            this.activeIndex = selectedItemIndex;
            this.onActiveIndexChange.emit(this.activeIndex);
        }
    }
    step(dir) {
        let totalShiftedItems = this.totalShiftedItems + dir;
        if (dir < 0 && -1 * totalShiftedItems + this.d_numVisible > this.value.length - 1) {
            totalShiftedItems = this.d_numVisible - this.value.length;
        }
        else if (dir > 0 && totalShiftedItems > 0) {
            totalShiftedItems = 0;
        }
        if (this.circular) {
            if (dir < 0 && this.value.length - 1 === this._activeIndex) {
                totalShiftedItems = 0;
            }
            else if (dir > 0 && this._activeIndex === 0) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            }
        }
        if (this.itemsContainer) {
            DomHandler.removeClass(this.itemsContainer.nativeElement, 'p-items-hidden');
            this.itemsContainer.nativeElement.style.transform = this.isVertical ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }
        this.totalShiftedItems = totalShiftedItems;
    }
    stopTheSlideShow() {
        if (this.slideShowActive && this.stopSlideShow) {
            this.stopSlideShow.emit();
        }
    }
    changePageOnTouch(e, diff) {
        if (diff < 0) {
            // left
            this.navForward(e);
        }
        else {
            // right
            this.navBackward(e);
        }
    }
    getTotalPageNumber() {
        return this.value.length > this.d_numVisible ? this.value.length - this.d_numVisible + 1 : 0;
    }
    getMedianItemIndex() {
        let index = Math.floor(this.d_numVisible / 2);
        return this.d_numVisible % 2 ? index : index - 1;
    }
    onTransitionEnd() {
        if (this.itemsContainer && this.itemsContainer.nativeElement) {
            DomHandler.addClass(this.itemsContainer.nativeElement, 'p-items-hidden');
            this.itemsContainer.nativeElement.style.transition = '';
        }
    }
    onTouchEnd(e) {
        let touchobj = e.changedTouches[0];
        if (this.isVertical) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
        }
        else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
        }
    }
    onTouchMove(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onTouchStart(e) {
        let touchobj = e.changedTouches[0];
        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }
    isNavBackwardDisabled() {
        return (!this.circular && this._activeIndex === 0) || this.value.length <= this.d_numVisible;
    }
    isNavForwardDisabled() {
        return (!this.circular && this._activeIndex === this.value.length - 1) || this.value.length <= this.d_numVisible;
    }
    firstItemAciveIndex() {
        return this.totalShiftedItems * -1;
    }
    lastItemActiveIndex() {
        return this.firstItemAciveIndex() + this.d_numVisible - 1;
    }
    isItemActive(index) {
        return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
    }
    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            const window = this.document.defaultView || 'window';
            this.documentResizeListener = this.renderer.listen(window, 'resize', () => {
                this.calculatePosition();
            });
        }
    }
    unbindDocumentListeners() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    ngOnDestroy() {
        if (this.responsiveOptions) {
            this.unbindDocumentListeners();
        }
        if (this.thumbnailsStyle) {
            this.thumbnailsStyle.parentNode.removeChild(this.thumbnailsStyle);
        }
    }
}
GalleriaThumbnails.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaThumbnails, deps: [{ token: Galleria }, { token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
GalleriaThumbnails.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: GalleriaThumbnails, selector: "p-galleriaThumbnails", inputs: { containerId: "containerId", value: "value", isVertical: "isVertical", slideShowActive: "slideShowActive", circular: "circular", responsiveOptions: "responsiveOptions", contentHeight: "contentHeight", showThumbnailNavigators: "showThumbnailNavigators", templates: "templates", numVisible: "numVisible", activeIndex: "activeIndex" }, outputs: { onActiveIndexChange: "onActiveIndexChange", stopSlideShow: "stopSlideShow" }, viewQueries: [{ propertyName: "itemsContainer", first: true, predicate: ["itemsContainer"], descendants: true }], ngImport: i0, template: `
        <div class="p-galleria-thumbnail-wrapper">
            <div class="p-galleria-thumbnail-container">
                <button *ngIf="showThumbnailNavigators" type="button" [ngClass]="{ 'p-galleria-thumbnail-prev p-link': true, 'p-disabled': this.isNavBackwardDisabled() }" (click)="navBackward($event)" [disabled]="isNavBackwardDisabled()" pRipple>
                    <ng-container *ngIf="!galleria.previousThumbnailIconTemplate">
                        <ChevronLeftIcon *ngIf="!isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                        <ChevronUpIcon *ngIf="isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.previousThumbnailIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-thumbnail-items-container" [ngStyle]="{ height: isVertical ? contentHeight : '' }">
                    <div #itemsContainer class="p-galleria-thumbnail-items" (transitionend)="onTransitionEnd()" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                        <div
                            *ngFor="let item of value; let index = index"
                            [ngClass]="{
                                'p-galleria-thumbnail-item': true,
                                'p-galleria-thumbnail-item-current': activeIndex === index,
                                'p-galleria-thumbnail-item-active': isItemActive(index),
                                'p-galleria-thumbnail-item-start': firstItemAciveIndex() === index,
                                'p-galleria-thumbnail-item-end': lastItemActiveIndex() === index
                            }"
                        >
                            <div class="p-galleria-thumbnail-item-content" [attr.tabindex]="getTabIndex(index)" (click)="onItemClick(index)" (touchend)="onItemClick(index)" (keydown.enter)="onItemClick(index)">
                                <p-galleriaItemSlot type="thumbnail" [item]="item" [templates]="templates"></p-galleriaItemSlot>
                            </div>
                        </div>
                    </div>
                </div>
                <button *ngIf="showThumbnailNavigators" type="button" [ngClass]="{ 'p-galleria-thumbnail-next p-link': true, 'p-disabled': this.isNavForwardDisabled() }" (click)="navForward($event)" [disabled]="isNavForwardDisabled()" pRipple>
                    <ng-container *ngIf="!galleria.nextThumbnailIconTemplate">
                        <ChevronRightIcon *ngIf="!isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                        <ChevronDownIcon *ngIf="isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.nextThumbnailIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return ChevronRightIcon; }), selector: "ChevronRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return ChevronLeftIcon; }), selector: "ChevronLeftIcon" }, { kind: "component", type: i0.forwardRef(function () { return GalleriaItemSlot; }), selector: "p-galleriaItemSlot", inputs: ["templates", "index", "item", "type"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaThumbnails, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaThumbnails',
                    template: `
        <div class="p-galleria-thumbnail-wrapper">
            <div class="p-galleria-thumbnail-container">
                <button *ngIf="showThumbnailNavigators" type="button" [ngClass]="{ 'p-galleria-thumbnail-prev p-link': true, 'p-disabled': this.isNavBackwardDisabled() }" (click)="navBackward($event)" [disabled]="isNavBackwardDisabled()" pRipple>
                    <ng-container *ngIf="!galleria.previousThumbnailIconTemplate">
                        <ChevronLeftIcon *ngIf="!isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                        <ChevronUpIcon *ngIf="isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.previousThumbnailIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-thumbnail-items-container" [ngStyle]="{ height: isVertical ? contentHeight : '' }">
                    <div #itemsContainer class="p-galleria-thumbnail-items" (transitionend)="onTransitionEnd()" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                        <div
                            *ngFor="let item of value; let index = index"
                            [ngClass]="{
                                'p-galleria-thumbnail-item': true,
                                'p-galleria-thumbnail-item-current': activeIndex === index,
                                'p-galleria-thumbnail-item-active': isItemActive(index),
                                'p-galleria-thumbnail-item-start': firstItemAciveIndex() === index,
                                'p-galleria-thumbnail-item-end': lastItemActiveIndex() === index
                            }"
                        >
                            <div class="p-galleria-thumbnail-item-content" [attr.tabindex]="getTabIndex(index)" (click)="onItemClick(index)" (touchend)="onItemClick(index)" (keydown.enter)="onItemClick(index)">
                                <p-galleriaItemSlot type="thumbnail" [item]="item" [templates]="templates"></p-galleriaItemSlot>
                            </div>
                        </div>
                    </div>
                </div>
                <button *ngIf="showThumbnailNavigators" type="button" [ngClass]="{ 'p-galleria-thumbnail-next p-link': true, 'p-disabled': this.isNavForwardDisabled() }" (click)="navForward($event)" [disabled]="isNavForwardDisabled()" pRipple>
                    <ng-container *ngIf="!galleria.nextThumbnailIconTemplate">
                        <ChevronRightIcon *ngIf="!isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                        <ChevronDownIcon *ngIf="isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.nextThumbnailIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () {
        return [{ type: Galleria }, { type: Document, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }];
    }, propDecorators: { containerId: [{
                type: Input
            }], value: [{
                type: Input
            }], isVertical: [{
                type: Input
            }], slideShowActive: [{
                type: Input
            }], circular: [{
                type: Input
            }], responsiveOptions: [{
                type: Input
            }], contentHeight: [{
                type: Input
            }], showThumbnailNavigators: [{
                type: Input
            }], templates: [{
                type: Input
            }], onActiveIndexChange: [{
                type: Output
            }], stopSlideShow: [{
                type: Output
            }], itemsContainer: [{
                type: ViewChild,
                args: ['itemsContainer']
            }], numVisible: [{
                type: Input
            }], activeIndex: [{
                type: Input
            }] } });
class GalleriaModule {
}
GalleriaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GalleriaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: GalleriaModule, declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails], imports: [CommonModule, SharedModule, RippleModule, TimesIcon, ChevronRightIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon], exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule] });
GalleriaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaModule, imports: [CommonModule, SharedModule, RippleModule, TimesIcon, ChevronRightIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon, CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: GalleriaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule, TimesIcon, ChevronRightIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon],
                    exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule],
                    declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Galleria, GalleriaContent, GalleriaItem, GalleriaItemSlot, GalleriaModule, GalleriaThumbnails };
//# sourceMappingURL=primeng-galleria.mjs.map
