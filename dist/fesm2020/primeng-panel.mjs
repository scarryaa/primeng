import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChild, ContentChildren, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { Footer, PrimeTemplate, SharedModule } from 'primeng/api';
import * as i2 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MinusIcon } from 'primeng/icons/minus';
import { PlusIcon } from 'primeng/icons/plus';

let idx = 0;
class Panel {
    constructor(el) {
        this.el = el;
        this.collapsed = false;
        this.iconPos = 'end';
        this.showHeader = true;
        this.toggler = 'icon';
        this.collapsedChange = new EventEmitter();
        this.onBeforeToggle = new EventEmitter();
        this.onAfterToggle = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = `p-panel-${idx++}`;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                case 'icons':
                    this.iconTemplate = item.template;
                    break;
                case 'headericons':
                    this.headerIconTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    onHeaderClick(event) {
        if (this.toggler === 'header') {
            this.toggle(event);
        }
    }
    onIconClick(event) {
        if (this.toggler === 'icon') {
            this.toggle(event);
        }
    }
    toggle(event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.toggleable) {
            if (this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
        event.preventDefault();
    }
    expand(event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    }
    collapse(event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    onToggleDone(event) {
        this.animating = false;
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
    }
}
Panel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Panel, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
Panel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Panel, selector: "p-panel", inputs: { toggleable: "toggleable", header: "header", collapsed: "collapsed", style: "style", styleClass: "styleClass", iconPos: "iconPos", expandIcon: "expandIcon", collapseIcon: "collapseIcon", showHeader: "showHeader", toggler: "toggler", transitionOptions: "transitionOptions" }, outputs: { collapsedChange: "collapsedChange", onBeforeToggle: "onBeforeToggle", onAfterToggle: "onAfterToggle" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "footerFacet", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="{ 'p-panel p-component': true, 'p-panel-toggleable': toggleable, 'p-panel-expanded': !collapsed && toggleable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-panel-header" *ngIf="showHeader" (click)="onHeaderClick($event)" [attr.id]="id + '-titlebar'">
                <span class="p-panel-title" *ngIf="header" [attr.id]="id + '_header'">{{ header }}</span>
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <div role="tablist" class="p-panel-icons" [ngClass]="{ 'p-panel-icons-start': iconPos === 'start', 'p-panel-icons-end': iconPos === 'end', 'p-panel-icons-center': iconPos === 'center' }">
                    <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
                    <button
                        *ngIf="toggleable"
                        type="button"
                        [attr.aria-label]="'collapse button'"
                        [attr.id]="id + '-label'"
                        class="p-panel-header-icon p-panel-toggler p-link"
                        pRipple
                        (click)="onIconClick($event)"
                        (keydown.enter)="onIconClick($event)"
                        [attr.aria-controls]="id + '-content'"
                        role="tab"
                        [attr.aria-expanded]="!collapsed"
                    >
                        <ng-container *ngIf="!headerIconTemplate">
                            <ng-container *ngIf="collapsed">
                                <span *ngIf="expandIcon" [class]="expandIcon" [ngClass]="iconClass"></span>
                                <PlusIcon *ngIf="!expandIcon" [styleClass]="iconClass" />
                            </ng-container>

                            <ng-container *ngIf="!collapsed">
                                <span *ngIf="collapseIcon" [class]="collapseIcon" [ngClass]="iconClass"></span>
                                <MinusIcon *ngIf="!collapseIcon" [styleClass]="iconClass" />
                            </ng-container>
                        </ng-container>

                        <ng-template *ngTemplateOutlet="headerIconTemplate; context: { $implicit: collapsed }"></ng-template>
                    </button>
                </div>
            </div>
            <div
                [attr.id]="id + '-content'"
                class="p-toggleable-content"
                [@panelContent]="
                    collapsed
                        ? { value: 'hidden', params: { transitionParams: animating ? transitionOptions : '0ms', height: '0', opacity: '0' } }
                        : { value: 'visible', params: { transitionParams: animating ? transitionOptions : '0ms', height: '*', opacity: '1' } }
                "
                (@panelContent.done)="onToggleDone($event)"
                role="region"
                [attr.aria-hidden]="collapsed"
                [attr.aria-labelledby]="id + '-titlebar'"
            >
                <div class="p-panel-content">
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </div>

                <div class="p-panel-footer" *ngIf="footerFacet || footerTemplate">
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
                </div>
            </div>
        </div>
    `, isInline: true, styles: [".p-panel-header{display:flex;align-items:center}.p-panel-title{line-height:1;order:1}.p-panel-header-icon{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}.p-panel-toggleable.p-panel-expanded .p-toggleable-content:not(.ng-animating){overflow:visible}.p-panel-toggleable .p-toggleable-content{overflow:hidden}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return PlusIcon; }), selector: "PlusIcon" }, { kind: "component", type: i0.forwardRef(function () { return MinusIcon; }), selector: "MinusIcon" }], animations: [
        trigger('panelContent', [
            state('hidden', style({
                height: '0'
            })),
            state('void', style({
                height: '{{height}}'
            }), { params: { height: '0' } }),
            state('visible', style({
                height: '*'
            })),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => hidden', animate('{{transitionParams}}')),
            transition('void => visible', animate('{{transitionParams}}'))
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Panel, decorators: [{
            type: Component,
            args: [{ selector: 'p-panel', template: `
        <div [attr.id]="id" [ngClass]="{ 'p-panel p-component': true, 'p-panel-toggleable': toggleable, 'p-panel-expanded': !collapsed && toggleable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-panel-header" *ngIf="showHeader" (click)="onHeaderClick($event)" [attr.id]="id + '-titlebar'">
                <span class="p-panel-title" *ngIf="header" [attr.id]="id + '_header'">{{ header }}</span>
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <div role="tablist" class="p-panel-icons" [ngClass]="{ 'p-panel-icons-start': iconPos === 'start', 'p-panel-icons-end': iconPos === 'end', 'p-panel-icons-center': iconPos === 'center' }">
                    <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
                    <button
                        *ngIf="toggleable"
                        type="button"
                        [attr.aria-label]="'collapse button'"
                        [attr.id]="id + '-label'"
                        class="p-panel-header-icon p-panel-toggler p-link"
                        pRipple
                        (click)="onIconClick($event)"
                        (keydown.enter)="onIconClick($event)"
                        [attr.aria-controls]="id + '-content'"
                        role="tab"
                        [attr.aria-expanded]="!collapsed"
                    >
                        <ng-container *ngIf="!headerIconTemplate">
                            <ng-container *ngIf="collapsed">
                                <span *ngIf="expandIcon" [class]="expandIcon" [ngClass]="iconClass"></span>
                                <PlusIcon *ngIf="!expandIcon" [styleClass]="iconClass" />
                            </ng-container>

                            <ng-container *ngIf="!collapsed">
                                <span *ngIf="collapseIcon" [class]="collapseIcon" [ngClass]="iconClass"></span>
                                <MinusIcon *ngIf="!collapseIcon" [styleClass]="iconClass" />
                            </ng-container>
                        </ng-container>

                        <ng-template *ngTemplateOutlet="headerIconTemplate; context: { $implicit: collapsed }"></ng-template>
                    </button>
                </div>
            </div>
            <div
                [attr.id]="id + '-content'"
                class="p-toggleable-content"
                [@panelContent]="
                    collapsed
                        ? { value: 'hidden', params: { transitionParams: animating ? transitionOptions : '0ms', height: '0', opacity: '0' } }
                        : { value: 'visible', params: { transitionParams: animating ? transitionOptions : '0ms', height: '*', opacity: '1' } }
                "
                (@panelContent.done)="onToggleDone($event)"
                role="region"
                [attr.aria-hidden]="collapsed"
                [attr.aria-labelledby]="id + '-titlebar'"
            >
                <div class="p-panel-content">
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </div>

                <div class="p-panel-footer" *ngIf="footerFacet || footerTemplate">
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
                </div>
            </div>
        </div>
    `, animations: [
                        trigger('panelContent', [
                            state('hidden', style({
                                height: '0'
                            })),
                            state('void', style({
                                height: '{{height}}'
                            }), { params: { height: '0' } }),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
                            transition('void => hidden', animate('{{transitionParams}}')),
                            transition('void => visible', animate('{{transitionParams}}'))
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-panel-header{display:flex;align-items:center}.p-panel-title{line-height:1;order:1}.p-panel-header-icon{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}.p-panel-toggleable.p-panel-expanded .p-toggleable-content:not(.ng-animating){overflow:visible}.p-panel-toggleable .p-toggleable-content{overflow:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { toggleable: [{
                type: Input
            }], header: [{
                type: Input
            }], collapsed: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], expandIcon: [{
                type: Input
            }], collapseIcon: [{
                type: Input
            }], showHeader: [{
                type: Input
            }], toggler: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], onBeforeToggle: [{
                type: Output
            }], onAfterToggle: [{
                type: Output
            }], transitionOptions: [{
                type: Input
            }], footerFacet: [{
                type: ContentChild,
                args: [Footer]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class PanelModule {
}
PanelModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PanelModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: PanelModule, declarations: [Panel], imports: [CommonModule, SharedModule, RippleModule, PlusIcon, MinusIcon], exports: [Panel, SharedModule] });
PanelModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PanelModule, imports: [CommonModule, SharedModule, RippleModule, PlusIcon, MinusIcon, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PanelModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule, PlusIcon, MinusIcon],
                    exports: [Panel, SharedModule],
                    declarations: [Panel]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Panel, PanelModule };
//# sourceMappingURL=primeng-panel.mjs.map
