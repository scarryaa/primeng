import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, Input, Output, ViewChild, ContentChildren, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i3 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i4 from 'primeng/overlay';
import { OverlayModule } from 'primeng/overlay';
import * as i2 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { ObjectUtils } from 'primeng/utils';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import { AngleRightIcon } from 'primeng/icons/angleright';
import { TimesIcon } from 'primeng/icons/times';

const CASCADESELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CascadeSelect),
    multi: true
};
class CascadeSelectSub {
    constructor(cascadeSelect, el) {
        this.el = el;
        this.level = 0;
        this.onSelect = new EventEmitter();
        this.onGroupSelect = new EventEmitter();
        this.activeOption = null;
        this.cascadeSelect = cascadeSelect;
    }
    get parentActive() {
        return this._parentActive;
    }
    set parentActive(val) {
        if (!val) {
            this.activeOption = null;
        }
        this._parentActive = val;
    }
    ngOnInit() {
        if (this.selectionPath && this.options && !this.dirty) {
            for (let option of this.options) {
                if (this.selectionPath.includes(option)) {
                    this.activeOption = option;
                    break;
                }
            }
        }
        if (!this.root) {
            this.position();
        }
    }
    onOptionClick(event, option) {
        if (this.isOptionGroup(option)) {
            this.activeOption = this.activeOption === option ? null : option;
            this.onGroupSelect.emit({
                originalEvent: event,
                value: option
            });
        }
        else {
            this.onSelect.emit({
                originalEvent: event,
                value: this.getOptionValue(option)
            });
        }
    }
    onOptionSelect(event) {
        this.onSelect.emit(event);
    }
    onOptionGroupSelect(event) {
        this.onGroupSelect.emit(event);
    }
    getOptionLabel(option) {
        return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
    }
    getOptionValue(option) {
        return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
    }
    getOptionGroupLabel(optionGroup) {
        return this.optionGroupLabel ? ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel) : null;
    }
    getOptionGroupChildren(optionGroup) {
        return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren[this.level]);
    }
    isOptionGroup(option) {
        return Object.prototype.hasOwnProperty.call(option, this.optionGroupChildren[this.level]);
    }
    getOptionLabelToRender(option) {
        return this.isOptionGroup(option) ? this.getOptionGroupLabel(option) : this.getOptionLabel(option);
    }
    getItemClass(option) {
        return {
            'p-cascadeselect-item': true,
            'p-cascadeselect-item-group': this.isOptionGroup(option),
            'p-cascadeselect-item-active p-highlight': this.isOptionActive(option)
        };
    }
    isOptionActive(option) {
        return this.activeOption === option;
    }
    onKeyDown(event, option, index) {
        let listItem = event.currentTarget.parentElement;
        switch (event.key) {
            case 'Down':
            case 'ArrowDown':
                var nextItem = this.el.nativeElement.children[0].children[index + 1];
                if (nextItem) {
                    nextItem.children[0].focus();
                }
                event.preventDefault();
                break;
            case 'Up':
            case 'ArrowUp':
                var prevItem = this.el.nativeElement.children[0].children[index - 1];
                if (prevItem) {
                    prevItem.children[0].focus();
                }
                event.preventDefault();
                break;
            case 'Right':
            case 'ArrowRight':
                if (this.isOptionGroup(option)) {
                    if (this.isOptionActive(option)) {
                        listItem.children[1].children[0].children[0].children[0].focus();
                    }
                    else {
                        this.activeOption = option;
                    }
                }
                event.preventDefault();
                break;
            case 'Left':
            case 'ArrowLeft':
                this.activeOption = null;
                var parentList = listItem.parentElement.parentElement.parentElement;
                if (parentList) {
                    parentList.children[0].focus();
                }
                event.preventDefault();
                break;
            case 'Enter':
                this.onOptionClick(event, option);
                event.preventDefault();
                break;
            case 'Tab':
            case 'Escape':
                this.cascadeSelect.hide();
                event.preventDefault();
                break;
        }
    }
    position() {
        const parentItem = this.el.nativeElement.parentElement;
        const containerOffset = DomHandler.getOffset(parentItem);
        const viewport = DomHandler.getViewport();
        const sublistWidth = this.el.nativeElement.children[0].offsetParent ? this.el.nativeElement.children[0].offsetWidth : DomHandler.getHiddenElementOuterWidth(this.el.nativeElement.children[0]);
        const itemOuterWidth = DomHandler.getOuterWidth(parentItem.children[0]);
        if (parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width - DomHandler.calculateScrollbarWidth()) {
            this.el.nativeElement.children[0].style.left = '-200%';
        }
    }
}
CascadeSelectSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelectSub, deps: [{ token: forwardRef(() => CascadeSelect) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
CascadeSelectSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: CascadeSelectSub, selector: "p-cascadeSelectSub", inputs: { selectionPath: "selectionPath", options: "options", optionGroupChildren: "optionGroupChildren", optionTemplate: "optionTemplate", groupIconTemplate: "groupIconTemplate", level: "level", optionLabel: "optionLabel", optionValue: "optionValue", optionGroupLabel: "optionGroupLabel", dirty: "dirty", root: "root", parentActive: "parentActive" }, outputs: { onSelect: "onSelect", onGroupSelect: "onGroupSelect" }, ngImport: i0, template: `
        <ul class="p-cascadeselect-panel p-cascadeselect-items" [ngClass]="{ 'p-cascadeselect-panel-root': root }" role="listbox" aria-orientation="horizontal">
            <ng-template ngFor let-option [ngForOf]="options" let-i="index">
                <li [ngClass]="getItemClass(option)" role="none">
                    <div class="p-cascadeselect-item-content" (click)="onOptionClick($event, option)" tabindex="0" (keydown)="onKeyDown($event, option, i)" pRipple>
                        <ng-container *ngIf="optionTemplate; else defaultOptionTemplate">
                            <ng-container *ngTemplateOutlet="optionTemplate; context: { $implicit: option }"></ng-container>
                        </ng-container>
                        <ng-template #defaultOptionTemplate>
                            <span class="p-cascadeselect-item-text">{{ getOptionLabelToRender(option) }}</span>
                        </ng-template>
                        <span class="p-cascadeselect-group-icon" *ngIf="isOptionGroup(option)">
                            <AngleRightIcon *ngIf="!groupIconTemplate" />
                            <ng-template *ngTemplateOutlet="groupIconTemplate"></ng-template>
                        </span>
                    </div>
                    <p-cascadeSelectSub
                        *ngIf="isOptionGroup(option) && isOptionActive(option)"
                        class="p-cascadeselect-sublist"
                        [selectionPath]="selectionPath"
                        [options]="getOptionGroupChildren(option)"
                        [optionLabel]="optionLabel"
                        [optionValue]="optionValue"
                        [level]="level + 1"
                        (onSelect)="onOptionSelect($event)"
                        (onOptionGroupSelect)="onOptionGroupSelect()"
                        [optionGroupLabel]="optionGroupLabel"
                        [optionGroupChildren]="optionGroupChildren"
                        [parentActive]="isOptionActive(option)"
                        [dirty]="dirty"
                        [optionTemplate]="optionTemplate"
                    >
                    </p-cascadeSelectSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return AngleRightIcon; }), selector: "AngleRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return CascadeSelectSub; }), selector: "p-cascadeSelectSub", inputs: ["selectionPath", "options", "optionGroupChildren", "optionTemplate", "groupIconTemplate", "level", "optionLabel", "optionValue", "optionGroupLabel", "dirty", "root", "parentActive"], outputs: ["onSelect", "onGroupSelect"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelectSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-cascadeSelectSub',
                    template: `
        <ul class="p-cascadeselect-panel p-cascadeselect-items" [ngClass]="{ 'p-cascadeselect-panel-root': root }" role="listbox" aria-orientation="horizontal">
            <ng-template ngFor let-option [ngForOf]="options" let-i="index">
                <li [ngClass]="getItemClass(option)" role="none">
                    <div class="p-cascadeselect-item-content" (click)="onOptionClick($event, option)" tabindex="0" (keydown)="onKeyDown($event, option, i)" pRipple>
                        <ng-container *ngIf="optionTemplate; else defaultOptionTemplate">
                            <ng-container *ngTemplateOutlet="optionTemplate; context: { $implicit: option }"></ng-container>
                        </ng-container>
                        <ng-template #defaultOptionTemplate>
                            <span class="p-cascadeselect-item-text">{{ getOptionLabelToRender(option) }}</span>
                        </ng-template>
                        <span class="p-cascadeselect-group-icon" *ngIf="isOptionGroup(option)">
                            <AngleRightIcon *ngIf="!groupIconTemplate" />
                            <ng-template *ngTemplateOutlet="groupIconTemplate"></ng-template>
                        </span>
                    </div>
                    <p-cascadeSelectSub
                        *ngIf="isOptionGroup(option) && isOptionActive(option)"
                        class="p-cascadeselect-sublist"
                        [selectionPath]="selectionPath"
                        [options]="getOptionGroupChildren(option)"
                        [optionLabel]="optionLabel"
                        [optionValue]="optionValue"
                        [level]="level + 1"
                        (onSelect)="onOptionSelect($event)"
                        (onOptionGroupSelect)="onOptionGroupSelect()"
                        [optionGroupLabel]="optionGroupLabel"
                        [optionGroupChildren]="optionGroupChildren"
                        [parentActive]="isOptionActive(option)"
                        [dirty]="dirty"
                        [optionTemplate]="optionTemplate"
                    >
                    </p-cascadeSelectSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => CascadeSelect)]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { selectionPath: [{
                type: Input
            }], options: [{
                type: Input
            }], optionGroupChildren: [{
                type: Input
            }], optionTemplate: [{
                type: Input
            }], groupIconTemplate: [{
                type: Input
            }], level: [{
                type: Input
            }], optionLabel: [{
                type: Input
            }], optionValue: [{
                type: Input
            }], optionGroupLabel: [{
                type: Input
            }], dirty: [{
                type: Input
            }], root: [{
                type: Input
            }], onSelect: [{
                type: Output
            }], onGroupSelect: [{
                type: Output
            }], parentActive: [{
                type: Input
            }] } });
class CascadeSelect {
    constructor(el, cd, config, overlayService) {
        this.el = el;
        this.cd = cd;
        this.config = config;
        this.overlayService = overlayService;
        this.showClear = false;
        this.onChange = new EventEmitter();
        this.onGroupChange = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.selectionPath = null;
        this.focused = false;
        this.filled = false;
        this.overlayVisible = false;
        this.dirty = false;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    get showTransitionOptions() {
        return this._showTransitionOptions;
    }
    set showTransitionOptions(val) {
        this._showTransitionOptions = val;
        console.warn('The showTransitionOptions property is deprecated since v14.2.0, use overlayOptions property instead.');
    }
    get hideTransitionOptions() {
        return this._hideTransitionOptions;
    }
    set hideTransitionOptions(val) {
        this._hideTransitionOptions = val;
        console.warn('The hideTransitionOptions property is deprecated since v14.2.0, use overlayOptions property instead.');
    }
    ngOnInit() {
        this.updateSelectionPath();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'value':
                    this.valueTemplate = item.template;
                    break;
                case 'option':
                    this.optionTemplate = item.template;
                    break;
                case 'triggericon':
                    this.triggerIconTemplate = item.template;
                    break;
                case 'clearicon':
                    this.clearIconTemplate = item.template;
                    break;
                case 'optiongroupicon':
                    this.groupIconTemplate = item.template;
                    break;
            }
        });
    }
    onOptionSelect(event) {
        this.value = event.value;
        this.updateSelectionPath();
        this.onModelChange(this.value);
        this.onChange.emit(event);
        this.hide();
        this.focusInputEl.nativeElement.focus();
    }
    onOptionGroupSelect(event) {
        this.dirty = true;
        this.onGroupChange.emit(event);
    }
    getOptionLabel(option) {
        return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
    }
    getOptionValue(option) {
        return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
    }
    getOptionGroupChildren(optionGroup, level) {
        return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren[level]);
    }
    isOptionGroup(option, level) {
        return Object.prototype.hasOwnProperty.call(option, this.optionGroupChildren[level]);
    }
    updateSelectionPath() {
        let path;
        if (this.value != null && this.options) {
            for (let option of this.options) {
                path = this.findModelOptionInGroup(option, 0);
                if (path) {
                    break;
                }
            }
        }
        this.selectionPath = path;
        this.updateFilledState();
    }
    updateFilledState() {
        this.filled = !(this.selectionPath == null || this.selectionPath.length == 0);
    }
    findModelOptionInGroup(option, level) {
        if (this.isOptionGroup(option, level)) {
            let selectedOption;
            for (let childOption of this.getOptionGroupChildren(option, level)) {
                selectedOption = this.findModelOptionInGroup(childOption, level + 1);
                if (selectedOption) {
                    selectedOption.unshift(option);
                    return selectedOption;
                }
            }
        }
        else if (ObjectUtils.equals(this.value, this.getOptionValue(option), this.dataKey)) {
            return [option];
        }
        return null;
    }
    show() {
        this.overlayVisible = true;
    }
    hide() {
        this.overlayVisible = false;
        this.cd.markForCheck();
    }
    clear(event) {
        this.value = null;
        this.selectionPath = null;
        this.updateFilledState();
        this.onClear.emit();
        this.onModelChange(this.value);
        event.stopPropagation();
        this.cd.markForCheck();
    }
    onClick(event) {
        if (this.disabled) {
            return;
        }
        if (!this.overlayViewChild?.el?.nativeElement?.contains(event.target)) {
            if (this.overlayVisible) {
                this.hide();
            }
            else {
                this.show();
            }
            this.focusInputEl.nativeElement.focus();
        }
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    onOverlayAnimationDone(event) {
        switch (event.toState) {
            case 'void':
                this.dirty = false;
                break;
        }
    }
    writeValue(value) {
        this.value = value;
        this.updateSelectionPath();
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
    label() {
        if (this.selectionPath) {
            return this.getOptionLabel(this.selectionPath[this.selectionPath.length - 1]);
        }
        return this.placeholder || 'p-emptylabel';
    }
    onKeyDown(event) {
        switch (event.code) {
            case 'Down':
            case 'ArrowDown':
                if (this.overlayVisible) {
                    DomHandler.findSingle(this.panelEl.nativeElement, '.p-cascadeselect-item').children[0].focus();
                }
                else if (event.altKey && this.options && this.options.length) {
                    this.show();
                }
                event.preventDefault();
                break;
            case 'Space':
            case 'Enter':
                if (!this.overlayVisible)
                    this.show();
                else
                    this.hide();
                event.preventDefault();
                break;
            case 'Tab':
            case 'Escape':
                if (this.overlayVisible) {
                    this.hide();
                    event.preventDefault();
                }
                break;
        }
    }
    containerClass() {
        return {
            'p-cascadeselect p-component p-inputwrapper': true,
            'p-disabled': this.disabled,
            'p-focus': this.focused
        };
    }
    labelClass() {
        return {
            'p-cascadeselect-label': true,
            'p-inputtext': true,
            'p-placeholder': this.label() === this.placeholder,
            'p-cascadeselect-label-empty': !this.value && (this.label() === 'p-emptylabel' || this.label().length === 0)
        };
    }
}
CascadeSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelect, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i3.PrimeNGConfig }, { token: i3.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
CascadeSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: CascadeSelect, selector: "p-cascadeSelect", inputs: { styleClass: "styleClass", style: "style", options: "options", optionLabel: "optionLabel", optionValue: "optionValue", optionGroupLabel: "optionGroupLabel", optionGroupChildren: "optionGroupChildren", placeholder: "placeholder", value: "value", dataKey: "dataKey", inputId: "inputId", tabindex: "tabindex", ariaLabelledBy: "ariaLabelledBy", inputLabel: "inputLabel", ariaLabel: "ariaLabel", appendTo: "appendTo", disabled: "disabled", rounded: "rounded", showClear: "showClear", panelStyleClass: "panelStyleClass", panelStyle: "panelStyle", overlayOptions: "overlayOptions", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onChange: "onChange", onGroupChange: "onGroupChange", onShow: "onShow", onHide: "onHide", onClear: "onClear", onBeforeShow: "onBeforeShow", onBeforeHide: "onBeforeHide" }, host: { properties: { "class.p-inputwrapper-filled": "filled", "class.p-inputwrapper-focus": "focused || overlayVisible", "class.p-cascadeselect-clearable": "showClear && !disabled" }, classAttribute: "p-element p-inputwrapper" }, providers: [CASCADESELECT_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "focusInputEl", first: true, predicate: ["focusInput"], descendants: true }, { propertyName: "containerEl", first: true, predicate: ["container"], descendants: true }, { propertyName: "panelEl", first: true, predicate: ["panel"], descendants: true }, { propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input
                    #focusInput
                    type="text"
                    [attr.id]="inputId"
                    readonly
                    [disabled]="disabled"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    (keydown)="onKeyDown($event)"
                    [attr.tabindex]="tabindex"
                    aria-haspopup="listbox"
                    [attr.aria-expanded]="overlayVisible"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [attr.label]="inputLabel"
                    [attr.aria-label]="ariaLabel"
                />
            </div>
            <span [ngClass]="labelClass()">
                <ng-container *ngIf="valueTemplate; else defaultValueTemplate">
                    <ng-container *ngTemplateOutlet="valueTemplate; context: { $implicit: value, placeholder: placeholder }"></ng-container>
                </ng-container>
                <ng-template #defaultValueTemplate>
                    {{ label() }}
                </ng-template>
            </span>

            <ng-container *ngIf="filled && !disabled && showClear">
                <TimesIcon *ngIf="!clearIconTemplate" [styleClass]="'p-cascadeselect-clear-icon'" (click)="clear($event)" />
                <span *ngIf="clearIconTemplate" class="p-cascadeselect-clear-icon" (click)="clear($event)">
                    <ng-template *ngTemplateOutlet="clearIconTemplate"></ng-template>
                </span>
            </ng-container>

            <div class="p-cascadeselect-trigger" role="button" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible">
                <ChevronDownIcon *ngIf="!triggerIconTemplate" [styleClass]="'p-cascadeselect-trigger-icon'" />
                <span *ngIf="triggerIconTemplate" class="p-cascadeselect-trigger-icon">
                    <ng-template *ngTemplateOutlet="triggerIconTemplate"></ng-template>
                </span>
            </div>
            <p-overlay
                #overlay
                [(visible)]="overlayVisible"
                [options]="overlayOptions"
                [target]="'@parent'"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onAnimationDone)="onOverlayAnimationDone($event)"
                (onBeforeShow)="onBeforeShow.emit($event)"
                (onShow)="onShow.emit($event)"
                (onBeforeHide)="onBeforeHide.emit($event)"
                (onHide)="onHide.emit($event)"
            >
                <ng-template pTemplate="content">
                    <div #panel class="p-cascadeselect-panel p-component" [class]="panelStyleClass" [ngStyle]="panelStyle">
                        <div class="p-cascadeselect-items-wrapper">
                            <p-cascadeSelectSub
                                [options]="options"
                                [selectionPath]="selectionPath"
                                class="p-cascadeselect-items"
                                [optionLabel]="optionLabel"
                                [optionValue]="optionValue"
                                [level]="0"
                                [optionTemplate]="optionTemplate"
                                [groupIconTemplate]="groupIconTemplate"
                                [optionGroupLabel]="optionGroupLabel"
                                [optionGroupChildren]="optionGroupChildren"
                                (onSelect)="onOptionSelect($event)"
                                (onGroupSelect)="onOptionGroupSelect($event)"
                                [dirty]="dirty"
                                [root]="true"
                            >
                            </p-cascadeSelectSub>
                        </div>
                    </div>
                </ng-template>
            </p-overlay>
        </div>
    `, isInline: true, styles: [".p-cascadeselect{display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.p-cascadeselect-trigger{display:flex;align-items:center;justify-content:center;flex-shrink:0}.p-cascadeselect-label{display:block;white-space:nowrap;overflow:hidden;flex:1 1 auto;width:1%;text-overflow:ellipsis;cursor:pointer}.p-cascadeselect-label-empty{overflow:hidden;visibility:hidden}.p-cascadeselect-item{cursor:pointer;font-weight:400;white-space:nowrap}.p-cascadeselect-item-content{display:flex;align-items:center;overflow:hidden;position:relative}.p-cascadeselect-group-icon{margin-left:auto}.p-cascadeselect-items{margin:0;padding:0;list-style-type:none}.p-fluid .p-cascadeselect{display:flex}.p-fluid .p-cascadeselect .p-cascadeselect-label{width:1%}.p-cascadeselect-sublist{position:absolute;min-width:100%;z-index:1;display:none}.p-cascadeselect-item-active{overflow:visible!important}.p-cascadeselect-item-active>.p-cascadeselect-sublist{display:block;left:100%;top:0}.p-cascadeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-cascadeselect-clearable,.p-overlay-modal .p-cascadeselect-sublist{position:relative}.p-overlay-modal .p-cascadeselect-item-active>.p-cascadeselect-sublist{left:0}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return i4.Overlay; }), selector: "p-overlay", inputs: ["visible", "mode", "style", "styleClass", "contentStyle", "contentStyleClass", "target", "appendTo", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "listener", "responsive", "options"], outputs: ["visibleChange", "onBeforeShow", "onShow", "onBeforeHide", "onHide", "onAnimationStart", "onAnimationDone"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.PrimeTemplate; }), selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i0.forwardRef(function () { return ChevronDownIcon; }), selector: "ChevronDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }, { kind: "component", type: i0.forwardRef(function () { return CascadeSelectSub; }), selector: "p-cascadeSelectSub", inputs: ["selectionPath", "options", "optionGroupChildren", "optionTemplate", "groupIconTemplate", "level", "optionLabel", "optionValue", "optionGroupLabel", "dirty", "root", "parentActive"], outputs: ["onSelect", "onGroupSelect"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelect, decorators: [{
            type: Component,
            args: [{ selector: 'p-cascadeSelect', template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input
                    #focusInput
                    type="text"
                    [attr.id]="inputId"
                    readonly
                    [disabled]="disabled"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    (keydown)="onKeyDown($event)"
                    [attr.tabindex]="tabindex"
                    aria-haspopup="listbox"
                    [attr.aria-expanded]="overlayVisible"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [attr.label]="inputLabel"
                    [attr.aria-label]="ariaLabel"
                />
            </div>
            <span [ngClass]="labelClass()">
                <ng-container *ngIf="valueTemplate; else defaultValueTemplate">
                    <ng-container *ngTemplateOutlet="valueTemplate; context: { $implicit: value, placeholder: placeholder }"></ng-container>
                </ng-container>
                <ng-template #defaultValueTemplate>
                    {{ label() }}
                </ng-template>
            </span>

            <ng-container *ngIf="filled && !disabled && showClear">
                <TimesIcon *ngIf="!clearIconTemplate" [styleClass]="'p-cascadeselect-clear-icon'" (click)="clear($event)" />
                <span *ngIf="clearIconTemplate" class="p-cascadeselect-clear-icon" (click)="clear($event)">
                    <ng-template *ngTemplateOutlet="clearIconTemplate"></ng-template>
                </span>
            </ng-container>

            <div class="p-cascadeselect-trigger" role="button" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible">
                <ChevronDownIcon *ngIf="!triggerIconTemplate" [styleClass]="'p-cascadeselect-trigger-icon'" />
                <span *ngIf="triggerIconTemplate" class="p-cascadeselect-trigger-icon">
                    <ng-template *ngTemplateOutlet="triggerIconTemplate"></ng-template>
                </span>
            </div>
            <p-overlay
                #overlay
                [(visible)]="overlayVisible"
                [options]="overlayOptions"
                [target]="'@parent'"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onAnimationDone)="onOverlayAnimationDone($event)"
                (onBeforeShow)="onBeforeShow.emit($event)"
                (onShow)="onShow.emit($event)"
                (onBeforeHide)="onBeforeHide.emit($event)"
                (onHide)="onHide.emit($event)"
            >
                <ng-template pTemplate="content">
                    <div #panel class="p-cascadeselect-panel p-component" [class]="panelStyleClass" [ngStyle]="panelStyle">
                        <div class="p-cascadeselect-items-wrapper">
                            <p-cascadeSelectSub
                                [options]="options"
                                [selectionPath]="selectionPath"
                                class="p-cascadeselect-items"
                                [optionLabel]="optionLabel"
                                [optionValue]="optionValue"
                                [level]="0"
                                [optionTemplate]="optionTemplate"
                                [groupIconTemplate]="groupIconTemplate"
                                [optionGroupLabel]="optionGroupLabel"
                                [optionGroupChildren]="optionGroupChildren"
                                (onSelect)="onOptionSelect($event)"
                                (onGroupSelect)="onOptionGroupSelect($event)"
                                [dirty]="dirty"
                                [root]="true"
                            >
                            </p-cascadeSelectSub>
                        </div>
                    </div>
                </ng-template>
            </p-overlay>
        </div>
    `, host: {
                        class: 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': 'filled',
                        '[class.p-inputwrapper-focus]': 'focused || overlayVisible',
                        '[class.p-cascadeselect-clearable]': 'showClear && !disabled'
                    }, providers: [CASCADESELECT_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [".p-cascadeselect{display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.p-cascadeselect-trigger{display:flex;align-items:center;justify-content:center;flex-shrink:0}.p-cascadeselect-label{display:block;white-space:nowrap;overflow:hidden;flex:1 1 auto;width:1%;text-overflow:ellipsis;cursor:pointer}.p-cascadeselect-label-empty{overflow:hidden;visibility:hidden}.p-cascadeselect-item{cursor:pointer;font-weight:400;white-space:nowrap}.p-cascadeselect-item-content{display:flex;align-items:center;overflow:hidden;position:relative}.p-cascadeselect-group-icon{margin-left:auto}.p-cascadeselect-items{margin:0;padding:0;list-style-type:none}.p-fluid .p-cascadeselect{display:flex}.p-fluid .p-cascadeselect .p-cascadeselect-label{width:1%}.p-cascadeselect-sublist{position:absolute;min-width:100%;z-index:1;display:none}.p-cascadeselect-item-active{overflow:visible!important}.p-cascadeselect-item-active>.p-cascadeselect-sublist{display:block;left:100%;top:0}.p-cascadeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-cascadeselect-clearable,.p-overlay-modal .p-cascadeselect-sublist{position:relative}.p-overlay-modal .p-cascadeselect-item-active>.p-cascadeselect-sublist{left:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i3.PrimeNGConfig }, { type: i3.OverlayService }]; }, propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], options: [{
                type: Input
            }], optionLabel: [{
                type: Input
            }], optionValue: [{
                type: Input
            }], optionGroupLabel: [{
                type: Input
            }], optionGroupChildren: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], value: [{
                type: Input
            }], dataKey: [{
                type: Input
            }], inputId: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], inputLabel: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], disabled: [{
                type: Input
            }], rounded: [{
                type: Input
            }], showClear: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], panelStyle: [{
                type: Input
            }], overlayOptions: [{
                type: Input
            }], focusInputEl: [{
                type: ViewChild,
                args: ['focusInput']
            }], containerEl: [{
                type: ViewChild,
                args: ['container']
            }], panelEl: [{
                type: ViewChild,
                args: ['panel']
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], onChange: [{
                type: Output
            }], onGroupChange: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onBeforeShow: [{
                type: Output
            }], onBeforeHide: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }] } });
class CascadeSelectModule {
}
CascadeSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CascadeSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelectModule, declarations: [CascadeSelect, CascadeSelectSub], imports: [CommonModule, OverlayModule, SharedModule, RippleModule, ChevronDownIcon, AngleRightIcon, TimesIcon], exports: [CascadeSelect, OverlayModule, CascadeSelectSub, SharedModule] });
CascadeSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelectModule, imports: [CommonModule, OverlayModule, SharedModule, RippleModule, ChevronDownIcon, AngleRightIcon, TimesIcon, OverlayModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: CascadeSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, SharedModule, RippleModule, ChevronDownIcon, AngleRightIcon, TimesIcon],
                    exports: [CascadeSelect, OverlayModule, CascadeSelectSub, SharedModule],
                    declarations: [CascadeSelect, CascadeSelectSub]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CASCADESELECT_VALUE_ACCESSOR, CascadeSelect, CascadeSelectModule, CascadeSelectSub };
//# sourceMappingURL=primeng-cascadeselect.mjs.map
