import * as i0 from '@angular/core';
import { forwardRef, PLATFORM_ID, Component, ViewEncapsulation, Inject, Input, ViewChild, EventEmitter, ChangeDetectionStrategy, Output, ContentChildren, NgModule } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import * as i1 from '@angular/common';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import * as i4 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i2 from '@angular/router';
import { RouterModule } from '@angular/router';
import { ZIndexUtils } from 'primeng/utils';
import * as i3 from 'primeng/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { CaretRightIcon } from 'primeng/icons/caretright';
import { CaretLeftIcon } from 'primeng/icons/caretleft';
import { AngleRightIcon } from 'primeng/icons/angleright';

class SlideMenuSub {
    constructor(slideMenu, document, platformId, renderer) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.backLabel = 'Back';
        this.easing = 'ease-out';
        this.slideMenu = slideMenu;
    }
    itemClick(event, item, listitem) {
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
        if (item.items && !this.slideMenu.animating) {
            this.slideMenu.left -= this.slideMenu.menuWidth;
            this.activeItem = listitem;
            this.slideMenu.animating = true;
            setTimeout(() => (this.slideMenu.animating = false), this.effectDuration);
        }
        if (!item.items && this.slideMenu.popup) {
            this.slideMenu.hide();
        }
    }
    focusNextList(listitem) {
        if (!this.slideMenu.animating) {
            let focusableElements = DomHandler.getFocusableElements(listitem);
            if (focusableElements && focusableElements.length > 0) {
                focusableElements[0].focus();
            }
            this.unbindTransitionEndListener();
        }
    }
    onItemKeyDown(event) {
        let listItem = event.currentTarget.parentElement;
        switch (event.code) {
            case 'Space':
            case 'Enter':
                if (listItem && !DomHandler.hasClass(listItem, 'p-disabled')) {
                    listItem.children[0].click();
                    this.transitionEndListener = this.renderer.listen(this.sublistViewChild.nativeElement, 'transitionend', this.focusNextList.bind(this, listItem));
                }
                event.preventDefault();
                break;
            default:
                break;
        }
    }
    unbindTransitionEndListener() {
        if (this.transitionEndListener && this.sublistViewChild) {
            this.transitionEndListener();
            this.transitionEndListener = null;
        }
    }
    ngOnDestroy() {
        this.activeItem = null;
        this.unbindTransitionEndListener();
    }
    get isActive() {
        return -this.slideMenu.left == this.index * this.menuWidth;
    }
}
SlideMenuSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenuSub, deps: [{ token: forwardRef(() => SlideMenu) }, { token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
SlideMenuSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: SlideMenuSub, selector: "p-slideMenuSub", inputs: { item: "item", root: "root", backLabel: "backLabel", menuWidth: "menuWidth", effectDuration: "effectDuration", easing: "easing", index: "index" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "sublistViewChild", first: true, predicate: ["sublist"], descendants: true }], ngImport: i0, template: `
        <ul
            #sublist
            [ngClass]="{ 'p-slidemenu-rootlist': root, 'p-submenu-list': !root, 'p-active-submenu': isActive }"
            [style.width.px]="menuWidth"
            [style.left.px]="root ? slideMenu.left : slideMenu.menuWidth"
            [style.transitionProperty]="root ? 'left' : 'none'"
            [style.transitionDuration]="effectDuration + 'ms'"
            [style.transitionTimingFunction]="easing"
        >
            <ng-template ngFor let-child [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }"></li>
                <li
                    *ngIf="!child.separator"
                    #listitem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': listitem == activeItem, 'p-hidden': child.visible === false }"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                    [class]="child.styleClass"
                    [ngStyle]="child.style"
                >
                    <a
                        *ngIf="!child.routerLink"
                        (keydown)="onItemKeyDown($event)"
                        [attr.href]="child.url"
                        class="p-menuitem-link"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [ngClass]="{ 'p-disabled': child.disabled }"
                        [attr.tabindex]="child.disabled || !isActive ? null : '0'"
                        (click)="itemClick($event, child, listitem)"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <AngleRightIcon *ngIf="!slideMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <ng-template *ngTemplateOutlet="slideMenu.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        (keydown)="onItemKeyDown($event)"
                        [routerLink]="child.routerLink"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [href]="child.url"
                        class="p-menuitem-link"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled || !isActive ? null : '0'"
                        [ngClass]="{ 'p-disabled': child.disabled }"
                        (click)="itemClick($event, child, listitem)"
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <CaretRightIcon *ngIf="!slideMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <ng-template *ngTemplateOutlet="slideMenu.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <p-slideMenuSub class="p-submenu" [item]="child" [index]="index + 1" [menuWidth]="menuWidth" *ngIf="child.items"></p-slideMenuSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLink; }), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLinkActive; }), selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Tooltip; }), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: i0.forwardRef(function () { return CaretRightIcon; }), selector: "CaretRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleRightIcon; }), selector: "AngleRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return SlideMenuSub; }), selector: "p-slideMenuSub", inputs: ["item", "root", "backLabel", "menuWidth", "effectDuration", "easing", "index"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenuSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-slideMenuSub',
                    template: `
        <ul
            #sublist
            [ngClass]="{ 'p-slidemenu-rootlist': root, 'p-submenu-list': !root, 'p-active-submenu': isActive }"
            [style.width.px]="menuWidth"
            [style.left.px]="root ? slideMenu.left : slideMenu.menuWidth"
            [style.transitionProperty]="root ? 'left' : 'none'"
            [style.transitionDuration]="effectDuration + 'ms'"
            [style.transitionTimingFunction]="easing"
        >
            <ng-template ngFor let-child [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }"></li>
                <li
                    *ngIf="!child.separator"
                    #listitem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': listitem == activeItem, 'p-hidden': child.visible === false }"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                    [class]="child.styleClass"
                    [ngStyle]="child.style"
                >
                    <a
                        *ngIf="!child.routerLink"
                        (keydown)="onItemKeyDown($event)"
                        [attr.href]="child.url"
                        class="p-menuitem-link"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [ngClass]="{ 'p-disabled': child.disabled }"
                        [attr.tabindex]="child.disabled || !isActive ? null : '0'"
                        (click)="itemClick($event, child, listitem)"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <AngleRightIcon *ngIf="!slideMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <ng-template *ngTemplateOutlet="slideMenu.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        (keydown)="onItemKeyDown($event)"
                        [routerLink]="child.routerLink"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [href]="child.url"
                        class="p-menuitem-link"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled || !isActive ? null : '0'"
                        [ngClass]="{ 'p-disabled': child.disabled }"
                        (click)="itemClick($event, child, listitem)"
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <CaretRightIcon *ngIf="!slideMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <ng-template *ngTemplateOutlet="slideMenu.submenuIconTemplate"></ng-template>
                        </ng-container>
                    </a>
                    <p-slideMenuSub class="p-submenu" [item]="child" [index]="index + 1" [menuWidth]="menuWidth" *ngIf="child.items"></p-slideMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => SlideMenu)]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }]; }, propDecorators: { item: [{
                type: Input
            }], root: [{
                type: Input
            }], backLabel: [{
                type: Input
            }], menuWidth: [{
                type: Input
            }], effectDuration: [{
                type: Input
            }], easing: [{
                type: Input
            }], index: [{
                type: Input
            }], sublistViewChild: [{
                type: ViewChild,
                args: ['sublist']
            }] } });
class SlideMenu {
    constructor(document, platformId, el, renderer, cd, config, overlayService) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.config = config;
        this.overlayService = overlayService;
        this.menuWidth = 190;
        this.viewportHeight = 180;
        this.effectDuration = 250;
        this.easing = 'ease-out';
        this.backLabel = 'Back';
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.left = 0;
        this.animating = false;
        this.window = this.document.defaultView;
    }
    ngAfterViewChecked() {
        if (!this.viewportUpdated && !this.popup && this.containerViewChild) {
            this.updateViewPort();
            this.viewportUpdated = true;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'backicon':
                    this.backIconTemplate = item.template;
                    break;
                case 'submenuicon':
                    this.submenuIconTemplate = item.template;
                    break;
            }
        });
    }
    set container(element) {
        this.containerViewChild = element;
    }
    set backward(element) {
        this.backwardViewChild = element;
    }
    set slideMenuContent(element) {
        this.slideMenuContentViewChild = element;
    }
    updateViewPort() {
        this.renderer.setStyle(this.slideMenuContentViewChild.nativeElement, 'height', this.viewportHeight - DomHandler.getHiddenElementOuterHeight(this.backwardViewChild.nativeElement) + 'px');
    }
    toggle(event) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
        this.preventDocumentDefault = true;
    }
    show(event) {
        this.target = event.currentTarget;
        this.visible = true;
        this.preventDocumentDefault = true;
        this.cd.markForCheck();
    }
    onOverlayClick(event) {
        if (this.popup) {
            this.overlayService.add({
                originalEvent: event,
                target: this.el.nativeElement
            });
        }
        this.preventDocumentDefault = true;
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.updateViewPort();
                    this.moveOnTop();
                    this.onShow.emit({});
                    this.appendOverlay();
                    DomHandler.absolutePosition(this.containerViewChild.nativeElement, this.target);
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                    this.bindScrollListener();
                }
                break;
            case 'void':
                this.onOverlayHide();
                this.onHide.emit({});
                break;
        }
    }
    onOverlayAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(event.element);
                break;
        }
    }
    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                this.renderer.appendChild(this.document.body, this.containerViewChild.nativeElement);
            else
                DomHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }
    }
    restoreOverlayAppend() {
        if (this.container && this.appendTo) {
            this.renderer.appendChild(this.el.nativeElement, this.containerViewChild.nativeElement);
        }
    }
    moveOnTop() {
        if (this.autoZIndex) {
            ZIndexUtils.set('menu', this.containerViewChild.nativeElement, this.baseZIndex + this.config.zIndex.menu);
        }
    }
    hide() {
        this.visible = false;
        this.cd.markForCheck();
    }
    onWindowResize() {
        if (this.visible && !DomHandler.isTouchDevice()) {
            this.hide();
        }
    }
    goBack() {
        this.left += this.menuWidth;
    }
    onBackwardKeydown(event) {
        this.goBack();
        if (!this.left) {
            setTimeout(() => {
                let focusableElements = DomHandler.getFocusableElements(this.el.nativeElement);
                if (focusableElements && focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }, 1);
        }
        event.preventDefault();
    }
    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener) {
                const documentTarget = this.el ? this.el.nativeElement.ownerDocument : this.document;
                this.documentClickListener = this.renderer.listen(documentTarget, 'click', () => {
                    if (!this.preventDocumentDefault) {
                        this.hide();
                        this.cd.detectChanges();
                    }
                    this.preventDocumentDefault = false;
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
    bindDocumentResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener) {
                this.documentResizeListener = this.renderer.listen(this.window, 'resize', this.onWindowResize.bind(this));
            }
        }
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    bindScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
                    if (this.visible) {
                        this.hide();
                    }
                });
            }
            this.scrollHandler.bindScrollListener();
        }
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.preventDocumentDefault = false;
        this.left = 0;
        if (!this.cd.destroyed) {
            this.target = null;
        }
    }
    ngOnDestroy() {
        if (this.popup) {
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }
            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    }
}
SlideMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenu, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i4.PrimeNGConfig }, { token: i4.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
SlideMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: SlideMenu, selector: "p-slideMenu", inputs: { model: "model", popup: "popup", style: "style", styleClass: "styleClass", menuWidth: "menuWidth", viewportHeight: "viewportHeight", effectDuration: "effectDuration", easing: "easing", backLabel: "backLabel", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true }, { propertyName: "backward", first: true, predicate: ["backward"], descendants: true }, { propertyName: "slideMenuContent", first: true, predicate: ["slideMenuContent"], descendants: true }], ngImport: i0, template: `
        <div
            #container
            [ngClass]="{ 'p-slidemenu p-component': true, 'p-slidemenu-overlay': popup }"
            [class]="styleClass"
            [ngStyle]="style"
            (click)="onOverlayClick($event)"
            [@overlayAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            [@.disabled]="popup !== true"
            (@overlayAnimation.start)="onOverlayAnimationStart($event)"
            (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
            *ngIf="!popup || visible"
        >
            <div class="p-slidemenu-wrapper" [style.height]="left ? viewportHeight + 'px' : 'auto'" [style.width]="menuWidth + 'px'">
                <div #slideMenuContent class="p-slidemenu-content">
                    <p-slideMenuSub [item]="model" root="root" [index]="0" [menuWidth]="menuWidth" [effectDuration]="effectDuration" [easing]="easing"></p-slideMenuSub>
                </div>
                <a #backward (keydown.enter)="onBackwardKeydown($event)" (keydown.space)="onBackwardKeydown($event)" class="p-slidemenu-backward p-menuitem-link" tabindex="0" [style.display]="left ? 'block' : 'none'" (click)="goBack()">
                    <CaretLeftIcon *ngIf="!backIconTemplate" [styleClass]="'p-slidemenu-backward-icon'" />
                    <ng-template *ngTemplateOutlet="backIconTemplate"></ng-template>
                    <span>{{ backLabel }}</span>
                </a>
            </div>
        </div>
    `, isInline: true, styles: [".p-slidemenu{width:12.5rem}.p-slidemenu.p-slidemenu-overlay{position:absolute;top:0;left:0}.p-slidemenu ul{list-style:none;margin:0;padding:0}.p-slidemenu .p-slidemenu-rootlist{position:absolute;top:0}.p-slidemenu .p-submenu-list{display:none;position:absolute;top:0;width:12.5rem}.p-slidemenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden}.p-slidemenu .p-menuitem-icon,.p-slidemenu .p-menuitem-text{vertical-align:middle}.p-slidemenu .p-menuitem{position:relative}.p-slidemenu .p-menuitem-link .p-submenu-icon:not(svg){margin-left:auto}.p-slidemenu .p-menuitem-link .p-icon-wrapper{margin-left:auto;vertical-align:middle}.p-slidemenu .p-slidemenu-wrapper{position:relative}.p-slidemenu .p-slidemenu-content{overflow-x:hidden;overflow-y:auto;position:relative}.p-slidemenu-backward{position:absolute;bottom:0;width:100%;cursor:pointer;display:none}.p-slidemenu-backward .p-slidemenu-backward-icon,.p-slidemenu-backward span{vertical-align:middle}.p-slidemenu .p-menuitem-active{position:static}.p-slidemenu .p-menuitem-active>.p-submenu>.p-submenu-list{display:block}.p-slidemenu ul:not(.p-active-submenu)>.p-menuitem:not(.p-menuitem-active),.p-slidemenu .p-active-submenu>.p-menuitem-active>.p-submenu>.p-submenu-list{display:none}.p-slidemenu .p-active-submenu>.p-menuitem-active~.p-menuitem{display:block}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return CaretLeftIcon; }), selector: "CaretLeftIcon" }, { kind: "component", type: i0.forwardRef(function () { return SlideMenuSub; }), selector: "p-slideMenuSub", inputs: ["item", "root", "backLabel", "menuWidth", "effectDuration", "easing", "index"] }], animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('{{showTransitionParams}}')]), transition(':leave', [animate('{{hideTransitionParams}}', style({ opacity: 0 }))])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-slideMenu', template: `
        <div
            #container
            [ngClass]="{ 'p-slidemenu p-component': true, 'p-slidemenu-overlay': popup }"
            [class]="styleClass"
            [ngStyle]="style"
            (click)="onOverlayClick($event)"
            [@overlayAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            [@.disabled]="popup !== true"
            (@overlayAnimation.start)="onOverlayAnimationStart($event)"
            (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
            *ngIf="!popup || visible"
        >
            <div class="p-slidemenu-wrapper" [style.height]="left ? viewportHeight + 'px' : 'auto'" [style.width]="menuWidth + 'px'">
                <div #slideMenuContent class="p-slidemenu-content">
                    <p-slideMenuSub [item]="model" root="root" [index]="0" [menuWidth]="menuWidth" [effectDuration]="effectDuration" [easing]="easing"></p-slideMenuSub>
                </div>
                <a #backward (keydown.enter)="onBackwardKeydown($event)" (keydown.space)="onBackwardKeydown($event)" class="p-slidemenu-backward p-menuitem-link" tabindex="0" [style.display]="left ? 'block' : 'none'" (click)="goBack()">
                    <CaretLeftIcon *ngIf="!backIconTemplate" [styleClass]="'p-slidemenu-backward-icon'" />
                    <ng-template *ngTemplateOutlet="backIconTemplate"></ng-template>
                    <span>{{ backLabel }}</span>
                </a>
            </div>
        </div>
    `, animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('{{showTransitionParams}}')]), transition(':leave', [animate('{{hideTransitionParams}}', style({ opacity: 0 }))])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-slidemenu{width:12.5rem}.p-slidemenu.p-slidemenu-overlay{position:absolute;top:0;left:0}.p-slidemenu ul{list-style:none;margin:0;padding:0}.p-slidemenu .p-slidemenu-rootlist{position:absolute;top:0}.p-slidemenu .p-submenu-list{display:none;position:absolute;top:0;width:12.5rem}.p-slidemenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden}.p-slidemenu .p-menuitem-icon,.p-slidemenu .p-menuitem-text{vertical-align:middle}.p-slidemenu .p-menuitem{position:relative}.p-slidemenu .p-menuitem-link .p-submenu-icon:not(svg){margin-left:auto}.p-slidemenu .p-menuitem-link .p-icon-wrapper{margin-left:auto;vertical-align:middle}.p-slidemenu .p-slidemenu-wrapper{position:relative}.p-slidemenu .p-slidemenu-content{overflow-x:hidden;overflow-y:auto;position:relative}.p-slidemenu-backward{position:absolute;bottom:0;width:100%;cursor:pointer;display:none}.p-slidemenu-backward .p-slidemenu-backward-icon,.p-slidemenu-backward span{vertical-align:middle}.p-slidemenu .p-menuitem-active{position:static}.p-slidemenu .p-menuitem-active>.p-submenu>.p-submenu-list{display:block}.p-slidemenu ul:not(.p-active-submenu)>.p-menuitem:not(.p-menuitem-active),.p-slidemenu .p-active-submenu>.p-menuitem-active>.p-submenu>.p-submenu-list{display:none}.p-slidemenu .p-active-submenu>.p-menuitem-active~.p-menuitem{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i4.PrimeNGConfig }, { type: i4.OverlayService }]; }, propDecorators: { model: [{
                type: Input
            }], popup: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], menuWidth: [{
                type: Input
            }], viewportHeight: [{
                type: Input
            }], effectDuration: [{
                type: Input
            }], easing: [{
                type: Input
            }], backLabel: [{
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
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], container: [{
                type: ViewChild,
                args: ['container']
            }], backward: [{
                type: ViewChild,
                args: ['backward']
            }], slideMenuContent: [{
                type: ViewChild,
                args: ['slideMenuContent']
            }] } });
class SlideMenuModule {
}
SlideMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SlideMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: SlideMenuModule, declarations: [SlideMenu, SlideMenuSub], imports: [CommonModule, RouterModule, TooltipModule, SharedModule, CaretLeftIcon, CaretRightIcon, AngleRightIcon], exports: [SlideMenu, RouterModule, TooltipModule, SharedModule] });
SlideMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenuModule, imports: [CommonModule, RouterModule, TooltipModule, SharedModule, CaretLeftIcon, CaretRightIcon, AngleRightIcon, RouterModule, TooltipModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: SlideMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, TooltipModule, SharedModule, CaretLeftIcon, CaretRightIcon, AngleRightIcon],
                    exports: [SlideMenu, RouterModule, TooltipModule, SharedModule],
                    declarations: [SlideMenu, SlideMenuSub]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { SlideMenu, SlideMenuModule, SlideMenuSub };
//# sourceMappingURL=primeng-slidemenu.mjs.map
