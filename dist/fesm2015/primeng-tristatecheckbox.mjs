import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChildren, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckIcon } from 'primeng/icons/check';
import { TimesIcon } from 'primeng/icons/times';
import { PrimeTemplate, SharedModule } from 'primeng/api';

const TRISTATECHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TriStateCheckbox),
    multi: true
};
class TriStateCheckbox {
    constructor(cd) {
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    onClick(event, input) {
        if (!this.disabled && !this.readonly) {
            this.toggle(event);
            this.focused = true;
            input.focus();
        }
    }
    onKeydown(event) {
        if (event.keyCode == 32) {
            event.preventDefault();
        }
    }
    onKeyup(event) {
        if (event.keyCode == 32 && !this.readonly) {
            this.toggle(event);
            event.preventDefault();
        }
    }
    toggle(event) {
        if (this.value == null || this.value == undefined)
            this.value = true;
        else if (this.value == true)
            this.value = false;
        else if (this.value == false)
            this.value = null;
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'checkicon':
                    this.checkIconTemplate = item.template;
                    break;
                case 'uncheckicon':
                    this.uncheckIconTemplate = item.template;
                    break;
            }
        });
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
        this.onModelTouched();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    writeValue(value) {
        this.value = value;
        this.cd.markForCheck();
    }
    setDisabledState(disabled) {
        this.disabled = disabled;
        this.cd.markForCheck();
    }
}
TriStateCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TriStateCheckbox, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TriStateCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TriStateCheckbox, selector: "p-triStateCheckbox", inputs: { disabled: "disabled", name: "name", ariaLabelledBy: "ariaLabelledBy", tabindex: "tabindex", inputId: "inputId", style: "style", styleClass: "styleClass", label: "label", readonly: "readonly", checkboxTrueIcon: "checkboxTrueIcon", checkboxFalseIcon: "checkboxFalseIcon" }, outputs: { onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [TRISTATECHECKBOX_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [ngStyle]="style" [ngClass]="{ 'p-checkbox p-component': true, 'p-checkbox-disabled': disabled, 'p-checkbox-focused': focused }" [class]="styleClass">
            <div class="p-hidden-accessible">
                <input
                    #input
                    type="text"
                    [attr.id]="inputId"
                    [name]="name"
                    [attr.tabindex]="tabindex"
                    [readonly]="readonly"
                    [disabled]="disabled"
                    (keyup)="onKeyup($event)"
                    (keydown)="onKeydown($event)"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    inputmode="none"
                />
            </div>
            <div class="p-checkbox-box" (click)="onClick($event, input)" role="checkbox" [attr.aria-checked]="value === true" [ngClass]="{ 'p-highlight': value != null, 'p-disabled': disabled, 'p-focus': focused }">
                <ng-container *ngIf="value === true">
                    <span *ngIf="checkboxTrueIcon" [ngClass]="checkboxTrueIcon" class="p-checkbox-icon"></span>
                    <ng-container *ngIf="!checkboxTrueIcon">
                        <CheckIcon [styleClass]="'p-checkbox-icon'" *ngIf="!checkIconTemplate" />
                        <span *ngIf="checkIconTemplate" class="p-checkbox-icon">
                            <ng-template *ngTemplateOutlet="checkIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
                <ng-container *ngIf="value === false">
                    <span *ngIf="checkboxFalseIcon" [ngClass]="checkboxFalseIcon" class="p-checkbox-icon"></span>
                    <ng-container *ngIf="!checkboxFalseIcon">
                        <TimesIcon [styleClass]="'p-checkbox-icon'" *ngIf="!uncheckIconTemplate" />
                        <span class="p-checkbox-icon" *ngIf="uncheckIconTemplate">
                            <ng-template *ngTemplateOutlet="uncheckIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
            </div>
        </div>
        <label class="p-checkbox-label" (click)="onClick($event, input)" [ngClass]="{ 'p-checkbox-label-active': value != null, 'p-disabled': disabled, 'p-checkbox-label-focus': focused }" *ngIf="label" [attr.for]="inputId">{{ label }}</label>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return CheckIcon; }), selector: "CheckIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TriStateCheckbox, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-triStateCheckbox',
                    template: `
        <div [ngStyle]="style" [ngClass]="{ 'p-checkbox p-component': true, 'p-checkbox-disabled': disabled, 'p-checkbox-focused': focused }" [class]="styleClass">
            <div class="p-hidden-accessible">
                <input
                    #input
                    type="text"
                    [attr.id]="inputId"
                    [name]="name"
                    [attr.tabindex]="tabindex"
                    [readonly]="readonly"
                    [disabled]="disabled"
                    (keyup)="onKeyup($event)"
                    (keydown)="onKeydown($event)"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    inputmode="none"
                />
            </div>
            <div class="p-checkbox-box" (click)="onClick($event, input)" role="checkbox" [attr.aria-checked]="value === true" [ngClass]="{ 'p-highlight': value != null, 'p-disabled': disabled, 'p-focus': focused }">
                <ng-container *ngIf="value === true">
                    <span *ngIf="checkboxTrueIcon" [ngClass]="checkboxTrueIcon" class="p-checkbox-icon"></span>
                    <ng-container *ngIf="!checkboxTrueIcon">
                        <CheckIcon [styleClass]="'p-checkbox-icon'" *ngIf="!checkIconTemplate" />
                        <span *ngIf="checkIconTemplate" class="p-checkbox-icon">
                            <ng-template *ngTemplateOutlet="checkIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
                <ng-container *ngIf="value === false">
                    <span *ngIf="checkboxFalseIcon" [ngClass]="checkboxFalseIcon" class="p-checkbox-icon"></span>
                    <ng-container *ngIf="!checkboxFalseIcon">
                        <TimesIcon [styleClass]="'p-checkbox-icon'" *ngIf="!uncheckIconTemplate" />
                        <span class="p-checkbox-icon" *ngIf="uncheckIconTemplate">
                            <ng-template *ngTemplateOutlet="uncheckIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
            </div>
        </div>
        <label class="p-checkbox-label" (click)="onClick($event, input)" [ngClass]="{ 'p-checkbox-label-active': value != null, 'p-disabled': disabled, 'p-checkbox-label-focus': focused }" *ngIf="label" [attr.for]="inputId">{{ label }}</label>
    `,
                    providers: [TRISTATECHECKBOX_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], name: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], inputId: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], label: [{
                type: Input
            }], readonly: [{
                type: Input
            }], checkboxTrueIcon: [{
                type: Input
            }], checkboxFalseIcon: [{
                type: Input
            }], onChange: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class TriStateCheckboxModule {
}
TriStateCheckboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TriStateCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TriStateCheckboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: TriStateCheckboxModule, declarations: [TriStateCheckbox], imports: [CommonModule, SharedModule, CheckIcon, TimesIcon], exports: [TriStateCheckbox, SharedModule] });
TriStateCheckboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TriStateCheckboxModule, imports: [CommonModule, SharedModule, CheckIcon, TimesIcon, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TriStateCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, CheckIcon, TimesIcon],
                    exports: [TriStateCheckbox, SharedModule],
                    declarations: [TriStateCheckbox]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { TRISTATECHECKBOX_VALUE_ACCESSOR, TriStateCheckbox, TriStateCheckboxModule };
//# sourceMappingURL=primeng-tristatecheckbox.mjs.map
