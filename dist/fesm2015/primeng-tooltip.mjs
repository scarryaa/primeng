import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { PLATFORM_ID, Directive, Inject, Input, HostListener, NgModule } from '@angular/core';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import * as i1 from 'primeng/api';

class Tooltip {
    constructor(platformId, el, zone, config, renderer, changeDetector) {
        this.platformId = platformId;
        this.el = el;
        this.zone = zone;
        this.config = config;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        this.escape = true;
        this.autoHide = true;
        this.fitContent = true;
        this.hideOnEscape = true;
        this._tooltipOptions = {
            tooltipPosition: 'right',
            tooltipEvent: 'hover',
            appendTo: 'body',
            tooltipZIndex: 'auto',
            escape: true,
            positionTop: 0,
            positionLeft: 0,
            autoHide: true,
            hideOnEscape: false
        };
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
        this.deactivate();
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                if (this.getOption('tooltipEvent') === 'hover') {
                    this.mouseEnterListener = this.onMouseEnter.bind(this);
                    this.mouseLeaveListener = this.onMouseLeave.bind(this);
                    this.clickListener = this.onInputClick.bind(this);
                    this.el.nativeElement.addEventListener('mouseenter', this.mouseEnterListener);
                    this.el.nativeElement.addEventListener('click', this.clickListener);
                    this.el.nativeElement.addEventListener('mouseleave', this.mouseLeaveListener);
                }
                else if (this.getOption('tooltipEvent') === 'focus') {
                    this.focusListener = this.onFocus.bind(this);
                    this.blurListener = this.onBlur.bind(this);
                    let target = this.getTarget(this.el.nativeElement);
                    target.addEventListener('focus', this.focusListener);
                    target.addEventListener('blur', this.blurListener);
                }
            });
        }
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.tooltipPosition) {
            this.setOption({ tooltipPosition: simpleChange.tooltipPosition.currentValue });
        }
        if (simpleChange.tooltipEvent) {
            this.setOption({ tooltipEvent: simpleChange.tooltipEvent.currentValue });
        }
        if (simpleChange.appendTo) {
            this.setOption({ appendTo: simpleChange.appendTo.currentValue });
        }
        if (simpleChange.positionStyle) {
            this.setOption({ positionStyle: simpleChange.positionStyle.currentValue });
        }
        if (simpleChange.tooltipStyleClass) {
            this.setOption({ tooltipStyleClass: simpleChange.tooltipStyleClass.currentValue });
        }
        if (simpleChange.tooltipZIndex) {
            this.setOption({ tooltipZIndex: simpleChange.tooltipZIndex.currentValue });
        }
        if (simpleChange.escape) {
            this.setOption({ escape: simpleChange.escape.currentValue });
        }
        if (simpleChange.showDelay) {
            this.setOption({ showDelay: simpleChange.showDelay.currentValue });
        }
        if (simpleChange.hideDelay) {
            this.setOption({ hideDelay: simpleChange.hideDelay.currentValue });
        }
        if (simpleChange.life) {
            this.setOption({ life: simpleChange.life.currentValue });
        }
        if (simpleChange.positionTop) {
            this.setOption({ positionTop: simpleChange.positionTop.currentValue });
        }
        if (simpleChange.positionLeft) {
            this.setOption({ positionLeft: simpleChange.positionLeft.currentValue });
        }
        if (simpleChange.disabled) {
            this.setOption({ disabled: simpleChange.disabled.currentValue });
        }
        if (simpleChange.text) {
            this.setOption({ tooltipLabel: simpleChange.text.currentValue });
            if (this.active) {
                if (simpleChange.text.currentValue) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    }
                    else {
                        this.show();
                    }
                }
                else {
                    this.hide();
                }
            }
        }
        if (simpleChange.autoHide) {
            this.setOption({ autoHide: simpleChange.autoHide.currentValue });
        }
        if (simpleChange.tooltipOptions) {
            this._tooltipOptions = Object.assign(Object.assign({}, this._tooltipOptions), simpleChange.tooltipOptions.currentValue);
            this.deactivate();
            if (this.active) {
                if (this.getOption('tooltipLabel')) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    }
                    else {
                        this.show();
                    }
                }
                else {
                    this.hide();
                }
            }
        }
    }
    isAutoHide() {
        return this.getOption('autoHide');
    }
    onMouseEnter(e) {
        if (!this.container && !this.showTimeout) {
            this.activate();
        }
    }
    onMouseLeave(e) {
        if (!this.isAutoHide()) {
            const valid = DomHandler.hasClass(e.toElement, 'p-tooltip') || DomHandler.hasClass(e.toElement, 'p-tooltip-arrow') || DomHandler.hasClass(e.toElement, 'p-tooltip-text') || DomHandler.hasClass(e.relatedTarget, 'p-tooltip');
            !valid && this.deactivate();
        }
        else {
            this.deactivate();
        }
    }
    onFocus(e) {
        this.activate();
    }
    onBlur(e) {
        this.deactivate();
    }
    onInputClick(e) {
        this.deactivate();
    }
    onPressEscape() {
        if (this.hideOnEscape) {
            this.deactivate();
        }
    }
    activate() {
        this.active = true;
        this.clearHideTimeout();
        if (this.getOption('showDelay'))
            this.showTimeout = setTimeout(() => {
                this.show();
            }, this.getOption('showDelay'));
        else
            this.show();
        if (this.getOption('life')) {
            let duration = this.getOption('showDelay') ? this.getOption('life') + this.getOption('showDelay') : this.getOption('life');
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, duration);
        }
    }
    deactivate() {
        this.active = false;
        this.clearShowTimeout();
        if (this.getOption('hideDelay')) {
            this.clearHideTimeout(); //life timeout
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.getOption('hideDelay'));
        }
        else {
            this.hide();
        }
    }
    create() {
        if (this.container) {
            this.clearHideTimeout();
            this.remove();
        }
        this.container = document.createElement('div');
        let tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'p-tooltip-arrow';
        this.container.appendChild(tooltipArrow);
        this.tooltipText = document.createElement('div');
        this.tooltipText.className = 'p-tooltip-text';
        this.updateText();
        if (this.getOption('positionStyle')) {
            this.container.style.position = this.getOption('positionStyle');
        }
        this.container.appendChild(this.tooltipText);
        if (this.getOption('appendTo') === 'body')
            document.body.appendChild(this.container);
        else if (this.getOption('appendTo') === 'target')
            DomHandler.appendChild(this.container, this.el.nativeElement);
        else
            DomHandler.appendChild(this.container, this.getOption('appendTo'));
        this.container.style.display = 'inline-block';
        if (this.fitContent) {
            this.container.style.width = 'fit-content';
        }
        if (!this.isAutoHide()) {
            this.bindContainerMouseleaveListener();
        }
    }
    bindContainerMouseleaveListener() {
        var _a;
        if (!this.containerMouseleaveListener) {
            const targetEl = (_a = this.container) !== null && _a !== void 0 ? _a : this.container.nativeElement;
            this.containerMouseleaveListener = this.renderer.listen(targetEl, 'mouseleave', (e) => {
                this.deactivate();
            });
        }
    }
    unbindContainerMouseleaveListener() {
        if (this.containerMouseleaveListener) {
            this.bindContainerMouseleaveListener();
            this.containerMouseleaveListener = null;
        }
    }
    show() {
        if (!this.getOption('tooltipLabel') || this.getOption('disabled')) {
            return;
        }
        this.create();
        this.align();
        DomHandler.fadeIn(this.container, 250);
        if (this.getOption('tooltipZIndex') === 'auto')
            ZIndexUtils.set('tooltip', this.container, this.config.zIndex.tooltip);
        else
            this.container.style.zIndex = this.getOption('tooltipZIndex');
        this.bindDocumentResizeListener();
        this.bindScrollListener();
    }
    hide() {
        if (this.getOption('tooltipZIndex') === 'auto') {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
    }
    updateText() {
        if (this.getOption('escape')) {
            this.tooltipText.innerHTML = '';
            this.tooltipText.appendChild(document.createTextNode(this.getOption('tooltipLabel')));
        }
        else {
            this.tooltipText.innerHTML = this.getOption('tooltipLabel');
        }
    }
    align() {
        let position = this.getOption('tooltipPosition');
        switch (position) {
            case 'top':
                this.alignTop();
                if (this.isOutOfBounds()) {
                    this.alignBottom();
                    if (this.isOutOfBounds()) {
                        this.alignRight();
                        if (this.isOutOfBounds()) {
                            this.alignLeft();
                        }
                    }
                }
                break;
            case 'bottom':
                this.alignBottom();
                if (this.isOutOfBounds()) {
                    this.alignTop();
                    if (this.isOutOfBounds()) {
                        this.alignRight();
                        if (this.isOutOfBounds()) {
                            this.alignLeft();
                        }
                    }
                }
                break;
            case 'left':
                this.alignLeft();
                if (this.isOutOfBounds()) {
                    this.alignRight();
                    if (this.isOutOfBounds()) {
                        this.alignTop();
                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
            case 'right':
                this.alignRight();
                if (this.isOutOfBounds()) {
                    this.alignLeft();
                    if (this.isOutOfBounds()) {
                        this.alignTop();
                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
        }
    }
    getHostOffset() {
        if (this.getOption('appendTo') === 'body' || this.getOption('appendTo') === 'target') {
            let offset = this.el.nativeElement.getBoundingClientRect();
            let targetLeft = offset.left + DomHandler.getWindowScrollLeft();
            let targetTop = offset.top + DomHandler.getWindowScrollTop();
            return { left: targetLeft, top: targetTop };
        }
        else {
            return { left: 0, top: 0 };
        }
    }
    alignRight() {
        this.preAlign('right');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + DomHandler.getOuterWidth(this.el.nativeElement);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.el.nativeElement) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignLeft() {
        this.preAlign('left');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left - DomHandler.getOuterWidth(this.container);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.el.nativeElement) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignTop() {
        this.preAlign('top');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.el.nativeElement) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top - DomHandler.getOuterHeight(this.container);
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignBottom() {
        this.preAlign('bottom');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.el.nativeElement) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top + DomHandler.getOuterHeight(this.el.nativeElement);
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    setOption(option) {
        this._tooltipOptions = Object.assign(Object.assign({}, this._tooltipOptions), option);
    }
    getOption(option) {
        return this._tooltipOptions[option];
    }
    getTarget(el) {
        return DomHandler.hasClass(el, 'p-inputwrapper') ? DomHandler.findSingle(el, 'input') : el;
    }
    preAlign(position) {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';
        let defaultClassName = 'p-tooltip p-component p-tooltip-' + position;
        this.container.className = this.getOption('tooltipStyleClass') ? defaultClassName + ' ' + this.getOption('tooltipStyleClass') : defaultClassName;
    }
    isOutOfBounds() {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = DomHandler.getOuterWidth(this.container);
        let height = DomHandler.getOuterHeight(this.container);
        let viewport = DomHandler.getViewport();
        return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
    }
    onWindowResize(e) {
        this.hide();
    }
    bindDocumentResizeListener() {
        this.zone.runOutsideAngular(() => {
            this.resizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.resizeListener);
        });
    }
    unbindDocumentResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (this.container) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    unbindEvents() {
        if (this.getOption('tooltipEvent') === 'hover') {
            this.el.nativeElement.removeEventListener('mouseenter', this.mouseEnterListener);
            this.el.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener);
            this.el.nativeElement.removeEventListener('click', this.clickListener);
        }
        else if (this.getOption('tooltipEvent') === 'focus') {
            let target = this.getTarget(this.el.nativeElement);
            target.removeEventListener('focus', this.focusListener);
            target.removeEventListener('blur', this.blurListener);
        }
        this.unbindDocumentResizeListener();
    }
    remove() {
        if (this.container && this.container.parentElement) {
            if (this.getOption('appendTo') === 'body')
                document.body.removeChild(this.container);
            else if (this.getOption('appendTo') === 'target')
                this.el.nativeElement.removeChild(this.container);
            else
                DomHandler.removeChild(this.container, this.getOption('appendTo'));
        }
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.unbindContainerMouseleaveListener();
        this.clearTimeouts();
        this.container = null;
        this.scrollHandler = null;
    }
    clearShowTimeout() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }
    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }
    ngOnDestroy() {
        this.unbindEvents();
        if (this.container) {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
    }
}
Tooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Tooltip, deps: [{ token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.PrimeNGConfig }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
Tooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: Tooltip, selector: "[pTooltip]", inputs: { tooltipPosition: "tooltipPosition", tooltipEvent: "tooltipEvent", appendTo: "appendTo", positionStyle: "positionStyle", tooltipStyleClass: "tooltipStyleClass", tooltipZIndex: "tooltipZIndex", escape: "escape", showDelay: "showDelay", hideDelay: "hideDelay", life: "life", positionTop: "positionTop", positionLeft: "positionLeft", autoHide: "autoHide", fitContent: "fitContent", hideOnEscape: "hideOnEscape", text: ["pTooltip", "text"], disabled: ["tooltipDisabled", "disabled"], tooltipOptions: "tooltipOptions" }, host: { listeners: { "document:keydown.escape": "onPressEscape($event)" }, classAttribute: "p-element" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Tooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pTooltip]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.PrimeNGConfig }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }];
    }, propDecorators: { tooltipPosition: [{
                type: Input
            }], tooltipEvent: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], positionStyle: [{
                type: Input
            }], tooltipStyleClass: [{
                type: Input
            }], tooltipZIndex: [{
                type: Input
            }], escape: [{
                type: Input
            }], showDelay: [{
                type: Input
            }], hideDelay: [{
                type: Input
            }], life: [{
                type: Input
            }], positionTop: [{
                type: Input
            }], positionLeft: [{
                type: Input
            }], autoHide: [{
                type: Input
            }], fitContent: [{
                type: Input
            }], hideOnEscape: [{
                type: Input
            }], text: [{
                type: Input,
                args: ['pTooltip']
            }], disabled: [{
                type: Input,
                args: ['tooltipDisabled']
            }], tooltipOptions: [{
                type: Input
            }], onPressEscape: [{
                type: HostListener,
                args: ['document:keydown.escape', ['$event']]
            }] } });
class TooltipModule {
}
TooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: TooltipModule, declarations: [Tooltip], imports: [CommonModule], exports: [Tooltip] });
TooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TooltipModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Tooltip],
                    declarations: [Tooltip]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Tooltip, TooltipModule };
//# sourceMappingURL=primeng-tooltip.mjs.map
