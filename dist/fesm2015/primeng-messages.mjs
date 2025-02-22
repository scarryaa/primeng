import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Optional, Input, ContentChildren, Output, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import * as i1 from 'primeng/api';
import { PrimeTemplate } from 'primeng/api';
import { timer } from 'rxjs';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { CheckIcon } from 'primeng/icons/check';
import { InfoCircleIcon } from 'primeng/icons/infocircle';
import { TimesCircleIcon } from 'primeng/icons/timescircle';
import { ExclamationTriangleIcon } from 'primeng/icons/exclamationtriangle';
import { TimesIcon } from 'primeng/icons/times';

class Messages {
    constructor(messageService, el, cd) {
        this.messageService = messageService;
        this.el = el;
        this.cd = cd;
        this.closable = true;
        this.enableService = true;
        this.escape = true;
        this.showTransitionOptions = '300ms ease-out';
        this.hideTransitionOptions = '200ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.valueChange = new EventEmitter();
        this.timerSubscriptions = [];
    }
    set value(messages) {
        this.messages = messages;
        this.startMessageLifes(this.messages);
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
        if (this.messageService && this.enableService && !this.contentTemplate) {
            this.messageSubscription = this.messageService.messageObserver.subscribe((messages) => {
                if (messages) {
                    if (!Array.isArray(messages)) {
                        messages = [messages];
                    }
                    const filteredMessages = messages.filter((m) => this.key === m.key);
                    this.messages = this.messages ? [...this.messages, ...filteredMessages] : [...filteredMessages];
                    this.startMessageLifes(filteredMessages);
                    this.cd.markForCheck();
                }
            });
            this.clearSubscription = this.messageService.clearObserver.subscribe((key) => {
                if (key) {
                    if (this.key === key) {
                        this.messages = null;
                    }
                }
                else {
                    this.messages = null;
                }
                this.cd.markForCheck();
            });
        }
    }
    hasMessages() {
        let parentEl = this.el.nativeElement.parentElement;
        if (parentEl && parentEl.offsetParent) {
            return this.contentTemplate != null || (this.messages && this.messages.length > 0);
        }
        return false;
    }
    clear() {
        this.messages = [];
        this.valueChange.emit(this.messages);
    }
    removeMessage(i) {
        this.messages = this.messages.filter((msg, index) => index !== i);
        this.valueChange.emit(this.messages);
    }
    get icon() {
        const severity = this.severity || (this.hasMessages() ? this.messages[0].severity : null);
        if (this.hasMessages()) {
            switch (severity) {
                case 'success':
                    return 'pi-check';
                case 'info':
                    return 'pi-info-circle';
                case 'error':
                    return 'pi-times';
                case 'warn':
                    return 'pi-exclamation-triangle';
                default:
                    return 'pi-info-circle';
            }
        }
        return null;
    }
    ngOnDestroy() {
        var _a;
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }
        (_a = this.timerSubscriptions) === null || _a === void 0 ? void 0 : _a.forEach((subscription) => subscription.unsubscribe());
    }
    startMessageLifes(messages) {
        messages === null || messages === void 0 ? void 0 : messages.forEach((message) => message.life && this.startMessageLife(message));
    }
    startMessageLife(message) {
        const timerSubsctiption = timer(message.life).subscribe(() => {
            var _a, _b;
            this.messages = (_a = this.messages) === null || _a === void 0 ? void 0 : _a.filter((msgEl) => msgEl !== message);
            this.timerSubscriptions = (_b = this.timerSubscriptions) === null || _b === void 0 ? void 0 : _b.filter((timerEl) => timerEl !== timerSubsctiption);
            this.valueChange.emit(this.messages);
            this.cd.markForCheck();
        });
        this.timerSubscriptions.push(timerSubsctiption);
    }
}
Messages.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Messages, deps: [{ token: i1.MessageService, optional: true }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Messages.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: Messages, selector: "p-messages", inputs: { value: "value", closable: "closable", style: "style", styleClass: "styleClass", enableService: "enableService", key: "key", escape: "escape", severity: "severity", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { valueChange: "valueChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div class="p-messages p-component" role="alert" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="!contentTemplate; else staticMessage">
                <div
                    *ngFor="let msg of messages; let i = index"
                    [class]="'p-message p-message-' + msg.severity"
                    role="alert"
                    [@messageAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                >
                    <div class="p-message-wrapper">
                        <span *ngIf="msg.icon" [class]="'p-message-icon pi ' + msg.icon"> </span>
                        <span class="p-message-icon" *ngIf="!msg.icon">
                            <ng-container>
                                <CheckIcon *ngIf="msg.severity === 'success'" />
                                <InfoCircleIcon *ngIf="msg.severity === 'info'" />
                                <TimesCircleIcon *ngIf="msg.severity === 'error'" />
                                <ExclamationTriangleIcon *ngIf="msg.severity === 'warn'" />
                            </ng-container>
                        </span>
                        <ng-container *ngIf="!escape; else escapeOut">
                            <span *ngIf="msg.summary" class="p-message-summary" [innerHTML]="msg.summary"></span>
                            <span *ngIf="msg.detail" class="p-message-detail" [innerHTML]="msg.detail"></span>
                        </ng-container>
                        <ng-template #escapeOut>
                            <span *ngIf="msg.summary" class="p-message-summary">{{ msg.summary }}</span>
                            <span *ngIf="msg.detail" class="p-message-detail">{{ msg.detail }}</span>
                        </ng-template>
                        <button class="p-message-close p-link" (click)="removeMessage(i)" *ngIf="closable" type="button" pRipple>
                            <TimesIcon [styleClass]="'p-message-close-icon'" />
                        </button>
                    </div>
                </div>
            </ng-container>
            <ng-template #staticMessage>
                <div [ngClass]="'p-message p-message-' + severity" role="alert">
                    <div class="p-message-wrapper">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </div>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-message-wrapper{display:flex;align-items:center}.p-message-close{display:flex;align-items:center;justify-content:center}.p-message-close.p-link{margin-left:auto;overflow:hidden;position:relative}.p-messages .p-message.ng-animating{overflow:hidden}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return CheckIcon; }), selector: "CheckIcon" }, { kind: "component", type: i0.forwardRef(function () { return InfoCircleIcon; }), selector: "InfoCircleIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesCircleIcon; }), selector: "TimesCircleIcon" }, { kind: "component", type: i0.forwardRef(function () { return ExclamationTriangleIcon; }), selector: "ExclamationTriangleIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }], animations: [
        trigger('messageAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'translateY(-25%)' }), animate('{{showTransitionParams}}')]),
            transition(':leave', [animate('{{hideTransitionParams}}', style({ height: 0, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, opacity: 0 }))])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: Messages, decorators: [{
            type: Component,
            args: [{ selector: 'p-messages', template: `
        <div class="p-messages p-component" role="alert" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="!contentTemplate; else staticMessage">
                <div
                    *ngFor="let msg of messages; let i = index"
                    [class]="'p-message p-message-' + msg.severity"
                    role="alert"
                    [@messageAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                >
                    <div class="p-message-wrapper">
                        <span *ngIf="msg.icon" [class]="'p-message-icon pi ' + msg.icon"> </span>
                        <span class="p-message-icon" *ngIf="!msg.icon">
                            <ng-container>
                                <CheckIcon *ngIf="msg.severity === 'success'" />
                                <InfoCircleIcon *ngIf="msg.severity === 'info'" />
                                <TimesCircleIcon *ngIf="msg.severity === 'error'" />
                                <ExclamationTriangleIcon *ngIf="msg.severity === 'warn'" />
                            </ng-container>
                        </span>
                        <ng-container *ngIf="!escape; else escapeOut">
                            <span *ngIf="msg.summary" class="p-message-summary" [innerHTML]="msg.summary"></span>
                            <span *ngIf="msg.detail" class="p-message-detail" [innerHTML]="msg.detail"></span>
                        </ng-container>
                        <ng-template #escapeOut>
                            <span *ngIf="msg.summary" class="p-message-summary">{{ msg.summary }}</span>
                            <span *ngIf="msg.detail" class="p-message-detail">{{ msg.detail }}</span>
                        </ng-template>
                        <button class="p-message-close p-link" (click)="removeMessage(i)" *ngIf="closable" type="button" pRipple>
                            <TimesIcon [styleClass]="'p-message-close-icon'" />
                        </button>
                    </div>
                </div>
            </ng-container>
            <ng-template #staticMessage>
                <div [ngClass]="'p-message p-message-' + severity" role="alert">
                    <div class="p-message-wrapper">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </div>
                </div>
            </ng-template>
        </div>
    `, animations: [
                        trigger('messageAnimation', [
                            transition(':enter', [style({ opacity: 0, transform: 'translateY(-25%)' }), animate('{{showTransitionParams}}')]),
                            transition(':leave', [animate('{{hideTransitionParams}}', style({ height: 0, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, opacity: 0 }))])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-message-wrapper{display:flex;align-items:center}.p-message-close{display:flex;align-items:center;justify-content:center}.p-message-close.p-link{margin-left:auto;overflow:hidden;position:relative}.p-messages .p-message.ng-animating{overflow:hidden}\n"] }]
        }], ctorParameters: function () {
        return [{ type: i1.MessageService, decorators: [{
                        type: Optional
                    }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }];
    }, propDecorators: { value: [{
                type: Input
            }], closable: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], enableService: [{
                type: Input
            }], key: [{
                type: Input
            }], escape: [{
                type: Input
            }], severity: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], valueChange: [{
                type: Output
            }] } });
class MessagesModule {
}
MessagesModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MessagesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MessagesModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: MessagesModule, declarations: [Messages], imports: [CommonModule, RippleModule, CheckIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon, TimesIcon], exports: [Messages] });
MessagesModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MessagesModule, imports: [CommonModule, RippleModule, CheckIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon, TimesIcon] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: MessagesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule, CheckIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon, TimesIcon],
                    exports: [Messages],
                    declarations: [Messages]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Messages, MessagesModule };
//# sourceMappingURL=primeng-messages.mjs.map
