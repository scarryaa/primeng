import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Output, EventEmitter, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DomHandler } from 'primeng/dom';
import { RouterModule } from '@angular/router';
import { PlusIcon } from 'primeng/icons/plus';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "@angular/router";
export class SpeedDial {
    constructor(platformId, el, cd, document, renderer) {
        this.platformId = platformId;
        this.el = el;
        this.cd = cd;
        this.document = document;
        this.renderer = renderer;
        this.model = null;
        this.direction = 'up';
        this.transitionDelay = 30;
        this.type = 'linear';
        this.radius = 0;
        this.mask = false;
        this.disabled = false;
        this.hideOnClickOutside = true;
        this.rotateAnimation = true;
        this.onVisibleChange = new EventEmitter();
        this.visibleChange = new EventEmitter();
        this.onClick = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.isItemClicked = false;
        this._visible = false;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible) {
            this.bindDocumentClickListener();
        }
        else {
            this.unbindDocumentClickListener();
        }
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.type !== 'linear') {
                const button = DomHandler.findSingle(this.container.nativeElement, '.p-speeddial-button');
                const firstItem = DomHandler.findSingle(this.list.nativeElement, '.p-speeddial-item');
                if (button && firstItem) {
                    const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                    const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);
                    this.list.nativeElement.style.setProperty('--item-diff-x', `${wDiff / 2}px`);
                    this.list.nativeElement.style.setProperty('--item-diff-y', `${hDiff / 2}px`);
                }
            }
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'button':
                    this.buttonTemplate = item.template;
                    break;
            }
        });
    }
    show() {
        this.onVisibleChange.emit(true);
        this.visibleChange.emit(true);
        this._visible = true;
        this.onShow.emit();
        this.bindDocumentClickListener();
        this.cd.markForCheck();
    }
    hide() {
        this.onVisibleChange.emit(false);
        this.visibleChange.emit(false);
        this._visible = false;
        this.onHide.emit();
        this.unbindDocumentClickListener();
        this.cd.markForCheck();
    }
    onButtonClick(event) {
        this.visible ? this.hide() : this.show();
        this.onClick.emit(event);
        this.isItemClicked = true;
    }
    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
        this.hide();
        this.isItemClicked = true;
    }
    calculatePointStyle(index) {
        const type = this.type;
        if (type !== 'linear') {
            const length = this.model.length;
            const radius = this.radius || length * 20;
            if (type === 'circle') {
                const step = (2 * Math.PI) / length;
                return {
                    left: `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`,
                    top: `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`
                };
            }
            else if (type === 'semi-circle') {
                const direction = this.direction;
                const step = Math.PI / (length - 1);
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up') {
                    return { left: x, bottom: y };
                }
                else if (direction === 'down') {
                    return { left: x, top: y };
                }
                else if (direction === 'left') {
                    return { right: y, top: x };
                }
                else if (direction === 'right') {
                    return { left: y, top: x };
                }
            }
            else if (type === 'quarter-circle') {
                const direction = this.direction;
                const step = Math.PI / (2 * (length - 1));
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up-left') {
                    return { right: x, bottom: y };
                }
                else if (direction === 'up-right') {
                    return { left: x, bottom: y };
                }
                else if (direction === 'down-left') {
                    return { right: y, top: x };
                }
                else if (direction === 'down-right') {
                    return { left: y, top: x };
                }
            }
        }
        return {};
    }
    calculateTransitionDelay(index) {
        const length = this.model.length;
        return (this.visible ? index : length - index - 1) * this.transitionDelay;
    }
    containerClass() {
        return {
            ['p-speeddial p-component' + ` p-speeddial-${this.type}`]: true,
            [`p-speeddial-direction-${this.direction}`]: this.type !== 'circle',
            'p-speeddial-opened': this.visible,
            'p-disabled': this.disabled
        };
    }
    buttonClass() {
        return {
            'p-speeddial-button p-button-rounded': true,
            'p-speeddial-rotate': this.rotateAnimation && !this.hideIcon,
            [this.buttonClassName]: true
        };
    }
    get buttonIconClass() {
        return (!this.visible && this.showIcon) || !this.hideIcon ? this.showIcon : this.hideIcon;
    }
    getItemStyle(index) {
        const transitionDelay = this.calculateTransitionDelay(index);
        const pointStyle = this.calculatePointStyle(index);
        return {
            transitionDelay: `${transitionDelay}ms`,
            ...pointStyle
        };
    }
    isClickableRouterLink(item) {
        return item.routerLink && !this.disabled && !item.disabled;
    }
    isOutsideClicked(event) {
        return this.container && !(this.container.nativeElement.isSameNode(event.target) || this.container.nativeElement.contains(event.target) || this.isItemClicked);
    }
    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener && this.hideOnClickOutside) {
                this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.visible && this.isOutsideClicked(event)) {
                        this.hide();
                    }
                    this.isItemClicked = false;
                });
            }
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    ngOnDestroy() {
        this.unbindDocumentClickListener();
    }
}
SpeedDial.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SpeedDial, deps: [{ token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
SpeedDial.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: SpeedDial, selector: "p-speedDial", inputs: { id: "id", model: "model", visible: "visible", style: "style", className: "className", direction: "direction", transitionDelay: "transitionDelay", type: "type", radius: "radius", mask: "mask", disabled: "disabled", hideOnClickOutside: "hideOnClickOutside", buttonStyle: "buttonStyle", buttonClassName: "buttonClassName", maskStyle: "maskStyle", maskClassName: "maskClassName", showIcon: "showIcon", hideIcon: "hideIcon", rotateAnimation: "rotateAnimation" }, outputs: { onVisibleChange: "onVisibleChange", visibleChange: "visibleChange", onClick: "onClick", onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true }, { propertyName: "list", first: true, predicate: ["list"], descendants: true }], ngImport: i0, template: `
        <div #container [attr.id]="id" [ngClass]="containerClass()" [class]="className" [ngStyle]="style">
            <button pRipple pButton class="p-button-icon-only" [style]="buttonStyle" [icon]="buttonIconClass" [ngClass]="buttonClass()" (click)="onButtonClick($event)">
                <PlusIcon *ngIf="!showIcon && !buttonTemplate" />
                <ng-container *ngIf="buttonTemplate">
                    <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
                </ng-container>
            </button>
            <ul #list class="p-speeddial-list" role="menu">
                <li *ngFor="let item of model; let i = index" [ngStyle]="getItemStyle(i)" class="p-speeddial-item" pTooltip [tooltipOptions]="item.tooltipOptions" [ngClass]="{ 'p-hidden': item.visible === false }">
                    <a
                        *ngIf="isClickableRouterLink(item); else elseBlock"
                        pRipple
                        [routerLink]="item.routerLink"
                        [queryParams]="item.queryParams"
                        class="p-speeddial-action"
                        [ngClass]="{ 'p-disabled': item.disabled }"
                        role="menuitem"
                        [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                        (click)="onItemClick($event, item)"
                        (keydown.enter)="onItemClick($event, item, i)"
                        [attr.target]="item.target"
                        [attr.id]="item.id"
                        [attr.tabindex]="item.disabled || readonly || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        [fragment]="item.fragment"
                        [queryParamsHandling]="item.queryParamsHandling"
                        [preserveFragment]="item.preserveFragment"
                        [skipLocationChange]="item.skipLocationChange"
                        [replaceUrl]="item.replaceUrl"
                        [state]="item.state"
                    >
                        <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                    </a>
                    <ng-template #elseBlock>
                        <a
                            [attr.href]="item.url || null"
                            class="p-speeddial-action"
                            role="menuitem"
                            pRipple
                            (click)="onItemClick($event, item)"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target"
                            [attr.id]="item.id"
                            [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        >
                            <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                        </a>
                    </ng-template>
                </li>
            </ul>
        </div>
        <div *ngIf="mask && visible" [ngClass]="{ 'p-speeddial-mask': true, 'p-speeddial-mask-visible': visible }" [class]="maskClassName" [ngStyle]="maskStyle"></div>
    `, isInline: true, styles: [".p-speeddial{position:absolute;display:flex;z-index:1}.p-speeddial-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center;transition:top 0s linear .2s;pointer-events:none}.p-speeddial-item{transform:scale(0);opacity:0;transition:transform .2s cubic-bezier(.4,0,.2,1) 0ms,opacity .8s;will-change:transform}.p-speeddial-action{display:flex;align-items:center;justify-content:center;border-radius:50%;position:relative;overflow:hidden;cursor:pointer}.p-speeddial-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item{position:absolute}.p-speeddial-rotate{transition:transform .25s cubic-bezier(.4,0,.2,1) 0ms;will-change:transform}.p-speeddial-mask{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity .25s cubic-bezier(.25,.8,.25,1)}.p-speeddial-mask-visible{pointer-events:none;opacity:1;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.p-speeddial-opened .p-speeddial-list{pointer-events:auto}.p-speeddial-opened .p-speeddial-item{transform:scale(1);opacity:1}.p-speeddial-opened .p-speeddial-rotate{transform:rotate(45deg)}.p-speeddial-direction-up{align-items:center;flex-direction:column-reverse}.p-speeddial-direction-up .p-speeddial-list{flex-direction:column-reverse}.p-speeddial-direction-down{align-items:center;flex-direction:column}.p-speeddial-direction-down .p-speeddial-list{flex-direction:column}.p-speeddial-direction-left{justify-content:center;flex-direction:row-reverse}.p-speeddial-direction-left .p-speeddial-list{flex-direction:row-reverse}.p-speeddial-direction-right{justify-content:center;flex-direction:row}.p-speeddial-direction-right .p-speeddial-list{flex-direction:row}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.ButtonDirective; }), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(function () { return i4.Tooltip; }), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "directive", type: i0.forwardRef(function () { return i5.RouterLink; }), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: i0.forwardRef(function () { return PlusIcon; }), selector: "PlusIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SpeedDial, decorators: [{
            type: Component,
            args: [{ selector: 'p-speedDial', template: `
        <div #container [attr.id]="id" [ngClass]="containerClass()" [class]="className" [ngStyle]="style">
            <button pRipple pButton class="p-button-icon-only" [style]="buttonStyle" [icon]="buttonIconClass" [ngClass]="buttonClass()" (click)="onButtonClick($event)">
                <PlusIcon *ngIf="!showIcon && !buttonTemplate" />
                <ng-container *ngIf="buttonTemplate">
                    <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
                </ng-container>
            </button>
            <ul #list class="p-speeddial-list" role="menu">
                <li *ngFor="let item of model; let i = index" [ngStyle]="getItemStyle(i)" class="p-speeddial-item" pTooltip [tooltipOptions]="item.tooltipOptions" [ngClass]="{ 'p-hidden': item.visible === false }">
                    <a
                        *ngIf="isClickableRouterLink(item); else elseBlock"
                        pRipple
                        [routerLink]="item.routerLink"
                        [queryParams]="item.queryParams"
                        class="p-speeddial-action"
                        [ngClass]="{ 'p-disabled': item.disabled }"
                        role="menuitem"
                        [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                        (click)="onItemClick($event, item)"
                        (keydown.enter)="onItemClick($event, item, i)"
                        [attr.target]="item.target"
                        [attr.id]="item.id"
                        [attr.tabindex]="item.disabled || readonly || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        [fragment]="item.fragment"
                        [queryParamsHandling]="item.queryParamsHandling"
                        [preserveFragment]="item.preserveFragment"
                        [skipLocationChange]="item.skipLocationChange"
                        [replaceUrl]="item.replaceUrl"
                        [state]="item.state"
                    >
                        <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                    </a>
                    <ng-template #elseBlock>
                        <a
                            [attr.href]="item.url || null"
                            class="p-speeddial-action"
                            role="menuitem"
                            pRipple
                            (click)="onItemClick($event, item)"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target"
                            [attr.id]="item.id"
                            [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        >
                            <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                        </a>
                    </ng-template>
                </li>
            </ul>
        </div>
        <div *ngIf="mask && visible" [ngClass]="{ 'p-speeddial-mask': true, 'p-speeddial-mask-visible': visible }" [class]="maskClassName" [ngStyle]="maskStyle"></div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-speeddial{position:absolute;display:flex;z-index:1}.p-speeddial-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center;transition:top 0s linear .2s;pointer-events:none}.p-speeddial-item{transform:scale(0);opacity:0;transition:transform .2s cubic-bezier(.4,0,.2,1) 0ms,opacity .8s;will-change:transform}.p-speeddial-action{display:flex;align-items:center;justify-content:center;border-radius:50%;position:relative;overflow:hidden;cursor:pointer}.p-speeddial-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item{position:absolute}.p-speeddial-rotate{transition:transform .25s cubic-bezier(.4,0,.2,1) 0ms;will-change:transform}.p-speeddial-mask{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity .25s cubic-bezier(.25,.8,.25,1)}.p-speeddial-mask-visible{pointer-events:none;opacity:1;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.p-speeddial-opened .p-speeddial-list{pointer-events:auto}.p-speeddial-opened .p-speeddial-item{transform:scale(1);opacity:1}.p-speeddial-opened .p-speeddial-rotate{transform:rotate(45deg)}.p-speeddial-direction-up{align-items:center;flex-direction:column-reverse}.p-speeddial-direction-up .p-speeddial-list{flex-direction:column-reverse}.p-speeddial-direction-down{align-items:center;flex-direction:column}.p-speeddial-direction-down .p-speeddial-list{flex-direction:column}.p-speeddial-direction-left{justify-content:center;flex-direction:row-reverse}.p-speeddial-direction-left .p-speeddial-list{flex-direction:row-reverse}.p-speeddial-direction-right{justify-content:center;flex-direction:row}.p-speeddial-direction-right .p-speeddial-list{flex-direction:row}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }]; }, propDecorators: { id: [{
                type: Input
            }], model: [{
                type: Input
            }], visible: [{
                type: Input
            }], style: [{
                type: Input
            }], className: [{
                type: Input
            }], direction: [{
                type: Input
            }], transitionDelay: [{
                type: Input
            }], type: [{
                type: Input
            }], radius: [{
                type: Input
            }], mask: [{
                type: Input
            }], disabled: [{
                type: Input
            }], hideOnClickOutside: [{
                type: Input
            }], buttonStyle: [{
                type: Input
            }], buttonClassName: [{
                type: Input
            }], maskStyle: [{
                type: Input
            }], maskClassName: [{
                type: Input
            }], showIcon: [{
                type: Input
            }], hideIcon: [{
                type: Input
            }], rotateAnimation: [{
                type: Input
            }], onVisibleChange: [{
                type: Output
            }], visibleChange: [{
                type: Output
            }], onClick: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], container: [{
                type: ViewChild,
                args: ['container']
            }], list: [{
                type: ViewChild,
                args: ['list']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class SpeedDialModule {
}
SpeedDialModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SpeedDialModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SpeedDialModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: SpeedDialModule, declarations: [SpeedDial], imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, PlusIcon], exports: [SpeedDial, SharedModule, ButtonModule, TooltipModule, RouterModule] });
SpeedDialModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SpeedDialModule, imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, PlusIcon, SharedModule, ButtonModule, TooltipModule, RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SpeedDialModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, PlusIcon],
                    exports: [SpeedDial, SharedModule, ButtonModule, TooltipModule, RouterModule],
                    declarations: [SpeedDial]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlZWRkaWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3NwZWVkZGlhbC9zcGVlZGRpYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsS0FBSyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFHakIsZUFBZSxFQUVmLE1BQU0sRUFDTixZQUFZLEVBRVosU0FBUyxFQUdULE1BQU0sRUFFTixXQUFXLEVBQ2QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBWSxNQUFNLGFBQWEsQ0FBQztBQUNwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7QUFpRTlDLE1BQU0sT0FBTyxTQUFTO0lBMEVsQixZQUF5QyxVQUFlLEVBQVUsRUFBYyxFQUFTLEVBQXFCLEVBQTRCLFFBQWtCLEVBQVUsUUFBbUI7UUFBaEosZUFBVSxHQUFWLFVBQVUsQ0FBSztRQUFVLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUE0QixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQXZFaEwsVUFBSyxHQUFVLElBQUksQ0FB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ZW50IjpbImltcG9ydCB7XG4gICAgTmdNb2R1bGUsXG4gICAgQ29tcG9uZW50LFxuICAgIElucHV0LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIE91dHB1dCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIE9uRGVzdHJveSxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIEluamVjdCxcbiAgICBSZW5kZXJlcjIsXG4gICAgUExBVEZPUk1fSURcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUsIFByaW1lVGVtcGxhdGUsIE1lbnVJdGVtIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBsdXNJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9wbHVzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNwZWVkRGlhbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAjY29udGFpbmVyIFthdHRyLmlkXT1cImlkXCIgW25nQ2xhc3NdPVwiY29udGFpbmVyQ2xhc3MoKVwiIFtjbGFzc109XCJjbGFzc05hbWVcIiBbbmdTdHlsZV09XCJzdHlsZVwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBwUmlwcGxlIHBCdXR0b24gY2xhc3M9XCJwLWJ1dHRvbi1pY29uLW9ubHlcIiBbc3R5bGVdPVwiYnV0dG9uU3R5bGVcIiBbaWNvbl09XCJidXR0b25JY29uQ2xhc3NcIiBbbmdDbGFzc109XCJidXR0b25DbGFzcygpXCIgKGNsaWNrKT1cIm9uQnV0dG9uQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxQbHVzSWNvbiAqbmdJZj1cIiFzaG93SWNvbiAmJiAhYnV0dG9uVGVtcGxhdGVcIiAvPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJidXR0b25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYnV0dG9uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHVsICNsaXN0IGNsYXNzPVwicC1zcGVlZGRpYWwtbGlzdFwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsOyBsZXQgaSA9IGluZGV4XCIgW25nU3R5bGVdPVwiZ2V0SXRlbVN0eWxlKGkpXCIgY2xhc3M9XCJwLXNwZWVkZGlhbC1pdGVtXCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIiBbbmdDbGFzc109XCJ7ICdwLWhpZGRlbic6IGl0ZW0udmlzaWJsZSA9PT0gZmFsc2UgfVwiPlxuICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJpc0NsaWNrYWJsZVJvdXRlckxpbmsoaXRlbSk7IGVsc2UgZWxzZUJsb2NrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cIml0ZW0ucm91dGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcXVlcnlQYXJhbXNdPVwiaXRlbS5xdWVyeVBhcmFtc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtc3BlZWRkaWFsLWFjdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWRpc2FibGVkJzogaXRlbS5kaXNhYmxlZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJtZW51aXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9ucyB8fCB7IGV4YWN0OiBmYWxzZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChrZXlkb3duLmVudGVyKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgaXRlbSwgaSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cIml0ZW0uaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCB8fCByZWFkb25seSB8fCAhdmlzaWJsZSA/IG51bGwgOiBpdGVtLnRhYmluZGV4ID8gaXRlbS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBbZnJhZ21lbnRdPVwiaXRlbS5mcmFnbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcXVlcnlQYXJhbXNIYW5kbGluZ109XCJpdGVtLnF1ZXJ5UGFyYW1zSGFuZGxpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3ByZXNlcnZlRnJhZ21lbnRdPVwiaXRlbS5wcmVzZXJ2ZUZyYWdtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtza2lwTG9jYXRpb25DaGFuZ2VdPVwiaXRlbS5za2lwTG9jYXRpb25DaGFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JlcGxhY2VVcmxdPVwiaXRlbS5yZXBsYWNlVXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGF0ZV09XCJpdGVtLnN0YXRlXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXNwZWVkZGlhbC1hY3Rpb24taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZWxzZUJsb2NrPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5ocmVmXT1cIml0ZW0udXJsIHx8IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1zcGVlZGRpYWwtYWN0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kaXNhYmxlZCc6IGl0ZW0uZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJpdGVtLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJpdGVtLmRpc2FibGVkIHx8IChpICE9PSBhY3RpdmVJbmRleCAmJiByZWFkb25seSkgfHwgIXZpc2libGUgPyBudWxsIDogaXRlbS50YWJpbmRleCA/IGl0ZW0udGFiaW5kZXggOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zcGVlZGRpYWwtYWN0aW9uLWljb25cIiAqbmdJZj1cIml0ZW0uaWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJtYXNrICYmIHZpc2libGVcIiBbbmdDbGFzc109XCJ7ICdwLXNwZWVkZGlhbC1tYXNrJzogdHJ1ZSwgJ3Atc3BlZWRkaWFsLW1hc2stdmlzaWJsZSc6IHZpc2libGUgfVwiIFtjbGFzc109XCJtYXNrQ2xhc3NOYW1lXCIgW25nU3R5bGVdPVwibWFza1N0eWxlXCI+PC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3NwZWVkZGlhbC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU3BlZWREaWFsIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBpZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbW9kZWw6IGFueVtdID0gbnVsbDtcblxuICAgIEBJbnB1dCgpIGdldCB2aXNpYmxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgIH1cbiAgICBzZXQgdmlzaWJsZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGNsYXNzTmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZGlyZWN0aW9uOiBzdHJpbmcgPSAndXAnO1xuXG4gICAgQElucHV0KCkgdHJhbnNpdGlvbkRlbGF5OiBudW1iZXIgPSAzMDtcblxuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICdsaW5lYXInO1xuXG4gICAgQElucHV0KCkgcmFkaXVzOiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgbWFzazogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGhpZGVPbkNsaWNrT3V0c2lkZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBidXR0b25TdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgYnV0dG9uQ2xhc3NOYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtYXNrU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIG1hc2tDbGFzc05hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNob3dJY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBoaWRlSWNvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcm90YXRlQW5pbWF0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBPdXRwdXQoKSBvblZpc2libGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIHZpc2libGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2xpc3QnKSBsaXN0OiBFbGVtZW50UmVmO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgYnV0dG9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBpc0l0ZW1DbGlja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSwgcHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdsaW5lYXInKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQsICcucC1zcGVlZGRpYWwtYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LCAnLnAtc3BlZWRkaWFsLWl0ZW0nKTtcblxuICAgICAgICAgICAgICAgIGlmIChidXR0b24gJiYgZmlyc3RJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdEaWZmID0gTWF0aC5hYnMoYnV0dG9uLm9mZnNldFdpZHRoIC0gZmlyc3RJdGVtLm9mZnNldFdpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaERpZmYgPSBNYXRoLmFicyhidXR0b24ub2Zmc2V0SGVpZ2h0IC0gZmlyc3RJdGVtLm9mZnNldEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWl0ZW0tZGlmZi14JywgYCR7d0RpZmYgLyAyfXB4YCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWl0ZW0tZGlmZi15JywgYCR7aERpZmYgLyAyfXB4YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgICB0aGlzLnZpc2libGVDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMub25TaG93LmVtaXQoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICAgIHRoaXMudmlzaWJsZUNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uSGlkZS5lbWl0KCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgb25CdXR0b25DbGljayhldmVudCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xuICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdChldmVudCk7XG4gICAgICAgIHRoaXMuaXNJdGVtQ2xpY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25JdGVtQ2xpY2soZSwgaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoeyBvcmlnaW5hbEV2ZW50OiBlLCBpdGVtIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oaWRlKCk7XG5cbiAgICAgICAgdGhpcy5pc0l0ZW1DbGlja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQb2ludFN0eWxlKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnR5cGU7XG5cbiAgICAgICAgaWYgKHR5cGUgIT09ICdsaW5lYXInKSB7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLm1vZGVsLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucmFkaXVzIHx8IGxlbmd0aCAqIDIwO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NpcmNsZScpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gKDIgKiBNYXRoLlBJKSAvIGxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGBjYWxjKCR7cmFkaXVzICogTWF0aC5jb3Moc3RlcCAqIGluZGV4KX1weCArIHZhcigtLWl0ZW0tZGlmZi14LCAwcHgpKWAsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogYGNhbGMoJHtyYWRpdXMgKiBNYXRoLnNpbihzdGVwICogaW5kZXgpfXB4ICsgdmFyKC0taXRlbS1kaWZmLXksIDBweCkpYFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzZW1pLWNpcmNsZScpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gTWF0aC5QSSAvIChsZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gYGNhbGMoJHtyYWRpdXMgKiBNYXRoLmNvcyhzdGVwICogaW5kZXgpfXB4ICsgdmFyKC0taXRlbS1kaWZmLXgsIDBweCkpYDtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gYGNhbGMoJHtyYWRpdXMgKiBNYXRoLnNpbihzdGVwICogaW5kZXgpfXB4ICsgdmFyKC0taXRlbS1kaWZmLXksIDBweCkpYDtcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGxlZnQ6IHgsIGJvdHRvbTogeSB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogeCwgdG9wOiB5IH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByaWdodDogeSwgdG9wOiB4IH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogeSwgdG9wOiB4IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncXVhcnRlci1jaXJjbGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IE1hdGguUEkgLyAoMiAqIChsZW5ndGggLSAxKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IGBjYWxjKCR7cmFkaXVzICogTWF0aC5jb3Moc3RlcCAqIGluZGV4KX1weCArIHZhcigtLWl0ZW0tZGlmZi14LCAwcHgpKWA7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IGBjYWxjKCR7cmFkaXVzICogTWF0aC5zaW4oc3RlcCAqIGluZGV4KX1weCArIHZhcigtLWl0ZW0tZGlmZi15LCAwcHgpKWA7XG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwLWxlZnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJpZ2h0OiB4LCBib3R0b206IHkgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwLXJpZ2h0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBsZWZ0OiB4LCBib3R0b206IHkgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24tbGVmdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmlnaHQ6IHksIHRvcDogeCB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bi1yaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogeSwgdG9wOiB4IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVRyYW5zaXRpb25EZWxheShpbmRleCkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLm1vZGVsLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gKHRoaXMudmlzaWJsZSA/IGluZGV4IDogbGVuZ3RoIC0gaW5kZXggLSAxKSAqIHRoaXMudHJhbnNpdGlvbkRlbGF5O1xuICAgIH1cblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgWydwLXNwZWVkZGlhbCBwLWNvbXBvbmVudCcgKyBgIHAtc3BlZWRkaWFsLSR7dGhpcy50eXBlfWBdOiB0cnVlLFxuICAgICAgICAgICAgW2BwLXNwZWVkZGlhbC1kaXJlY3Rpb24tJHt0aGlzLmRpcmVjdGlvbn1gXTogdGhpcy50eXBlICE9PSAnY2lyY2xlJyxcbiAgICAgICAgICAgICdwLXNwZWVkZGlhbC1vcGVuZWQnOiB0aGlzLnZpc2libGUsXG4gICAgICAgICAgICAncC1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBidXR0b25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLXNwZWVkZGlhbC1idXR0b24gcC1idXR0b24tcm91bmRlZCc6IHRydWUsXG4gICAgICAgICAgICAncC1zcGVlZGRpYWwtcm90YXRlJzogdGhpcy5yb3RhdGVBbmltYXRpb24gJiYgIXRoaXMuaGlkZUljb24sXG4gICAgICAgICAgICBbdGhpcy5idXR0b25DbGFzc05hbWVdOiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IGJ1dHRvbkljb25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuICghdGhpcy52aXNpYmxlICYmIHRoaXMuc2hvd0ljb24pIHx8ICF0aGlzLmhpZGVJY29uID8gdGhpcy5zaG93SWNvbiA6IHRoaXMuaGlkZUljb247XG4gICAgfVxuXG4gICAgZ2V0SXRlbVN0eWxlKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25EZWxheSA9IHRoaXMuY2FsY3VsYXRlVHJhbnNpdGlvbkRlbGF5KGluZGV4KTtcbiAgICAgICAgY29uc3QgcG9pbnRTdHlsZSA9IHRoaXMuY2FsY3VsYXRlUG9pbnRTdHlsZShpbmRleCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uRGVsYXk6IGAke3RyYW5zaXRpb25EZWxheX1tc2AsXG4gICAgICAgICAgICAuLi5wb2ludFN0eWxlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaXNDbGlja2FibGVSb3V0ZXJMaW5rKGl0ZW06IE1lbnVJdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnJvdXRlckxpbmsgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIWl0ZW0uZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgaXNPdXRzaWRlQ2xpY2tlZChldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIgJiYgISh0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmlzU2FtZU5vZGUoZXZlbnQudGFyZ2V0KSB8fCB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgfHwgdGhpcy5pc0l0ZW1DbGlja2VkKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciAmJiB0aGlzLmhpZGVPbkNsaWNrT3V0c2lkZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGUgJiYgdGhpcy5pc091dHNpZGVDbGlja2VkKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzSXRlbUNsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEJ1dHRvbk1vZHVsZSwgUmlwcGxlTW9kdWxlLCBUb29sdGlwTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFBsdXNJY29uXSxcbiAgICBleHBvcnRzOiBbU3BlZWREaWFsLCBTaGFyZWRNb2R1bGUsIEJ1dHRvbk1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTcGVlZERpYWxdXG59KVxuZXhwb3J0IGNsYXNzIFNwZWVkRGlhbE1vZHVsZSB7fVxuIl19