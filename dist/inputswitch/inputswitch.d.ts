import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare const INPUTSWITCH_VALUE_ACCESSOR: any;
export interface InputSwitchOnChangeEvent {
    originalEvent: Event;
    checked: boolean;
}
export declare class InputSwitch implements ControlValueAccessor {
    private cd;
    style: any;
    styleClass: string;
    tabindex: number;
    inputId: string;
    name: string;
    disabled: boolean;
    readonly: boolean;
    trueValue: any;
    falseValue: any;
    ariaLabel: string;
    ariaLabelledBy: string;
    onChange: EventEmitter<InputSwitchOnChangeEvent>;
    modelValue: any;
    focused: boolean;
    onModelChange: Function;
    onModelTouched: Function;
    constructor(cd: ChangeDetectorRef);
    onClick(event: Event, cb: HTMLInputElement): void;
    onInputChange(event: Event): void;
    toggle(event: Event): void;
    updateModel(event: Event, value: boolean): void;
    onFocus(event: Event): void;
    onBlur(event: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    checked(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputSwitch, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InputSwitch, "p-inputSwitch", never, { "style": "style"; "styleClass": "styleClass"; "tabindex": "tabindex"; "inputId": "inputId"; "name": "name"; "disabled": "disabled"; "readonly": "readonly"; "trueValue": "trueValue"; "falseValue": "falseValue"; "ariaLabel": "ariaLabel"; "ariaLabelledBy": "ariaLabelledBy"; }, { "onChange": "onChange"; }, never, never, false, never>;
}
export declare class InputSwitchModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<InputSwitchModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<InputSwitchModule, [typeof InputSwitch], [typeof i1.CommonModule], [typeof InputSwitch]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<InputSwitchModule>;
}
