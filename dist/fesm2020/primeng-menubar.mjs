import * as i0 from '@angular/core';
import { Injectable, EventEmitter, PLATFORM_ID, Component, ViewEncapsulation, Inject, Input, Output, ChangeDetectionStrategy, ContentChildren, ViewChild, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { ZIndexUtils } from 'primeng/utils';
import * as i5 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i2 from '@angular/router';
import { RouterModule } from '@angular/router';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import * as i4 from 'primeng/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounce, interval, filter } from 'rxjs';
import { BarsIcon } from 'primeng/icons/bars';
import { AngleDownIcon } from 'primeng/icons/angledown';
import { AngleRightIcon } from 'primeng/icons/angleright';

class MenubarService {
    constructor() {
        this.mouseLeaves = new Subject();
        this.mouseLeft$ = this.mouseLeaves.pipe(debounce(() => interval(this.autoHideDelay)), filter((mouseLeft) => this.autoHide && mouseLeft));
    }
}
MenubarService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MenubarService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarService, decorators: [{
            type: Injectable
        }] });
class MenubarSub {
    constructor(document, platformId, el, renderer, cd, menubarService, menubar) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.menubarService = menubarService;
        this.menubar = menubar;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.leafClick = new EventEmitter();
        this.menuHoverActive = false;
    }
    get parentActive() {
        return this._parentActive;
    }
    set parentActive(value) {
        if (!this.root) {
            this._parentActive = value;
            if (!value)
                this.activeItem = null;
        }
    }
    ngOnInit() {
        this.mouseLeaveSubscriber = this.menubarService.mouseLeft$.subscribe(() => {
            this.activeItem = null;
            this.cd.markForCheck();
            this.unbindDocumentClickListener();
        });
    }
    onItemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (item.items) {
            if (this.activeItem && item === this.activeItem) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                if (this.root) {
                    this.bindDocumentClickListener();
                }
            }
        }
        if (!item.items) {
            this.onLeafClick();
        }
    }
    onItemMouseLeave(event, item) {
        this.menubarService.mouseLeaves.next(true);
    }
    onItemMouseEnter(event, item) {
        this.menubarService.mouseLeaves.next(false);
        if (item.disabled || this.mobileActive) {
            event.preventDefault();
            return;
        }
        if (this.root) {
            if (this.activeItem || this.autoDisplay) {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
        else {
            this.activeItem = item;
            this.bindDocumentClickListener();
        }
    }
    onLeafClick() {
        this.activeItem = null;
        if (this.root) {
            this.unbindDocumentClickListener();
        }
        this.leafClick.emit();
    }
    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.el && !this.el.nativeElement.contains(event.target)) {
                        this.activeItem = null;
                        this.cd.markForCheck();
                        this.unbindDocumentClickListener();
                    }
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
        this.mouseLeaveSubscriber.unsubscribe();
        this.unbindDocumentClickListener();
    }
}
MenubarSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarSub, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: MenubarService }, { token: Menubar }], target: i0.ɵɵFactoryTarget.Component });
MenubarSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: MenubarSub, selector: "p-menubarSub", inputs: { item: "item", root: "root", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", mobileActive: "mobileActive", autoDisplay: "autoDisplay", parentActive: "parentActive" }, outputs: { leafClick: "leafClick" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <ul [ngClass]="{ 'p-submenu-list': !root, 'p-menubar-root-list': root }" [attr.role]="root ? 'menubar' : 'menu'">
            <ng-template ngFor let-child [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #listItem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': child === activeItem, 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    role="none"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url"
                        [attr.data-automationid]="child.automationId"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="item === activeItem"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <ng-container *ngIf="!menubar.submenuIconTemplate">
                                <AngleDownIcon [styleClass]="'p-submenu-icon'" *ngIf="root" />
                                <AngleRightIcon [styleClass]="'p-submenu-icon'" *ngIf="!root" />
                            </ng-container>
                            <ng-template *ngTemplateOutlet="menubar.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [attr.data-automationid]="child.automationId"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <ng-container *ngIf="!menubar.submenuIconTemplate">
                                <AngleDownIcon [styleClass]="'p-submenu-icon'" *ngIf="root" />
                                <AngleRightIcon [styleClass]="'p-submenu-icon'" *ngIf="!root" />
                            </ng-container>
                            <ng-template *ngTemplateOutlet="menubar.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <p-menubarSub [parentActive]="child === activeItem" [item]="child" *ngIf="child.items" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay" (leafClick)="onLeafClick()"></p-menubarSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLink; }), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLinkActive; }), selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(function () { return i4.Tooltip; }), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: i0.forwardRef(function () { return AngleDownIcon; }), selector: "AngleDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleRightIcon; }), selector: "AngleRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return MenubarSub; }), selector: "p-menubarSub", inputs: ["item", "root", "autoZIndex", "baseZIndex", "mobileActive", "autoDisplay", "parentActive"], outputs: ["leafClick"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-menubarSub',
                    template: `
        <ul [ngClass]="{ 'p-submenu-list': !root, 'p-menubar-root-list': root }" [attr.role]="root ? 'menubar' : 'menu'">
            <ng-template ngFor let-child [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #listItem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': child === activeItem, 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    role="none"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url"
                        [attr.data-automationid]="child.automationId"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="item === activeItem"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <ng-container *ngIf="!menubar.submenuIconTemplate">
                                <AngleDownIcon [styleClass]="'p-submenu-icon'" *ngIf="root" />
                                <AngleRightIcon [styleClass]="'p-submenu-icon'" *ngIf="!root" />
                            </ng-container>
                            <ng-template *ngTemplateOutlet="menubar.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [attr.data-automationid]="child.automationId"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <ng-container *ngIf="!menubar.submenuIconTemplate">
                                <AngleDownIcon [styleClass]="'p-submenu-icon'" *ngIf="root" />
                                <AngleRightIcon [styleClass]="'p-submenu-icon'" *ngIf="!root" />
                            </ng-container>
                            <ng-template *ngTemplateOutlet="menubar.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <p-menubarSub [parentActive]="child === activeItem" [item]="child" *ngIf="child.items" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay" (leafClick)="onLeafClick()"></p-menubarSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: MenubarService }, { type: Menubar }]; }, propDecorators: { item: [{
                type: Input
            }], root: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], mobileActive: [{
                type: Input
            }], autoDisplay: [{
                type: Input
            }], parentActive: [{
                type: Input
            }], leafClick: [{
                type: Output
            }] } });
class Menubar {
    constructor(document, platformId, el, renderer, cd, config, menubarService) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.config = config;
        this.menubarService = menubarService;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.autoHideDelay = 100;
    }
    ngOnInit() {
        this.menubarService.autoHide = this.autoHide;
        this.menubarService.autoHideDelay = this.autoHideDelay;
        this.mouseLeaveSubscriber = this.menubarService.mouseLeft$.subscribe(() => this.unbindOutsideClickListener());
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
                case 'menuicon':
                    this.menuIconTemplate = item.template;
                    break;
                case 'submenuicon':
                    this.submenuIconTemplate = item.template;
                    break;
            }
        });
    }
    toggle(event) {
        if (this.mobileActive) {
            this.hide();
            ZIndexUtils.clear(this.rootmenu.el.nativeElement);
        }
        else {
            this.mobileActive = true;
            ZIndexUtils.set('menu', this.rootmenu.el.nativeElement, this.config.zIndex.menu);
        }
        this.bindOutsideClickListener();
        event.preventDefault();
    }
    bindOutsideClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.outsideClickListener) {
                this.outsideClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.mobileActive &&
                        this.rootmenu.el.nativeElement !== event.target &&
                        !this.rootmenu.el.nativeElement.contains(event.target) &&
                        this.menubutton.nativeElement !== event.target &&
                        !this.menubutton.nativeElement.contains(event.target)) {
                        this.hide();
                    }
                });
            }
        }
    }
    hide() {
        this.mobileActive = false;
        this.cd.markForCheck();
        ZIndexUtils.clear(this.rootmenu.el.nativeElement);
        this.unbindOutsideClickListener();
    }
    onLeafClick() {
        this.hide();
    }
    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            this.outsideClickListener();
            this.outsideClickListener = null;
        }
    }
    ngOnDestroy() {
        this.mouseLeaveSubscriber.unsubscribe();
        this.unbindOutsideClickListener();
    }
}
Menubar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Menubar, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i5.PrimeNGConfig }, { token: MenubarService }], target: i0.ɵɵFactoryTarget.Component });
Menubar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Menubar, selector: "p-menubar", inputs: { model: "model", style: "style", styleClass: "styleClass", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", autoDisplay: "autoDisplay", autoHide: "autoHide", autoHideDelay: "autoHideDelay" }, host: { classAttribute: "p-element" }, providers: [MenubarService], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "menubutton", first: true, predicate: ["menubutton"], descendants: true }, { propertyName: "rootmenu", first: true, predicate: ["rootmenu"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="{ 'p-menubar p-component': true, 'p-menubar-mobile-active': mobileActive }" [class]="styleClass" [ngStyle]="style">
            <div class="p-menubar-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <a #menubutton tabindex="0" *ngIf="model && model.length > 0" class="p-menubar-button" (click)="toggle($event)">
                <BarsIcon *ngIf="!menuIconTemplate" />
                <ng-template *ngTemplateOutlet="menuIconTemplate"></ng-template>
            </a>
            <p-menubarSub #rootmenu [item]="model" root="root" [baseZIndex]="baseZIndex" (leafClick)="onLeafClick()" [autoZIndex]="autoZIndex" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay"></p-menubarSub>
            <div class="p-menubar-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-menubar-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-menubar{display:flex;align-items:center}.p-menubar ul{margin:0;padding:0;list-style:none}.p-menubar .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menubar .p-menuitem-text{line-height:1}.p-menubar .p-menuitem{position:relative}.p-menubar-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-menubar-root-list>li ul{display:none;z-index:1}.p-menubar-root-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block}.p-menubar .p-submenu-list{display:none;position:absolute;z-index:2}.p-menubar .p-submenu-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block;left:100%;top:0}.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon:not(svg){margin-left:auto}.p-menubar .p-submenu-list .p-menuitem-link .p-icon-wrapper{margin-left:auto}.p-menubar .p-menubar-custom,.p-menubar .p-menubar-end{margin-left:auto;align-self:center}.p-menubar-button{display:none;cursor:pointer;align-items:center;justify-content:center}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return BarsIcon; }), selector: "BarsIcon" }, { kind: "component", type: i0.forwardRef(function () { return MenubarSub; }), selector: "p-menubarSub", inputs: ["item", "root", "autoZIndex", "baseZIndex", "mobileActive", "autoDisplay", "parentActive"], outputs: ["leafClick"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Menubar, decorators: [{
            type: Component,
            args: [{ selector: 'p-menubar', template: `
        <div [ngClass]="{ 'p-menubar p-component': true, 'p-menubar-mobile-active': mobileActive }" [class]="styleClass" [ngStyle]="style">
            <div class="p-menubar-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <a #menubutton tabindex="0" *ngIf="model && model.length > 0" class="p-menubar-button" (click)="toggle($event)">
                <BarsIcon *ngIf="!menuIconTemplate" />
                <ng-template *ngTemplateOutlet="menuIconTemplate"></ng-template>
            </a>
            <p-menubarSub #rootmenu [item]="model" root="root" [baseZIndex]="baseZIndex" (leafClick)="onLeafClick()" [autoZIndex]="autoZIndex" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay"></p-menubarSub>
            <div class="p-menubar-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-menubar-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, providers: [MenubarService], styles: [".p-menubar{display:flex;align-items:center}.p-menubar ul{margin:0;padding:0;list-style:none}.p-menubar .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menubar .p-menuitem-text{line-height:1}.p-menubar .p-menuitem{position:relative}.p-menubar-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-menubar-root-list>li ul{display:none;z-index:1}.p-menubar-root-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block}.p-menubar .p-submenu-list{display:none;position:absolute;z-index:2}.p-menubar .p-submenu-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block;left:100%;top:0}.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon:not(svg){margin-left:auto}.p-menubar .p-submenu-list .p-menuitem-link .p-icon-wrapper{margin-left:auto}.p-menubar .p-menubar-custom,.p-menubar .p-menubar-end{margin-left:auto;align-self:center}.p-menubar-button{display:none;cursor:pointer;align-items:center;justify-content:center}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i5.PrimeNGConfig }, { type: MenubarService }]; }, propDecorators: { model: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], autoDisplay: [{
                type: Input
            }], autoHide: [{
                type: Input
            }], autoHideDelay: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], menubutton: [{
                type: ViewChild,
                args: ['menubutton']
            }], rootmenu: [{
                type: ViewChild,
                args: ['rootmenu']
            }] } });
class MenubarModule {
}
MenubarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MenubarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: MenubarModule, declarations: [Menubar, MenubarSub], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, BarsIcon, AngleDownIcon, AngleRightIcon], exports: [Menubar, RouterModule, TooltipModule, SharedModule] });
MenubarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarModule, imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, BarsIcon, AngleDownIcon, AngleRightIcon, RouterModule, TooltipModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MenubarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, BarsIcon, AngleDownIcon, AngleRightIcon],
                    exports: [Menubar, RouterModule, TooltipModule, SharedModule],
                    declarations: [Menubar, MenubarSub]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Menubar, MenubarModule, MenubarService, MenubarSub };
//# sourceMappingURL=primeng-menubar.mjs.map
