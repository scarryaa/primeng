import { NgModule, Component, Input, Output, ContentChildren, EventEmitter, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { AngleDoubleDownIcon } from 'primeng/icons/angledoubledown';
import { AngleDoubleLeftIcon } from 'primeng/icons/angledoubleleft';
import { AngleDoubleRightIcon } from 'primeng/icons/angledoubleright';
import { AngleDoubleUpIcon } from 'primeng/icons/angledoubleup';
import { AngleDownIcon } from 'primeng/icons/angledown';
import { AngleLeftIcon } from 'primeng/icons/angleleft';
import { AngleRightIcon } from 'primeng/icons/angleright';
import { AngleUpIcon } from 'primeng/icons/angleup';
import { SearchIcon } from 'primeng/icons/search';
import { HomeIcon } from 'primeng/icons/home';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/button";
import * as i4 from "primeng/ripple";
import * as i5 from "@angular/cdk/drag-drop";
export class PickList {
    constructor(document, platformId, renderer, el, cd, filterService) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.el = el;
        this.cd = cd;
        this.filterService = filterService;
        this.trackBy = (index, item) => item;
        this.showSourceFilter = true;
        this.showTargetFilter = true;
        this.metaKeySelection = true;
        this.dragdrop = false;
        this.showSourceControls = true;
        this.showTargetControls = true;
        this.disabled = false;
        this.filterMatchMode = 'contains';
        this.keepSelection = false;
        this.onMoveToSource = new EventEmitter();
        this.onMoveAllToSource = new EventEmitter();
        this.onMoveAllToTarget = new EventEmitter();
        this.onMoveToTarget = new EventEmitter();
        this.onSourceReorder = new EventEmitter();
        this.onTargetReorder = new EventEmitter();
        this.onSourceSelect = new EventEmitter();
        this.onTargetSelect = new EventEmitter();
        this.onSourceFilter = new EventEmitter();
        this.onTargetFilter = new EventEmitter();
        this._breakpoint = '960px';
        this.selectedItemsSource = [];
        this.selectedItemsTarget = [];
        this.id = UniqueComponentId();
        this.SOURCE_LIST = -1;
        this.TARGET_LIST = 1;
        this.window = this.document.defaultView;
    }
    get breakpoint() {
        return this._breakpoint;
    }
    set breakpoint(value) {
        if (value !== this._breakpoint) {
            this._breakpoint = value;
            if (isPlatformBrowser(this.platformId)) {
                this.destroyMedia();
                this.initMedia();
            }
        }
    }
    ngOnInit() {
        if (this.responsive) {
            this.createStyle();
            this.initMedia();
        }
        if (this.filterBy) {
            this.sourceFilterOptions = {
                filter: (value) => this.filterSource(value),
                reset: () => this.resetSourceFilter()
            };
            this.targetFilterOptions = {
                filter: (value) => this.filterTarget(value),
                reset: () => this.resetTargetFilter()
            };
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'sourceHeader':
                    this.sourceHeaderTemplate = item.template;
                    break;
                case 'targetHeader':
                    this.targetHeaderTemplate = item.template;
                    break;
                case 'sourceFilter':
                    this.sourceFilterTemplate = item.template;
                    break;
                case 'targetFilter':
                    this.targetFilterTemplate = item.template;
                    break;
                case 'emptymessagesource':
                    this.emptyMessageSourceTemplate = item.template;
                    break;
                case 'emptyfiltermessagesource':
                    this.emptyFilterMessageSourceTemplate = item.template;
                    break;
                case 'emptymessagetarget':
                    this.emptyMessageTargetTemplate = item.template;
                    break;
                case 'emptyfiltermessagetarget':
                    this.emptyFilterMessageTargetTemplate = item.template;
                    break;
                case 'moveupicon':
                    this.moveUpIconTemplate = item.template;
                    break;
                case 'movetopicon':
                    this.moveTopIconTemplate = item.template;
                    break;
                case 'movedownicon':
                    this.moveDownIconTemplate = item.template;
                    break;
                case 'movebottomicon':
                    this.moveBottomIconTemplate = item.template;
                    break;
                case 'movetotargeticon':
                    this.moveToTargetIconTemplate = item.template;
                    break;
                case 'movealltotargeticon':
                    this.moveAllToTargetIconTemplate = item.template;
                    break;
                case 'movetosourceicon':
                    this.moveToSourceIconTemplate = item.template;
                    break;
                case 'movealltosourceicon':
                    this.moveAllToSourceIconTemplate = item.template;
                    break;
                case 'targetfiltericon':
                    this.targetFilterIconTemplate = item.template;
                    break;
                case 'sourcefiltericon':
                    this.sourceFilterIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewChecked() {
        if (this.movedUp || this.movedDown) {
            let listItems = DomHandler.find(this.reorderedListElement, 'li.p-highlight');
            let listItem;
            if (this.movedUp)
                listItem = listItems[0];
            else
                listItem = listItems[listItems.length - 1];
            DomHandler.scrollInView(this.reorderedListElement, listItem);
            this.movedUp = false;
            this.movedDown = false;
            this.reorderedListElement = null;
        }
    }
    onItemClick(event, item, selectedItems, callback) {
        if (this.disabled) {
            return;
        }
        let index = this.findIndexInSelection(item, selectedItems);
        let selected = index != -1;
        let metaSelection = this.itemTouched ? false : this.metaKeySelection;
        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey || event.shiftKey;
            if (selected && metaKey) {
                selectedItems.splice(index, 1);
            }
            else {
                if (!metaKey) {
                    selectedItems.length = 0;
                }
                selectedItems.push(item);
            }
        }
        else {
            if (selected)
                selectedItems.splice(index, 1);
            else
                selectedItems.push(item);
        }
        callback.emit({ originalEvent: event, items: selectedItems });
        this.itemTouched = false;
    }
    onSourceItemDblClick() {
        if (this.disabled) {
            return;
        }
        this.moveRight();
    }
    onTargetItemDblClick() {
        if (this.disabled) {
            return;
        }
        this.moveLeft();
    }
    onFilter(event, listType) {
        let query = event.target.value;
        if (listType === this.SOURCE_LIST)
            this.filterSource(query);
        else if (listType === this.TARGET_LIST)
            this.filterTarget(query);
    }
    filterSource(value = '') {
        this.filterValueSource = value.trim().toLocaleLowerCase(this.filterLocale);
        this.filter(this.source, this.SOURCE_LIST);
    }
    filterTarget(value = '') {
        this.filterValueTarget = value.trim().toLocaleLowerCase(this.filterLocale);
        this.filter(this.target, this.TARGET_LIST);
    }
    filter(data, listType) {
        let searchFields = this.filterBy.split(',');
        if (listType === this.SOURCE_LIST) {
            this.visibleOptionsSource = this.filterService.filter(data, searchFields, this.filterValueSource, this.filterMatchMode, this.filterLocale);
            this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
        }
        else if (listType === this.TARGET_LIST) {
            this.visibleOptionsTarget = this.filterService.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode, this.filterLocale);
            this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
        }
    }
    isItemVisible(item, listType) {
        if (listType == this.SOURCE_LIST)
            return this.isVisibleInList(this.visibleOptionsSource, item, this.filterValueSource);
        else
            return this.isVisibleInList(this.visibleOptionsTarget, item, this.filterValueTarget);
    }
    isEmpty(listType) {
        if (listType == this.SOURCE_LIST)
            return this.filterValueSource ? !this.visibleOptionsSource || this.visibleOptionsSource.length === 0 : !this.source || this.source.length === 0;
        else
            return this.filterValueTarget ? !this.visibleOptionsTarget || this.visibleOptionsTarget.length === 0 : !this.target || this.target.length === 0;
    }
    isVisibleInList(data, item, filterValue) {
        if (filterValue && filterValue.trim().length) {
            for (let i = 0; i < data.length; i++) {
                if (item == data[i]) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }
    onItemTouchEnd() {
        if (this.disabled) {
            return;
        }
        this.itemTouched = true;
    }
    sortByIndexInList(items, list) {
        return items.sort((item1, item2) => ObjectUtils.findIndexInList(item1, list) - ObjectUtils.findIndexInList(item2, list));
    }
    moveUp(listElement, list, selectedItems, callback, listType) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, list);
                if (selectedItemIndex != 0) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex - 1];
                    list[selectedItemIndex - 1] = movedItem;
                    list[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST)))
                this.filter(list, listType);
            this.movedUp = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
        }
    }
    moveTop(listElement, list, selectedItems, callback, listType) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, list);
                if (selectedItemIndex != 0) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.unshift(movedItem);
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST)))
                this.filter(list, listType);
            listElement.scrollTop = 0;
            callback.emit({ items: selectedItems });
        }
    }
    moveDown(listElement, list, selectedItems, callback, listType) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, list);
                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex + 1];
                    list[selectedItemIndex + 1] = movedItem;
                    list[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST)))
                this.filter(list, listType);
            this.movedDown = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
        }
    }
    moveBottom(listElement, list, selectedItems, callback, listType) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, list);
                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.push(movedItem);
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST)))
                this.filter(list, listType);
            listElement.scrollTop = listElement.scrollHeight;
            callback.emit({ items: selectedItems });
        }
    }
    moveRight() {
        if (this.selectedItemsSource && this.selectedItemsSource.length) {
            for (let i = 0; i < this.selectedItemsSource.length; i++) {
                let selectedItem = this.selectedItemsSource[i];
                if (ObjectUtils.findIndexInList(selectedItem, this.target) == -1) {
                    this.target.push(this.source.splice(ObjectUtils.findIndexInList(selectedItem, this.source), 1)[0]);
                    if (this.visibleOptionsSource)
                        this.visibleOptionsSource.splice(ObjectUtils.findIndexInList(selectedItem, this.visibleOptionsSource), 1);
                }
            }
            this.onMoveToTarget.emit({
                items: this.selectedItemsSource
            });
            if (this.keepSelection) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...this.selectedItemsSource];
            }
            this.selectedItemsSource = [];
            if (this.filterValueTarget) {
                this.filter(this.target, this.TARGET_LIST);
            }
        }
    }
    moveAllRight() {
        if (this.source) {
            let movedItems = [];
            for (let i = 0; i < this.source.length; i++) {
                if (this.isItemVisible(this.source[i], this.SOURCE_LIST)) {
                    let removedItem = this.source.splice(i, 1)[0];
                    this.target.push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToTarget.emit({
                items: movedItems
            });
            if (this.keepSelection) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...this.selectedItemsSource];
            }
            this.selectedItemsSource = [];
            if (this.filterValueTarget) {
                this.filter(this.target, this.TARGET_LIST);
            }
            this.visibleOptionsSource = [];
        }
    }
    moveLeft() {
        if (this.selectedItemsTarget && this.selectedItemsTarget.length) {
            for (let i = 0; i < this.selectedItemsTarget.length; i++) {
                let selectedItem = this.selectedItemsTarget[i];
                if (ObjectUtils.findIndexInList(selectedItem, this.source) == -1) {
                    this.source.push(this.target.splice(ObjectUtils.findIndexInList(selectedItem, this.target), 1)[0]);
                    if (this.visibleOptionsTarget)
                        this.visibleOptionsTarget.splice(ObjectUtils.findIndexInList(selectedItem, this.visibleOptionsTarget), 1)[0];
                }
            }
            this.onMoveToSource.emit({
                items: this.selectedItemsTarget
            });
            if (this.keepSelection) {
                this.selectedItemsSource = [...this.selectedItemsSource, ...this.selectedItemsTarget];
            }
            this.selectedItemsTarget = [];
            if (this.filterValueSource) {
                this.filter(this.source, this.SOURCE_LIST);
            }
        }
    }
    moveAllLeft() {
        if (this.target) {
            let movedItems = [];
            for (let i = 0; i < this.target.length; i++) {
                if (this.isItemVisible(this.target[i], this.TARGET_LIST)) {
                    let removedItem = this.target.splice(i, 1)[0];
                    this.source.push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToSource.emit({
                items: movedItems
            });
            if (this.keepSelection) {
                this.selectedItemsSource = [...this.selectedItemsSource, ...this.selectedItemsTarget];
            }
            this.selectedItemsTarget = [];
            if (this.filterValueSource) {
                this.filter(this.source, this.SOURCE_LIST);
            }
            this.visibleOptionsTarget = [];
        }
    }
    isSelected(item, selectedItems) {
        return this.findIndexInSelection(item, selectedItems) != -1;
    }
    findIndexInSelection(item, selectedItems) {
        return ObjectUtils.findIndexInList(item, selectedItems);
    }
    onDrop(event, listType) {
        let isTransfer = event.previousContainer !== event.container;
        let dropIndexes = this.getDropIndexes(event.previousIndex, event.currentIndex, listType, isTransfer, event.item.data);
        if (listType === this.SOURCE_LIST) {
            if (isTransfer) {
                transferArrayItem(event.previousContainer.data, event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                let selectedItemIndex = ObjectUtils.findIndexInList(event.item.data, this.selectedItemsTarget);
                if (selectedItemIndex != -1) {
                    this.selectedItemsTarget.splice(selectedItemIndex, 1);
                    if (this.keepSelection) {
                        this.selectedItemsTarget.push(event.item.data);
                    }
                }
                if (this.visibleOptionsTarget)
                    this.visibleOptionsTarget.splice(event.previousIndex, 1);
                this.onMoveToSource.emit({ items: [event.item.data] });
            }
            else {
                moveItemInArray(event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                this.onSourceReorder.emit({ items: [event.item.data] });
            }
            if (this.filterValueSource) {
                this.filter(this.source, this.SOURCE_LIST);
            }
        }
        else {
            if (isTransfer) {
                transferArrayItem(event.previousContainer.data, event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                let selectedItemIndex = ObjectUtils.findIndexInList(event.item.data, this.selectedItemsSource);
                if (selectedItemIndex != -1) {
                    this.selectedItemsSource.splice(selectedItemIndex, 1);
                    if (this.keepSelection) {
                        this.selectedItemsTarget.push(event.item.data);
                    }
                }
                if (this.visibleOptionsSource)
                    this.visibleOptionsSource.splice(event.previousIndex, 1);
                this.onMoveToTarget.emit({ items: [event.item.data] });
            }
            else {
                moveItemInArray(event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                this.onTargetReorder.emit({ items: [event.item.data] });
            }
            if (this.filterValueTarget) {
                this.filter(this.target, this.TARGET_LIST);
            }
        }
    }
    getDropIndexes(fromIndex, toIndex, droppedList, isTransfer, data) {
        let previousIndex, currentIndex;
        if (droppedList === this.SOURCE_LIST) {
            previousIndex = isTransfer ? (this.filterValueTarget ? ObjectUtils.findIndexInList(data, this.target) : fromIndex) : this.filterValueSource ? ObjectUtils.findIndexInList(data, this.source) : fromIndex;
            currentIndex = this.filterValueSource ? this.findFilteredCurrentIndex(this.visibleOptionsSource, toIndex, this.source) : toIndex;
        }
        else {
            previousIndex = isTransfer ? (this.filterValueSource ? ObjectUtils.findIndexInList(data, this.source) : fromIndex) : this.filterValueTarget ? ObjectUtils.findIndexInList(data, this.target) : fromIndex;
            currentIndex = this.filterValueTarget ? this.findFilteredCurrentIndex(this.visibleOptionsTarget, toIndex, this.target) : toIndex;
        }
        return { previousIndex, currentIndex };
    }
    findFilteredCurrentIndex(visibleOptions, index, options) {
        if (visibleOptions.length === index) {
            let toIndex = ObjectUtils.findIndexInList(visibleOptions[index - 1], options);
            return toIndex + 1;
        }
        else {
            return ObjectUtils.findIndexInList(visibleOptions[index], options);
        }
    }
    resetSourceFilter() {
        this.visibleOptionsSource = null;
        this.filterValueSource = null;
        this.sourceFilterViewChild && (this.sourceFilterViewChild.nativeElement.value = '');
    }
    resetTargetFilter() {
        this.visibleOptionsTarget = null;
        this.filterValueTarget = null;
        this.targetFilterViewChild && (this.targetFilterViewChild.nativeElement.value = '');
    }
    resetFilter() {
        this.resetSourceFilter();
        this.resetTargetFilter();
    }
    onItemKeydown(event, item, selectedItems, callback) {
        let listItem = event.currentTarget;
        switch (event.which) {
            //down
            case 40:
                var nextItem = this.findNextItem(listItem);
                if (nextItem) {
                    nextItem.focus();
                }
                event.preventDefault();
                break;
            //up
            case 38:
                var prevItem = this.findPrevItem(listItem);
                if (prevItem) {
                    prevItem.focus();
                }
                event.preventDefault();
                break;
            //enter
            case 13:
                this.onItemClick(event, item, selectedItems, callback);
                event.preventDefault();
                break;
        }
    }
    findNextItem(item) {
        let nextItem = item.nextElementSibling;
        if (nextItem)
            return !DomHandler.hasClass(nextItem, 'p-picklist-item') || DomHandler.isHidden(nextItem) ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    }
    findPrevItem(item) {
        let prevItem = item.previousElementSibling;
        if (prevItem)
            return !DomHandler.hasClass(prevItem, 'p-picklist-item') || DomHandler.isHidden(prevItem) ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    }
    initMedia() {
        if (isPlatformBrowser(this.platformId)) {
            this.media = this.window.matchMedia(`(max-width: ${this.breakpoint})`);
            this.viewChanged = this.media.matches;
            this.bindMediaChangeListener();
        }
    }
    destroyMedia() {
        this.unbindMediaChangeListener();
    }
    bindMediaChangeListener() {
        if (this.media && !this.mediaChangeListener) {
            this.mediaChangeListener = this.renderer.listen(this.media, 'change', (event) => {
                this.viewChanged = event.matches;
                this.cd.markForCheck();
            });
        }
    }
    unbindMediaChangeListener() {
        if (this.mediaChangeListener) {
            this.mediaChangeListener();
            this.mediaChangeListener = null;
        }
    }
    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement) {
                this.renderer.setAttribute(this.el.nativeElement.children[0], this.id, '');
                this.styleElement = this.renderer.createElement('style');
                this.renderer.setAttribute(this.styleElement, 'type', 'text/css');
                this.renderer.appendChild(this.document.head, this.styleElement);
                let innerHTML = `
                @media screen and (max-width: ${this.breakpoint}) {
                    .p-picklist[${this.id}] {
                        flex-direction: column;
                    }
    
                    .p-picklist[${this.id}] .p-picklist-buttons {
                        padding: var(--content-padding);
                        flex-direction: row;
                    }
    
                    .p-picklist[${this.id}] .p-picklist-buttons .p-button {
                        margin-right: var(--inline-spacing);
                        margin-bottom: 0;
                    }
    
                    .p-picklist[${this.id}] .p-picklist-buttons .p-button:last-child {
                        margin-right: 0;
                    }
                }`;
                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
            }
        }
    }
    sourceMoveDisabled() {
        if (this.disabled || !this.selectedItemsSource.length) {
            return true;
        }
    }
    targetMoveDisabled() {
        if (this.disabled || !this.selectedItemsTarget.length) {
            return true;
        }
    }
    moveRightDisabled() {
        return this.disabled || ObjectUtils.isEmpty(this.selectedItemsSource);
    }
    moveLeftDisabled() {
        return this.disabled || ObjectUtils.isEmpty(this.selectedItemsTarget);
    }
    moveAllRightDisabled() {
        return this.disabled || ObjectUtils.isEmpty(this.source);
    }
    moveAllLeftDisabled() {
        return this.disabled || ObjectUtils.isEmpty(this.target);
    }
    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
            ``;
        }
    }
    ngOnDestroy() {
        this.destroyStyle();
        this.destroyMedia();
    }
}
PickList.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PickList, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FilterService }], target: i0.ɵɵFactoryTarget.Component });
PickList.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: PickList, selector: "p-pickList", inputs: { source: "source", target: "target", sourceHeader: "sourceHeader", rightButtonAriaLabel: "rightButtonAriaLabel", leftButtonAriaLabel: "leftButtonAriaLabel", allRightButtonAriaLabel: "allRightButtonAriaLabel", allLeftButtonAriaLabel: "allLeftButtonAriaLabel", upButtonAriaLabel: "upButtonAriaLabel", downButtonAriaLabel: "downButtonAriaLabel", topButtonAriaLabel: "topButtonAriaLabel", bottomButtonAriaLabel: "bottomButtonAriaLabel", targetHeader: "targetHeader", responsive: "responsive", filterBy: "filterBy", filterLocale: "filterLocale", trackBy: "trackBy", sourceTrackBy: "sourceTrackBy", targetTrackBy: "targetTrackBy", showSourceFilter: "showSourceFilter", showTargetFilter: "showTargetFilter", metaKeySelection: "metaKeySelection", dragdrop: "dragdrop", style: "style", styleClass: "styleClass", sourceStyle: "sourceStyle", targetStyle: "targetStyle", showSourceControls: "showSourceControls", showTargetControls: "showTargetControls", sourceFilterPlaceholder: "sourceFilterPlaceholder", targetFilterPlaceholder: "targetFilterPlaceholder", disabled: "disabled", ariaSourceFilterLabel: "ariaSourceFilterLabel", ariaTargetFilterLabel: "ariaTargetFilterLabel", filterMatchMode: "filterMatchMode", breakpoint: "breakpoint", stripedRows: "stripedRows", keepSelection: "keepSelection" }, outputs: { onMoveToSource: "onMoveToSource", onMoveAllToSource: "onMoveAllToSource", onMoveAllToTarget: "onMoveAllToTarget", onMoveToTarget: "onMoveToTarget", onSourceReorder: "onSourceReorder", onTargetReorder: "onTargetReorder", onSourceSelect: "onSourceSelect", onTargetSelect: "onTargetSelect", onSourceFilter: "onSourceFilter", onTargetFilter: "onTargetFilter" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "listViewSourceChild", first: true, predicate: ["sourcelist"], descendants: true }, { propertyName: "listViewTargetChild", first: true, predicate: ["targetlist"], descendants: true }, { propertyName: "sourceFilterViewChild", first: true, predicate: ["sourceFilter"], descendants: true }, { propertyName: "targetFilterViewChild", first: true, predicate: ["targetFilter"], descendants: true }], ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{ 'p-picklist p-component': true, 'p-picklist-striped': stripedRows }" cdkDropListGroup>
            <div class="p-picklist-buttons p-picklist-source-controls" *ngIf="showSourceControls">
                <button type="button" [attr.aria-label]="upButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveUp(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleUpIcon *ngIf="!moveUpIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveUpIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="topButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveTop(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleDoubleUpIcon *ngIf="!moveTopIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveTopIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="downButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveDown(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleDownIcon *ngIf="!moveDownIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveDownIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="bottomButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveBottom(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleDoubleDownIcon *ngIf="!moveBottomIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveBottomIconTemplate"></ng-template>
                </button>
            </div>
            <div class="p-picklist-list-wrapper p-picklist-source-wrapper">
                <div class="p-picklist-header" *ngIf="sourceHeader || sourceHeaderTemplate">
                    <div class="p-picklist-title" *ngIf="!sourceHeaderTemplate">{{ sourceHeader }}</div>
                    <ng-container *ngTemplateOutlet="sourceHeaderTemplate"></ng-container>
                </div>
                <div class="p-picklist-filter-container" *ngIf="filterBy && showSourceFilter !== false">
                    <ng-container *ngIf="sourceFilterTemplate; else builtInSourceElement">
                        <ng-container *ngTemplateOutlet="sourceFilterTemplate; context: { options: sourceFilterOptions }"></ng-container>
                    </ng-container>
                    <ng-template #builtInSourceElement>
                        <div class="p-picklist-filter">
                            <input
                                #sourceFilter
                                type="text"
                                role="textbox"
                                (keyup)="onFilter($event, SOURCE_LIST)"
                                class="p-picklist-filter-input p-inputtext p-component"
                                [disabled]="disabled"
                                [attr.placeholder]="sourceFilterPlaceholder"
                                [attr.aria-label]="ariaSourceFilterLabel"
                            />
                            <SearchIcon *ngIf="!sourceFilterIconTemplate" [styleClass]="'p-picklist-filter-icon'" />
                            <span class="p-picklist-filter-icon" *ngIf="sourceFilterIconTemplate">
                                <ng-template *ngTemplateOutlet="sourceFilterIconTemplate"></ng-template>
                            </span>
                        </div>
                    </ng-template>
                </div>

                <ul #sourcelist class="p-picklist-list p-picklist-source" cdkDropList [cdkDropListData]="source" (cdkDropListDropped)="onDrop($event, SOURCE_LIST)" [ngStyle]="sourceStyle" role="listbox" aria-multiselectable="multiple">
                    <ng-template ngFor let-item [ngForOf]="source" [ngForTrackBy]="sourceTrackBy || trackBy" let-i="index" let-l="last">
                        <li
                            [ngClass]="{ 'p-picklist-item': true, 'p-highlight': isSelected(item, selectedItemsSource), 'p-disabled': disabled }"
                            pRipple
                            cdkDrag
                            [cdkDragData]="item"
                            [cdkDragDisabled]="!dragdrop"
                            (click)="onItemClick($event, item, selectedItemsSource, onSourceSelect)"
                            (dblclick)="onSourceItemDblClick()"
                            (touchend)="onItemTouchEnd()"
                            (keydown)="onItemKeydown($event, item, selectedItemsSource, onSourceSelect)"
                            *ngIf="isItemVisible(item, SOURCE_LIST)"
                            tabindex="0"
                            role="option"
                            [attr.aria-selected]="isSelected(item, selectedItemsSource)"
                        >
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                    </ng-template>
                    <ng-container *ngIf="isEmpty(SOURCE_LIST) && (emptyMessageSourceTemplate || emptyFilterMessageSourceTemplate)">
                        <li class="p-picklist-empty-message" *ngIf="!filterValueSource || !emptyFilterMessageSourceTemplate">
                            <ng-container *ngTemplateOutlet="emptyMessageSourceTemplate"></ng-container>
                        </li>
                        <li class="p-picklist-empty-message" *ngIf="filterValueSource">
                            <ng-container *ngTemplateOutlet="emptyFilterMessageSourceTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
            <div class="p-picklist-buttons p-picklist-transfer-buttons">
                <button type="button" [attr.aria-label]="rightButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveRightDisabled()" (click)="moveRight()">
                    <ng-container *ngIf="!moveToTargetIconTemplate">
                        <AngleRightIcon *ngIf="!viewChanged" />
                        <AngleDownIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveToTargetIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="allRightButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveAllRightDisabled()" (click)="moveAllRight()">
                    <ng-container *ngIf="!moveAllToTargetIconTemplate">
                        <AngleDoubleRightIcon *ngIf="!viewChanged" />
                        <AngleDoubleDownIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveAllToTargetIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="leftButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveLeftDisabled()" (click)="moveLeft()">
                    <ng-container *ngIf="!moveToSourceIconTemplate">
                        <AngleLeftIcon *ngIf="!viewChanged" />
                        <AngleUpIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveToSourceIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="allLeftButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveAllLeftDisabled()" (click)="moveAllLeft()">
                    <ng-container *ngIf="!moveAllToSourceIconTemplate">
                        <AngleDoubleLeftIcon *ngIf="!viewChanged" />
                        <AngleDoubleUpIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveAllToSourceIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
            </div>
            <div class="p-picklist-list-wrapper p-picklist-target-wrapper">
                <div class="p-picklist-header" *ngIf="targetHeader || targetHeaderTemplate">
                    <div class="p-picklist-title" *ngIf="!targetHeaderTemplate">{{ targetHeader }}</div>
                    <ng-container *ngTemplateOutlet="targetHeaderTemplate"></ng-container>
                </div>
                <div class="p-picklist-filter-container" *ngIf="filterBy && showTargetFilter !== false">
                    <ng-container *ngIf="targetFilterTemplate; else builtInTargetElement">
                        <ng-container *ngTemplateOutlet="targetFilterTemplate; context: { options: targetFilterOptions }"></ng-container>
                    </ng-container>
                    <ng-template #builtInTargetElement>
                        <div class="p-picklist-filter">
                            <input
                                #targetFilter
                                type="text"
                                role="textbox"
                                (keyup)="onFilter($event, TARGET_LIST)"
                                class="p-picklist-filter-input p-inputtext p-component"
                                [disabled]="disabled"
                                [attr.placeholder]="targetFilterPlaceholder"
                                [attr.aria-label]="ariaTargetFilterLabel"
                            />
                            <SearchIcon *ngIf="!targetFilterIconTemplate" [styleClass]="'p-picklist-filter-icon'" />
                            <span class="p-picklist-filter-icon" *ngIf="targetFilterIconTemplate">
                                <ng-template *ngTemplateOutlet="targetFilterIconTemplate"></ng-template>
                            </span>
                        </div>
                    </ng-template>
                </div>
                <ul #targetlist class="p-picklist-list p-picklist-target" cdkDropList [cdkDropListData]="target" (cdkDropListDropped)="onDrop($event, TARGET_LIST)" [ngStyle]="targetStyle" role="listbox" aria-multiselectable="multiple">
                    <ng-template ngFor let-item [ngForOf]="target" [ngForTrackBy]="targetTrackBy || trackBy" let-i="index" let-l="last">
                        <li
                            [ngClass]="{ 'p-picklist-item': true, 'p-highlight': isSelected(item, selectedItemsTarget), 'p-disabled': disabled }"
                            pRipple
                            cdkDrag
                            [cdkDragData]="item"
                            [cdkDragDisabled]="!dragdrop"
                            (click)="onItemClick($event, item, selectedItemsTarget, onTargetSelect)"
                            (dblclick)="onTargetItemDblClick()"
                            (touchend)="onItemTouchEnd()"
                            (keydown)="onItemKeydown($event, item, selectedItemsTarget, onTargetSelect)"
                            *ngIf="isItemVisible(item, TARGET_LIST)"
                            tabindex="0"
                            role="option"
                            [attr.aria-selected]="isSelected(item, selectedItemsTarget)"
                        >
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                    </ng-template>
                    <ng-container *ngIf="isEmpty(TARGET_LIST) && (emptyMessageTargetTemplate || emptyFilterMessageTargetTemplate)">
                        <li class="p-picklist-empty-message" *ngIf="!filterValueTarget || !emptyFilterMessageTargetTemplate">
                            <ng-container *ngTemplateOutlet="emptyMessageTargetTemplate"></ng-container>
                        </li>
                        <li class="p-picklist-empty-message" *ngIf="filterValueTarget">
                            <ng-container *ngTemplateOutlet="emptyFilterMessageTargetTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
            <div class="p-picklist-buttons p-picklist-target-controls" *ngIf="showTargetControls">
                <button type="button" [attr.aria-label]="upButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveUp(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleUpIcon *ngIf="!moveUpIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveUpIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="topButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveTop(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleDoubleUpIcon *ngIf="!moveTopIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveTopIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="downButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveDown(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleDownIcon *ngIf="!moveDownIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveDownIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="bottomButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveBottom(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleDoubleDownIcon *ngIf="!moveBottomIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveBottomIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `, isInline: true, styles: [".p-picklist{display:flex}.p-picklist-buttons{display:flex;flex-direction:column;justify-content:center}.p-picklist-list-wrapper{flex:1 1 50%}.p-picklist-list{list-style-type:none;margin:0;padding:0;overflow:auto;min-height:12rem}.p-picklist-item{display:block;cursor:pointer;overflow:hidden;position:relative}.p-picklist-item:not(.cdk-drag-disabled){cursor:move}.p-picklist-item.cdk-drag-placeholder{opacity:0}.p-picklist-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.p-picklist-filter{position:relative}.p-picklist-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-picklist-filter-input{width:100%}.p-picklist-list.cdk-drop-list-dragging .p-picklist-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(function () { return i3.ButtonDirective; }), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i0.forwardRef(function () { return i4.Ripple; }), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(function () { return i5.CdkDropList; }), selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i0.forwardRef(function () { return i5.CdkDropListGroup; }), selector: "[cdkDropListGroup]", inputs: ["cdkDropListGroupDisabled"], exportAs: ["cdkDropListGroup"] }, { kind: "directive", type: i0.forwardRef(function () { return i5.CdkDrag; }), selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "component", type: i0.forwardRef(function () { return AngleDoubleDownIcon; }), selector: "AngleDoubleDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleDoubleLeftIcon; }), selector: "AngleDoubleLeftIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleDoubleRightIcon; }), selector: "AngleDoubleRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleDoubleUpIcon; }), selector: "AngleDoubleUpIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleDownIcon; }), selector: "AngleDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleLeftIcon; }), selector: "AngleLeftIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleRightIcon; }), selector: "AngleRightIcon" }, { kind: "component", type: i0.forwardRef(function () { return AngleUpIcon; }), selector: "AngleUpIcon" }, { kind: "component", type: i0.forwardRef(function () { return SearchIcon; }), selector: "SearchIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PickList, decorators: [{
            type: Component,
            args: [{ selector: 'p-pickList', template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{ 'p-picklist p-component': true, 'p-picklist-striped': stripedRows }" cdkDropListGroup>
            <div class="p-picklist-buttons p-picklist-source-controls" *ngIf="showSourceControls">
                <button type="button" [attr.aria-label]="upButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveUp(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleUpIcon *ngIf="!moveUpIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveUpIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="topButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveTop(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleDoubleUpIcon *ngIf="!moveTopIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveTopIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="downButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveDown(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleDownIcon *ngIf="!moveDownIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveDownIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="bottomButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="sourceMoveDisabled()" (click)="moveBottom(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)">
                    <AngleDoubleDownIcon *ngIf="!moveBottomIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveBottomIconTemplate"></ng-template>
                </button>
            </div>
            <div class="p-picklist-list-wrapper p-picklist-source-wrapper">
                <div class="p-picklist-header" *ngIf="sourceHeader || sourceHeaderTemplate">
                    <div class="p-picklist-title" *ngIf="!sourceHeaderTemplate">{{ sourceHeader }}</div>
                    <ng-container *ngTemplateOutlet="sourceHeaderTemplate"></ng-container>
                </div>
                <div class="p-picklist-filter-container" *ngIf="filterBy && showSourceFilter !== false">
                    <ng-container *ngIf="sourceFilterTemplate; else builtInSourceElement">
                        <ng-container *ngTemplateOutlet="sourceFilterTemplate; context: { options: sourceFilterOptions }"></ng-container>
                    </ng-container>
                    <ng-template #builtInSourceElement>
                        <div class="p-picklist-filter">
                            <input
                                #sourceFilter
                                type="text"
                                role="textbox"
                                (keyup)="onFilter($event, SOURCE_LIST)"
                                class="p-picklist-filter-input p-inputtext p-component"
                                [disabled]="disabled"
                                [attr.placeholder]="sourceFilterPlaceholder"
                                [attr.aria-label]="ariaSourceFilterLabel"
                            />
                            <SearchIcon *ngIf="!sourceFilterIconTemplate" [styleClass]="'p-picklist-filter-icon'" />
                            <span class="p-picklist-filter-icon" *ngIf="sourceFilterIconTemplate">
                                <ng-template *ngTemplateOutlet="sourceFilterIconTemplate"></ng-template>
                            </span>
                        </div>
                    </ng-template>
                </div>

                <ul #sourcelist class="p-picklist-list p-picklist-source" cdkDropList [cdkDropListData]="source" (cdkDropListDropped)="onDrop($event, SOURCE_LIST)" [ngStyle]="sourceStyle" role="listbox" aria-multiselectable="multiple">
                    <ng-template ngFor let-item [ngForOf]="source" [ngForTrackBy]="sourceTrackBy || trackBy" let-i="index" let-l="last">
                        <li
                            [ngClass]="{ 'p-picklist-item': true, 'p-highlight': isSelected(item, selectedItemsSource), 'p-disabled': disabled }"
                            pRipple
                            cdkDrag
                            [cdkDragData]="item"
                            [cdkDragDisabled]="!dragdrop"
                            (click)="onItemClick($event, item, selectedItemsSource, onSourceSelect)"
                            (dblclick)="onSourceItemDblClick()"
                            (touchend)="onItemTouchEnd()"
                            (keydown)="onItemKeydown($event, item, selectedItemsSource, onSourceSelect)"
                            *ngIf="isItemVisible(item, SOURCE_LIST)"
                            tabindex="0"
                            role="option"
                            [attr.aria-selected]="isSelected(item, selectedItemsSource)"
                        >
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                    </ng-template>
                    <ng-container *ngIf="isEmpty(SOURCE_LIST) && (emptyMessageSourceTemplate || emptyFilterMessageSourceTemplate)">
                        <li class="p-picklist-empty-message" *ngIf="!filterValueSource || !emptyFilterMessageSourceTemplate">
                            <ng-container *ngTemplateOutlet="emptyMessageSourceTemplate"></ng-container>
                        </li>
                        <li class="p-picklist-empty-message" *ngIf="filterValueSource">
                            <ng-container *ngTemplateOutlet="emptyFilterMessageSourceTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
            <div class="p-picklist-buttons p-picklist-transfer-buttons">
                <button type="button" [attr.aria-label]="rightButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveRightDisabled()" (click)="moveRight()">
                    <ng-container *ngIf="!moveToTargetIconTemplate">
                        <AngleRightIcon *ngIf="!viewChanged" />
                        <AngleDownIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveToTargetIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="allRightButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveAllRightDisabled()" (click)="moveAllRight()">
                    <ng-container *ngIf="!moveAllToTargetIconTemplate">
                        <AngleDoubleRightIcon *ngIf="!viewChanged" />
                        <AngleDoubleDownIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveAllToTargetIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="leftButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveLeftDisabled()" (click)="moveLeft()">
                    <ng-container *ngIf="!moveToSourceIconTemplate">
                        <AngleLeftIcon *ngIf="!viewChanged" />
                        <AngleUpIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveToSourceIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="allLeftButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="moveAllLeftDisabled()" (click)="moveAllLeft()">
                    <ng-container *ngIf="!moveAllToSourceIconTemplate">
                        <AngleDoubleLeftIcon *ngIf="!viewChanged" />
                        <AngleDoubleUpIcon *ngIf="viewChanged" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveAllToSourceIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
            </div>
            <div class="p-picklist-list-wrapper p-picklist-target-wrapper">
                <div class="p-picklist-header" *ngIf="targetHeader || targetHeaderTemplate">
                    <div class="p-picklist-title" *ngIf="!targetHeaderTemplate">{{ targetHeader }}</div>
                    <ng-container *ngTemplateOutlet="targetHeaderTemplate"></ng-container>
                </div>
                <div class="p-picklist-filter-container" *ngIf="filterBy && showTargetFilter !== false">
                    <ng-container *ngIf="targetFilterTemplate; else builtInTargetElement">
                        <ng-container *ngTemplateOutlet="targetFilterTemplate; context: { options: targetFilterOptions }"></ng-container>
                    </ng-container>
                    <ng-template #builtInTargetElement>
                        <div class="p-picklist-filter">
                            <input
                                #targetFilter
                                type="text"
                                role="textbox"
                                (keyup)="onFilter($event, TARGET_LIST)"
                                class="p-picklist-filter-input p-inputtext p-component"
                                [disabled]="disabled"
                                [attr.placeholder]="targetFilterPlaceholder"
                                [attr.aria-label]="ariaTargetFilterLabel"
                            />
                            <SearchIcon *ngIf="!targetFilterIconTemplate" [styleClass]="'p-picklist-filter-icon'" />
                            <span class="p-picklist-filter-icon" *ngIf="targetFilterIconTemplate">
                                <ng-template *ngTemplateOutlet="targetFilterIconTemplate"></ng-template>
                            </span>
                        </div>
                    </ng-template>
                </div>
                <ul #targetlist class="p-picklist-list p-picklist-target" cdkDropList [cdkDropListData]="target" (cdkDropListDropped)="onDrop($event, TARGET_LIST)" [ngStyle]="targetStyle" role="listbox" aria-multiselectable="multiple">
                    <ng-template ngFor let-item [ngForOf]="target" [ngForTrackBy]="targetTrackBy || trackBy" let-i="index" let-l="last">
                        <li
                            [ngClass]="{ 'p-picklist-item': true, 'p-highlight': isSelected(item, selectedItemsTarget), 'p-disabled': disabled }"
                            pRipple
                            cdkDrag
                            [cdkDragData]="item"
                            [cdkDragDisabled]="!dragdrop"
                            (click)="onItemClick($event, item, selectedItemsTarget, onTargetSelect)"
                            (dblclick)="onTargetItemDblClick()"
                            (touchend)="onItemTouchEnd()"
                            (keydown)="onItemKeydown($event, item, selectedItemsTarget, onTargetSelect)"
                            *ngIf="isItemVisible(item, TARGET_LIST)"
                            tabindex="0"
                            role="option"
                            [attr.aria-selected]="isSelected(item, selectedItemsTarget)"
                        >
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                    </ng-template>
                    <ng-container *ngIf="isEmpty(TARGET_LIST) && (emptyMessageTargetTemplate || emptyFilterMessageTargetTemplate)">
                        <li class="p-picklist-empty-message" *ngIf="!filterValueTarget || !emptyFilterMessageTargetTemplate">
                            <ng-container *ngTemplateOutlet="emptyMessageTargetTemplate"></ng-container>
                        </li>
                        <li class="p-picklist-empty-message" *ngIf="filterValueTarget">
                            <ng-container *ngTemplateOutlet="emptyFilterMessageTargetTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
            <div class="p-picklist-buttons p-picklist-target-controls" *ngIf="showTargetControls">
                <button type="button" [attr.aria-label]="upButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveUp(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleUpIcon *ngIf="!moveUpIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveUpIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="topButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveTop(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleDoubleUpIcon *ngIf="!moveTopIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveTopIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="downButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveDown(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleDownIcon *ngIf="!moveDownIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveDownIconTemplate"></ng-template>
                </button>
                <button type="button" [attr.aria-label]="bottomButtonAriaLabel" pButton pRipple class="p-button-icon-only" [disabled]="targetMoveDisabled()" (click)="moveBottom(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)">
                    <AngleDoubleDownIcon *ngIf="!moveBottomIconTemplate" />
                    <ng-template *ngTemplateOutlet="moveBottomIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-picklist{display:flex}.p-picklist-buttons{display:flex;flex-direction:column;justify-content:center}.p-picklist-list-wrapper{flex:1 1 50%}.p-picklist-list{list-style-type:none;margin:0;padding:0;overflow:auto;min-height:12rem}.p-picklist-item{display:block;cursor:pointer;overflow:hidden;position:relative}.p-picklist-item:not(.cdk-drag-disabled){cursor:move}.p-picklist-item.cdk-drag-placeholder{opacity:0}.p-picklist-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.p-picklist-filter{position:relative}.p-picklist-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-picklist-filter-input{width:100%}.p-picklist-list.cdk-drop-list-dragging .p-picklist-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FilterService }]; }, propDecorators: { source: [{
                type: Input
            }], target: [{
                type: Input
            }], sourceHeader: [{
                type: Input
            }], rightButtonAriaLabel: [{
                type: Input
            }], leftButtonAriaLabel: [{
                type: Input
            }], allRightButtonAriaLabel: [{
                type: Input
            }], allLeftButtonAriaLabel: [{
                type: Input
            }], upButtonAriaLabel: [{
                type: Input
            }], downButtonAriaLabel: [{
                type: Input
            }], topButtonAriaLabel: [{
                type: Input
            }], bottomButtonAriaLabel: [{
                type: Input
            }], targetHeader: [{
                type: Input
            }], responsive: [{
                type: Input
            }], filterBy: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], trackBy: [{
                type: Input
            }], sourceTrackBy: [{
                type: Input
            }], targetTrackBy: [{
                type: Input
            }], showSourceFilter: [{
                type: Input
            }], showTargetFilter: [{
                type: Input
            }], metaKeySelection: [{
                type: Input
            }], dragdrop: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], sourceStyle: [{
                type: Input
            }], targetStyle: [{
                type: Input
            }], showSourceControls: [{
                type: Input
            }], showTargetControls: [{
                type: Input
            }], sourceFilterPlaceholder: [{
                type: Input
            }], targetFilterPlaceholder: [{
                type: Input
            }], disabled: [{
                type: Input
            }], ariaSourceFilterLabel: [{
                type: Input
            }], ariaTargetFilterLabel: [{
                type: Input
            }], filterMatchMode: [{
                type: Input
            }], breakpoint: [{
                type: Input
            }], stripedRows: [{
                type: Input
            }], keepSelection: [{
                type: Input
            }], onMoveToSource: [{
                type: Output
            }], onMoveAllToSource: [{
                type: Output
            }], onMoveAllToTarget: [{
                type: Output
            }], onMoveToTarget: [{
                type: Output
            }], onSourceReorder: [{
                type: Output
            }], onTargetReorder: [{
                type: Output
            }], onSourceSelect: [{
                type: Output
            }], onTargetSelect: [{
                type: Output
            }], onSourceFilter: [{
                type: Output
            }], onTargetFilter: [{
                type: Output
            }], listViewSourceChild: [{
                type: ViewChild,
                args: ['sourcelist']
            }], listViewTargetChild: [{
                type: ViewChild,
                args: ['targetlist']
            }], sourceFilterViewChild: [{
                type: ViewChild,
                args: ['sourceFilter']
            }], targetFilterViewChild: [{
                type: ViewChild,
                args: ['targetFilter']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class PickListModule {
}
PickListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PickListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PickListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: PickListModule, declarations: [PickList], imports: [CommonModule, ButtonModule, SharedModule, RippleModule, DragDropModule, AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon, SearchIcon, HomeIcon], exports: [PickList, SharedModule, DragDropModule] });
PickListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PickListModule, imports: [CommonModule, ButtonModule, SharedModule, RippleModule, DragDropModule, AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon, SearchIcon, HomeIcon, SharedModule, DragDropModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: PickListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, SharedModule, RippleModule, DragDropModule, AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon, SearchIcon, HomeIcon],
                    exports: [PickList, SharedModule, DragDropModule],
                    declarations: [PickList]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2xpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvcGlja2xpc3QvcGlja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixTQUFTLEVBSVQsS0FBSyxFQUNMLE1BQU0sRUFDTixlQUFlLEVBR2YsWUFBWSxFQUNaLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBR2pCLE1BQU0sRUFDTixXQUFXLEVBQ2QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQWlCLE1BQU0sYUFBYSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBZSxjQUFjLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekcsT0FBTyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlC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LGlCQUFpQixFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO29CQUNyUCxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQztvQkFDakQsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUMzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgTmdNb2R1bGUsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdDaGVja2VkLFxuICAgIElucHV0LFxuICAgIE91dHB1dCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBWaWV3Q2hpbGQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgUmVuZGVyZXIyLFxuICAgIEluamVjdCxcbiAgICBQTEFURk9STV9JRFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSwgUHJpbWVUZW1wbGF0ZSwgRmlsdGVyU2VydmljZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBDZGtEcmFnRHJvcCwgRHJhZ0Ryb3BNb2R1bGUsIG1vdmVJdGVtSW5BcnJheSwgdHJhbnNmZXJBcnJheUl0ZW0gfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcbmltcG9ydCB7IE9iamVjdFV0aWxzLCBVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuaW1wb3J0IHsgQW5nbGVEb3VibGVEb3duSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvYW5nbGVkb3VibGVkb3duJztcbmltcG9ydCB7IEFuZ2xlRG91YmxlTGVmdEljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL2FuZ2xlZG91YmxlbGVmdCc7XG5pbXBvcnQgeyBBbmdsZURvdWJsZVJpZ2h0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvYW5nbGVkb3VibGVyaWdodCc7XG5pbXBvcnQgeyBBbmdsZURvdWJsZVVwSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvYW5nbGVkb3VibGV1cCc7XG5pbXBvcnQgeyBBbmdsZURvd25JY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9hbmdsZWRvd24nO1xuaW1wb3J0IHsgQW5nbGVMZWZ0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvYW5nbGVsZWZ0JztcbmltcG9ydCB7IEFuZ2xlUmlnaHRJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9hbmdsZXJpZ2h0JztcbmltcG9ydCB7IEFuZ2xlVXBJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9hbmdsZXVwJztcbmltcG9ydCB7IFNlYXJjaEljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL3NlYXJjaCc7XG5pbXBvcnQgeyBIb21lSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvaG9tZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGlja0xpc3RGaWx0ZXJPcHRpb25zIHtcbiAgICBmaWx0ZXI/OiAodmFsdWU/OiBhbnkpID0+IHZvaWQ7XG4gICAgcmVzZXQ/OiAoKSA9PiB2b2lkO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtcGlja0xpc3QnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtuZ0NsYXNzXT1cInsgJ3AtcGlja2xpc3QgcC1jb21wb25lbnQnOiB0cnVlLCAncC1waWNrbGlzdC1zdHJpcGVkJzogc3RyaXBlZFJvd3MgfVwiIGNka0Ryb3BMaXN0R3JvdXA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1waWNrbGlzdC1idXR0b25zIHAtcGlja2xpc3Qtc291cmNlLWNvbnRyb2xzXCIgKm5nSWY9XCJzaG93U291cmNlQ29udHJvbHNcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cInVwQnV0dG9uQXJpYUxhYmVsXCIgcEJ1dHRvbiBwUmlwcGxlIGNsYXNzPVwicC1idXR0b24taWNvbi1vbmx5XCIgW2Rpc2FibGVkXT1cInNvdXJjZU1vdmVEaXNhYmxlZCgpXCIgKGNsaWNrKT1cIm1vdmVVcChzb3VyY2VsaXN0LCBzb3VyY2UsIHNlbGVjdGVkSXRlbXNTb3VyY2UsIG9uU291cmNlUmVvcmRlciwgU09VUkNFX0xJU1QpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxBbmdsZVVwSWNvbiAqbmdJZj1cIiFtb3ZlVXBJY29uVGVtcGxhdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJtb3ZlVXBJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwidG9wQnV0dG9uQXJpYUxhYmVsXCIgcEJ1dHRvbiBwUmlwcGxlIGNsYXNzPVwicC1idXR0b24taWNvbi1vbmx5XCIgW2Rpc2FibGVkXT1cInNvdXJjZU1vdmVEaXNhYmxlZCgpXCIgKGNsaWNrKT1cIm1vdmVUb3Aoc291cmNlbGlzdCwgc291cmNlLCBzZWxlY3RlZEl0ZW1zU291cmNlLCBvblNvdXJjZVJlb3JkZXIsIFNPVVJDRV9MSVNUKVwiPlxuICAgICAgICAgICAgICAgICAgICA8QW5nbGVEb3VibGVVcEljb24gKm5nSWY9XCIhbW92ZVRvcEljb25UZW1wbGF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm1vdmVUb3BJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwiZG93bkJ1dHRvbkFyaWFMYWJlbFwiIHBCdXR0b24gcFJpcHBsZSBjbGFzcz1cInAtYnV0dG9uLWljb24tb25seVwiIFtkaXNhYmxlZF09XCJzb3VyY2VNb3ZlRGlzYWJsZWQoKVwiIChjbGljayk9XCJtb3ZlRG93bihzb3VyY2VsaXN0LCBzb3VyY2UsIHNlbGVjdGVkSXRlbXNTb3VyY2UsIG9uU291cmNlUmVvcmRlciwgU09VUkNFX0xJU1QpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxBbmdsZURvd25JY29uICpuZ0lmPVwiIW1vdmVEb3duSWNvblRlbXBsYXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibW92ZURvd25JY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYm90dG9tQnV0dG9uQXJpYUxhYmVsXCIgcEJ1dHRvbiBwUmlwcGxlIGNsYXNzPVwicC1idXR0b24taWNvbi1vbmx5XCIgW2Rpc2FibGVkXT1cInNvdXJjZU1vdmVEaXNhYmxlZCgpXCIgKGNsaWNrKT1cIm1vdmVCb3R0b20oc291cmNlbGlzdCwgc291cmNlLCBzZWxlY3RlZEl0ZW1zU291cmNlLCBvblNvdXJjZVJlb3JkZXIsIFNPVVJDRV9MSVNUKVwiPlxuICAgICAgICAgICAgICAgICAgICA8QW5nbGVEb3VibGVEb3duSWNvbiAqbmdJZj1cIiFtb3ZlQm90dG9tSWNvblRlbXBsYXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibW92ZUJvdHRvbUljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBpY2tsaXN0LWxpc3Qtd3JhcHBlciBwLXBpY2tsaXN0LXNvdXJjZS13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcGlja2xpc3QtaGVhZGVyXCIgKm5nSWY9XCJzb3VyY2VIZWFkZXIgfHwgc291cmNlSGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcGlja2xpc3QtdGl0bGVcIiAqbmdJZj1cIiFzb3VyY2VIZWFkZXJUZW1wbGF0ZVwiPnt7IHNvdXJjZUhlYWRlciB9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic291cmNlSGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1waWNrbGlzdC1maWx0ZXItY29udGFpbmVyXCIgKm5nSWY9XCJmaWx0ZXJCeSAmJiBzaG93U291cmNlRmlsdGVyICE9PSBmYWxzZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwic291cmNlRmlsdGVyVGVtcGxhdGU7IGVsc2UgYnVpbHRJblNvdXJjZUVsZW1lbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzb3VyY2VGaWx0ZXJUZW1wbGF0ZTsgY29udGV4dDogeyBvcHRpb25zOiBzb3VyY2VGaWx0ZXJPcHRpb25zIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbHRJblNvdXJjZUVsZW1lbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1waWNrbGlzdC1maWx0ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI3NvdXJjZUZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJ0ZXh0Ym94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uRmlsdGVyKCRldmVudCwgU09VUkNFX0xJU1QpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBpY2tsaXN0LWZpbHRlci1pbnB1dCBwLWlucHV0dGV4dCBwLWNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnBsYWNlaG9sZGVyXT1cInNvdXJjZUZpbHRlclBsYWNlaG9sZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhU291cmNlRmlsdGVyTGFiZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFNlYXJjaEljb24gKm5nSWY9XCIhc291cmNlRmlsdGVySWNvblRlbXBsYXRlXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtcGlja2xpc3QtZmlsdGVyLWljb24nXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtcGlja2xpc3QtZmlsdGVyLWljb25cIiAqbmdJZj1cInNvdXJjZUZpbHRlckljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzb3VyY2VGaWx0ZXJJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPHVsICNzb3VyY2VsaXN0IGNsYXNzPVwicC1waWNrbGlzdC1saXN0IHAtcGlja2xpc3Qtc291cmNlXCIgY2RrRHJvcExpc3QgW2Nka0Ryb3BMaXN0RGF0YV09XCJzb3VyY2VcIiAoY2RrRHJvcExpc3REcm9wcGVkKT1cIm9uRHJvcCgkZXZlbnQsIFNPVVJDRV9MSVNUKVwiIFtuZ1N0eWxlXT1cInNvdXJjZVN0eWxlXCIgcm9sZT1cImxpc3Rib3hcIiBhcmlhLW11bHRpc2VsZWN0YWJsZT1cIm11bHRpcGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtaXRlbSBbbmdGb3JPZl09XCJzb3VyY2VcIiBbbmdGb3JUcmFja0J5XT1cInNvdXJjZVRyYWNrQnkgfHwgdHJhY2tCeVwiIGxldC1pPVwiaW5kZXhcIiBsZXQtbD1cImxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtcGlja2xpc3QtaXRlbSc6IHRydWUsICdwLWhpZ2hsaWdodCc6IGlzU2VsZWN0ZWQoaXRlbSwgc2VsZWN0ZWRJdGVtc1NvdXJjZSksICdwLWRpc2FibGVkJzogZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNka0RyYWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2RrRHJhZ0RhdGFdPVwiaXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Nka0RyYWdEaXNhYmxlZF09XCIhZHJhZ2Ryb3BcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGl0ZW0sIHNlbGVjdGVkSXRlbXNTb3VyY2UsIG9uU291cmNlU2VsZWN0KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRibGNsaWNrKT1cIm9uU291cmNlSXRlbURibENsaWNrKClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJvbkl0ZW1Ub3VjaEVuZCgpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbkl0ZW1LZXlkb3duKCRldmVudCwgaXRlbSwgc2VsZWN0ZWRJdGVtc1NvdXJjZSwgb25Tb3VyY2VTZWxlY3QpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cImlzSXRlbVZpc2libGUoaXRlbSwgU09VUkNFX0xJU1QpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJvcHRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZChpdGVtLCBzZWxlY3RlZEl0ZW1zU291cmNlKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW0sIGluZGV4OiBpIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc0VtcHR5KFNPVVJDRV9MSVNUKSAmJiAoZW1wdHlNZXNzYWdlU291cmNlVGVtcGxhdGUgfHwgZW1wdHlGaWx0ZXJNZXNzYWdlU291cmNlVGVtcGxhdGUpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLXBpY2tsaXN0LWVtcHR5LW1lc3NhZ2VcIiAqbmdJZj1cIiFmaWx0ZXJWYWx1ZVNvdXJjZSB8fCAhZW1wdHlGaWx0ZXJNZXNzYWdlU291cmNlVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW1wdHlNZXNzYWdlU291cmNlVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLXBpY2tsaXN0LWVtcHR5LW1lc3NhZ2VcIiAqbmdJZj1cImZpbHRlclZhbHVlU291cmNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVtcHR5RmlsdGVyTWVzc2FnZVNvdXJjZVRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1waWNrbGlzdC1idXR0b25zIHAtcGlja2xpc3QtdHJhbnNmZXItYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwicmlnaHRCdXR0b25BcmlhTGFiZWxcIiBwQnV0dG9uIHBSaXBwbGUgY2xhc3M9XCJwLWJ1dHRvbi1pY29uLW9ubHlcIiBbZGlzYWJsZWRdPVwibW92ZVJpZ2h0RGlzYWJsZWQoKVwiIChjbGljayk9XCJtb3ZlUmlnaHQoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIW1vdmVUb1RhcmdldEljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFuZ2xlUmlnaHRJY29uICpuZ0lmPVwiIXZpZXdDaGFuZ2VkXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxBbmdsZURvd25JY29uICpuZ0lmPVwidmlld0NoYW5nZWRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibW92ZVRvVGFyZ2V0SWNvblRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogdmlld0NoYW5nZWQgfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhbGxSaWdodEJ1dHRvbkFyaWFMYWJlbFwiIHBCdXR0b24gcFJpcHBsZSBjbGFzcz1cInAtYnV0dG9uLWljb24tb25seVwiIFtkaXNhYmxlZF09XCJtb3ZlQWxsUmlnaHREaXNhYmxlZCgpXCIgKGNsaWNrKT1cIm1vdmVBbGxSaWdodCgpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhbW92ZUFsbFRvVGFyZ2V0SWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8QW5nbGVEb3VibGVSaWdodEljb24gKm5nSWY9XCIhdmlld0NoYW5nZWRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFuZ2xlRG91YmxlRG93bkljb24gKm5nSWY9XCJ2aWV3Q2hhbmdlZFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJtb3ZlQWxsVG9UYXJnZXRJY29uVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2aWV3Q2hhbmdlZCB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cImxlZnRCdXR0b25BcmlhTGFiZWxcIiBwQnV0dG9uIHBSaXBwbGUgY2xhc3M9XCJwLWJ1dHRvbi1pY29uLW9ubHlcIiBbZGlzYWJsZWRdPVwibW92ZUxlZnREaXNhYmxlZCgpXCIgKGNsaWNrKT1cIm1vdmVMZWZ0KClcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFtb3ZlVG9Tb3VyY2VJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxBbmdsZUxlZnRJY29uICpuZ0lmPVwiIXZpZXdDaGFuZ2VkXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxBbmdsZVVwSWNvbiAqbmdJZj1cInZpZXdDaGFuZ2VkXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm1vdmVUb1NvdXJjZUljb25UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHZpZXdDaGFuZ2VkIH1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYWxsTGVmdEJ1dHRvbkFyaWFMYWJlbFwiIHBCdXR0b24gcFJpcHBsZSBjbGFzcz1cInAtYnV0dG9uLWljb24tb25seVwiIFtkaXNhYmxlZF09XCJtb3ZlQWxsTGVmdERpc2FibGVkKClcIiAoY2xpY2spPVwibW92ZUFsbExlZnQoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIW1vdmVBbGxUb1NvdXJjZUljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFuZ2xlRG91YmxlTGVmdEljb24gKm5nSWY9XCIhdmlld0NoYW5nZWRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEFuZ2xlRG91YmxlVXBJY29uICpuZ0lmPVwidmlld0NoYW5nZWRcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibW92ZUFsbFRvU291cmNlSWNvblRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogdmlld0NoYW5nZWQgfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBpY2tsaXN0LWxpc3Qtd3JhcHBlciBwLXBpY2tsaXN0LXRhcmdldC13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcGlja2xpc3QtaGVhZGVyXCIgKm5nSWY9XCJ0YXJnZXRIZWFkZXIgfHwgdGFyZ2V0SGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcGlja2xpc3QtdGl0bGVcIiAqbmdJZj1cIiF0YXJnZXRIZWFkZXJUZW1wbGF0ZVwiPnt7IHRhcmdldEhlYWRlciB9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGFyZ2V0SGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1waWNrbGlzdC1maWx0ZXItY29udGFpbmVyXCIgKm5nSWY9XCJmaWx0ZXJCeSAmJiBzaG93VGFyZ2V0RmlsdGVyICE9PSBmYWxzZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidGFyZ2V0RmlsdGVyVGVtcGxhdGU7IGVsc2UgYnVpbHRJblRhcmdldEVsZW1lbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0YXJnZXRGaWx0ZXJUZW1wbGF0ZTsgY29udGV4dDogeyBvcHRpb25zOiB0YXJnZXRGaWx0ZXJPcHRpb25zIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbHRJblRhcmdldEVsZW1lbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1waWNrbGlzdC1maWx0ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI3RhcmdldEZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJ0ZXh0Ym94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uRmlsdGVyKCRldmVudCwgVEFSR0VUX0xJU1QpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBpY2tsaXN0LWZpbHRlci1pbnB1dCBwLWlucHV0dGV4dCBwLWNvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnBsYWNlaG9sZGVyXT1cInRhcmdldEZpbHRlclBsYWNlaG9sZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhVGFyZ2V0RmlsdGVyTGFiZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFNlYXJjaEljb24gKm5nSWY9XCIhdGFyZ2V0RmlsdGVySWNvblRlbXBsYXRlXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtcGlja2xpc3QtZmlsdGVyLWljb24nXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtcGlja2xpc3QtZmlsdGVyLWljb25cIiAqbmdJZj1cInRhcmdldEZpbHRlckljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0YXJnZXRGaWx0ZXJJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDx1bCAjdGFyZ2V0bGlzdCBjbGFzcz1cInAtcGlja2xpc3QtbGlzdCBwLXBpY2tsaXN0LXRhcmdldFwiIGNka0Ryb3BMaXN0IFtjZGtEcm9wTGlzdERhdGFdPVwidGFyZ2V0XCIgKGNka0Ryb3BMaXN0RHJvcHBlZCk9XCJvbkRyb3AoJGV2ZW50LCBUQVJHRVRfTElTVClcIiBbbmdTdHlsZV09XCJ0YXJnZXRTdHlsZVwiIHJvbGU9XCJsaXN0Ym94XCIgYXJpYS1tdWx0aXNlbGVjdGFibGU9XCJtdWx0aXBsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LWl0ZW0gW25nRm9yT2ZdPVwidGFyZ2V0XCIgW25nRm9yVHJhY2tCeV09XCJ0YXJnZXRUcmFja0J5IHx8IHRyYWNrQnlcIiBsZXQtaT1cImluZGV4XCIgbGV0LWw9XCJsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLXBpY2tsaXN0LWl0ZW0nOiB0cnVlLCAncC1oaWdobGlnaHQnOiBpc1NlbGVjdGVkKGl0ZW0sIHNlbGVjdGVkSXRlbXNUYXJnZXQpLCAncC1kaXNhYmxlZCc6IGRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZGtEcmFnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Nka0RyYWdEYXRhXT1cIml0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjZGtEcmFnRGlzYWJsZWRdPVwiIWRyYWdkcm9wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBzZWxlY3RlZEl0ZW1zVGFyZ2V0LCBvblRhcmdldFNlbGVjdClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkYmxjbGljayk9XCJvblRhcmdldEl0ZW1EYmxDbGljaygpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodG91Y2hlbmQpPVwib25JdGVtVG91Y2hFbmQoKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25JdGVtS2V5ZG93bigkZXZlbnQsIGl0ZW0sIHNlbGVjdGVkSXRlbXNUYXJnZXQsIG9uVGFyZ2V0U2VsZWN0KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJpc0l0ZW1WaXNpYmxlKGl0ZW0sIFRBUkdFVF9MSVNUKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwib3B0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cImlzU2VsZWN0ZWQoaXRlbSwgc2VsZWN0ZWRJdGVtc1RhcmdldClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtLCBpbmRleDogaSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNFbXB0eShUQVJHRVRfTElTVCkgJiYgKGVtcHR5TWVzc2FnZVRhcmdldFRlbXBsYXRlIHx8IGVtcHR5RmlsdGVyTWVzc2FnZVRhcmdldFRlbXBsYXRlKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1waWNrbGlzdC1lbXB0eS1tZXNzYWdlXCIgKm5nSWY9XCIhZmlsdGVyVmFsdWVUYXJnZXQgfHwgIWVtcHR5RmlsdGVyTWVzc2FnZVRhcmdldFRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVtcHR5TWVzc2FnZVRhcmdldFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1waWNrbGlzdC1lbXB0eS1tZXNzYWdlXCIgKm5nSWY9XCJmaWx0ZXJWYWx1ZVRhcmdldFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJlbXB0eUZpbHRlck1lc3NhZ2VUYXJnZXRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcGlja2xpc3QtYnV0dG9ucyBwLXBpY2tsaXN0LXRhcmdldC1jb250cm9sc1wiICpuZ0lmPVwic2hvd1RhcmdldENvbnRyb2xzXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJ1cEJ1dHRvbkFyaWFMYWJlbFwiIHBCdXR0b24gcFJpcHBsZSBjbGFzcz1cInAtYnV0dG9uLWljb24tb25seVwiIFtkaXNhYmxlZF09XCJ0YXJnZXRNb3ZlRGlzYWJsZWQoKVwiIChjbGljayk9XCJtb3ZlVXAodGFyZ2V0bGlzdCwgdGFyZ2V0LCBzZWxlY3RlZEl0ZW1zVGFyZ2V0LCBvblRhcmdldFJlb3JkZXIsIFRBUkdFVF9MSVNUKVwiPlxuICAgICAgICAgICAgICAgICAgICA8QW5nbGVVcEljb24gKm5nSWY9XCIhbW92ZVVwSWNvblRlbXBsYXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibW92ZVVwSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cInRvcEJ1dHRvbkFyaWFMYWJlbFwiIHBCdXR0b24gcFJpcHBsZSBjbGFzcz1cInAtYnV0dG9uLWljb24tb25seVwiIFtkaXNhYmxlZF09XCJ0YXJnZXRNb3ZlRGlzYWJsZWQoKVwiIChjbGljayk9XCJtb3ZlVG9wKHRhcmdldGxpc3QsIHRhcmdldCwgc2VsZWN0ZWRJdGVtc1RhcmdldCwgb25UYXJnZXRSZW9yZGVyLCBUQVJHRVRfTElTVClcIj5cbiAgICAgICAgICAgICAgICAgICAgPEFuZ2xlRG91YmxlVXBJY29uICpuZ0lmPVwiIW1vdmVUb3BJY29uVGVtcGxhdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJtb3ZlVG9wSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cImRvd25CdXR0b25BcmlhTGFiZWxcIiBwQnV0dG9uIHBSaXBwbGUgY2xhc3M9XCJwLWJ1dHRvbi1pY29uLW9ubHlcIiBbZGlzYWJsZWRdPVwidGFyZ2V0TW92ZURpc2FibGVkKClcIiAoY2xpY2spPVwibW92ZURvd24odGFyZ2V0bGlzdCwgdGFyZ2V0LCBzZWxlY3RlZEl0ZW1zVGFyZ2V0LCBvblRhcmdldFJlb3JkZXIsIFRBUkdFVF9MSVNUKVwiPlxuICAgICAgICAgICAgICAgICAgICA8QW5nbGVEb3duSWNvbiAqbmdJZj1cIiFtb3ZlRG93bkljb25UZW1wbGF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm1vdmVEb3duSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cImJvdHRvbUJ1dHRvbkFyaWFMYWJlbFwiIHBCdXR0b24gcFJpcHBsZSBjbGFzcz1cInAtYnV0dG9uLWljb24tb25seVwiIFtkaXNhYmxlZF09XCJ0YXJnZXRNb3ZlRGlzYWJsZWQoKVwiIChjbGljayk9XCJtb3ZlQm90dG9tKHRhcmdldGxpc3QsIHRhcmdldCwgc2VsZWN0ZWRJdGVtc1RhcmdldCwgb25UYXJnZXRSZW9yZGVyLCBUQVJHRVRfTElTVClcIj5cbiAgICAgICAgICAgICAgICAgICAgPEFuZ2xlRG91YmxlRG93bkljb24gKm5nSWY9XCIhbW92ZUJvdHRvbUljb25UZW1wbGF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm1vdmVCb3R0b21JY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9waWNrbGlzdC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgUGlja0xpc3QgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0IHtcbiAgICBASW5wdXQoKSBzb3VyY2U6IGFueVtdO1xuXG4gICAgQElucHV0KCkgdGFyZ2V0OiBhbnlbXTtcblxuICAgIEBJbnB1dCgpIHNvdXJjZUhlYWRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcmlnaHRCdXR0b25BcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxlZnRCdXR0b25BcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFsbFJpZ2h0QnV0dG9uQXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhbGxMZWZ0QnV0dG9uQXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB1cEJ1dHRvbkFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZG93bkJ1dHRvbkFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdG9wQnV0dG9uQXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBib3R0b21CdXR0b25BcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhcmdldEhlYWRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGZpbHRlckJ5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJMb2NhbGU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRyYWNrQnk6IEZ1bmN0aW9uID0gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gaXRlbTtcblxuICAgIEBJbnB1dCgpIHNvdXJjZVRyYWNrQnk6IEZ1bmN0aW9uO1xuXG4gICAgQElucHV0KCkgdGFyZ2V0VHJhY2tCeTogRnVuY3Rpb247XG5cbiAgICBASW5wdXQoKSBzaG93U291cmNlRmlsdGVyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNob3dUYXJnZXRGaWx0ZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgbWV0YUtleVNlbGVjdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBkcmFnZHJvcDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNvdXJjZVN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSB0YXJnZXRTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc2hvd1NvdXJjZUNvbnRyb2xzOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNob3dUYXJnZXRDb250cm9sczogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzb3VyY2VGaWx0ZXJQbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdGFyZ2V0RmlsdGVyUGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBhcmlhU291cmNlRmlsdGVyTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFUYXJnZXRGaWx0ZXJMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZmlsdGVyTWF0Y2hNb2RlOiBzdHJpbmcgPSAnY29udGFpbnMnO1xuXG4gICAgQElucHV0KCkgZ2V0IGJyZWFrcG9pbnQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JyZWFrcG9pbnQ7XG4gICAgfVxuXG4gICAgc2V0IGJyZWFrcG9pbnQodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX2JyZWFrcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2JyZWFrcG9pbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95TWVkaWEoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRNZWRpYSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgc3RyaXBlZFJvd3M6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBrZWVwU2VsZWN0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAT3V0cHV0KCkgb25Nb3ZlVG9Tb3VyY2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uTW92ZUFsbFRvU291cmNlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbk1vdmVBbGxUb1RhcmdldDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Nb3ZlVG9UYXJnZXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU291cmNlUmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25UYXJnZXRSZW9yZGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNvdXJjZVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25UYXJnZXRTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU291cmNlRmlsdGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblRhcmdldEZpbHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdzb3VyY2VsaXN0JykgbGlzdFZpZXdTb3VyY2VDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RhcmdldGxpc3QnKSBsaXN0Vmlld1RhcmdldENoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnc291cmNlRmlsdGVyJykgc291cmNlRmlsdGVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgndGFyZ2V0RmlsdGVyJykgdGFyZ2V0RmlsdGVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgX2JyZWFrcG9pbnQ6IHN0cmluZyA9ICc5NjBweCc7XG5cbiAgICBwdWJsaWMgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbW92ZVRvcEljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG1vdmVVcEljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG1vdmVEb3duSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbW92ZUJvdHRvbUljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG1vdmVUb1RhcmdldEljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG1vdmVBbGxUb1RhcmdldEljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG1vdmVUb1NvdXJjZUljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG1vdmVBbGxUb1NvdXJjZUljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHRhcmdldEZpbHRlckljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHNvdXJjZUZpbHRlckljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHB1YmxpYyB2aXNpYmxlT3B0aW9uc1NvdXJjZTogYW55W107XG5cbiAgICBwdWJsaWMgdmlzaWJsZU9wdGlvbnNUYXJnZXQ6IGFueVtdO1xuXG4gICAgc2VsZWN0ZWRJdGVtc1NvdXJjZTogYW55W10gPSBbXTtcblxuICAgIHNlbGVjdGVkSXRlbXNUYXJnZXQ6IGFueVtdID0gW107XG5cbiAgICByZW9yZGVyZWRMaXN0RWxlbWVudDogYW55O1xuXG4gICAgbW92ZWRVcDogYm9vbGVhbjtcblxuICAgIG1vdmVkRG93bjogYm9vbGVhbjtcblxuICAgIGl0ZW1Ub3VjaGVkOiBib29sZWFuO1xuXG4gICAgc3R5bGVFbGVtZW50OiBhbnk7XG5cbiAgICBpZDogc3RyaW5nID0gVW5pcXVlQ29tcG9uZW50SWQoKTtcblxuICAgIGZpbHRlclZhbHVlU291cmNlOiBzdHJpbmc7XG5cbiAgICBmaWx0ZXJWYWx1ZVRhcmdldDogc3RyaW5nO1xuXG4gICAgZnJvbUxpc3RUeXBlOiBudW1iZXI7XG5cbiAgICBlbXB0eU1lc3NhZ2VTb3VyY2VUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGVtcHR5RmlsdGVyTWVzc2FnZVNvdXJjZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZW1wdHlNZXNzYWdlVGFyZ2V0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBlbXB0eUZpbHRlck1lc3NhZ2VUYXJnZXRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHNvdXJjZUhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgdGFyZ2V0SGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBzb3VyY2VGaWx0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHRhcmdldEZpbHRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgc291cmNlRmlsdGVyT3B0aW9uczogUGlja0xpc3RGaWx0ZXJPcHRpb25zO1xuXG4gICAgdGFyZ2V0RmlsdGVyT3B0aW9uczogUGlja0xpc3RGaWx0ZXJPcHRpb25zO1xuXG4gICAgcmVhZG9ubHkgU09VUkNFX0xJU1QgPSAtMTtcblxuICAgIHJlYWRvbmx5IFRBUkdFVF9MSVNUID0gMTtcblxuICAgIHdpbmRvdzogV2luZG93O1xuXG4gICAgbWVkaWE6IE1lZGlhUXVlcnlMaXN0IHwgbnVsbDtcblxuICAgIHZpZXdDaGFuZ2VkOiBib29sZWFuO1xuXG4gICAgbWVkaWFDaGFuZ2VMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyBmaWx0ZXJTZXJ2aWNlOiBGaWx0ZXJTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMud2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldyBhcyBXaW5kb3c7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdE1lZGlhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWx0ZXJCeSkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2VGaWx0ZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB0aGlzLmZpbHRlclNvdXJjZSh2YWx1ZSksXG4gICAgICAgICAgICAgICAgcmVzZXQ6ICgpID0+IHRoaXMucmVzZXRTb3VyY2VGaWx0ZXIoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy50YXJnZXRGaWx0ZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB0aGlzLmZpbHRlclRhcmdldCh2YWx1ZSksXG4gICAgICAgICAgICAgICAgcmVzZXQ6ICgpID0+IHRoaXMucmVzZXRUYXJnZXRGaWx0ZXIoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2l0ZW0nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc291cmNlSGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VIZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGFyZ2V0SGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRIZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc291cmNlRmlsdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VGaWx0ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGFyZ2V0RmlsdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRGaWx0ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHltZXNzYWdlc291cmNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eU1lc3NhZ2VTb3VyY2VUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHlmaWx0ZXJtZXNzYWdlc291cmNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eUZpbHRlck1lc3NhZ2VTb3VyY2VUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHltZXNzYWdldGFyZ2V0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eU1lc3NhZ2VUYXJnZXRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHlmaWx0ZXJtZXNzYWdldGFyZ2V0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eUZpbHRlck1lc3NhZ2VUYXJnZXRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbW92ZXVwaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVVwSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdtb3ZldG9waWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRvcEljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbW92ZWRvd25pY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlRG93bkljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbW92ZWJvdHRvbWljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCb3R0b21JY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ21vdmV0b3RhcmdldGljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhcmdldEljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbW92ZWFsbHRvdGFyZ2V0aWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUFsbFRvVGFyZ2V0SWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdtb3ZldG9zb3VyY2VpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG9Tb3VyY2VJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ21vdmVhbGx0b3NvdXJjZWljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVBbGxUb1NvdXJjZUljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndGFyZ2V0ZmlsdGVyaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0RmlsdGVySWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdzb3VyY2VmaWx0ZXJpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VGaWx0ZXJJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMubW92ZWRVcCB8fCB0aGlzLm1vdmVkRG93bikge1xuICAgICAgICAgICAgbGV0IGxpc3RJdGVtcyA9IERvbUhhbmRsZXIuZmluZCh0aGlzLnJlb3JkZXJlZExpc3RFbGVtZW50LCAnbGkucC1oaWdobGlnaHQnKTtcbiAgICAgICAgICAgIGxldCBsaXN0SXRlbTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZWRVcCkgbGlzdEl0ZW0gPSBsaXN0SXRlbXNbMF07XG4gICAgICAgICAgICBlbHNlIGxpc3RJdGVtID0gbGlzdEl0ZW1zW2xpc3RJdGVtcy5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgRG9tSGFuZGxlci5zY3JvbGxJblZpZXcodGhpcy5yZW9yZGVyZWRMaXN0RWxlbWVudCwgbGlzdEl0ZW0pO1xuICAgICAgICAgICAgdGhpcy5tb3ZlZFVwID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1vdmVkRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5yZW9yZGVyZWRMaXN0RWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhldmVudCwgaXRlbTogYW55LCBzZWxlY3RlZEl0ZW1zOiBhbnlbXSwgY2FsbGJhY2s6IEV2ZW50RW1pdHRlcjxhbnk+KSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKGl0ZW0sIHNlbGVjdGVkSXRlbXMpO1xuICAgICAgICBsZXQgc2VsZWN0ZWQgPSBpbmRleCAhPSAtMTtcbiAgICAgICAgbGV0IG1ldGFTZWxlY3Rpb24gPSB0aGlzLml0ZW1Ub3VjaGVkID8gZmFsc2UgOiB0aGlzLm1ldGFLZXlTZWxlY3Rpb247XG5cbiAgICAgICAgaWYgKG1ldGFTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGxldCBtZXRhS2V5ID0gZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgbWV0YUtleSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtZXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSBzZWxlY3RlZEl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICBlbHNlIHNlbGVjdGVkSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgaXRlbXM6IHNlbGVjdGVkSXRlbXMgfSk7XG5cbiAgICAgICAgdGhpcy5pdGVtVG91Y2hlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uU291cmNlSXRlbURibENsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcbiAgICB9XG5cbiAgICBvblRhcmdldEl0ZW1EYmxDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW92ZUxlZnQoKTtcbiAgICB9XG5cbiAgICBvbkZpbHRlcihldmVudDogS2V5Ym9hcmRFdmVudCwgbGlzdFR5cGU6IG51bWJlcikge1xuICAgICAgICBsZXQgcXVlcnkgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KS52YWx1ZTtcbiAgICAgICAgaWYgKGxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKSB0aGlzLmZpbHRlclNvdXJjZShxdWVyeSk7XG4gICAgICAgIGVsc2UgaWYgKGxpc3RUeXBlID09PSB0aGlzLlRBUkdFVF9MSVNUKSB0aGlzLmZpbHRlclRhcmdldChxdWVyeSk7XG4gICAgfVxuXG4gICAgZmlsdGVyU291cmNlKHZhbHVlOiBhbnkgPSAnJykge1xuICAgICAgICB0aGlzLmZpbHRlclZhbHVlU291cmNlID0gdmFsdWUudHJpbSgpLnRvTG9jYWxlTG93ZXJDYXNlKHRoaXMuZmlsdGVyTG9jYWxlKTtcbiAgICAgICAgdGhpcy5maWx0ZXIodGhpcy5zb3VyY2UsIHRoaXMuU09VUkNFX0xJU1QpO1xuICAgIH1cblxuICAgIGZpbHRlclRhcmdldCh2YWx1ZTogYW55ID0gJycpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCA9IHZhbHVlLnRyaW0oKS50b0xvY2FsZUxvd2VyQ2FzZSh0aGlzLmZpbHRlckxvY2FsZSk7XG4gICAgICAgIHRoaXMuZmlsdGVyKHRoaXMudGFyZ2V0LCB0aGlzLlRBUkdFVF9MSVNUKTtcbiAgICB9XG5cbiAgICBmaWx0ZXIoZGF0YTogYW55W10sIGxpc3RUeXBlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHNlYXJjaEZpZWxkcyA9IHRoaXMuZmlsdGVyQnkuc3BsaXQoJywnKTtcblxuICAgICAgICBpZiAobGlzdFR5cGUgPT09IHRoaXMuU09VUkNFX0xJU1QpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZU9wdGlvbnNTb3VyY2UgPSB0aGlzLmZpbHRlclNlcnZpY2UuZmlsdGVyKGRhdGEsIHNlYXJjaEZpZWxkcywgdGhpcy5maWx0ZXJWYWx1ZVNvdXJjZSwgdGhpcy5maWx0ZXJNYXRjaE1vZGUsIHRoaXMuZmlsdGVyTG9jYWxlKTtcbiAgICAgICAgICAgIHRoaXMub25Tb3VyY2VGaWx0ZXIuZW1pdCh7IHF1ZXJ5OiB0aGlzLmZpbHRlclZhbHVlU291cmNlLCB2YWx1ZTogdGhpcy52aXNpYmxlT3B0aW9uc1NvdXJjZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChsaXN0VHlwZSA9PT0gdGhpcy5UQVJHRVRfTElTVCkge1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlT3B0aW9uc1RhcmdldCA9IHRoaXMuZmlsdGVyU2VydmljZS5maWx0ZXIoZGF0YSwgc2VhcmNoRmllbGRzLCB0aGlzLmZpbHRlclZhbHVlVGFyZ2V0LCB0aGlzLmZpbHRlck1hdGNoTW9kZSwgdGhpcy5maWx0ZXJMb2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5vblRhcmdldEZpbHRlci5lbWl0KHsgcXVlcnk6IHRoaXMuZmlsdGVyVmFsdWVUYXJnZXQsIHZhbHVlOiB0aGlzLnZpc2libGVPcHRpb25zVGFyZ2V0IH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNJdGVtVmlzaWJsZShpdGVtOiBhbnksIGxpc3RUeXBlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGxpc3RUeXBlID09IHRoaXMuU09VUkNFX0xJU1QpIHJldHVybiB0aGlzLmlzVmlzaWJsZUluTGlzdCh0aGlzLnZpc2libGVPcHRpb25zU291cmNlLCBpdGVtLCB0aGlzLmZpbHRlclZhbHVlU291cmNlKTtcbiAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5pc1Zpc2libGVJbkxpc3QodGhpcy52aXNpYmxlT3B0aW9uc1RhcmdldCwgaXRlbSwgdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCk7XG4gICAgfVxuXG4gICAgaXNFbXB0eShsaXN0VHlwZTogbnVtYmVyKSB7XG4gICAgICAgIGlmIChsaXN0VHlwZSA9PSB0aGlzLlNPVVJDRV9MSVNUKSByZXR1cm4gdGhpcy5maWx0ZXJWYWx1ZVNvdXJjZSA/ICF0aGlzLnZpc2libGVPcHRpb25zU291cmNlIHx8IHRoaXMudmlzaWJsZU9wdGlvbnNTb3VyY2UubGVuZ3RoID09PSAwIDogIXRoaXMuc291cmNlIHx8IHRoaXMuc291cmNlLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCA/ICF0aGlzLnZpc2libGVPcHRpb25zVGFyZ2V0IHx8IHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQubGVuZ3RoID09PSAwIDogIXRoaXMudGFyZ2V0IHx8IHRoaXMudGFyZ2V0Lmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICBpc1Zpc2libGVJbkxpc3QoZGF0YTogYW55W10sIGl0ZW06IGFueSwgZmlsdGVyVmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoZmlsdGVyVmFsdWUgJiYgZmlsdGVyVmFsdWUudHJpbSgpLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT0gZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSXRlbVRvdWNoRW5kKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pdGVtVG91Y2hlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzb3J0QnlJbmRleEluTGlzdChpdGVtczogYW55W10sIGxpc3Q6IGFueSkge1xuICAgICAgICByZXR1cm4gaXRlbXMuc29ydCgoaXRlbTEsIGl0ZW0yKSA9PiBPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3QoaXRlbTEsIGxpc3QpIC0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGl0ZW0yLCBsaXN0KSk7XG4gICAgfVxuXG4gICAgbW92ZVVwKGxpc3RFbGVtZW50LCBsaXN0LCBzZWxlY3RlZEl0ZW1zLCBjYWxsYmFjaywgbGlzdFR5cGUpIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMgPSB0aGlzLnNvcnRCeUluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbXMsIGxpc3QpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4OiBudW1iZXIgPSBPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCBsaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW0gPSBsaXN0W3NlbGVjdGVkSXRlbUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBsaXN0W3NlbGVjdGVkSXRlbUluZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGxpc3Rbc2VsZWN0ZWRJdGVtSW5kZXggLSAxXSA9IG1vdmVkSXRlbTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtzZWxlY3RlZEl0ZW1JbmRleF0gPSB0ZW1wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2Ryb3AgJiYgKCh0aGlzLmZpbHRlclZhbHVlU291cmNlICYmIGxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKSB8fCAodGhpcy5maWx0ZXJWYWx1ZVRhcmdldCAmJiBsaXN0VHlwZSA9PT0gdGhpcy5UQVJHRVRfTElTVCkpKSB0aGlzLmZpbHRlcihsaXN0LCBsaXN0VHlwZSk7XG5cbiAgICAgICAgICAgIHRoaXMubW92ZWRVcCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnJlb3JkZXJlZExpc3RFbGVtZW50ID0gbGlzdEVsZW1lbnQ7XG4gICAgICAgICAgICBjYWxsYmFjay5lbWl0KHsgaXRlbXM6IHNlbGVjdGVkSXRlbXMgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlVG9wKGxpc3RFbGVtZW50LCBsaXN0LCBzZWxlY3RlZEl0ZW1zLCBjYWxsYmFjaywgbGlzdFR5cGUpIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMgPSB0aGlzLnNvcnRCeUluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbXMsIGxpc3QpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4OiBudW1iZXIgPSBPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCBsaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW0gPSBsaXN0LnNwbGljZShzZWxlY3RlZEl0ZW1JbmRleCwgMSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxpc3QudW5zaGlmdChtb3ZlZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2Ryb3AgJiYgKCh0aGlzLmZpbHRlclZhbHVlU291cmNlICYmIGxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKSB8fCAodGhpcy5maWx0ZXJWYWx1ZVRhcmdldCAmJiBsaXN0VHlwZSA9PT0gdGhpcy5UQVJHRVRfTElTVCkpKSB0aGlzLmZpbHRlcihsaXN0LCBsaXN0VHlwZSk7XG5cbiAgICAgICAgICAgIGxpc3RFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgICBjYWxsYmFjay5lbWl0KHsgaXRlbXM6IHNlbGVjdGVkSXRlbXMgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlRG93bihsaXN0RWxlbWVudCwgbGlzdCwgc2VsZWN0ZWRJdGVtcywgY2FsbGJhY2ssIGxpc3RUeXBlKSB7XG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW1zICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zb3J0QnlJbmRleEluTGlzdChzZWxlY3RlZEl0ZW1zLCBsaXN0KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4OiBudW1iZXIgPSBPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCBsaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCAhPSBsaXN0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vdmVkSXRlbSA9IGxpc3Rbc2VsZWN0ZWRJdGVtSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IGxpc3Rbc2VsZWN0ZWRJdGVtSW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtzZWxlY3RlZEl0ZW1JbmRleCArIDFdID0gbW92ZWRJdGVtO1xuICAgICAgICAgICAgICAgICAgICBsaXN0W3NlbGVjdGVkSXRlbUluZGV4XSA9IHRlbXA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZHJvcCAmJiAoKHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UgJiYgbGlzdFR5cGUgPT09IHRoaXMuU09VUkNFX0xJU1QpIHx8ICh0aGlzLmZpbHRlclZhbHVlVGFyZ2V0ICYmIGxpc3RUeXBlID09PSB0aGlzLlRBUkdFVF9MSVNUKSkpIHRoaXMuZmlsdGVyKGxpc3QsIGxpc3RUeXBlKTtcblxuICAgICAgICAgICAgdGhpcy5tb3ZlZERvd24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5yZW9yZGVyZWRMaXN0RWxlbWVudCA9IGxpc3RFbGVtZW50O1xuICAgICAgICAgICAgY2FsbGJhY2suZW1pdCh7IGl0ZW1zOiBzZWxlY3RlZEl0ZW1zIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUJvdHRvbShsaXN0RWxlbWVudCwgbGlzdCwgc2VsZWN0ZWRJdGVtcywgY2FsbGJhY2ssIGxpc3RUeXBlKSB7XG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW1zICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zb3J0QnlJbmRleEluTGlzdChzZWxlY3RlZEl0ZW1zLCBsaXN0KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4OiBudW1iZXIgPSBPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCBsaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCAhPSBsaXN0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vdmVkSXRlbSA9IGxpc3Quc3BsaWNlKHNlbGVjdGVkSXRlbUluZGV4LCAxKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKG1vdmVkSXRlbSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZHJvcCAmJiAoKHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UgJiYgbGlzdFR5cGUgPT09IHRoaXMuU09VUkNFX0xJU1QpIHx8ICh0aGlzLmZpbHRlclZhbHVlVGFyZ2V0ICYmIGxpc3RUeXBlID09PSB0aGlzLlRBUkdFVF9MSVNUKSkpIHRoaXMuZmlsdGVyKGxpc3QsIGxpc3RUeXBlKTtcblxuICAgICAgICAgICAgbGlzdEVsZW1lbnQuc2Nyb2xsVG9wID0gbGlzdEVsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgY2FsbGJhY2suZW1pdCh7IGl0ZW1zOiBzZWxlY3RlZEl0ZW1zIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVJpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlICYmIHRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZVtpXTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgdGhpcy50YXJnZXQpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnB1c2godGhpcy5zb3VyY2Uuc3BsaWNlKE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChzZWxlY3RlZEl0ZW0sIHRoaXMuc291cmNlKSwgMSlbMF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVPcHRpb25zU291cmNlKSB0aGlzLnZpc2libGVPcHRpb25zU291cmNlLnNwbGljZShPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCB0aGlzLnZpc2libGVPcHRpb25zU291cmNlKSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTW92ZVRvVGFyZ2V0LmVtaXQoe1xuICAgICAgICAgICAgICAgIGl0ZW1zOiB0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5rZWVwU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0ID0gWy4uLnRoaXMuc2VsZWN0ZWRJdGVtc1RhcmdldCwgLi4udGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlID0gW107XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlclZhbHVlVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXIodGhpcy50YXJnZXQsIHRoaXMuVEFSR0VUX0xJU1QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUFsbFJpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW1zID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0l0ZW1WaXNpYmxlKHRoaXMuc291cmNlW2ldLCB0aGlzLlNPVVJDRV9MSVNUKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlZEl0ZW0gPSB0aGlzLnNvdXJjZS5zcGxpY2UoaSwgMSlbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnB1c2gocmVtb3ZlZEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBtb3ZlZEl0ZW1zLnB1c2gocmVtb3ZlZEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uTW92ZUFsbFRvVGFyZ2V0LmVtaXQoe1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBtb3ZlZEl0ZW1zXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMua2VlcFNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1RhcmdldCA9IFsuLi50aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQsIC4uLnRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZSA9IFtdO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJWYWx1ZVRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyKHRoaXMudGFyZ2V0LCB0aGlzLlRBUkdFVF9MSVNUKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52aXNpYmxlT3B0aW9uc1NvdXJjZSA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQgJiYgdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtID0gdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCB0aGlzLnNvdXJjZSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UucHVzaCh0aGlzLnRhcmdldC5zcGxpY2UoT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgdGhpcy50YXJnZXQpLCAxKVswXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQpIHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQuc3BsaWNlKE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChzZWxlY3RlZEl0ZW0sIHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQpLCAxKVswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub25Nb3ZlVG9Tb3VyY2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgaXRlbXM6IHRoaXMuc2VsZWN0ZWRJdGVtc1RhcmdldFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmtlZXBTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2UgPSBbLi4udGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlLCAuLi50aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXRdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcih0aGlzLnNvdXJjZSwgdGhpcy5TT1VSQ0VfTElTVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQWxsTGVmdCgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICBsZXQgbW92ZWRJdGVtcyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJdGVtVmlzaWJsZSh0aGlzLnRhcmdldFtpXSwgdGhpcy5UQVJHRVRfTElTVCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbW92ZWRJdGVtID0gdGhpcy50YXJnZXQuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5wdXNoKHJlbW92ZWRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgbW92ZWRJdGVtcy5wdXNoKHJlbW92ZWRJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vbk1vdmVBbGxUb1NvdXJjZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBpdGVtczogbW92ZWRJdGVtc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmtlZXBTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2UgPSBbLi4udGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlLCAuLi50aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXRdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcih0aGlzLnNvdXJjZSwgdGhpcy5TT1VSQ0VfTElTVCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU2VsZWN0ZWQoaXRlbTogYW55LCBzZWxlY3RlZEl0ZW1zOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihpdGVtLCBzZWxlY3RlZEl0ZW1zKSAhPSAtMTtcbiAgICB9XG5cbiAgICBmaW5kSW5kZXhJblNlbGVjdGlvbihpdGVtOiBhbnksIHNlbGVjdGVkSXRlbXM6IGFueVtdKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChpdGVtLCBzZWxlY3RlZEl0ZW1zKTtcbiAgICB9XG5cbiAgICBvbkRyb3AoZXZlbnQ6IENka0RyYWdEcm9wPHN0cmluZ1tdPiwgbGlzdFR5cGU6IG51bWJlcikge1xuICAgICAgICBsZXQgaXNUcmFuc2ZlciA9IGV2ZW50LnByZXZpb3VzQ29udGFpbmVyICE9PSBldmVudC5jb250YWluZXI7XG4gICAgICAgIGxldCBkcm9wSW5kZXhlcyA9IHRoaXMuZ2V0RHJvcEluZGV4ZXMoZXZlbnQucHJldmlvdXNJbmRleCwgZXZlbnQuY3VycmVudEluZGV4LCBsaXN0VHlwZSwgaXNUcmFuc2ZlciwgZXZlbnQuaXRlbS5kYXRhKTtcblxuICAgICAgICBpZiAobGlzdFR5cGUgPT09IHRoaXMuU09VUkNFX0xJU1QpIHtcbiAgICAgICAgICAgIGlmIChpc1RyYW5zZmVyKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmZXJBcnJheUl0ZW0oZXZlbnQucHJldmlvdXNDb250YWluZXIuZGF0YSwgZXZlbnQuY29udGFpbmVyLmRhdGEsIGRyb3BJbmRleGVzLnByZXZpb3VzSW5kZXgsIGRyb3BJbmRleGVzLmN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4ID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGV2ZW50Lml0ZW0uZGF0YSwgdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQuc3BsaWNlKHNlbGVjdGVkSXRlbUluZGV4LCAxKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5rZWVwU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQucHVzaChldmVudC5pdGVtLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQpIHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQuc3BsaWNlKGV2ZW50LnByZXZpb3VzSW5kZXgsIDEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdmVUb1NvdXJjZS5lbWl0KHsgaXRlbXM6IFtldmVudC5pdGVtLmRhdGFdIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3ZlSXRlbUluQXJyYXkoZXZlbnQuY29udGFpbmVyLmRhdGEsIGRyb3BJbmRleGVzLnByZXZpb3VzSW5kZXgsIGRyb3BJbmRleGVzLmN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNvdXJjZVJlb3JkZXIuZW1pdCh7IGl0ZW1zOiBbZXZlbnQuaXRlbS5kYXRhXSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcih0aGlzLnNvdXJjZSwgdGhpcy5TT1VSQ0VfTElTVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNUcmFuc2Zlcikge1xuICAgICAgICAgICAgICAgIHRyYW5zZmVyQXJyYXlJdGVtKGV2ZW50LnByZXZpb3VzQ29udGFpbmVyLmRhdGEsIGV2ZW50LmNvbnRhaW5lci5kYXRhLCBkcm9wSW5kZXhlcy5wcmV2aW91c0luZGV4LCBkcm9wSW5kZXhlcy5jdXJyZW50SW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4ID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGV2ZW50Lml0ZW0uZGF0YSwgdGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2Uuc3BsaWNlKHNlbGVjdGVkSXRlbUluZGV4LCAxKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5rZWVwU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQucHVzaChldmVudC5pdGVtLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZU9wdGlvbnNTb3VyY2UpIHRoaXMudmlzaWJsZU9wdGlvbnNTb3VyY2Uuc3BsaWNlKGV2ZW50LnByZXZpb3VzSW5kZXgsIDEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdmVUb1RhcmdldC5lbWl0KHsgaXRlbXM6IFtldmVudC5pdGVtLmRhdGFdIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3ZlSXRlbUluQXJyYXkoZXZlbnQuY29udGFpbmVyLmRhdGEsIGRyb3BJbmRleGVzLnByZXZpb3VzSW5kZXgsIGRyb3BJbmRleGVzLmN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRhcmdldFJlb3JkZXIuZW1pdCh7IGl0ZW1zOiBbZXZlbnQuaXRlbS5kYXRhXSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyVmFsdWVUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcih0aGlzLnRhcmdldCwgdGhpcy5UQVJHRVRfTElTVCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREcm9wSW5kZXhlcyhmcm9tSW5kZXgsIHRvSW5kZXgsIGRyb3BwZWRMaXN0LCBpc1RyYW5zZmVyLCBkYXRhKSB7XG4gICAgICAgIGxldCBwcmV2aW91c0luZGV4LCBjdXJyZW50SW5kZXg7XG5cbiAgICAgICAgaWYgKGRyb3BwZWRMaXN0ID09PSB0aGlzLlNPVVJDRV9MSVNUKSB7XG4gICAgICAgICAgICBwcmV2aW91c0luZGV4ID0gaXNUcmFuc2ZlciA/ICh0aGlzLmZpbHRlclZhbHVlVGFyZ2V0ID8gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGRhdGEsIHRoaXMudGFyZ2V0KSA6IGZyb21JbmRleCkgOiB0aGlzLmZpbHRlclZhbHVlU291cmNlID8gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGRhdGEsIHRoaXMuc291cmNlKSA6IGZyb21JbmRleDtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UgPyB0aGlzLmZpbmRGaWx0ZXJlZEN1cnJlbnRJbmRleCh0aGlzLnZpc2libGVPcHRpb25zU291cmNlLCB0b0luZGV4LCB0aGlzLnNvdXJjZSkgOiB0b0luZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldmlvdXNJbmRleCA9IGlzVHJhbnNmZXIgPyAodGhpcy5maWx0ZXJWYWx1ZVNvdXJjZSA/IE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChkYXRhLCB0aGlzLnNvdXJjZSkgOiBmcm9tSW5kZXgpIDogdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCA/IE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChkYXRhLCB0aGlzLnRhcmdldCkgOiBmcm9tSW5kZXg7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSB0aGlzLmZpbHRlclZhbHVlVGFyZ2V0ID8gdGhpcy5maW5kRmlsdGVyZWRDdXJyZW50SW5kZXgodGhpcy52aXNpYmxlT3B0aW9uc1RhcmdldCwgdG9JbmRleCwgdGhpcy50YXJnZXQpIDogdG9JbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHByZXZpb3VzSW5kZXgsIGN1cnJlbnRJbmRleCB9O1xuICAgIH1cblxuICAgIGZpbmRGaWx0ZXJlZEN1cnJlbnRJbmRleCh2aXNpYmxlT3B0aW9ucywgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHZpc2libGVPcHRpb25zLmxlbmd0aCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgIGxldCB0b0luZGV4ID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHZpc2libGVPcHRpb25zW2luZGV4IC0gMV0sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdG9JbmRleCArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHZpc2libGVPcHRpb25zW2luZGV4XSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldFNvdXJjZUZpbHRlcigpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlT3B0aW9uc1NvdXJjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNvdXJjZUZpbHRlclZpZXdDaGlsZCAmJiAoKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuc291cmNlRmlsdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLnZhbHVlID0gJycpO1xuICAgIH1cblxuICAgIHJlc2V0VGFyZ2V0RmlsdGVyKCkge1xuICAgICAgICB0aGlzLnZpc2libGVPcHRpb25zVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCA9IG51bGw7XG4gICAgICAgIHRoaXMudGFyZ2V0RmlsdGVyVmlld0NoaWxkICYmICgoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy50YXJnZXRGaWx0ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkudmFsdWUgPSAnJyk7XG4gICAgfVxuXG4gICAgcmVzZXRGaWx0ZXIoKSB7XG4gICAgICAgIHRoaXMucmVzZXRTb3VyY2VGaWx0ZXIoKTtcbiAgICAgICAgdGhpcy5yZXNldFRhcmdldEZpbHRlcigpO1xuICAgIH1cblxuICAgIG9uSXRlbUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGl0ZW06IGFueSwgc2VsZWN0ZWRJdGVtczogYW55W10sIGNhbGxiYWNrOiBFdmVudEVtaXR0ZXI8YW55Pikge1xuICAgICAgICBsZXQgbGlzdEl0ZW0gPSA8SFRNTExJRWxlbWVudD5ldmVudC5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgIC8vZG93blxuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEl0ZW0gPSB0aGlzLmZpbmROZXh0SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy91cFxuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICB2YXIgcHJldkl0ZW0gPSB0aGlzLmZpbmRQcmV2SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZJdGVtLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy9lbnRlclxuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uSXRlbUNsaWNrKGV2ZW50LCBpdGVtLCBzZWxlY3RlZEl0ZW1zLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmROZXh0SXRlbShpdGVtKSB7XG4gICAgICAgIGxldCBuZXh0SXRlbSA9IGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChuZXh0SXRlbSkgcmV0dXJuICFEb21IYW5kbGVyLmhhc0NsYXNzKG5leHRJdGVtLCAncC1waWNrbGlzdC1pdGVtJykgfHwgRG9tSGFuZGxlci5pc0hpZGRlbihuZXh0SXRlbSkgPyB0aGlzLmZpbmROZXh0SXRlbShuZXh0SXRlbSkgOiBuZXh0SXRlbTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmaW5kUHJldkl0ZW0oaXRlbSkge1xuICAgICAgICBsZXQgcHJldkl0ZW0gPSBpdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKHByZXZJdGVtKSByZXR1cm4gIURvbUhhbmRsZXIuaGFzQ2xhc3MocHJldkl0ZW0sICdwLXBpY2tsaXN0LWl0ZW0nKSB8fCBEb21IYW5kbGVyLmlzSGlkZGVuKHByZXZJdGVtKSA/IHRoaXMuZmluZFByZXZJdGVtKHByZXZJdGVtKSA6IHByZXZJdGVtO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGluaXRNZWRpYSgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHRoaXMubWVkaWEgPSB0aGlzLndpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke3RoaXMuYnJlYWtwb2ludH0pYCk7XG4gICAgICAgICAgICB0aGlzLnZpZXdDaGFuZ2VkID0gdGhpcy5tZWRpYS5tYXRjaGVzO1xuICAgICAgICAgICAgdGhpcy5iaW5kTWVkaWFDaGFuZ2VMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveU1lZGlhKCkge1xuICAgICAgICB0aGlzLnVuYmluZE1lZGlhQ2hhbmdlTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBiaW5kTWVkaWFDaGFuZ2VMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMubWVkaWEgJiYgIXRoaXMubWVkaWFDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5tZWRpYUNoYW5nZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5tZWRpYSwgJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmlld0NoYW5nZWQgPSBldmVudC5tYXRjaGVzO1xuICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZE1lZGlhQ2hhbmdlTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLm1lZGlhQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubWVkaWFDaGFuZ2VMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5tZWRpYUNoYW5nZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVN0eWxlKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0eWxlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSwgdGhpcy5pZCwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuc3R5bGVFbGVtZW50LCAndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5kb2N1bWVudC5oZWFkLCB0aGlzLnN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6ICR7dGhpcy5icmVha3BvaW50fSkge1xuICAgICAgICAgICAgICAgICAgICAucC1waWNrbGlzdFske3RoaXMuaWR9XSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIC5wLXBpY2tsaXN0WyR7dGhpcy5pZH1dIC5wLXBpY2tsaXN0LWJ1dHRvbnMge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogdmFyKC0tY29udGVudC1wYWRkaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICAgICAgLnAtcGlja2xpc3RbJHt0aGlzLmlkfV0gLnAtcGlja2xpc3QtYnV0dG9ucyAucC1idXR0b24ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiB2YXIoLS1pbmxpbmUtc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIC5wLXBpY2tsaXN0WyR7dGhpcy5pZH1dIC5wLXBpY2tsaXN0LWJ1dHRvbnMgLnAtYnV0dG9uOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWA7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuc3R5bGVFbGVtZW50LCAnaW5uZXJIVE1MJywgaW5uZXJIVE1MKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvdXJjZU1vdmVEaXNhYmxlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGFyZ2V0TW92ZURpc2FibGVkKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlUmlnaHREaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgT2JqZWN0VXRpbHMuaXNFbXB0eSh0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2UpO1xuICAgIH1cblxuICAgIG1vdmVMZWZ0RGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8IE9iamVjdFV0aWxzLmlzRW1wdHkodGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0KTtcbiAgICB9XG5cbiAgICBtb3ZlQWxsUmlnaHREaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgT2JqZWN0VXRpbHMuaXNFbXB0eSh0aGlzLnNvdXJjZSk7XG4gICAgfVxuXG4gICAgbW92ZUFsbExlZnREaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgT2JqZWN0VXRpbHMuaXNFbXB0eSh0aGlzLnRhcmdldCk7XG4gICAgfVxuXG4gICAgZGVzdHJveVN0eWxlKCkge1xuICAgICAgICBpZiAodGhpcy5zdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5kb2N1bWVudC5oZWFkLCB0aGlzLnN0eWxlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnN0eWxlRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICBgYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3lTdHlsZSgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lNZWRpYSgpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBCdXR0b25Nb2R1bGUsIFNoYXJlZE1vZHVsZSwgUmlwcGxlTW9kdWxlLCBEcmFnRHJvcE1vZHVsZSwgQW5nbGVEb3VibGVEb3duSWNvbiwgQW5nbGVEb3VibGVMZWZ0SWNvbiwgQW5nbGVEb3VibGVSaWdodEljb24sIEFuZ2xlRG91YmxlVXBJY29uLCBBbmdsZURvd25JY29uLCBBbmdsZUxlZnRJY29uLCBBbmdsZVJpZ2h0SWNvbiwgQW5nbGVVcEljb24sIFNlYXJjaEljb24sIEhvbWVJY29uXSxcbiAgICBleHBvcnRzOiBbUGlja0xpc3QsIFNoYXJlZE1vZHVsZSwgRHJhZ0Ryb3BNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1BpY2tMaXN0XVxufSlcbmV4cG9ydCBjbGFzcyBQaWNrTGlzdE1vZHVsZSB7fVxuIl19