import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, forwardRef, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const KNOB_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Knob),
    multi: true
};
export class Knob {
    constructor(document, renderer, cd, el) {
        this.document = document;
        this.renderer = renderer;
        this.cd = cd;
        this.el = el;
        this.valueColor = 'var(--primary-color, Black)';
        this.rangeColor = 'var(--surface-border, LightGray)';
        this.textColor = 'var(--text-color-secondary, Black)';
        this.valueTemplate = '{value}';
        this.size = 100;
        this.step = 1;
        this.min = 0;
        this.max = 100;
        this.strokeWidth = 14;
        this.showValue = true;
        this.readonly = false;
        this.onChange = new EventEmitter();
        this.radius = 40;
        this.midX = 50;
        this.midY = 50;
        this.minRadians = (4 * Math.PI) / 3;
        this.maxRadians = -Math.PI / 3;
        this.value = null;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    mapRange(x, inMin, inMax, outMin, outMax) {
        return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }
    onClick(event) {
        if (!this.disabled && !this.readonly) {
            this.updateValue(event.offsetX, event.offsetY);
        }
    }
    updateValue(offsetX, offsetY) {
        let dx = offsetX - this.size / 2;
        let dy = this.size / 2 - offsetY;
        let angle = Math.atan2(dy, dx);
        let start = -Math.PI / 2 - Math.PI / 6;
        this.updateModel(angle, start);
    }
    updateModel(angle, start) {
        let mappedValue;
        if (angle > this.maxRadians)
            mappedValue = this.mapRange(angle, this.minRadians, this.maxRadians, this.min, this.max);
        else if (angle < start)
            mappedValue = this.mapRange(angle + 2 * Math.PI, this.minRadians, this.maxRadians, this.min, this.max);
        else
            return;
        let newValue = Math.round((mappedValue - this.min) / this.step) * this.step + this.min;
        this.value = newValue;
        this.onModelChange(this.value);
        this.onChange.emit(this.value);
    }
    onMouseDown(event) {
        if (!this.disabled && !this.readonly) {
            const window = this.document.defaultView || 'window';
            this.windowMouseMoveListener = this.renderer.listen(window, 'mousemove', this.onMouseMove.bind(this));
            this.windowMouseUpListener = this.renderer.listen(window, 'mouseup', this.onMouseUp.bind(this));
            event.preventDefault();
        }
    }
    onMouseUp(event) {
        if (!this.disabled && !this.readonly) {
            if (this.windowMouseMoveListener) {
                this.windowMouseMoveListener();
                this.windowMouseUpListener = null;
            }
            if (this.windowMouseUpListener) {
                this.windowMouseUpListener();
                this.windowMouseMoveListener = null;
            }
            event.preventDefault();
        }
    }
    onTouchStart(event) {
        if (!this.disabled && !this.readonly) {
            const window = this.document.defaultView || 'window';
            this.windowTouchMoveListener = this.renderer.listen(window, 'touchmove', this.onTouchMove.bind(this));
            this.windowTouchEndListener = this.renderer.listen(window, 'touchend', this.onTouchEnd.bind(this));
            event.preventDefault();
        }
    }
    onTouchEnd(event) {
        if (!this.disabled && !this.readonly) {
            this.windowTouchMoveListener();
            this.windowTouchEndListener();
            this.windowTouchMoveListener = null;
            this.windowTouchEndListener = null;
            event.preventDefault();
        }
    }
    onMouseMove(event) {
        if (!this.disabled && !this.readonly) {
            this.updateValue(event.offsetX, event.offsetY);
            event.preventDefault();
        }
    }
    onTouchMove(event) {
        if (!this.disabled && !this.readonly && event.touches.length == 1) {
            const rect = this.el.nativeElement.children[0].getBoundingClientRect();
            const touch = event.targetTouches.item(0);
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            this.updateValue(offsetX, offsetY);
        }
    }
    writeValue(value) {
        this.value = value;
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
    containerClass() {
        return {
            'p-knob p-component': true,
            'p-disabled': this.disabled
        };
    }
    rangePath() {
        return `M ${this.minX()} ${this.minY()} A ${this.radius} ${this.radius} 0 1 1 ${this.maxX()} ${this.maxY()}`;
    }
    valuePath() {
        return `M ${this.zeroX()} ${this.zeroY()} A ${this.radius} ${this.radius} 0 ${this.largeArc()} ${this.sweep()} ${this.valueX()} ${this.valueY()}`;
    }
    zeroRadians() {
        if (this.min > 0 && this.max > 0)
            return this.mapRange(this.min, this.min, this.max, this.minRadians, this.maxRadians);
        else
            return this.mapRange(0, this.min, this.max, this.minRadians, this.maxRadians);
    }
    valueRadians() {
        return this.mapRange(this._value, this.min, this.max, this.minRadians, this.maxRadians);
    }
    minX() {
        return this.midX + Math.cos(this.minRadians) * this.radius;
    }
    minY() {
        return this.midY - Math.sin(this.minRadians) * this.radius;
    }
    maxX() {
        return this.midX + Math.cos(this.maxRadians) * this.radius;
    }
    maxY() {
        return this.midY - Math.sin(this.maxRadians) * this.radius;
    }
    zeroX() {
        return this.midX + Math.cos(this.zeroRadians()) * this.radius;
    }
    zeroY() {
        return this.midY - Math.sin(this.zeroRadians()) * this.radius;
    }
    valueX() {
        return this.midX + Math.cos(this.valueRadians()) * this.radius;
    }
    valueY() {
        return this.midY - Math.sin(this.valueRadians()) * this.radius;
    }
    largeArc() {
        return Math.abs(this.zeroRadians() - this.valueRadians()) < Math.PI ? 0 : 1;
    }
    sweep() {
        return this.valueRadians() > this.zeroRadians() ? 0 : 1;
    }
    valueToDisplay() {
        return this.valueTemplate.replace('{value}', this._value.toString());
    }
    get _value() {
        return this.value != null ? this.value : this.min;
    }
}
Knob.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Knob, deps: [{ token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
Knob.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Knob, selector: "p-knob", inputs: { styleClass: "styleClass", style: "style", severity: "severity", valueColor: "valueColor", rangeColor: "rangeColor", textColor: "textColor", valueTemplate: "valueTemplate", name: "name", size: "size", step: "step", min: "min", max: "max", strokeWidth: "strokeWidth", disabled: "disabled", showValue: "showValue", readonly: "readonly" }, outputs: { onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [KNOB_VALUE_ACCESSOR], ngImport: i0, template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <svg
                viewBox="0 0 100 100"
                [style.width]="size + 'px'"
                [style.height]="size + 'px'"
                (click)="onClick($event)"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
            >
                <path [attr.d]="rangePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="rangeColor" class="p-knob-range"></path>
                <path [attr.d]="valuePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="valueColor" class="p-knob-value"></path>
                <text *ngIf="showValue" [attr.x]="50" [attr.y]="57" text-anchor="middle" [attr.fill]="textColor" class="p-knob-text" [attr.name]="name">{{ valueToDisplay() }}</text>
            </svg>
        </div>
    `, isInline: true, styles: ["@keyframes dash-frame{to{stroke-dashoffset:0}}.p-knob-range{fill:none;transition:stroke .1s ease-in}.p-knob-value{animation-name:dash-frame;animation-fill-mode:forwards;fill:none}.p-knob-text{font-size:1.3rem;text-align:center}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Knob, decorators: [{
            type: Component,
            args: [{ selector: 'p-knob', template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <svg
                viewBox="0 0 100 100"
                [style.width]="size + 'px'"
                [style.height]="size + 'px'"
                (click)="onClick($event)"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
            >
                <path [attr.d]="rangePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="rangeColor" class="p-knob-range"></path>
                <path [attr.d]="valuePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="valueColor" class="p-knob-value"></path>
                <text *ngIf="showValue" [attr.x]="50" [attr.y]="57" text-anchor="middle" [attr.fill]="textColor" class="p-knob-text" [attr.name]="name">{{ valueToDisplay() }}</text>
            </svg>
        </div>
    `, providers: [KNOB_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@keyframes dash-frame{to{stroke-dashoffset:0}}.p-knob-range{fill:none;transition:stroke .1s ease-in}.p-knob-value{animation-name:dash-frame;animation-fill-mode:forwards;fill:none}.p-knob-text{font-size:1.3rem;text-align:center}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], severity: [{
                type: Input
            }], valueColor: [{
                type: Input
            }], rangeColor: [{
                type: Input
            }], textColor: [{
                type: Input
            }], valueTemplate: [{
                type: Input
            }], name: [{
                type: Input
            }], size: [{
                type: Input
            }], step: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], disabled: [{
                type: Input
            }], showValue: [{
                type: Input
            }], readonly: [{
                type: Input
            }], onChange: [{
                type: Output
            }] } });
export class KnobModule {
}
KnobModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: KnobModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
KnobModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: KnobModule, declarations: [Knob], imports: [CommonModule], exports: [Knob] });
KnobModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: KnobModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: KnobModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Knob],
                    declarations: [Knob]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9rbm9iL2tub2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBaUMsTUFBTSxFQUFFLFlBQVksRUFBYSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0wsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBRW5ELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFRO0lBQ3BDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDbkMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBOEJGLE1BQU0sT0FBTyxJQUFJO0lBMkRiLFlBQXNDLFFBQWtCLEVBQVUsUUFBbUIsRUFBVSxFQUFxQixFQUFVLEVBQWM7UUFBdEcsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVk7UUFwRG5JLGVBQVUsR0FBVyw2QkFBNkIsQ0FBQztRQUVuRCxlQUFVLEdBQVcsa0NBQWtDLENBQUM7UUFFeEQsY0FBUyxHQUFXLG9DQUFvQyxDQUFDO1FBRXpELGtCQUFhLEdBQVcsU0FBUyxDQUFDO1FBSWxDLFNBQUksR0FBVyxHQUFHLENBQUM7UUFFbkIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUVqQixRQUFHLEdBQVcsQ0FBQyxDQUFDO1FBRWhCLFFBQUcsR0FBVyxHQUFHLENBQUM7UUFFbEIsZ0JBQVcsR0FBVyxFQUFFLENB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O1FBQ0EsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDL0QsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMvRCxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQy9ELENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDL0QsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ2xFLENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNsRSxDQUFDO0lBRUQsTUFBTTtRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbkUsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ25FLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELGNBQWM7UUFDVixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDdEQsQ0FBQzs7aUdBL09RLElBQUksa0JBMkRPLFFBQVE7cUZBM0RuQixJQUFJLHFjQVJGLENBQUMsbUJBQW1CLENBQUMsMEJBbEJ0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQlQ7MkZBU1EsSUFBSTtrQkE1QmhCLFNBQVM7K0JBQ0ksUUFBUSxZQUNSOzs7Ozs7Ozs7Ozs7Ozs7OztLQWlCVCxhQUNVLENBQUMsbUJBQW1CLENBQUMsbUJBQ2YsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxRQUUvQjt3QkFDRixLQUFLLEVBQUUsV0FBVztxQkFDckI7OzBCQTZEWSxNQUFNOzJCQUFDLFFBQVE7NkhBMURuQixVQUFVO3NCQUFsQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsR0FBRztzQkFBWCxLQUFLO2dCQUVHLEdBQUc7c0JBQVgsS0FBSztnQkFFRyxXQUFXO3NCQUFuQixLQUFLO2dCQUVHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVJLFFBQVE7c0JBQWpCLE1BQU07O0FBc05YLE1BQU0sT0FBTyxVQUFVOzt1R0FBVixVQUFVO3dHQUFWLFVBQVUsaUJBdlBWLElBQUksYUFtUEgsWUFBWSxhQW5QYixJQUFJO3dHQXVQSixVQUFVLFlBSlQsWUFBWTsyRkFJYixVQUFVO2tCQUx0QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUNmLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQztpQkFDdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIElucHV0LCBmb3J3YXJkUmVmLCBDaGFuZ2VEZXRlY3RvclJlZiwgRWxlbWVudFJlZiwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyMiwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgY29uc3QgS05PQl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEtub2IpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Ata25vYicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCJjb250YWluZXJDbGFzcygpXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiPlxuICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoXT1cInNpemUgKyAncHgnXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cInNpemUgKyAncHgnXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChtb3VzZXVwKT1cIm9uTW91c2VVcCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHBhdGggW2F0dHIuZF09XCJyYW5nZVBhdGgoKVwiIFthdHRyLnN0cm9rZS13aWR0aF09XCJzdHJva2VXaWR0aFwiIFthdHRyLnN0cm9rZV09XCJyYW5nZUNvbG9yXCIgY2xhc3M9XCJwLWtub2ItcmFuZ2VcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgPHBhdGggW2F0dHIuZF09XCJ2YWx1ZVBhdGgoKVwiIFthdHRyLnN0cm9rZS13aWR0aF09XCJzdHJva2VXaWR0aFwiIFthdHRyLnN0cm9rZV09XCJ2YWx1ZUNvbG9yXCIgY2xhc3M9XCJwLWtub2ItdmFsdWVcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgPHRleHQgKm5nSWY9XCJzaG93VmFsdWVcIiBbYXR0ci54XT1cIjUwXCIgW2F0dHIueV09XCI1N1wiIHRleHQtYW5jaG9yPVwibWlkZGxlXCIgW2F0dHIuZmlsbF09XCJ0ZXh0Q29sb3JcIiBjbGFzcz1cInAta25vYi10ZXh0XCIgW2F0dHIubmFtZV09XCJuYW1lXCI+e3sgdmFsdWVUb0Rpc3BsYXkoKSB9fTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW0tOT0JfVkFMVUVfQUNDRVNTT1JdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4va25vYi5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgS25vYiB7XG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHNldmVyaXR5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB2YWx1ZUNvbG9yOiBzdHJpbmcgPSAndmFyKC0tcHJpbWFyeS1jb2xvciwgQmxhY2spJztcblxuICAgIEBJbnB1dCgpIHJhbmdlQ29sb3I6IHN0cmluZyA9ICd2YXIoLS1zdXJmYWNlLWJvcmRlciwgTGlnaHRHcmF5KSc7XG5cbiAgICBASW5wdXQoKSB0ZXh0Q29sb3I6IHN0cmluZyA9ICd2YXIoLS10ZXh0LWNvbG9yLXNlY29uZGFyeSwgQmxhY2spJztcblxuICAgIEBJbnB1dCgpIHZhbHVlVGVtcGxhdGU6IHN0cmluZyA9ICd7dmFsdWV9JztcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNpemU6IG51bWJlciA9IDEwMDtcblxuICAgIEBJbnB1dCgpIHN0ZXA6IG51bWJlciA9IDE7XG5cbiAgICBASW5wdXQoKSBtaW46IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDEwMDtcblxuICAgIEBJbnB1dCgpIHN0cm9rZVdpZHRoOiBudW1iZXIgPSAxNDtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2hvd1ZhbHVlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHJlYWRvbmx5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAT3V0cHV0KCkgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgcmFkaXVzOiBudW1iZXIgPSA0MDtcblxuICAgIG1pZFg6IG51bWJlciA9IDUwO1xuXG4gICAgbWlkWTogbnVtYmVyID0gNTA7XG5cbiAgICBtaW5SYWRpYW5zOiBudW1iZXIgPSAoNCAqIE1hdGguUEkpIC8gMztcblxuICAgIG1heFJhZGlhbnM6IG51bWJlciA9IC1NYXRoLlBJIC8gMztcblxuICAgIHZhbHVlOiBudW1iZXIgPSBudWxsO1xuXG4gICAgd2luZG93TW91c2VNb3ZlTGlzdGVuZXI6ICgpID0+IHZvaWQgfCBudWxsO1xuXG4gICAgd2luZG93TW91c2VVcExpc3RlbmVyOiAoKSA9PiB2b2lkIHwgbnVsbDtcblxuICAgIHdpbmRvd1RvdWNoTW92ZUxpc3RlbmVyOiAoKSA9PiB2b2lkIHwgbnVsbDtcblxuICAgIHdpbmRvd1RvdWNoRW5kTGlzdGVuZXI6ICgpID0+IHZvaWQgfCBudWxsO1xuXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHt9XG5cbiAgICBtYXBSYW5nZSh4LCBpbk1pbiwgaW5NYXgsIG91dE1pbiwgb3V0TWF4KSB7XG4gICAgICAgIHJldHVybiAoKHggLSBpbk1pbikgKiAob3V0TWF4IC0gb3V0TWluKSkgLyAoaW5NYXggLSBpbk1pbikgKyBvdXRNaW47XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVWYWx1ZShvZmZzZXRYLCBvZmZzZXRZKSB7XG4gICAgICAgIGxldCBkeCA9IG9mZnNldFggLSB0aGlzLnNpemUgLyAyO1xuICAgICAgICBsZXQgZHkgPSB0aGlzLnNpemUgLyAyIC0gb2Zmc2V0WTtcbiAgICAgICAgbGV0IGFuZ2xlID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuICAgICAgICBsZXQgc3RhcnQgPSAtTWF0aC5QSSAvIDIgLSBNYXRoLlBJIC8gNjtcbiAgICAgICAgdGhpcy51cGRhdGVNb2RlbChhbmdsZSwgc3RhcnQpO1xuICAgIH1cblxuICAgIHVwZGF0ZU1vZGVsKGFuZ2xlLCBzdGFydCkge1xuICAgICAgICBsZXQgbWFwcGVkVmFsdWU7XG4gICAgICAgIGlmIChhbmdsZSA+IHRoaXMubWF4UmFkaWFucykgbWFwcGVkVmFsdWUgPSB0aGlzLm1hcFJhbmdlKGFuZ2xlLCB0aGlzLm1pblJhZGlhbnMsIHRoaXMubWF4UmFkaWFucywgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgICAgICAgZWxzZSBpZiAoYW5nbGUgPCBzdGFydCkgbWFwcGVkVmFsdWUgPSB0aGlzLm1hcFJhbmdlKGFuZ2xlICsgMiAqIE1hdGguUEksIHRoaXMubWluUmFkaWFucywgdGhpcy5tYXhSYWRpYW5zLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICAgICAgICBlbHNlIHJldHVybjtcblxuICAgICAgICBsZXQgbmV3VmFsdWUgPSBNYXRoLnJvdW5kKChtYXBwZWRWYWx1ZSAtIHRoaXMubWluKSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXAgKyB0aGlzLm1pbjtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICBvbk1vdXNlRG93bihldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcgfHwgJ3dpbmRvdyc7XG4gICAgICAgICAgICB0aGlzLndpbmRvd01vdXNlTW92ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4od2luZG93LCAnbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMud2luZG93TW91c2VVcExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4od2luZG93LCAnbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VVcChldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndpbmRvd01vdXNlTW92ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dNb3VzZU1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMud2luZG93TW91c2VVcExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMud2luZG93TW91c2VVcExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dNb3VzZVVwTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd01vdXNlTW92ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICF0aGlzLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3IHx8ICd3aW5kb3cnO1xuICAgICAgICAgICAgdGhpcy53aW5kb3dUb3VjaE1vdmVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHdpbmRvdywgJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1RvdWNoRW5kTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih3aW5kb3csICd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5yZWFkb25seSkge1xuICAgICAgICAgICAgdGhpcy53aW5kb3dUb3VjaE1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy53aW5kb3dUb3VjaEVuZExpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1RvdWNoTW92ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMud2luZG93VG91Y2hFbmRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICF0aGlzLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5yZWFkb25seSAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSBldmVudC50YXJnZXRUb3VjaGVzLml0ZW0oMCk7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXRYID0gdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFkgPSB0b3VjaC5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKG9mZnNldFgsIG9mZnNldFkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgY29udGFpbmVyQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1rbm9iIHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICdwLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJhbmdlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGBNICR7dGhpcy5taW5YKCl9ICR7dGhpcy5taW5ZKCl9IEEgJHt0aGlzLnJhZGl1c30gJHt0aGlzLnJhZGl1c30gMCAxIDEgJHt0aGlzLm1heFgoKX0gJHt0aGlzLm1heFkoKX1gO1xuICAgIH1cblxuICAgIHZhbHVlUGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIGBNICR7dGhpcy56ZXJvWCgpfSAke3RoaXMuemVyb1koKX0gQSAke3RoaXMucmFkaXVzfSAke3RoaXMucmFkaXVzfSAwICR7dGhpcy5sYXJnZUFyYygpfSAke3RoaXMuc3dlZXAoKX0gJHt0aGlzLnZhbHVlWCgpfSAke3RoaXMudmFsdWVZKCl9YDtcbiAgICB9XG5cbiAgICB6ZXJvUmFkaWFucygpIHtcbiAgICAgICAgaWYgKHRoaXMubWluID4gMCAmJiB0aGlzLm1heCA+IDApIHJldHVybiB0aGlzLm1hcFJhbmdlKHRoaXMubWluLCB0aGlzLm1pbiwgdGhpcy5tYXgsIHRoaXMubWluUmFkaWFucywgdGhpcy5tYXhSYWRpYW5zKTtcbiAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5tYXBSYW5nZSgwLCB0aGlzLm1pbiwgdGhpcy5tYXgsIHRoaXMubWluUmFkaWFucywgdGhpcy5tYXhSYWRpYW5zKTtcbiAgICB9XG5cbiAgICB2YWx1ZVJhZGlhbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFJhbmdlKHRoaXMuX3ZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgsIHRoaXMubWluUmFkaWFucywgdGhpcy5tYXhSYWRpYW5zKTtcbiAgICB9XG5cbiAgICBtaW5YKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWRYICsgTWF0aC5jb3ModGhpcy5taW5SYWRpYW5zKSAqIHRoaXMucmFkaXVzO1xuICAgIH1cblxuICAgIG1pblkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pZFkgLSBNYXRoLnNpbih0aGlzLm1pblJhZGlhbnMpICogdGhpcy5yYWRpdXM7XG4gICAgfVxuXG4gICAgbWF4WCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlkWCArIE1hdGguY29zKHRoaXMubWF4UmFkaWFucykgKiB0aGlzLnJhZGl1cztcbiAgICB9XG5cbiAgICBtYXhZKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWRZIC0gTWF0aC5zaW4odGhpcy5tYXhSYWRpYW5zKSAqIHRoaXMucmFkaXVzO1xuICAgIH1cblxuICAgIHplcm9YKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWRYICsgTWF0aC5jb3ModGhpcy56ZXJvUmFkaWFucygpKSAqIHRoaXMucmFkaXVzO1xuICAgIH1cblxuICAgIHplcm9ZKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWRZIC0gTWF0aC5zaW4odGhpcy56ZXJvUmFkaWFucygpKSAqIHRoaXMucmFkaXVzO1xuICAgIH1cblxuICAgIHZhbHVlWCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlkWCArIE1hdGguY29zKHRoaXMudmFsdWVSYWRpYW5zKCkpICogdGhpcy5yYWRpdXM7XG4gICAgfVxuXG4gICAgdmFsdWVZKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWRZIC0gTWF0aC5zaW4odGhpcy52YWx1ZVJhZGlhbnMoKSkgKiB0aGlzLnJhZGl1cztcbiAgICB9XG5cbiAgICBsYXJnZUFyYygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuemVyb1JhZGlhbnMoKSAtIHRoaXMudmFsdWVSYWRpYW5zKCkpIDwgTWF0aC5QSSA/IDAgOiAxO1xuICAgIH1cblxuICAgIHN3ZWVwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVJhZGlhbnMoKSA+IHRoaXMuemVyb1JhZGlhbnMoKSA/IDAgOiAxO1xuICAgIH1cblxuICAgIHZhbHVlVG9EaXNwbGF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRlbXBsYXRlLnJlcGxhY2UoJ3t2YWx1ZX0nLCB0aGlzLl92YWx1ZS50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBnZXQgX3ZhbHVlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlICE9IG51bGwgPyB0aGlzLnZhbHVlIDogdGhpcy5taW47XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtLbm9iXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtLbm9iXVxufSlcbmV4cG9ydCBjbGFzcyBLbm9iTW9kdWxlIHt9XG4iXX0=