import * as i4 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import * as i2 from '@angular/common/http';
import { HttpEventType, HttpClientModule } from '@angular/common/http';
import * as i0 from '@angular/core';
import { EventEmitter, PLATFORM_ID, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ContentChildren, ViewChild, NgModule } from '@angular/core';
import * as i3 from 'primeng/api';
import { TranslationKeys, PrimeTemplate, SharedModule } from 'primeng/api';
import * as i5 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import { DomHandler } from 'primeng/dom';
import * as i7 from 'primeng/messages';
import { MessagesModule } from 'primeng/messages';
import * as i6 from 'primeng/progressbar';
import { ProgressBarModule } from 'primeng/progressbar';
import * as i8 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { PlusIcon } from 'primeng/icons/plus';
import { UploadIcon } from 'primeng/icons/upload';
import { TimesIcon } from 'primeng/icons/times';
import * as i1 from '@angular/platform-browser';

class FileUpload {
    constructor(document, platformId, renderer, el, sanitizer, zone, http, cd, config) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.el = el;
        this.sanitizer = sanitizer;
        this.zone = zone;
        this.http = http;
        this.cd = cd;
        this.config = config;
        this.method = 'post';
        this.invalidFileSizeMessageSummary = '{0}: Invalid file size, ';
        this.invalidFileSizeMessageDetail = 'maximum upload size is {0}.';
        this.invalidFileTypeMessageSummary = '{0}: Invalid file type, ';
        this.invalidFileTypeMessageDetail = 'allowed file types: {0}.';
        this.invalidFileLimitMessageDetail = 'limit is {0} at most.';
        this.invalidFileLimitMessageSummary = 'Maximum number of files exceeded, ';
        this.previewWidth = 50;
        this.showUploadButton = true;
        this.showCancelButton = true;
        this.mode = 'advanced';
        this.onBeforeUpload = new EventEmitter();
        this.onSend = new EventEmitter();
        this.onUpload = new EventEmitter();
        this.onError = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onRemove = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onProgress = new EventEmitter();
        this.uploadHandler = new EventEmitter();
        this.onImageError = new EventEmitter();
        this._files = [];
        this.progress = 0;
        this.uploadedFileCount = 0;
    }
    set files(files) {
        this._files = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (this.validate(file)) {
                if (this.isImage(file)) {
                    file.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                }
                this._files.push(files[i]);
            }
        }
    }
    get files() {
        return this._files;
    }
    get basicButtonLabel() {
        if (this.auto || !this.hasFiles()) {
            return this.chooseLabel;
        }
        return this.uploadLabel ?? this.files[0].name;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'file':
                    this.fileTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'toolbar':
                    this.toolbarTemplate = item.template;
                    break;
                case 'chooseicon':
                    this.chooseIconTemplate = item.template;
                    break;
                case 'uploadicon':
                    this.uploadIconTemplate = item.template;
                    break;
                case 'cancelicon':
                    this.cancelIconTemplate = item.template;
                    break;
                default:
                    this.fileTemplate = item.template;
                    break;
            }
        });
    }
    ngOnInit() {
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.cd.markForCheck();
        });
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mode === 'advanced') {
                this.zone.runOutsideAngular(() => {
                    if (this.content) {
                        this.dragOverListener = this.renderer.listen(this.content.nativeElement, 'dragover', this.onDragOver.bind(this));
                    }
                });
            }
        }
    }
    choose() {
        this.advancedFileInput.nativeElement.click();
    }
    onFileSelect(event) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }
        this.msgs = [];
        if (!this.multiple) {
            this.files = [];
        }
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                    }
                    this.files.push(files[i]);
                }
            }
        }
        this.onSelect.emit({ originalEvent: event, files: files, currentFiles: this.files });
        if (this.fileLimit && this.mode == 'advanced') {
            this.checkFileLimit();
        }
        if (this.hasFiles() && this.auto && (!(this.mode === 'advanced') || !this.isFileLimitExceeded())) {
            this.upload();
        }
        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        }
        else {
            this.clearInputElement();
        }
    }
    isFileSelected(file) {
        for (let sFile of this.files) {
            if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) {
                return true;
            }
        }
        return false;
    }
    isIE11() {
        if (isPlatformBrowser(this.platformId)) {
            return !!this.document.defaultView['MSInputMethodContext'] && !!this.document['documentMode'];
        }
    }
    validate(file) {
        this.msgs = [];
        if (this.accept && !this.isFileTypeValid(file)) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
            });
            return false;
        }
        if (this.maxFileSize && file.size > this.maxFileSize) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
            });
            return false;
        }
        return true;
    }
    isFileTypeValid(file) {
        let acceptableTypes = this.accept.split(',').map((type) => type.trim());
        for (let type of acceptableTypes) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();
            if (acceptable) {
                return true;
            }
        }
        return false;
    }
    getTypeClass(fileType) {
        return fileType.substring(0, fileType.indexOf('/'));
    }
    isWildcard(fileType) {
        return fileType.indexOf('*') !== -1;
    }
    getFileExtension(file) {
        return '.' + file.name.split('.').pop();
    }
    isImage(file) {
        return /^image\//.test(file.type);
    }
    onImageLoad(img) {
        window.URL.revokeObjectURL(img.src);
    }
    upload() {
        if (this.customUpload) {
            if (this.fileLimit) {
                this.uploadedFileCount += this.files.length;
            }
            this.uploadHandler.emit({
                files: this.files
            });
            this.cd.markForCheck();
        }
        else {
            this.uploading = true;
            this.msgs = [];
            let formData = new FormData();
            this.onBeforeUpload.emit({
                formData: formData
            });
            for (let i = 0; i < this.files.length; i++) {
                formData.append(this.name, this.files[i], this.files[i].name);
            }
            this.http[this.method](this.url, formData, {
                headers: this.headers,
                reportProgress: true,
                observe: 'events',
                withCredentials: this.withCredentials
            }).subscribe((event) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        this.onSend.emit({
                            originalEvent: event,
                            formData: formData
                        });
                        break;
                    case HttpEventType.Response:
                        this.uploading = false;
                        this.progress = 0;
                        if (event['status'] >= 200 && event['status'] < 300) {
                            if (this.fileLimit) {
                                this.uploadedFileCount += this.files.length;
                            }
                            this.onUpload.emit({ originalEvent: event, files: this.files });
                        }
                        else {
                            this.onError.emit({ files: this.files });
                        }
                        this.clear();
                        break;
                    case HttpEventType.UploadProgress: {
                        if (event['loaded']) {
                            this.progress = Math.round((event['loaded'] * 100) / event['total']);
                        }
                        this.onProgress.emit({ originalEvent: event, progress: this.progress });
                        break;
                    }
                }
                this.cd.markForCheck();
            }, (error) => {
                this.uploading = false;
                this.onError.emit({ files: this.files, error: error });
            });
        }
    }
    clear() {
        this.files = [];
        this.onClear.emit();
        this.clearInputElement();
        this.cd.markForCheck();
    }
    remove(event, index) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this.files[index] });
        this.files.splice(index, 1);
        this.checkFileLimit();
    }
    isFileLimitExceeded() {
        if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focus) {
            this.focus = false;
        }
        return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
    }
    isChooseDisabled() {
        return this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount;
    }
    checkFileLimit() {
        this.msgs = [];
        if (this.isFileLimitExceeded()) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileLimitMessageSummary.replace('{0}', this.fileLimit.toString()),
                detail: this.invalidFileLimitMessageDetail.replace('{0}', this.fileLimit.toString())
            });
        }
        else {
            this.msgs = [];
        }
    }
    clearInputElement() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.advancedFileInput.nativeElement.value = '';
        }
        if (this.basicFileInput && this.basicFileInput.nativeElement) {
            this.basicFileInput.nativeElement.value = '';
        }
    }
    clearIEInput() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            this.advancedFileInput.nativeElement.value = '';
        }
    }
    hasFiles() {
        return this.files && this.files.length > 0;
    }
    onDragEnter(e) {
        if (!this.disabled) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onDragOver(e) {
        if (!this.disabled) {
            DomHandler.addClass(this.content.nativeElement, 'p-fileupload-highlight');
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onDragLeave(event) {
        if (!this.disabled) {
            DomHandler.removeClass(this.content.nativeElement, 'p-fileupload-highlight');
        }
    }
    onDrop(event) {
        if (!this.disabled) {
            DomHandler.removeClass(this.content.nativeElement, 'p-fileupload-highlight');
            event.stopPropagation();
            event.preventDefault();
            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple || (files && files.length === 1);
            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }
    onFocus() {
        this.focus = true;
    }
    onBlur() {
        this.focus = false;
    }
    formatSize(bytes) {
        if (bytes == 0) {
            return '0 B';
        }
        let k = 1000, dm = 3, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    onBasicUploaderClick() {
        if (this.hasFiles())
            this.upload();
        else
            this.basicFileInput.nativeElement.click();
    }
    onBasicKeydown(event) {
        switch (event.code) {
            case 'Space':
            case 'Enter':
                this.onBasicUploaderClick();
                event.preventDefault();
                break;
        }
    }
    imageError(event) {
        this.onImageError.emit(event);
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    get chooseButtonLabel() {
        return this.chooseLabel || this.config.getTranslation(TranslationKeys.CHOOSE);
    }
    get uploadButtonLabel() {
        return this.uploadLabel || this.config.getTranslation(TranslationKeys.UPLOAD);
    }
    get cancelButtonLabel() {
        return this.cancelLabel || this.config.getTranslation(TranslationKeys.CANCEL);
    }
    ngOnDestroy() {
        if (this.content && this.content.nativeElement) {
            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }
        }
        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }
}
FileUpload.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: FileUpload, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.DomSanitizer }, { token: i0.NgZone }, { token: i2.HttpClient }, { token: i0.ChangeDetectorRef }, { token: i3.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
FileUpload.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: FileUpload, selector: "p-fileUpload", inputs: { name: "name", url: "url", method: "method", multiple: "multiple", accept: "accept", disabled: "disabled", auto: "auto", withCredentials: "withCredentials", maxFileSize: "maxFileSize", invalidFileSizeMessageSummary: "invalidFileSizeMessageSummary", invalidFileSizeMessageDetail: "invalidFileSizeMessageDetail", invalidFileTypeMessageSummary: "invalidFileTypeMessageSummary", invalidFileTypeMessageDetail: "invalidFileTypeMessageDetail", invalidFileLimitMessageDetail: "invalidFileLimitMessageDetail", invalidFileLimitMessageSummary: "invalidFileLimitMessageSummary", style: "style", styleClass: "styleClass", previewWidth: "previewWidth", chooseLabel: "chooseLabel", uploadLabel: "uploadLabel", cancelLabel: "cancelLabel", chooseIcon: "chooseIcon", uploadIcon: "uploadIcon", cancelIcon: "cancelIcon", showUploadButton: "showUploadButton", showCancelButton: "showCancelButton", mode: "mode", headers: "headers", customUpload: "customUpload", fileLimit: "fileLimit", uploadStyleClass: "uploadStyleClass", cancelStyleClass: "cancelStyleClass", removeStyleClass: "removeStyleClass", chooseStyleClass: "chooseStyleClass", files: "files" }, outputs: { onBeforeUpload: "onBeforeUpload", onSend: "onSend", onUpload: "onUpload", onError: "onError", onClear: "onClear", onRemove: "onRemove", onSelect: "onSelect", onProgress: "onProgress", uploadHandler: "uploadHandler", onImageError: "onImageError" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "advancedFileInput", first: true, predicate: ["advancedfileinput"], descendants: true }, { propertyName: "basicFileInput", first: true, predicate: ["basicfileinput"], descendants: true }, { propertyName: "content", first: true, predicate: ["content"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="'p-fileupload p-fileupload-advanced p-component'" [ngStyle]="style" [class]="styleClass" *ngIf="mode === 'advanced'">
            <div class="p-fileupload-buttonbar">
                <span
                    class="p-button p-component p-fileupload-choose"
                    [ngClass]="{ 'p-focus': focus, 'p-disabled': disabled || isChooseDisabled() }"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    pRipple
                    (click)="choose()"
                    (keydown.enter)="choose()"
                    tabindex="0"
                    [class]="chooseStyleClass"
                >
                    <input #advancedfileinput type="file" (change)="onFileSelect($event)" [multiple]="multiple" [accept]="accept" [disabled]="disabled || isChooseDisabled()" [attr.title]="''" />
                    <span *ngIf="chooseIcon" [ngClass]="'p-button-icon p-button-icon-left'" [class]="chooseIcon"></span>
                    <ng-container *ngIf="!chooseIcon">
                        <PlusIcon *ngIf="!chooseIconTemplate" />
                        <span *ngIf="chooseIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="chooseIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                    <span class="p-button-label">{{ chooseButtonLabel }}</span>
                </span>

                <p-button *ngIf="!auto && showUploadButton" type="button" [label]="uploadButtonLabel" (onClick)="upload()" [disabled]="!hasFiles() || isFileLimitExceeded()" [styleClass]="uploadStyleClass">
                    <span *ngIf="uploadIcon" [ngClass]="uploadIcon"></span>
                    <ng-container *ngIf="!uploadIcon">
                        <UploadIcon *ngIf="!uploadIconTemplate" [styleClass]="'p-button-icon p-button-icon-left'" />
                        <span *ngIf="uploadIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="uploadIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </p-button>
                <p-button *ngIf="!auto && showCancelButton" type="button" [label]="cancelButtonLabel" (onClick)="clear()" [disabled]="!hasFiles() || uploading" [styleClass]="cancelStyleClass">
                    <span *ngIf="cancelIcon" [ngClass]="cancelIcon"></span>
                    <ng-container *ngIf="!cancelIcon">
                        <TimesIcon *ngIf="!cancelIconTemplate" [styleClass]="'p-button-icon p-button-icon-left'" />
                        <span *ngIf="cancelIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="cancelIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </p-button>

                <ng-container *ngTemplateOutlet="toolbarTemplate"></ng-container>
            </div>
            <div #content class="p-fileupload-content" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
                <p-progressBar [value]="progress" [showValue]="false" *ngIf="hasFiles()"></p-progressBar>

                <p-messages [value]="msgs" [enableService]="false"></p-messages>

                <div class="p-fileupload-files" *ngIf="hasFiles()">
                    <div *ngIf="!fileTemplate">
                        <div class="p-fileupload-row" *ngFor="let file of files; let i = index">
                            <div><img [src]="file.objectURL" *ngIf="isImage(file)" [width]="previewWidth" (error)="imageError($event)" /></div>
                            <div class="p-fileupload-filename">{{ file.name }}</div>
                            <div>{{ formatSize(file.size) }}</div>
                            <div>
                                <button type="button" pButton (click)="remove($event, i)" [disabled]="uploading" class="p-button-icon-only" [class]="removeStyleClass">
                                    <TimesIcon *ngIf="!cancelIconTemplate" />
                                    <ng-template *ngTemplateOutlet="cancelIconTemplate"></ng-template>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div *ngIf="fileTemplate">
                        <ng-template ngFor [ngForOf]="files" [ngForTemplate]="fileTemplate"></ng-template>
                    </div>
                </div>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: files }"></ng-container>
            </div>
        </div>
        <div class="p-fileupload p-fileupload-basic p-component" *ngIf="mode === 'basic'">
            <p-messages [value]="msgs" [enableService]="false"></p-messages>
            <span
                [ngClass]="{ 'p-button p-component p-fileupload-choose': true, 'p-button-icon-only': !basicButtonLabel, 'p-fileupload-choose-selected': hasFiles(), 'p-focus': focus, 'p-disabled': disabled }"
                [ngStyle]="style"
                [class]="styleClass"
                (mouseup)="onBasicUploaderClick()"
                (keydown)="onBasicKeydown($event)"
                tabindex="0"
                pRipple
            >
                <ng-container *ngIf="hasFiles() && !auto; else chooseSection">
                    <span *ngIf="uploadIcon" class="p-button-icon p-button-icon-left" [ngClass]="uploadIcon"></span>
                    <ng-container *ngIf="!uploadIcon">
                        <UploadIcon *ngIf="!uploadIconTemplate" [styleClass]="'p-button-icon p-button-icon-left'" />
                        <span *ngIf="uploadIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="uploadIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
                <ng-template #chooseSection>
                    <span *ngIf="chooseIcon" class="p-button-icon p-button-icon-left pi" [ngClass]="chooseIcon"></span>
                    <ng-container *ngIf="!chooseIcon">
                        <PlusIcon [styleClass]="'p-button-icon p-button-icon-left pi'" *ngIf="!chooseIconTemplate" />
                        <span *ngIf="chooseIconTemplate" class="p-button-icon p-button-icon-left pi">
                            <ng-template *ngTemplateOutlet="chooseIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-template>
                <span *ngIf="basicButtonLabel" class="p-button-label">{{ basicButtonLabel }}</span>
                <input #basicfileinput type="file" [accept]="accept" [multiple]="multiple" [disabled]="disabled" (change)="onFileSelect($event)" *ngIf="!hasFiles()" (focus)="onFocus()" (blur)="onBlur()" />
            </span>
        </div>
    `, isInline: true, styles: [".p-fileupload-content{position:relative}.p-fileupload-row{display:flex;align-items:center}.p-fileupload-row>div{flex:1 1 auto;width:25%}.p-fileupload-row>div:last-child{text-align:right}.p-fileupload-content .p-progressbar{width:100%;position:absolute;top:0;left:0}.p-button.p-fileupload-choose{position:relative;overflow:hidden}.p-button.p-fileupload-choose input[type=file],.p-fileupload-choose.p-fileupload-choose-selected input[type=file]{display:none}.p-fluid .p-fileupload .p-button{width:auto}.p-fileupload-filename{word-break:break-all}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i4.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i5.ButtonDirective; }), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: i0.forwardRef(function () { return i5.Button; }), selector: "p-button", inputs: ["type", "iconPos", "icon", "badge", "label", "disabled", "loading", "loadingIcon", "style", "styleClass", "badgeClass", "ariaLabel"], outputs: ["onClick", "onFocus", "onBlur"] }, { kind: "component", type: i0.forwardRef(function () { return i6.ProgressBar; }), selector: "p-progressBar", inputs: ["value", "showValue", "style", "styleClass", "unit", "mode", "color"] }, { kind: "component", type: i0.forwardRef(function () { return i7.Messages; }), selector: "p-messages", inputs: ["value", "closable", "style", "styleClass", "enableService", "key", "escape", "severity", "showTransitionOptions", "hideTransitionOptions"], outputs: ["valueChange"] }, { kind: "directive", type: i0.forwardRef(function () { return i8.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return PlusIcon; }), selector: "PlusIcon" }, { kind: "component", type: i0.forwardRef(function () { return UploadIcon; }), selector: "UploadIcon" }, { kind: "component", type: i0.forwardRef(function () { return TimesIcon; }), selector: "TimesIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: FileUpload, decorators: [{
            type: Component,
            args: [{ selector: 'p-fileUpload', template: `
        <div [ngClass]="'p-fileupload p-fileupload-advanced p-component'" [ngStyle]="style" [class]="styleClass" *ngIf="mode === 'advanced'">
            <div class="p-fileupload-buttonbar">
                <span
                    class="p-button p-component p-fileupload-choose"
                    [ngClass]="{ 'p-focus': focus, 'p-disabled': disabled || isChooseDisabled() }"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    pRipple
                    (click)="choose()"
                    (keydown.enter)="choose()"
                    tabindex="0"
                    [class]="chooseStyleClass"
                >
                    <input #advancedfileinput type="file" (change)="onFileSelect($event)" [multiple]="multiple" [accept]="accept" [disabled]="disabled || isChooseDisabled()" [attr.title]="''" />
                    <span *ngIf="chooseIcon" [ngClass]="'p-button-icon p-button-icon-left'" [class]="chooseIcon"></span>
                    <ng-container *ngIf="!chooseIcon">
                        <PlusIcon *ngIf="!chooseIconTemplate" />
                        <span *ngIf="chooseIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="chooseIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                    <span class="p-button-label">{{ chooseButtonLabel }}</span>
                </span>

                <p-button *ngIf="!auto && showUploadButton" type="button" [label]="uploadButtonLabel" (onClick)="upload()" [disabled]="!hasFiles() || isFileLimitExceeded()" [styleClass]="uploadStyleClass">
                    <span *ngIf="uploadIcon" [ngClass]="uploadIcon"></span>
                    <ng-container *ngIf="!uploadIcon">
                        <UploadIcon *ngIf="!uploadIconTemplate" [styleClass]="'p-button-icon p-button-icon-left'" />
                        <span *ngIf="uploadIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="uploadIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </p-button>
                <p-button *ngIf="!auto && showCancelButton" type="button" [label]="cancelButtonLabel" (onClick)="clear()" [disabled]="!hasFiles() || uploading" [styleClass]="cancelStyleClass">
                    <span *ngIf="cancelIcon" [ngClass]="cancelIcon"></span>
                    <ng-container *ngIf="!cancelIcon">
                        <TimesIcon *ngIf="!cancelIconTemplate" [styleClass]="'p-button-icon p-button-icon-left'" />
                        <span *ngIf="cancelIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="cancelIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </p-button>

                <ng-container *ngTemplateOutlet="toolbarTemplate"></ng-container>
            </div>
            <div #content class="p-fileupload-content" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
                <p-progressBar [value]="progress" [showValue]="false" *ngIf="hasFiles()"></p-progressBar>

                <p-messages [value]="msgs" [enableService]="false"></p-messages>

                <div class="p-fileupload-files" *ngIf="hasFiles()">
                    <div *ngIf="!fileTemplate">
                        <div class="p-fileupload-row" *ngFor="let file of files; let i = index">
                            <div><img [src]="file.objectURL" *ngIf="isImage(file)" [width]="previewWidth" (error)="imageError($event)" /></div>
                            <div class="p-fileupload-filename">{{ file.name }}</div>
                            <div>{{ formatSize(file.size) }}</div>
                            <div>
                                <button type="button" pButton (click)="remove($event, i)" [disabled]="uploading" class="p-button-icon-only" [class]="removeStyleClass">
                                    <TimesIcon *ngIf="!cancelIconTemplate" />
                                    <ng-template *ngTemplateOutlet="cancelIconTemplate"></ng-template>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div *ngIf="fileTemplate">
                        <ng-template ngFor [ngForOf]="files" [ngForTemplate]="fileTemplate"></ng-template>
                    </div>
                </div>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: files }"></ng-container>
            </div>
        </div>
        <div class="p-fileupload p-fileupload-basic p-component" *ngIf="mode === 'basic'">
            <p-messages [value]="msgs" [enableService]="false"></p-messages>
            <span
                [ngClass]="{ 'p-button p-component p-fileupload-choose': true, 'p-button-icon-only': !basicButtonLabel, 'p-fileupload-choose-selected': hasFiles(), 'p-focus': focus, 'p-disabled': disabled }"
                [ngStyle]="style"
                [class]="styleClass"
                (mouseup)="onBasicUploaderClick()"
                (keydown)="onBasicKeydown($event)"
                tabindex="0"
                pRipple
            >
                <ng-container *ngIf="hasFiles() && !auto; else chooseSection">
                    <span *ngIf="uploadIcon" class="p-button-icon p-button-icon-left" [ngClass]="uploadIcon"></span>
                    <ng-container *ngIf="!uploadIcon">
                        <UploadIcon *ngIf="!uploadIconTemplate" [styleClass]="'p-button-icon p-button-icon-left'" />
                        <span *ngIf="uploadIconTemplate" class="p-button-icon p-button-icon-left">
                            <ng-template *ngTemplateOutlet="uploadIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-container>
                <ng-template #chooseSection>
                    <span *ngIf="chooseIcon" class="p-button-icon p-button-icon-left pi" [ngClass]="chooseIcon"></span>
                    <ng-container *ngIf="!chooseIcon">
                        <PlusIcon [styleClass]="'p-button-icon p-button-icon-left pi'" *ngIf="!chooseIconTemplate" />
                        <span *ngIf="chooseIconTemplate" class="p-button-icon p-button-icon-left pi">
                            <ng-template *ngTemplateOutlet="chooseIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </ng-template>
                <span *ngIf="basicButtonLabel" class="p-button-label">{{ basicButtonLabel }}</span>
                <input #basicfileinput type="file" [accept]="accept" [multiple]="multiple" [disabled]="disabled" (change)="onFileSelect($event)" *ngIf="!hasFiles()" (focus)="onFocus()" (blur)="onBlur()" />
            </span>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-fileupload-content{position:relative}.p-fileupload-row{display:flex;align-items:center}.p-fileupload-row>div{flex:1 1 auto;width:25%}.p-fileupload-row>div:last-child{text-align:right}.p-fileupload-content .p-progressbar{width:100%;position:absolute;top:0;left:0}.p-button.p-fileupload-choose{position:relative;overflow:hidden}.p-button.p-fileupload-choose input[type=file],.p-fileupload-choose.p-fileupload-choose-selected input[type=file]{display:none}.p-fluid .p-fileupload .p-button{width:auto}.p-fileupload-filename{word-break:break-all}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.DomSanitizer }, { type: i0.NgZone }, { type: i2.HttpClient }, { type: i0.ChangeDetectorRef }, { type: i3.PrimeNGConfig }]; }, propDecorators: { name: [{
                type: Input
            }], url: [{
                type: Input
            }], method: [{
                type: Input
            }], multiple: [{
                type: Input
            }], accept: [{
                type: Input
            }], disabled: [{
                type: Input
            }], auto: [{
                type: Input
            }], withCredentials: [{
                type: Input
            }], maxFileSize: [{
                type: Input
            }], invalidFileSizeMessageSummary: [{
                type: Input
            }], invalidFileSizeMessageDetail: [{
                type: Input
            }], invalidFileTypeMessageSummary: [{
                type: Input
            }], invalidFileTypeMessageDetail: [{
                type: Input
            }], invalidFileLimitMessageDetail: [{
                type: Input
            }], invalidFileLimitMessageSummary: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], previewWidth: [{
                type: Input
            }], chooseLabel: [{
                type: Input
            }], uploadLabel: [{
                type: Input
            }], cancelLabel: [{
                type: Input
            }], chooseIcon: [{
                type: Input
            }], uploadIcon: [{
                type: Input
            }], cancelIcon: [{
                type: Input
            }], showUploadButton: [{
                type: Input
            }], showCancelButton: [{
                type: Input
            }], mode: [{
                type: Input
            }], headers: [{
                type: Input
            }], customUpload: [{
                type: Input
            }], fileLimit: [{
                type: Input
            }], uploadStyleClass: [{
                type: Input
            }], cancelStyleClass: [{
                type: Input
            }], removeStyleClass: [{
                type: Input
            }], chooseStyleClass: [{
                type: Input
            }], onBeforeUpload: [{
                type: Output
            }], onSend: [{
                type: Output
            }], onUpload: [{
                type: Output
            }], onError: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onRemove: [{
                type: Output
            }], onSelect: [{
                type: Output
            }], onProgress: [{
                type: Output
            }], uploadHandler: [{
                type: Output
            }], onImageError: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], advancedFileInput: [{
                type: ViewChild,
                args: ['advancedfileinput']
            }], basicFileInput: [{
                type: ViewChild,
                args: ['basicfileinput']
            }], content: [{
                type: ViewChild,
                args: ['content']
            }], files: [{
                type: Input
            }] } });
class FileUploadModule {
}
FileUploadModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: FileUploadModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FileUploadModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: FileUploadModule, declarations: [FileUpload], imports: [CommonModule, HttpClientModule, SharedModule, ButtonModule, ProgressBarModule, MessagesModule, RippleModule, PlusIcon, UploadIcon, TimesIcon], exports: [FileUpload, SharedModule, ButtonModule, ProgressBarModule, MessagesModule] });
FileUploadModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: FileUploadModule, imports: [CommonModule, HttpClientModule, SharedModule, ButtonModule, ProgressBarModule, MessagesModule, RippleModule, PlusIcon, UploadIcon, TimesIcon, SharedModule, ButtonModule, ProgressBarModule, MessagesModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: FileUploadModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, HttpClientModule, SharedModule, ButtonModule, ProgressBarModule, MessagesModule, RippleModule, PlusIcon, UploadIcon, TimesIcon],
                    exports: [FileUpload, SharedModule, ButtonModule, ProgressBarModule, MessagesModule],
                    declarations: [FileUpload]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { FileUpload, FileUploadModule };
//# sourceMappingURL=primeng-fileupload.mjs.map
