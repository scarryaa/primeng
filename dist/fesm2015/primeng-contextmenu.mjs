import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, ViewEncapsulation, Inject, Input, Output, ViewChild, ChangeDetectionStrategy, ContentChildren, NgModule } from '@angular/core';
import * as i2 from '@angular/router';
import { RouterModule } from '@angular/router';
import * as i5 from 'primeng/api';
import { PrimeTemplate, SharedModule, ContextMenuService } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import * as i4 from 'primeng/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { ZIndexUtils } from 'primeng/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngleRightIcon } from 'primeng/icons/angleright';

class ContextMenuSub {
    constructor(contextMenu) {
        this.leafClick = new EventEmitter();
        this.contextMenu = contextMenu;
    }
    ngOnInit() {
        this.activeItemKeyChangeSubscription = this.contextMenu.contextMenuService.activeItemKeyChange$.pipe(takeUntil(this.contextMenu.ngDestroy$)).subscribe((activeItemKey) => {
            this.activeItemKey = activeItemKey;
            if (this.isActive(this.parentItemKey) && DomHandler.hasClass(this.sublistViewChild.nativeElement, 'p-submenu-list-active')) {
                this.contextMenu.positionSubmenu(this.sublistViewChild.nativeElement);
            }
            this.contextMenu.cd.markForCheck();
        });
    }
    onItemMouseEnter(event, item, key) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (item.disabled) {
            this.activeItemKey = null;
            return;
        }
        if (item.items) {
            let childSublist = DomHandler.findSingle(event.currentTarget, '.p-submenu-list');
            DomHandler.addClass(childSublist, 'p-submenu-list-active');
        }
        this.contextMenu.contextMenuService.changeKey(key);
    }
    onItemMouseLeave(event, item) {
        if (item.disabled) {
            return;
        }
        if (this.contextMenu.el.nativeElement.contains(event.toElement)) {
            if (item.items) {
                this.contextMenu.removeActiveFromSubLists(event.currentTarget);
            }
            if (!this.root) {
                this.contextMenu.contextMenuService.changeKey(this.parentItemKey);
            }
        }
    }
    onItemClick(event, item, menuitem, key) {
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
            let childSublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (childSublist) {
                if (this.isActive(key) && DomHandler.hasClass(childSublist, 'p-submenu-list-active')) {
                    this.contextMenu.removeActiveFromSubLists(menuitem);
                }
                else {
                    DomHandler.addClass(childSublist, 'p-submenu-list-active');
                }
                this.contextMenu.contextMenuService.changeKey(key);
            }
        }
        if (!item.items) {
            this.onLeafClick();
        }
    }
    onLeafClick() {
        if (this.root) {
            this.contextMenu.hide();
        }
        this.leafClick.emit();
    }
    getKey(index) {
        return this.root ? String(index) : this.parentItemKey + '_' + index;
    }
    isActive(key) {
        return this.activeItemKey && (this.activeItemKey.startsWith(key + '_') || this.activeItemKey === key);
    }
}
ContextMenuSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenuSub, deps: [{ token: forwardRef(() => ContextMenu) }], target: i0.ɵɵFactoryTarget.Component });
ContextMenuSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: { item: "item", root: "root", parentItemKey: "parentItemKey" }, outputs: { leafClick: "leafClick" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "sublistViewChild", first: true, predicate: ["sublist"], descendants: true }, { propertyName: "menuitemViewChild", first: true, predicate: ["menuitem"], descendants: true }], ngImport: i0, template: `
        <ul #sublist [ngClass]="{ 'p-submenu-list': !root }">
            <ng-template ngFor let-child let-index="index" [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" #menuitem class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #menuitem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': isActive(getKey(index)), 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                    (mouseenter)="onItemMouseEnter($event, child, getKey(index))"
                    (mouseleave)="onItemMouseLeave($event, child)"
                    role="none"
                    [attr.data-ik]="getKey(index)"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url ? child.url : null"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="isActive(getKey(index))"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <AngleRightIcon *ngIf="!contextMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <span *ngIf="contextMenu.submenuIconTemplate" class="p-submenu-icon">
                                <ng-template *ngTemplateOutlet="contextMenu.submenuIconTemplate"></ng-template>
                            </span>
                        </ng-container>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        role="menuitem"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
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
                            <AngleRightIcon *ngIf="!contextMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <span *ngIf="contextMenu.submenuIconTemplate" class="p-submenu-icon">
                                <ng-template *ngTemplateOutlet="contextMenu.submenuIconTemplate"></ng-template>
                            </span>
                        </ng-container>
                    </a>
                    <p-contextMenuSub [parentItemKey]="getKey(index)" [item]="child" *ngIf="child.items" (leafClick)="onLeafClick()"></p-contextMenuSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLink; }), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLinkActive; }), selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(function () { return i4.Tooltip; }), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: i0.forwardRef(function () { return AngleRightIcon; }), selector: "AngleRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return ContextMenuSub; }), selector: "p-contextMenuSub", inputs: ["item", "root", "parentItemKey"], outputs: ["leafClick"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenuSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-contextMenuSub',
                    template: `
        <ul #sublist [ngClass]="{ 'p-submenu-list': !root }">
            <ng-template ngFor let-child let-index="index" [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" #menuitem class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #menuitem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': isActive(getKey(index)), 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                    (mouseenter)="onItemMouseEnter($event, child, getKey(index))"
                    (mouseleave)="onItemMouseLeave($event, child)"
                    role="none"
                    [attr.data-ik]="getKey(index)"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url ? child.url : null"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="isActive(getKey(index))"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <ng-container *ngIf="child.items">
                            <AngleRightIcon *ngIf="!contextMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <span *ngIf="contextMenu.submenuIconTemplate" class="p-submenu-icon">
                                <ng-template *ngTemplateOutlet="contextMenu.submenuIconTemplate"></ng-template>
                            </span>
                        </ng-container>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        role="menuitem"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
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
                            <AngleRightIcon *ngIf="!contextMenu.submenuIconTemplate" [styleClass]="'p-submenu-icon'" />
                            <span *ngIf="contextMenu.submenuIconTemplate" class="p-submenu-icon">
                                <ng-template *ngTemplateOutlet="contextMenu.submenuIconTemplate"></ng-template>
                            </span>
                        </ng-container>
                    </a>
                    <p-contextMenuSub [parentItemKey]="getKey(index)" [item]="child" *ngIf="child.items" (leafClick)="onLeafClick()"></p-contextMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [forwardRef(() => ContextMenu)]
                    }] }];
    }, propDecorators: { item: [{
                type: Input
            }], root: [{
                type: Input
            }], parentItemKey: [{
                type: Input
            }], leafClick: [{
                type: Output
            }], sublistViewChild: [{
                type: ViewChild,
                args: ['sublist']
            }], menuitemViewChild: [{
                type: ViewChild,
                args: ['menuitem']
            }] } });
class ContextMenu {
    constructor(document, el, renderer, cd, zone, contextMenuService, config) {
        this.document = document;
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.zone = zone;
        this.contextMenuService = contextMenuService;
        this.config = config;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.triggerEvent = 'contextmenu';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.ngDestroy$ = new Subject();
        this.preventDocumentDefault = false;
        this.window = this.document.defaultView;
    }
    ngAfterViewInit() {
        if (this.global) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.triggerEventListener = this.renderer.listen(documentTarget, this.triggerEvent, (event) => {
                this.show(event);
                event.preventDefault();
            });
        }
        else if (this.target) {
            this.triggerEventListener = this.renderer.listen(this.target, this.triggerEvent, (event) => {
                this.show(event);
                event.preventDefault();
            });
        }
        if (this.appendTo) {
            if (this.appendTo === 'body')
                this.renderer.appendChild(this.document.body, this.containerViewChild.nativeElement);
            else
                DomHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }
    }
    show(event) {
        this.clearActiveItem();
        this.position(event);
        this.moveOnTop();
        this.containerViewChild.nativeElement.style.display = 'block';
        this.preventDocumentDefault = true;
        DomHandler.fadeIn(this.containerViewChild.nativeElement, 250);
        this.bindGlobalListeners();
        if (event) {
            event.preventDefault();
        }
        this.onShow.emit();
    }
    hide() {
        this.containerViewChild.nativeElement.style.display = 'none';
        if (this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        this.clearActiveItem();
        this.unbindGlobalListeners();
        this.onHide.emit();
    }
    moveOnTop() {
        if (this.autoZIndex && this.containerViewChild && this.containerViewChild.nativeElement.style.display !== 'block') {
            ZIndexUtils.set('menu', this.containerViewChild.nativeElement, this.baseZIndex + this.config.zIndex.menu);
        }
    }
    toggle(event) {
        if (this.containerViewChild.nativeElement.offsetParent)
            this.hide();
        else
            this.show(event);
    }
    position(event) {
        if (event) {
            let left = event.pageX + 1;
            let top = event.pageY + 1;
            let width = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.containerViewChild.nativeElement);
            let height = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetHeight : DomHandler.getHiddenElementOuterHeight(this.containerViewChild.nativeElement);
            let viewport = DomHandler.getViewport();
            //flip
            if (left + width - this.document.scrollingElement.scrollLeft > viewport.width) {
                left -= width;
            }
            //flip
            if (top + height - this.document.scrollingElement.scrollTop > viewport.height) {
                top -= height;
            }
            //fit
            if (left < this.document.scrollingElement.scrollLeft) {
                left = this.document.scrollingElement.scrollLeft;
            }
            //fit
            if (top < this.document.scrollingElement.scrollTop) {
                top = this.document.scrollingElement.scrollTop;
            }
            this.containerViewChild.nativeElement.style.left = left + 'px';
            this.containerViewChild.nativeElement.style.top = top + 'px';
        }
    }
    positionSubmenu(sublist) {
        let parentMenuItem = sublist.parentElement.parentElement;
        let viewport = DomHandler.getViewport();
        let sublistWidth = sublist.offsetParent ? sublist.offsetWidth : DomHandler.getHiddenElementOuterWidth(sublist);
        let sublistHeight = sublist.offsetHeight ? sublist.offsetHeight : DomHandler.getHiddenElementOuterHeight(sublist);
        let itemOuterWidth = DomHandler.getOuterWidth(parentMenuItem.children[0]);
        let itemOuterHeight = DomHandler.getOuterHeight(parentMenuItem.children[0]);
        let containerOffset = DomHandler.getOffset(parentMenuItem.parentElement);
        sublist.style.zIndex = ++DomHandler.zindex;
        if (parseInt(containerOffset.top) + itemOuterHeight + sublistHeight > viewport.height - DomHandler.calculateScrollbarHeight()) {
            sublist.style.removeProperty('top');
            sublist.style.bottom = '0px';
        }
        else {
            sublist.style.removeProperty('bottom');
            sublist.style.top = '0px';
        }
        if (parseInt(containerOffset.left) + itemOuterWidth + sublistWidth > viewport.width - DomHandler.calculateScrollbarWidth()) {
            sublist.style.left = -sublistWidth + 'px';
        }
        else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    }
    isItemMatched(menuitem) {
        return DomHandler.hasClass(menuitem, 'p-menuitem') && !DomHandler.hasClass(menuitem.children[0], 'p-disabled');
    }
    findNextItem(menuitem, isRepeated) {
        let nextMenuitem = menuitem.nextElementSibling;
        if (nextMenuitem) {
            return this.isItemMatched(nextMenuitem) ? nextMenuitem : this.findNextItem(nextMenuitem, isRepeated);
        }
        else {
            let firstItem = menuitem.parentElement.children[0];
            return this.isItemMatched(firstItem) ? firstItem : !isRepeated ? this.findNextItem(firstItem, true) : null;
        }
    }
    findPrevItem(menuitem, isRepeated) {
        let prevMenuitem = menuitem.previousElementSibling;
        if (prevMenuitem) {
            return this.isItemMatched(prevMenuitem) ? prevMenuitem : this.findPrevItem(prevMenuitem, isRepeated);
        }
        else {
            let lastItem = menuitem.parentElement.children[menuitem.parentElement.children.length - 1];
            return this.isItemMatched(lastItem) ? lastItem : !isRepeated ? this.findPrevItem(lastItem, true) : null;
        }
    }
    getActiveItem() {
        let activeItemKey = this.contextMenuService.activeItemKey;
        return activeItemKey == null ? null : DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-menuitem[data-ik="' + activeItemKey + '"]');
    }
    clearActiveItem() {
        if (this.contextMenuService.activeItemKey) {
            this.removeActiveFromSubLists(this.containerViewChild.nativeElement);
            this.contextMenuService.reset();
        }
    }
    removeActiveFromSubLists(el) {
        let sublists = DomHandler.find(el, '.p-submenu-list-active');
        for (let sublist of sublists) {
            DomHandler.removeClass(sublist, 'p-submenu-list-active');
        }
    }
    removeActiveFromSublist(menuitem) {
        if (menuitem) {
            let sublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (sublist && DomHandler.hasClass(menuitem, 'p-submenu-list-active')) {
                DomHandler.removeClass(menuitem, 'p-submenu-list-active');
            }
        }
    }
    bindGlobalListeners() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                if (this.containerViewChild.nativeElement.offsetParent && this.isOutsideClicked(event) && !event.ctrlKey && event.button !== 2 && this.triggerEvent !== 'click') {
                    this.hide();
                }
            });
            this.documentTriggerListener = this.renderer.listen(documentTarget, this.triggerEvent, (event) => {
                if (this.containerViewChild.nativeElement.offsetParent && this.isOutsideClicked(event) && !this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
        this.zone.runOutsideAngular(() => {
            if (!this.windowResizeListener) {
                this.renderer.listen(this.window, 'resize', this.onWindowResize.bind(this));
            }
        });
        if (!this.documentKeydownListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentKeydownListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
                let activeItem = this.getActiveItem();
                switch (event.key) {
                    case 'ArrowDown':
                        if (activeItem) {
                            this.removeActiveFromSublist(activeItem);
                            activeItem = this.findNextItem(activeItem);
                        }
                        else {
                            let firstItem = DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-menuitem-link').parentElement;
                            activeItem = this.isItemMatched(firstItem) ? firstItem : this.findNextItem(firstItem);
                        }
                        if (activeItem) {
                            this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowUp':
                        if (activeItem) {
                            this.removeActiveFromSublist(activeItem);
                            activeItem = this.findPrevItem(activeItem);
                        }
                        else {
                            let sublist = DomHandler.findSingle(this.containerViewChild.nativeElement, 'ul');
                            let lastItem = sublist.children[sublist.children.length - 1];
                            activeItem = this.isItemMatched(lastItem) ? lastItem : this.findPrevItem(lastItem);
                        }
                        if (activeItem) {
                            this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowRight':
                        if (activeItem) {
                            let sublist = DomHandler.findSingle(activeItem, '.p-submenu-list');
                            if (sublist) {
                                DomHandler.addClass(sublist, 'p-submenu-list-active');
                                activeItem = DomHandler.findSingle(sublist, '.p-menuitem-link:not(.p-disabled)').parentElement;
                                if (activeItem) {
                                    this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowLeft':
                        if (activeItem) {
                            let sublist = activeItem.parentElement;
                            if (sublist && DomHandler.hasClass(sublist, 'p-submenu-list-active')) {
                                DomHandler.removeClass(sublist, 'p-submenu-list-active');
                                activeItem = sublist.parentElement.parentElement;
                                if (activeItem) {
                                    this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case 'Escape':
                        this.hide();
                        event.preventDefault();
                        break;
                    case 'Enter':
                        if (activeItem) {
                            this.handleItemClick(event, this.findModelItemFromKey(this.contextMenuService.activeItemKey), activeItem);
                        }
                        event.preventDefault();
                        break;
                    default:
                        break;
                }
            });
        }
    }
    findModelItemFromKey(key) {
        if (key == null || !this.model) {
            return null;
        }
        let indexes = key.split('_');
        return indexes.reduce((item, currentIndex) => {
            return item ? item.items[currentIndex] : this.model[currentIndex];
        }, null);
    }
    handleItemClick(event, item, menuitem) {
        if (!item || item.disabled) {
            return;
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (item.items) {
            let childSublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (childSublist) {
                if (DomHandler.hasClass(childSublist, 'p-submenu-list-active')) {
                    this.removeActiveFromSubLists(menuitem);
                }
                else {
                    DomHandler.addClass(childSublist, 'p-submenu-list-active');
                    this.positionSubmenu(childSublist);
                }
            }
        }
        if (!item.items) {
            this.hide();
        }
    }
    unbindGlobalListeners() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        if (this.documentTriggerListener) {
            this.documentTriggerListener();
            this.documentTriggerListener = null;
        }
        if (this.windowResizeListener) {
            this.windowResizeListener();
            this.windowResizeListener = null;
        }
        if (this.documentKeydownListener) {
            this.documentKeydownListener();
            this.documentKeydownListener = null;
        }
    }
    onWindowResize(event) {
        if (this.containerViewChild.nativeElement.offsetParent) {
            this.hide();
        }
    }
    isOutsideClicked(event) {
        return !(this.containerViewChild.nativeElement.isSameNode(event.target) || this.containerViewChild.nativeElement.contains(event.target));
    }
    ngOnDestroy() {
        this.unbindGlobalListeners();
        if (this.triggerEventListener) {
            this.triggerEventListener();
            this.triggerEventListener = null;
        }
        if (this.containerViewChild && this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        if (this.appendTo) {
            this.renderer.appendChild(this.el.nativeElement, this.containerViewChild.nativeElement);
        }
        this.ngDestroy$.next(true);
        this.ngDestroy$.complete();
    }
}
ContextMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenu, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i5.ContextMenuService }, { token: i5.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
ContextMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: ContextMenu, selector: "p-contextMenu", inputs: { model: "model", global: "global", target: "target", style: "style", styleClass: "styleClass", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", triggerEvent: "triggerEvent" }, outputs: { onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="'p-contextmenu p-component'" [class]="styleClass" [ngStyle]="style">
            <p-contextMenuSub [item]="model" [root]="true"></p-contextMenuSub>
        </div>
    `, isInline: true, styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon:not(svg){margin-left:auto}.p-contextmenu .p-menuitem-link .p-icon-wrapper{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list.p-submenu-list-active{display:block!important}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: ["item", "root", "parentItemKey"], outputs: ["leafClick"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-contextMenu', template: `
        <div #container [ngClass]="'p-contextmenu p-component'" [class]="styleClass" [ngStyle]="style">
            <p-contextMenuSub [item]="model" [root]="true"></p-contextMenuSub>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon:not(svg){margin-left:auto}.p-contextmenu .p-menuitem-link .p-icon-wrapper{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list.p-submenu-list-active{display:block!important}\n"] }]
        }], ctorParameters: function () {
        return [{ type: Document, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i5.ContextMenuService }, { type: i5.PrimeNGConfig }];
    }, propDecorators: { model: [{
                type: Input
            }], global: [{
                type: Input
            }], target: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], triggerEvent: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class ContextMenuModule {
}
ContextMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ContextMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: ContextMenuModule, declarations: [ContextMenu, ContextMenuSub], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, AngleRightIcon], exports: [ContextMenu, RouterModule, TooltipModule, SharedModule] });
ContextMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenuModule, providers: [ContextMenuService], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, AngleRightIcon, RouterModule, TooltipModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ContextMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, AngleRightIcon],
                    exports: [ContextMenu, RouterModule, TooltipModule, SharedModule],
                    declarations: [ContextMenu, ContextMenuSub],
                    providers: [ContextMenuService]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ContextMenu, ContextMenuModule, ContextMenuSub };
//# sourceMappingURL=primeng-contextmenu.mjs.map
