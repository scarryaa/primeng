import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ViewChild, ContentChildren, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i1 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { trigger, transition, style, animate } from '@angular/animations';
import { DomHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import { RefreshIcon } from 'primeng/icons/refresh';
import { EyeIcon } from 'primeng/icons/eye';
import { UndoIcon } from 'primeng/icons/undo';
import { SearchMinusIcon } from 'primeng/icons/searchminus';
import { SearchPlusIcon } from 'primeng/icons/searchplus';
import { TimesIcon } from 'primeng/icons/times';

class Image {
    constructor(document, config, cd) {
        this.document = document;
        this.config = config;
        this.cd = cd;
        this.preview = false;
        this.showTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onImageError = new EventEmitter();
        this.maskVisible = false;
        this.previewVisible = false;
        this.rotate = 0;
        this.scale = 1;
        this.previewClick = false;
        this.zoomSettings = {
            default: 1,
            step: 0.1,
            max: 1.5,
            min: 0.5
        };
    }
    get isZoomOutDisabled() {
        return this.scale - this.zoomSettings.step <= this.zoomSettings.min;
    }
    get isZoomInDisabled() {
        return this.scale + this.zoomSettings.step >= this.zoomSettings.max;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'indicator':
                    this.indicatorTemplate = item.template;
                    break;
                case 'rotaterighticon':
                    this.rotateRightIconTemplate = item.template;
                    break;
                case 'rotatelefticon':
                    this.rotateLeftIconTemplate = item.template;
                    break;
                case 'zoomouticon':
                    this.zoomOutIconTemplate = item.template;
                    break;
                case 'zoominicon':
                    this.zoomInIconTemplate = item.template;
                    break;
                case 'closeicon':
                    this.closeIconTemplate = item.template;
                    break;
                default:
                    this.indicatorTemplate = item.template;
                    break;
            }
        });
    }
    onImageClick() {
        if (this.preview) {
            this.maskVisible = true;
            this.previewVisible = true;
        }
    }
    onMaskClick() {
        if (!this.previewClick) {
            this.closePreview();
        }
        this.previewClick = false;
    }
    onPreviewImageClick() {
        this.previewClick = true;
    }
    rotateRight() {
        this.rotate += 90;
        this.previewClick = true;
    }
    rotateLeft() {
        this.rotate -= 90;
        this.previewClick = true;
    }
    zoomIn() {
        this.scale = this.scale + this.zoomSettings.step;
        this.previewClick = true;
    }
    zoomOut() {
        this.scale = this.scale - this.zoomSettings.step;
        this.previewClick = true;
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container.parentElement;
                this.appendContainer();
                this.moveOnTop();
                break;
            case 'void':
                DomHandler.addClass(this.wrapper, 'p-component-overlay-leave');
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(this.wrapper);
                this.maskVisible = false;
                this.container = null;
                this.wrapper = null;
                this.cd.markForCheck();
                this.onHide.emit({});
                break;
            case 'visible':
                this.onShow.emit({});
                break;
        }
    }
    moveOnTop() {
        ZIndexUtils.set('modal', this.wrapper, this.config.zIndex.modal);
    }
    appendContainer() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                this.document.body.appendChild(this.wrapper);
            else
                DomHandler.appendChild(this.wrapper, this.appendTo);
        }
    }
    imagePreviewStyle() {
        return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
    }
    containerClass() {
        return {
            'p-image p-component': true,
            'p-image-preview-container': this.preview
        };
    }
    handleToolbarClick(event) {
        event.stopPropagation();
    }
    closePreview() {
        this.previewVisible = false;
        this.rotate = 0;
        this.scale = this.zoomSettings.default;
    }
    imageError(event) {
        this.onImageError.emit(event);
    }
}
Image.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Image, deps: [{ token: DOCUMENT }, { token: i1.PrimeNGConfig }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Image.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Image, selector: "p-image", inputs: { imageClass: "imageClass", imageStyle: "imageStyle", styleClass: "styleClass", style: "style", src: "src", alt: "alt", width: "width", height: "height", appendTo: "appendTo", preview: "preview", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onShow: "onShow", onHide: "onHide", onImageError: "onImageError" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "mask", first: true, predicate: ["mask"], descendants: true }], ngImport: i0, template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <img [attr.src]="src" [attr.alt]="alt" [attr.width]="width" [attr.height]="height" [ngStyle]="imageStyle" [class]="imageClass" (error)="imageError($event)" />
            <div class="p-image-preview-indicator" *ngIf="preview" (click)="onImageClick()">
                <ng-container *ngIf="indicatorTemplate; else defaultTemplate">
                    <ng-container *ngTemplateOutlet="indicatorTemplate"></ng-container>
                </ng-container>
                <ng-template #defaultTemplate>
                    <EyeIcon [styleClass]="'p-image-preview-icon'" />
                </ng-template>
            </div>
            <div #mask class="p-image-mask p-component-overlay p-component-overlay-enter" *ngIf="maskVisible" (click)="onMaskClick()">
                <div class="p-image-toolbar" (click)="handleToolbarClick($event)">
                    <button class="p-image-action p-link" (click)="rotateRight()" type="button">
                        <RefreshIcon *ngIf="!rotateRightIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateRightIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="rotateLeft()" type="button">
                        <UndoIcon *ngIf="!rotateLeftIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateLeftIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled">
                        <SearchMinusIcon *ngIf="!zoomOutIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomOutIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled">
                        <SearchPlusIcon *ngIf="!zoomInIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomInIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" type="button" (click)="closePreview()">
                        <TimesIcon *ngIf="!closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate"></ng-template>
                    </button>
                </div>
                <div
                    *ngIf="previewVisible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                >
                    <img [attr.src]="src" class="p-image-preview" [ngStyle]="imagePreviewStyle()" (click)="onPreviewImageClick()" />
                </div>
            </div>
        </span>
    `, isInline: true, styles: [".p-image-mask{display:flex;align-items:center;justify-content:center}.p-image-preview-container{position:relative;display:inline-block}.p-image-preview-indicator{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}.p-image-preview-icon.pi{font-size:1.5rem}.p-image-preview-icon.p-icon{scale:1.5}.p-image-preview-container:hover>.p-image-preview-indicator{opacity:1;cursor:pointer}.p-image-preview-container>img{cursor:pointer}.p-image-toolbar{position:absolute;top:0;right:0;display:flex;z-index:1}.p-image-action.p-link{display:flex;justify-content:center;align-items:center}.p-image-action.p-link[disabled]{opacity:.5}.p-image-preview{transition:transform .15s;max-width:100vw;max-height:100vh}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return RefreshIcon; }), selector: "RefreshIcon" }, { kind: "component", type: i0.forwardRef(function () { return EyeIcon; }), selector: "EyeIcon" }, { kind: "component", type: i0.forwardRef(function () { return UndoIcon; }), selector: "UndoIcon" }, { kind: "component", type: i0.forwardRef(function () { return SearchMinusIcon; }), selector: "SearchMinusIcon" }, { kind: "component", type: i0.forwardRef(function () { return SearchPlusIcon; }), selector: "SearchPlusIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }], animations: [
        trigger('animation', [
            transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
            transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Image, decorators: [{
            type: Component,
            args: [{ selector: 'p-image', template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <img [attr.src]="src" [attr.alt]="alt" [attr.width]="width" [attr.height]="height" [ngStyle]="imageStyle" [class]="imageClass" (error)="imageError($event)" />
            <div class="p-image-preview-indicator" *ngIf="preview" (click)="onImageClick()">
                <ng-container *ngIf="indicatorTemplate; else defaultTemplate">
                    <ng-container *ngTemplateOutlet="indicatorTemplate"></ng-container>
                </ng-container>
                <ng-template #defaultTemplate>
                    <EyeIcon [styleClass]="'p-image-preview-icon'" />
                </ng-template>
            </div>
            <div #mask class="p-image-mask p-component-overlay p-component-overlay-enter" *ngIf="maskVisible" (click)="onMaskClick()">
                <div class="p-image-toolbar" (click)="handleToolbarClick($event)">
                    <button class="p-image-action p-link" (click)="rotateRight()" type="button">
                        <RefreshIcon *ngIf="!rotateRightIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateRightIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="rotateLeft()" type="button">
                        <UndoIcon *ngIf="!rotateLeftIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateLeftIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled">
                        <SearchMinusIcon *ngIf="!zoomOutIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomOutIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled">
                        <SearchPlusIcon *ngIf="!zoomInIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomInIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" type="button" (click)="closePreview()">
                        <TimesIcon *ngIf="!closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate"></ng-template>
                    </button>
                </div>
                <div
                    *ngIf="previewVisible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                >
                    <img [attr.src]="src" class="p-image-preview" [ngStyle]="imagePreviewStyle()" (click)="onPreviewImageClick()" />
                </div>
            </div>
        </span>
    `, animations: [
                        trigger('animation', [
                            transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
                            transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-image-mask{display:flex;align-items:center;justify-content:center}.p-image-preview-container{position:relative;display:inline-block}.p-image-preview-indicator{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}.p-image-preview-icon.pi{font-size:1.5rem}.p-image-preview-icon.p-icon{scale:1.5}.p-image-preview-container:hover>.p-image-preview-indicator{opacity:1;cursor:pointer}.p-image-preview-container>img{cursor:pointer}.p-image-toolbar{position:absolute;top:0;right:0;display:flex;z-index:1}.p-image-action.p-link{display:flex;justify-content:center;align-items:center}.p-image-action.p-link[disabled]{opacity:.5}.p-image-preview{transition:transform .15s;max-width:100vw;max-height:100vh}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PrimeNGConfig }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { imageClass: [{
                type: Input
            }], imageStyle: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], src: [{
                type: Input
            }], alt: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], preview: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onImageError: [{
                type: Output
            }], mask: [{
                type: ViewChild,
                args: ['mask']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class ImageModule {
}
ImageModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ImageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ImageModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: ImageModule, declarations: [Image], imports: [CommonModule, SharedModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon], exports: [Image, SharedModule] });
ImageModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ImageModule, imports: [CommonModule, SharedModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ImageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon],
                    exports: [Image, SharedModule],
                    declarations: [Image]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Image, ImageModule };
//# sourceMappingURL=primeng-image.mjs.map
