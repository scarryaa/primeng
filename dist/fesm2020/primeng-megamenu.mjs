import * as i0 from '@angular/core';
import { PLATFORM_ID, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, ContentChildren, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i2 from '@angular/router';
import { RouterModule } from '@angular/router';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import * as i4 from 'primeng/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { AngleDownIcon } from 'primeng/icons/angledown';
import { AngleRightIcon } from 'primeng/icons/angleright';

class MegaMenu {
    constructor(document, platformId, el, renderer, cd) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.orientation = 'horizontal';
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'submenuicon':
                    this.submenuIconTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
            }
        });
    }
    onCategoryMouseEnter(event, menuitem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return;
        }
        if (this.activeItem) {
            this.activeItem = menuitem;
        }
    }
    onCategoryClick(event, item) {
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
            if (this.activeItem && this.activeItem === item) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
    }
    itemClick(event, item) {
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
        this.activeItem = null;
    }
    getColumnClass(menuitem) {
        let length = menuitem.items ? menuitem.items.length : 0;
        let columnClass;
        switch (length) {
            case 2:
                columnClass = 'p-megamenu-col-6';
                break;
            case 3:
                columnClass = 'p-megamenu-col-4';
                break;
            case 4:
                columnClass = 'p-megamenu-col-3';
                break;
            case 6:
                columnClass = 'p-megamenu-col-2';
                break;
            default:
                columnClass = 'p-megamenu-col-12';
                break;
        }
        return columnClass;
    }
    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.el && !this.el.nativeElement.contains(event.target)) {
                        this.activeItem = null;
                        this.unbindDocumentClickListener();
                        this.cd.markForCheck();
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
}
MegaMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MegaMenu, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MegaMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: MegaMenu, selector: "p-megaMenu", inputs: { model: "model", style: "style", styleClass: "styleClass", orientation: "orientation" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{ 'p-megamenu p-component': true, 'p-megamenu-horizontal': orientation == 'horizontal', 'p-megamenu-vertical': orientation == 'vertical' }">
            <div class="p-megamenu-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <ul class="p-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': category.visible === false }"></li>
                    <li
                        *ngIf="!category.separator"
                        [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': category == activeItem, 'p-hidden': category.visible === false }"
                        pTooltip
                        [tooltipOptions]="category.tooltipOptions"
                        (mouseenter)="onCategoryMouseEnter($event, category)"
                    >
                        <a
                            *ngIf="!category.routerLink"
                            [href]="category.url || '#'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                            <ng-container *ngIf="!submenuIconTemplate">
                                <AngleDownIcon [styleClass]="'p-submenu-icon'" *ngIf="orientation === 'horizontal'" />
                                <AngleRightIcon [styleClass]="'p-submenu-icon'" *ngIf="orientation === 'vertical'" />
                            </ng-container>
                            <ng-template *ngTemplateOutlet="submenuIconTemplate"></ng-template>
                        </a>
                        <a
                            *ngIf="category.routerLink"
                            [routerLink]="category.routerLink"
                            [queryParams]="category.queryParams"
                            [routerLinkActive]="'p-menuitem-link-active'"
                            [routerLinkActiveOptions]="category.routerLinkActiveOptions || { exact: false }"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            [fragment]="category.fragment"
                            [queryParamsHandling]="category.queryParamsHandling"
                            [preserveFragment]="category.preserveFragment"
                            [skipLocationChange]="category.skipLocationChange"
                            [replaceUrl]="category.replaceUrl"
                            [state]="category.state"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlRouteLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlRouteLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                        </a>
                        <div class="p-megamenu-panel" *ngIf="category.items">
                            <div class="p-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="p-megamenu-submenu" role="menu">
                                                <li class="p-megamenu-submenu-header">
                                                    <span *ngIf="submenu.escape !== false; else submenuHtmlLabel">{{ submenu.label }}</span>
                                                    <ng-template #submenuHtmlLabel><span [innerHTML]="submenu.label"></span></ng-template>
                                                    <span class="p-menuitem-badge" *ngIf="submenu.badge" [ngClass]="submenu.badgeStyleClass">{{ submenu.badge }}</span>
                                                </li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': item.visible === false }" role="separator"></li>
                                                    <li *ngIf="!item.separator" class="p-menuitem" [ngClass]="{ 'p-hidden': item.visible === false }" role="none" pTooltip [tooltipOptions]="item.tooltipOptions">
                                                        <a
                                                            *ngIf="!item.routerLink"
                                                            role="menuitem"
                                                            [href]="item.url || '#'"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            [ngStyle]="item.style"
                                                            [class]="item.styleClass"
                                                            (click)="itemClick($event, item)"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{ item.label }}</span>
                                                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                        <a
                                                            *ngIf="item.routerLink"
                                                            role="menuitem"
                                                            [routerLink]="item.routerLink"
                                                            [queryParams]="item.queryParams"
                                                            [routerLinkActive]="'p-menuitem-link-active'"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            [ngStyle]="item.style"
                                                            [class]="item.styleClass"
                                                            (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment"
                                                            [queryParamsHandling]="item.queryParamsHandling"
                                                            [preserveFragment]="item.preserveFragment"
                                                            [skipLocationChange]="item.skipLocationChange"
                                                            [replaceUrl]="item.replaceUrl"
                                                            [state]="item.state"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{ item.label }}</span>
                                                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
            </ul>
            <div class="p-megamenu-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-megamenu-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-submenu-header{display:flex;align-items:center}.p-megamenu-horizontal .p-megamenu-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon:not(svg){margin-left:auto}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-icon-wrapper{margin-left:auto}.p-megamenu-grid{display:flex}.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6,.p-megamenu-col-12{flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}.p-megamenu-horizontal .p-megamenu-end{margin-left:auto;align-self:center}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLink; }), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.RouterLinkActive; }), selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(function () { return i4.Tooltip; }), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: i0.forwardRef(function () { return AngleDownIcon; }), selector: "AngleDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleRightIcon; }), selector: "AngleRightIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MegaMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-megaMenu', template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{ 'p-megamenu p-component': true, 'p-megamenu-horizontal': orientation == 'horizontal', 'p-megamenu-vertical': orientation == 'vertical' }">
            <div class="p-megamenu-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <ul class="p-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': category.visible === false }"></li>
                    <li
                        *ngIf="!category.separator"
                        [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': category == activeItem, 'p-hidden': category.visible === false }"
                        pTooltip
                        [tooltipOptions]="category.tooltipOptions"
                        (mouseenter)="onCategoryMouseEnter($event, category)"
                    >
                        <a
                            *ngIf="!category.routerLink"
                            [href]="category.url || '#'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                            <ng-container *ngIf="!submenuIconTemplate">
                                <AngleDownIcon [styleClass]="'p-submenu-icon'" *ngIf="orientation === 'horizontal'" />
                                <AngleRightIcon [styleClass]="'p-submenu-icon'" *ngIf="orientation === 'vertical'" />
                            </ng-container>
                            <ng-template *ngTemplateOutlet="submenuIconTemplate"></ng-template>
                        </a>
                        <a
                            *ngIf="category.routerLink"
                            [routerLink]="category.routerLink"
                            [queryParams]="category.queryParams"
                            [routerLinkActive]="'p-menuitem-link-active'"
                            [routerLinkActiveOptions]="category.routerLinkActiveOptions || { exact: false }"
                            [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [target]="category.target"
                            [attr.title]="category.title"
                            [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)"
                            [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': category.disabled }"
                            [ngStyle]="category.style"
                            [class]="category.styleClass"
                            [fragment]="category.fragment"
                            [queryParamsHandling]="category.queryParamsHandling"
                            [preserveFragment]="category.preserveFragment"
                            [skipLocationChange]="category.skipLocationChange"
                            [replaceUrl]="category.replaceUrl"
                            [state]="category.state"
                            pRipple
                        >
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlRouteLabel">{{ category.label }}</span>
                            <ng-template #categoryHtmlRouteLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="category.badge" [ngClass]="category.badgeStyleClass">{{ category.badge }}</span>
                        </a>
                        <div class="p-megamenu-panel" *ngIf="category.items">
                            <div class="p-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="p-megamenu-submenu" role="menu">
                                                <li class="p-megamenu-submenu-header">
                                                    <span *ngIf="submenu.escape !== false; else submenuHtmlLabel">{{ submenu.label }}</span>
                                                    <ng-template #submenuHtmlLabel><span [innerHTML]="submenu.label"></span></ng-template>
                                                    <span class="p-menuitem-badge" *ngIf="submenu.badge" [ngClass]="submenu.badgeStyleClass">{{ submenu.badge }}</span>
                                                </li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': item.visible === false }" role="separator"></li>
                                                    <li *ngIf="!item.separator" class="p-menuitem" [ngClass]="{ 'p-hidden': item.visible === false }" role="none" pTooltip [tooltipOptions]="item.tooltipOptions">
                                                        <a
                                                            *ngIf="!item.routerLink"
                                                            role="menuitem"
                                                            [href]="item.url || '#'"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            [ngStyle]="item.style"
                                                            [class]="item.styleClass"
                                                            (click)="itemClick($event, item)"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{ item.label }}</span>
                                                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                        <a
                                                            *ngIf="item.routerLink"
                                                            role="menuitem"
                                                            [routerLink]="item.routerLink"
                                                            [queryParams]="item.queryParams"
                                                            [routerLinkActive]="'p-menuitem-link-active'"
                                                            [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                                            class="p-menuitem-link"
                                                            [target]="item.target"
                                                            [attr.title]="item.title"
                                                            [attr.id]="item.id"
                                                            [ngClass]="{ 'p-disabled': item.disabled }"
                                                            [ngStyle]="item.style"
                                                            [class]="item.styleClass"
                                                            (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment"
                                                            [queryParamsHandling]="item.queryParamsHandling"
                                                            [preserveFragment]="item.preserveFragment"
                                                            [skipLocationChange]="item.skipLocationChange"
                                                            [replaceUrl]="item.replaceUrl"
                                                            [state]="item.state"
                                                            pRipple
                                                        >
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{ item.label }}</span>
                                                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
            </ul>
            <div class="p-megamenu-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-megamenu-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-submenu-header{display:flex;align-items:center}.p-megamenu-horizontal .p-megamenu-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon:not(svg){margin-left:auto}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-icon-wrapper{margin-left:auto}.p-megamenu-grid{display:flex}.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6,.p-megamenu-col-12{flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}.p-megamenu-horizontal .p-megamenu-end{margin-left:auto;align-self:center}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { model: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], orientation: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class MegaMenuModule {
}
MegaMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MegaMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MegaMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: MegaMenuModule, declarations: [MegaMenu], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, AngleDownIcon, AngleRightIcon], exports: [MegaMenu, RouterModule, TooltipModule, SharedModule] });
MegaMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MegaMenuModule, imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, AngleDownIcon, AngleRightIcon, RouterModule, TooltipModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MegaMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, AngleDownIcon, AngleRightIcon],
                    exports: [MegaMenu, RouterModule, TooltipModule, SharedModule],
                    declarations: [MegaMenu]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MegaMenu, MegaMenuModule };
//# sourceMappingURL=primeng-megamenu.mjs.map
