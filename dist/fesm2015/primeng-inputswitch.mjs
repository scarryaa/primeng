import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUTSWITCH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputSwitch),
    multi: true
};
class InputSwitch {
    constructor(cd) {
        this.cd = cd;
        this.trueValue = true;
        this.falseValue = false;
        this.onChange = new EventEmitter();
        this.modelValue = false;
        this.focused = false;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    onClick(event, cb) {
        if (!this.disabled && !this.readonly) {
            event.preventDefault();
            this.toggle(event);
            cb.focus();
        }
    }
    onInputChange(event) {
        if (!this.readonly) {
            const inputChecked = event.target.checked;
            this.updateModel(event, inputChecked);
        }
    }
    toggle(event) {
        this.updateModel(event, !this.checked());
    }
    updateModel(event, value) {
        this.modelValue = value ? this.trueValue : this.falseValue;
        this.onModelChange(this.modelValue);
        this.onChange.emit({
            originalEvent: event,
            checked: this.modelValue
        });
    }
    onFocus(event) {
        this.focused = true;
    }
    onBlur(event) {
        this.focused = false;
        this.onModelTouched();
    }
    writeValue(value) {
        this.modelValue = value;
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
    checked() {
        return this.modelValue === this.trueValue;
    }
}
InputSwitch.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: InputSwitch, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
InputSwitch.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: InputSwitch, selector: "p-inputSwitch", inputs: { style: "style", styleClass: "styleClass", tabindex: "tabindex", inputId: "inputId", name: "name", disabled: "disabled", readonly: "readonly", trueValue: "trueValue", falseValue: "falseValue", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy" }, outputs: { onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [INPUTSWITCH_VALUE_ACCESSOR], ngImport: i0, template: `
        <div [ngClass]="{ 'p-inputswitch p-component': true, 'p-inputswitch-checked': checked(), 'p-disabled': disabled, 'p-focus': focused }" [ngStyle]="style" [class]="styleClass" (click)="onClick($event, cb)">
            <div class="p-hidden-accessible">
                <input
                    #cb
                    type="checkbox"
                    [attr.aria-label]="ariaLabel"
                    [attr.id]="inputId"
                    [attr.name]="name"
                    [attr.tabindex]="tabindex"
                    [checked]="checked()"
                    (change)="onInputChange($event)"
                    (focus)="onFocus($event)"
                    (blur)="onBlur($event)"
                    [disabled]="disabled"
                    role="switch"
                    [attr.aria-checked]="checked()"
                    [attr.aria-labelledby]="ariaLabelledBy"
                />
            </div>
            <span class="p-inputswitch-slider"></span>
        </div>
    `, isInline: true, styles: [".p-inputswitch{position:relative;display:inline-block;-webkit-user-select:none;user-select:none}.p-inputswitch-slider{position:absolute;cursor:pointer;inset:0}.p-inputswitch-slider:before{position:absolute;content:\"\";top:50%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: InputSwitch, decorators: [{
            type: Component,
            args: [{ selector: 'p-inputSwitch', template: `
        <div [ngClass]="{ 'p-inputswitch p-component': true, 'p-inputswitch-checked': checked(), 'p-disabled': disabled, 'p-focus': focused }" [ngStyle]="style" [class]="styleClass" (click)="onClick($event, cb)">
            <div class="p-hidden-accessible">
                <input
                    #cb
                    type="checkbox"
                    [attr.aria-label]="ariaLabel"
                    [attr.id]="inputId"
                    [attr.name]="name"
                    [attr.tabindex]="tabindex"
                    [checked]="checked()"
                    (change)="onInputChange($event)"
                    (focus)="onFocus($event)"
                    (blur)="onBlur($event)"
                    [disabled]="disabled"
                    role="switch"
                    [attr.aria-checked]="checked()"
                    [attr.aria-labelledby]="ariaLabelledBy"
                />
            </div>
            <span class="p-inputswitch-slider"></span>
        </div>
    `, providers: [INPUTSWITCH_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-inputswitch{position:relative;display:inline-block;-webkit-user-select:none;user-select:none}.p-inputswitch-slider{position:absolute;cursor:pointer;inset:0}.p-inputswitch-slider:before{position:absolute;content:\"\";top:50%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], inputId: [{
                type: Input
            }], name: [{
                type: Input
            }], disabled: [{
                type: Input
            }], readonly: [{
                type: Input
            }], trueValue: [{
                type: Input
            }], falseValue: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], onChange: [{
                type: Output
            }] } });
class InputSwitchModule {
}
InputSwitchModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: InputSwitchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
InputSwitchModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: InputSwitchModule, declarations: [InputSwitch], imports: [CommonModule], exports: [InputSwitch] });
InputSwitchModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: InputSwitchModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: InputSwitchModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [InputSwitch],
                    declarations: [InputSwitch]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { INPUTSWITCH_VALUE_ACCESSOR, InputSwitch, InputSwitchModule };
//# sourceMappingURL=primeng-inputswitch.mjs.map
