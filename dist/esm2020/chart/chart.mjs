import { NgModule, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import * as i0 from "@angular/core";
export class UIChart {
    constructor(platformId, el) {
        this.platformId = platformId;
        this.el = el;
        this.plugins = [];
        this.responsive = true;
        this.onDataSelect = new EventEmitter();
        this.isBrowser = false;
        this._options = {};
    }
    get data() {
        return this._data;
    }
    set data(val) {
        this._data = val;
        this.reinit();
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        this.reinit();
    }
    ngAfterViewInit() {
        this.initChart();
        this.initialized = true;
    }
    onCanvasClick(event) {
        if (this.chart) {
            const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            const dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);
            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }
    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            let opts = this.options || {};
            opts.responsive = this.responsive;
            // allows chart to resize in responsive mode
            if (opts.responsive && (this.height || this.width)) {
                opts.maintainAspectRatio = false;
            }
            this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
                type: this.type,
                data: this.data,
                options: this.options,
                plugins: this.plugins
            });
        }
    }
    getCanvas() {
        return this.el.nativeElement.children[0].children[0];
    }
    getBase64Image() {
        return this.chart.toBase64Image();
    }
    generateLegend() {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    }
    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }
    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }
}
UIChart.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: UIChart, deps: [{ token: PLATFORM_ID }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
UIChart.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: UIChart, selector: "p-chart", inputs: { type: "type", plugins: "plugins", width: "width", height: "height", responsive: "responsive", data: "data", options: "options" }, outputs: { onDataSelect: "onDataSelect" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div style="position:relative" [style.width]="responsive && !width ? null : width" [style.height]="responsive && !height ? null : height">
            <canvas [attr.width]="responsive && !width ? null : width" [attr.height]="responsive && !height ? null : height" (click)="onCanvasClick($event)"></canvas>
        </div>
    `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: UIChart, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-chart',
                    template: `
        <div style="position:relative" [style.width]="responsive && !width ? null : width" [style.height]="responsive && !height ? null : height">
            <canvas [attr.width]="responsive && !width ? null : width" [attr.height]="responsive && !height ? null : height" (click)="onCanvasClick($event)"></canvas>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { type: [{
                type: Input
            }], plugins: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], responsive: [{
                type: Input
            }], onDataSelect: [{
                type: Output
            }], data: [{
                type: Input
            }], options: [{
                type: Input
            }] } });
export class ChartModule {
}
ChartModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ChartModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: ChartModule, declarations: [UIChart], imports: [CommonModule], exports: [UIChart] });
ChartModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ChartModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: ChartModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [UIChart],
                    declarations: [UIChart]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY2hhcnQvY2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQXdDLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEwsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xFLE9BQU8sS0FBSyxNQUFNLGVBQWUsQ0FBQzs7QUFlbEMsTUFBTSxPQUFPLE9BQU87SUF1QmhCLFlBQXlDLFVBQWUsRUFBUyxFQUFjO1FBQXRDLGVBQVUsR0FBVixVQUFVLENBQUs7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBcEJ0RSxZQUFPLEdBQVUsRUFBRSxDQUFDO1FBTXBCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFMUIsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvRCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBTTNCLGFBQVEsR0FBUSxFQUFFLENBQUM7SUFJK0QsQ0FBQztJQUVuRixJQUFhLElBQUk7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEdBQVE7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQWEsT0FBTztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLEdBQVE7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFD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LElBQUksQ0FBQztTQUNyQjtJQUNMLENBQUM7O29HQS9HUSxPQUFPLGtCQXVCSSxXQUFXO3dGQXZCdEIsT0FBTyw2UUFYTjs7OztLQUlUOzJGQU9RLE9BQU87a0JBYm5CLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFFBQVEsRUFBRTs7OztLQUlUO29CQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjtpQkFDSjs7MEJBd0JnQixNQUFNOzJCQUFDLFdBQVc7cUVBdEJ0QixJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsT0FBTztzQkFBZixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFSSxZQUFZO3NCQUFyQixNQUFNO2dCQWNNLElBQUk7c0JBQWhCLEtBQUs7Z0JBU08sT0FBTztzQkFBbkIsS0FBSzs7QUFxRlYsTUFBTSxPQUFPLFdBQVc7O3dHQUFYLFdBQVc7eUdBQVgsV0FBVyxpQkF2SFgsT0FBTyxhQW1ITixZQUFZLGFBbkhiLE9BQU87eUdBdUhQLFdBQVcsWUFKVixZQUFZOzJGQUliLFdBQVc7a0JBTHZCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0JBQ2xCLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBJbmplY3QsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCBDaGFydCBmcm9tICdjaGFydC5qcy9hdXRvJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWNoYXJ0JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIiBbc3R5bGUud2lkdGhdPVwicmVzcG9uc2l2ZSAmJiAhd2lkdGggPyBudWxsIDogd2lkdGhcIiBbc3R5bGUuaGVpZ2h0XT1cInJlc3BvbnNpdmUgJiYgIWhlaWdodCA/IG51bGwgOiBoZWlnaHRcIj5cbiAgICAgICAgICAgIDxjYW52YXMgW2F0dHIud2lkdGhdPVwicmVzcG9uc2l2ZSAmJiAhd2lkdGggPyBudWxsIDogd2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwicmVzcG9uc2l2ZSAmJiAhaGVpZ2h0ID8gbnVsbCA6IGhlaWdodFwiIChjbGljayk9XCJvbkNhbnZhc0NsaWNrKCRldmVudClcIj48L2NhbnZhcz5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBVSUNoYXJ0IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwbHVnaW5zOiBhbnlbXSA9IFtdO1xuXG4gICAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAT3V0cHV0KCkgb25EYXRhU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGlzQnJvd3NlcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgICBfZGF0YTogYW55O1xuXG4gICAgX29wdGlvbnM6IGFueSA9IHt9O1xuXG4gICAgY2hhcnQ6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHt9XG5cbiAgICBASW5wdXQoKSBnZXQgZGF0YSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9XG5cbiAgICBzZXQgZGF0YSh2YWw6IGFueSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdmFsO1xuICAgICAgICB0aGlzLnJlaW5pdCgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBvcHRpb25zKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICAgIH1cblxuICAgIHNldCBvcHRpb25zKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWw7XG4gICAgICAgIHRoaXMucmVpbml0KCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRDaGFydCgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkNhbnZhc0NsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jaGFydC5nZXRFbGVtZW50c0F0RXZlbnRGb3JNb2RlKGV2ZW50LCAnbmVhcmVzdCcsIHsgaW50ZXJzZWN0OiB0cnVlIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFzZXQgPSB0aGlzLmNoYXJ0LmdldEVsZW1lbnRzQXRFdmVudEZvck1vZGUoZXZlbnQsICdkYXRhc2V0JywgeyBpbnRlcnNlY3Q6IHRydWUgfSwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50WzBdICYmIGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRGF0YVNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIGVsZW1lbnQ6IGVsZW1lbnRbMF0sIGRhdGFzZXQ6IGRhdGFzZXQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0Q2hhcnQoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICBsZXQgb3B0cyA9IHRoaXMub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIG9wdHMucmVzcG9uc2l2ZSA9IHRoaXMucmVzcG9uc2l2ZTtcblxuICAgICAgICAgICAgLy8gYWxsb3dzIGNoYXJ0IHRvIHJlc2l6ZSBpbiByZXNwb25zaXZlIG1vZGVcbiAgICAgICAgICAgIGlmIChvcHRzLnJlc3BvbnNpdmUgJiYgKHRoaXMuaGVpZ2h0IHx8IHRoaXMud2lkdGgpKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5tYWludGFpbkFzcGVjdFJhdGlvID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgcGx1Z2luczogdGhpcy5wbHVnaW5zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBnZXRCYXNlNjRJbWFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnQudG9CYXNlNjRJbWFnZSgpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlTGVnZW5kKCkge1xuICAgICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnQuZ2VuZXJhdGVMZWdlbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlZnJlc2goKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJ0LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDaGFydCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtVSUNoYXJ0XSxcbiAgICBkZWNsYXJhdGlvbnM6IFtVSUNoYXJ0XVxufSlcbmV4cG9ydCBjbGFzcyBDaGFydE1vZHVsZSB7fVxuIl19