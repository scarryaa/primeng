import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, HostListener, Inject, Injectable, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { ScrollerModule } from 'primeng/scroller';
import { ObjectUtils } from 'primeng/utils';
import { Subject } from 'rxjs';
import { SortAmountDownIcon } from 'primeng/icons/sortamountdown';
import { ChevronRightIcon } from 'primeng/icons/chevronright';
import { ArrowDownIcon } from 'primeng/icons/arrowdown';
import { ArrowUpIcon } from 'primeng/icons/arrowup';
import { CheckIcon } from 'primeng/icons/check';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import { MinusIcon } from 'primeng/icons/minus';
import { SortAltIcon } from 'primeng/icons/sortalt';
import { SortAmountUpAltIcon } from 'primeng/icons/sortamountupalt';
import { SpinnerIcon } from 'primeng/icons/spinner';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/paginator";
import * as i4 from "primeng/scroller";
import * as i5 from "primeng/ripple";
export class TreeTableService {
    constructor() {
        this.sortSource = new Subject();
        this.selectionSource = new Subject();
        this.contextMenuSource = new Subject();
        this.uiUpdateSource = new Subject();
        this.totalRecordsSource = new Subject();
        this.sortSource$ = this.sortSource.asObservable();
        this.selectionSource$ = this.selectionSource.asObservable();
        this.contextMenuSource$ = this.contextMenuSource.asObservable();
        this.uiUpdateSource$ = this.uiUpdateSource.asObservable();
        this.totalRecordsSource$ = this.totalRecordsSource.asObservable();
    }
    onSort(sortMeta) {
        this.sortSource.next(sortMeta);
    }
    onSelectionChange() {
        this.selectionSource.next(null);
    }
    onContextMenu(node) {
        this.contextMenuSource.next(node);
    }
    onUIUpdate(value) {
        this.uiUpdateSource.next(value);
    }
    onTotalRecordsChange(value) {
        this.totalRecordsSource.next(value);
    }
}
TreeTableService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TreeTableService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableService, decorators: [{
            type: Injectable
        }] });
export class TreeTable {
    constructor(document, renderer, el, cd, zone, tableService, filterService) {
        this.document = document;
        this.renderer = renderer;
        this.el = el;
        this.cd = cd;
        this.zone = zone;
        this.tableService = tableService;
        this.filterService = filterService;
        this.lazy = false;
        this.lazyLoadOnInit = true;
        this.first = 0;
        this.pageLinks = 5;
        this.alwaysShowPaginator = true;
        this.paginatorPosition = 'bottom';
        this.currentPageReportTemplate = '{currentPage} of {totalPages}';
        this.showFirstLastIcon = true;
        this.showPageLinks = true;
        this.defaultSortOrder = 1;
        this.sortMode = 'single';
        this.resetPageOnSort = true;
        this.selectionChange = new EventEmitter();
        this.contextMenuSelectionChange = new EventEmitter();
        this.contextMenuSelectionMode = 'separate';
        this.compareSelectionBy = 'deepEquals';
        this.showLoader = true;
        this.virtualScrollDelay = 150;
        this.columnResizeMode = 'fit';
        this.rowTrackBy = (index, item) => item;
        this.filters = {};
        this.filterDelay = 300;
        this.filterMode = 'lenient';
        this.onFilter = new EventEmitter();
        this.onNodeExpand = new EventEmitter();
        this.onNodeCollapse = new EventEmitter();
        this.onPage = new EventEmitter();
        this.onSort = new EventEmitter();
        this.onLazyLoad = new EventEmitter();
        this.sortFunction = new EventEmitter();
        this.onColResize = new EventEmitter();
        this.onColReorder = new EventEmitter();
        this.onNodeSelect = new EventEmitter();
        this.onNodeUnselect = new EventEmitter();
        this.onContextMenuSelect = new EventEmitter();
        this.onHeaderCheckboxToggle = new EventEmitter();
        this.onEditInit = new EventEmitter();
        this.onEditComplete = new EventEmitter();
        this.onEditCancel = new EventEmitter();
        /* @deprecated */
        this._virtualRowHeight = 28;
        this._value = [];
        this._totalRecords = 0;
        this._sortOrder = 1;
        this.selectionKeys = {};
    }
    get virtualRowHeight() {
        return this._virtualRowHeight;
    }
    set virtualRowHeight(val) {
        this._virtualRowHeight = val;
        console.warn('The virtualRowHeight property is deprecated, use virtualScrollItemSize property instead.');
    }
    ngOnInit() {
        if (this.lazy && this.lazyLoadOnInit && !this.virtualScroll) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.initialized = true;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'caption':
                    this.captionTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'body':
                    this.bodyTemplate = item.template;
                    break;
                case 'loadingbody':
                    this.loadingBodyTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                case 'summary':
                    this.summaryTemplate = item.template;
                    break;
                case 'colgroup':
                    this.colGroupTemplate = item.template;
                    break;
                case 'emptymessage':
                    this.emptyMessageTemplate = item.template;
                    break;
                case 'paginatorleft':
                    this.paginatorLeftTemplate = item.template;
                    break;
                case 'paginatorright':
                    this.paginatorRightTemplate = item.template;
                    break;
                case 'paginatordropdownitem':
                    this.paginatorDropdownItemTemplate = item.template;
                    break;
                case 'frozenheader':
                    this.frozenHeaderTemplate = item.template;
                    break;
                case 'frozenbody':
                    this.frozenBodyTemplate = item.template;
                    break;
                case 'frozenfooter':
                    this.frozenFooterTemplate = item.template;
                    break;
                case 'frozencolgroup':
                    this.frozenColGroupTemplate = item.template;
                    break;
                case 'loadingicon':
                    this.loadingIconTemplate = item.template;
                    break;
                case 'reorderindicatorupicon':
                    this.reorderIndicatorUpIconTemplate = item.template;
                    break;
                case 'reorderindicatordownicon':
                    this.reorderIndicatorDownIconTemplate = item.template;
                    break;
                case 'sorticon':
                    this.sortIconTemplate = item.template;
                    break;
                case 'checkboxicon':
                    this.checkboxIconTemplate = item.template;
                    break;
                case 'headercheckboxicon':
                    this.headerCheckboxIconTemplate = item.template;
                    break;
                case 'togglericon':
                    this.togglerIconTemplate = item.template;
                    break;
                case 'paginatorfirstpagelinkicon':
                    this.paginatorFirstPageLinkIconTemplate = item.template;
                    break;
                case 'paginatorlastpagelinkicon':
                    this.paginatorLastPageLinkIconTemplate = item.template;
                    break;
                case 'paginatorpreviouspagelinkicon':
                    this.paginatorPreviousPageLinkIconTemplate = item.template;
                    break;
                case 'paginatornextpagelinkicon':
                    this.paginatorNextPageLinkIconTemplate = item.template;
                    break;
            }
        });
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.value) {
            this._value = simpleChange.value.currentValue;
            if (!this.lazy) {
                this.totalRecords = this._value ? this._value.length : 0;
                if (this.sortMode == 'single' && this.sortField)
                    this.sortSingle();
                else if (this.sortMode == 'multiple' && this.multiSortMeta)
                    this.sortMultiple();
                else if (this.hasFilter())
                    //sort already filters
                    this._filter();
            }
            this.updateSerializedValue();
            this.tableService.onUIUpdate(this.value);
        }
        if (simpleChange.sortField) {
            this._sortField = simpleChange.sortField.currentValue;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.sortOrder) {
            this._sortOrder = simpleChange.sortOrder.currentValue;
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy || this.initialized) {
                if (this.sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }
        if (simpleChange.multiSortMeta) {
            this._multiSortMeta = simpleChange.multiSortMeta.currentValue;
            if (this.sortMode === 'multiple') {
                this.sortMultiple();
            }
        }
        if (simpleChange.selection) {
            this._selection = simpleChange.selection.currentValue;
            if (!this.preventSelectionSetterPropagation) {
                this.updateSelectionKeys();
                this.tableService.onSelectionChange();
            }
            this.preventSelectionSetterPropagation = false;
        }
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }
    updateSerializedValue() {
        this.serializedValue = [];
        if (this.paginator)
            this.serializePageNodes();
        else
            this.serializeNodes(null, this.filteredNodes || this.value, 0, true);
    }
    serializeNodes(parent, nodes, level, visible) {
        if (nodes && nodes.length) {
            for (let node of nodes) {
                node.parent = parent;
                const rowNode = {
                    node: node,
                    parent: parent,
                    level: level,
                    visible: visible && (parent ? parent.expanded : true)
                };
                this.serializedValue.push(rowNode);
                if (rowNode.visible && node.expanded) {
                    this.serializeNodes(node, node.children, level + 1, rowNode.visible);
                }
            }
        }
    }
    serializePageNodes() {
        let data = this.filteredNodes || this.value;
        this.serializedValue = [];
        if (data && data.length) {
            const first = this.lazy ? 0 : this.first;
            for (let i = first; i < first + this.rows; i++) {
                let node = data[i];
                if (node) {
                    this.serializedValue.push({
                        node: node,
                        parent: null,
                        level: 0,
                        visible: true
                    });
                    this.serializeNodes(node, node.children, 1, true);
                }
            }
        }
    }
    get totalRecords() {
        return this._totalRecords;
    }
    set totalRecords(val) {
        this._totalRecords = val;
        this.tableService.onTotalRecordsChange(this._totalRecords);
    }
    get sortField() {
        return this._sortField;
    }
    set sortField(val) {
        this._sortField = val;
    }
    get sortOrder() {
        return this._sortOrder;
    }
    set sortOrder(val) {
        this._sortOrder = val;
    }
    get multiSortMeta() {
        return this._multiSortMeta;
    }
    set multiSortMeta(val) {
        this._multiSortMeta = val;
    }
    get selection() {
        return this._selection;
    }
    set selection(val) {
        this._selection = val;
    }
    updateSelectionKeys() {
        if (this.dataKey && this._selection) {
            this.selectionKeys = {};
            if (Array.isArray(this._selection)) {
                for (let node of this._selection) {
                    this.selectionKeys[String(ObjectUtils.resolveFieldData(node.data, this.dataKey))] = 1;
                }
            }
            else {
                this.selectionKeys[String(ObjectUtils.resolveFieldData(this._selection.data, this.dataKey))] = 1;
            }
        }
    }
    onPageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
        if (this.lazy)
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        else
            this.serializePageNodes();
        this.onPage.emit({
            first: this.first,
            rows: this.rows
        });
        this.tableService.onUIUpdate(this.value);
        if (this.scrollable) {
            this.resetScrollTop();
        }
    }
    sort(event) {
        let originalEvent = event.originalEvent;
        if (this.sortMode === 'single') {
            this._sortOrder = this.sortField === event.field ? this.sortOrder * -1 : this.defaultSortOrder;
            this._sortField = event.field;
            this.sortSingle();
            if (this.resetPageOnSort && this.scrollable) {
                this.resetScrollTop();
            }
        }
        if (this.sortMode === 'multiple') {
            let metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
            let sortMeta = this.getSortMeta(event.field);
            if (sortMeta) {
                if (!metaKey) {
                    this._multiSortMeta = [{ field: event.field, order: sortMeta.order * -1 }];
                    if (this.resetPageOnSort && this.scrollable) {
                        this.resetScrollTop();
                    }
                }
                else {
                    sortMeta.order = sortMeta.order * -1;
                }
            }
            else {
                if (!metaKey || !this.multiSortMeta) {
                    this._multiSortMeta = [];
                    if (this.resetPageOnSort && this.scrollable) {
                        this.resetScrollTop();
                    }
                }
                this.multiSortMeta.push({ field: event.field, order: this.defaultSortOrder });
            }
            this.sortMultiple();
        }
    }
    sortSingle() {
        if (this.sortField && this.sortOrder) {
            if (this.lazy) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else if (this.value) {
                this.sortNodes(this.value);
                if (this.hasFilter()) {
                    this._filter();
                }
            }
            let sortMeta = {
                field: this.sortField,
                order: this.sortOrder
            };
            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
            this.updateSerializedValue();
        }
    }
    sortNodes(nodes) {
        if (!nodes || nodes.length === 0) {
            return;
        }
        if (this.customSort) {
            this.sortFunction.emit({
                data: nodes,
                mode: this.sortMode,
                field: this.sortField,
                order: this.sortOrder
            });
        }
        else {
            nodes.sort((node1, node2) => {
                let value1 = ObjectUtils.resolveFieldData(node1.data, this.sortField);
                let value2 = ObjectUtils.resolveFieldData(node2.data, this.sortField);
                let result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                return this.sortOrder * result;
            });
        }
        for (let node of nodes) {
            this.sortNodes(node.children);
        }
    }
    sortMultiple() {
        if (this.multiSortMeta) {
            if (this.lazy) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else if (this.value) {
                this.sortMultipleNodes(this.value);
                if (this.hasFilter()) {
                    this._filter();
                }
            }
            this.onSort.emit({
                multisortmeta: this.multiSortMeta
            });
            this.updateSerializedValue();
            this.tableService.onSort(this.multiSortMeta);
        }
    }
    sortMultipleNodes(nodes) {
        if (!nodes || nodes.length === 0) {
            return;
        }
        if (this.customSort) {
            this.sortFunction.emit({
                data: this.value,
                mode: this.sortMode,
                multiSortMeta: this.multiSortMeta
            });
        }
        else {
            nodes.sort((node1, node2) => {
                return this.multisortField(node1, node2, this.multiSortMeta, 0);
            });
        }
        for (let node of nodes) {
            this.sortMultipleNodes(node.children);
        }
    }
    multisortField(node1, node2, multiSortMeta, index) {
        if (ObjectUtils.isEmpty(this.multiSortMeta) || ObjectUtils.isEmpty(multiSortMeta[index])) {
            return 0;
        }
        let value1 = ObjectUtils.resolveFieldData(node1.data, multiSortMeta[index].field);
        let value2 = ObjectUtils.resolveFieldData(node2.data, multiSortMeta[index].field);
        let result = null;
        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        if (typeof value1 == 'string' || value1 instanceof String) {
            if (value1.localeCompare && value1 != value2) {
                return multiSortMeta[index].order * value1.localeCompare(value2, undefined, { numeric: true });
            }
        }
        else {
            result = value1 < value2 ? -1 : 1;
        }
        if (value1 == value2) {
            return multiSortMeta.length - 1 > index ? this.multisortField(node1, node2, multiSortMeta, index + 1) : 0;
        }
        return multiSortMeta[index].order * result;
    }
    getSortMeta(field) {
        if (this.multiSortMeta && this.multiSortMeta.length) {
            for (let i = 0; i < this.multiSortMeta.length; i++) {
                if (this.multiSortMeta[i].field === field) {
                    return this.multiSortMeta[i];
                }
            }
        }
        return null;
    }
    isSorted(field) {
        if (this.sortMode === 'single') {
            return this.sortField && this.sortField === field;
        }
        else if (this.sortMode === 'multiple') {
            let sorted = false;
            if (this.multiSortMeta) {
                for (let i = 0; i < this.multiSortMeta.length; i++) {
                    if (this.multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }
    createLazyLoadMetadata() {
        return {
            first: this.first,
            rows: this.rows,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            filters: this.filters,
            globalFilter: this.filters && this.filters['global'] ? this.filters['global'].value : null,
            multiSortMeta: this.multiSortMeta,
            forceUpdate: () => this.cd.detectChanges()
        };
    }
    onLazyItemLoad(event) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: event.last - event.first
        });
    }
    resetScrollTop() {
        if (this.virtualScroll)
            this.scrollToVirtualIndex(0);
        else
            this.scrollTo({ top: 0 });
    }
    scrollToVirtualIndex(index) {
        if (this.scrollableViewChild) {
            this.scrollableViewChild.scrollToVirtualIndex(index);
        }
        if (this.scrollableFrozenViewChild) {
            this.scrollableFrozenViewChild.scrollToVirtualIndex(index);
        }
    }
    scrollTo(options) {
        if (this.scrollableViewChild) {
            this.scrollableViewChild.scrollTo(options);
        }
        if (this.scrollableFrozenViewChild) {
            this.scrollableFrozenViewChild.scrollTo(options);
        }
    }
    isEmpty() {
        let data = this.filteredNodes || this.value;
        return data == null || data.length == 0;
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    onColumnResizeBegin(event) {
        let containerLeft = DomHandler.getOffset(this.containerViewChild.nativeElement).left;
        this.lastResizerHelperX = event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft;
        event.preventDefault();
    }
    onColumnResize(event) {
        let containerLeft = DomHandler.getOffset(this.containerViewChild.nativeElement).left;
        DomHandler.addClass(this.containerViewChild.nativeElement, 'p-unselectable-text');
        this.resizeHelperViewChild.nativeElement.style.height = this.containerViewChild.nativeElement.offsetHeight + 'px';
        this.resizeHelperViewChild.nativeElement.style.top = 0 + 'px';
        this.resizeHelperViewChild.nativeElement.style.left = event.pageX - containerLeft + this.containerViewChild.nativeElement.scrollLeft + 'px';
        this.resizeHelperViewChild.nativeElement.style.display = 'block';
    }
    onColumnResizeEnd(event, column) {
        let delta = this.resizeHelperViewChild.nativeElement.offsetLeft - this.lastResizerHelperX;
        let columnWidth = column.offsetWidth;
        let newColumnWidth = columnWidth + delta;
        let minWidth = column.style.minWidth || 15;
        if (columnWidth + delta > parseInt(minWidth)) {
            if (this.columnResizeMode === 'fit') {
                let nextColumn = column.nextElementSibling;
                while (!nextColumn.offsetParent) {
                    nextColumn = nextColumn.nextElementSibling;
                }
                if (nextColumn) {
                    let nextColumnWidth = nextColumn.offsetWidth - delta;
                    let nextColumnMinWidth = nextColumn.style.minWidth || 15;
                    if (newColumnWidth > 15 && nextColumnWidth > parseInt(nextColumnMinWidth)) {
                        if (this.scrollable) {
                            let scrollableView = this.findParentScrollableView(column);
                            let scrollableBodyTable = DomHandler.findSingle(scrollableView, '.p-treetable-scrollable-body table') || DomHandler.findSingle(scrollableView, '.p-scroller-viewport table');
                            let scrollableHeaderTable = DomHandler.findSingle(scrollableView, 'table.p-treetable-scrollable-header-table');
                            let scrollableFooterTable = DomHandler.findSingle(scrollableView, 'table.p-treetable-scrollable-footer-table');
                            let resizeColumnIndex = DomHandler.index(column);
                            this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                        }
                        else {
                            column.style.width = newColumnWidth + 'px';
                            if (nextColumn) {
                                nextColumn.style.width = nextColumnWidth + 'px';
                            }
                        }
                    }
                }
            }
            else if (this.columnResizeMode === 'expand') {
                if (this.scrollable) {
                    let scrollableView = this.findParentScrollableView(column);
                    let scrollableBody = DomHandler.findSingle(scrollableView, '.p-treetable-scrollable-body') || DomHandler.findSingle(scrollableView, '.p-scroller-viewport');
                    let scrollableHeader = DomHandler.findSingle(scrollableView, '.p-treetable-scrollable-header');
                    let scrollableFooter = DomHandler.findSingle(scrollableView, '.p-treetable-scrollable-footer');
                    let scrollableBodyTable = DomHandler.findSingle(scrollableView, '.p-treetable-scrollable-body table') || DomHandler.findSingle(scrollableView, '.p-scroller-viewport table');
                    let scrollableHeaderTable = DomHandler.findSingle(scrollableView, 'table.p-treetable-scrollable-header-table');
                    let scrollableFooterTable = DomHandler.findSingle(scrollableView, 'table.p-treetable-scrollable-footer-table');
                    scrollableBodyTable.style.width = scrollableBodyTable.offsetWidth + delta + 'px';
                    scrollableHeaderTable.style.width = scrollableHeaderTable.offsetWidth + delta + 'px';
                    if (scrollableFooterTable) {
                        scrollableFooterTable.style.width = scrollableFooterTable.offsetWidth + delta + 'px';
                    }
                    let resizeColumnIndex = DomHandler.index(column);
                    const scrollableBodyTableWidth = column ? scrollableBodyTable.offsetWidth + delta : newColumnWidth;
                    const scrollableHeaderTableWidth = column ? scrollableHeaderTable.offsetWidth + delta : newColumnWidth;
                    const isContainerInViewport = this.containerViewChild.nativeElement.offsetWidth >= scrollableBodyTableWidth;
                    let setWidth = (container, table, width, isContainerInViewport) => {
                        if (container && table) {
                            container.style.width = isContainerInViewport ? width + DomHandler.calculateScrollbarWidth(scrollableBody) + 'px' : 'auto';
                            table.style.width = width + 'px';
                        }
                    };
                    setWidth(scrollableBody, scrollableBodyTable, scrollableBodyTableWidth, isContainerInViewport);
                    setWidth(scrollableHeader, scrollableHeaderTable, scrollableHeaderTableWidth, isContainerInViewport);
                    setWidth(scrollableFooter, scrollableFooterTable, scrollableHeaderTableWidth, isContainerInViewport);
                    this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, null);
                    this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, null);
                    this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, null);
                }
                else {
                    this.tableViewChild.nativeElement.style.width = this.tableViewChild.nativeElement.offsetWidth + delta + 'px';
                    column.style.width = newColumnWidth + 'px';
                    let containerWidth = this.tableViewChild.nativeElement.style.width;
                    this.containerViewChild.nativeElement.style.width = containerWidth + 'px';
                }
            }
            this.onColResize.emit({
                element: column,
                delta: delta
            });
        }
        this.resizeHelperViewChild.nativeElement.style.display = 'none';
        DomHandler.removeClass(this.containerViewChild.nativeElement, 'p-unselectable-text');
    }
    findParentScrollableView(column) {
        if (column) {
            let parent = column.parentElement;
            while (parent && !DomHandler.hasClass(parent, 'p-treetable-scrollable-view')) {
                parent = parent.parentElement;
            }
            return parent;
        }
        else {
            return null;
        }
    }
    resizeColGroup(table, resizeColumnIndex, newColumnWidth, nextColumnWidth) {
        if (table) {
            let colGroup = table.children[0].nodeName === 'COLGROUP' ? table.children[0] : null;
            if (colGroup) {
                let col = colGroup.children[resizeColumnIndex];
                let nextCol = col.nextElementSibling;
                col.style.width = newColumnWidth + 'px';
                if (nextCol && nextColumnWidth) {
                    nextCol.style.width = nextColumnWidth + 'px';
                }
            }
            else {
                throw 'Scrollable tables require a colgroup to support resizable columns';
            }
        }
    }
    onColumnDragStart(event, columnElement) {
        this.reorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild.nativeElement);
        this.reorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild.nativeElement);
        this.draggedColumn = columnElement;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }
    onColumnDragEnter(event, dropHeader) {
        if (this.reorderableColumns && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = DomHandler.getOffset(this.containerViewChild.nativeElement);
            let dropHeaderOffset = DomHandler.getOffset(dropHeader);
            if (this.draggedColumn != dropHeader) {
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
                this.reorderIndicatorUpViewChild.nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (this.reorderIconHeight - 1) + 'px';
                this.reorderIndicatorDownViewChild.nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';
                if (event.pageX > columnCenter) {
                    this.reorderIndicatorUpViewChild.nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.reorderIndicatorDownViewChild.nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = 1;
                }
                else {
                    this.reorderIndicatorUpViewChild.nativeElement.style.left = targetLeft - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.reorderIndicatorDownViewChild.nativeElement.style.left = targetLeft - Math.ceil(this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = -1;
                }
                this.reorderIndicatorUpViewChild.nativeElement.style.display = 'block';
                this.reorderIndicatorDownViewChild.nativeElement.style.display = 'block';
            }
            else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }
    onColumnDragLeave(event) {
        if (this.reorderableColumns && this.draggedColumn) {
            event.preventDefault();
            this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
            this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
        }
    }
    onColumnDrop(event, dropColumn) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'ttreorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'ttreorderablecolumn');
            let allowDrop = dragIndex != dropIndex;
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }
            if (allowDrop && dropIndex < dragIndex && this.dropPosition === 1) {
                dropIndex = dropIndex + 1;
            }
            if (allowDrop && dropIndex > dragIndex && this.dropPosition === -1) {
                dropIndex = dropIndex - 1;
            }
            if (allowDrop) {
                ObjectUtils.reorderArray(this.columns, dragIndex, dropIndex);
                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns
                });
            }
            this.reorderIndicatorUpViewChild.nativeElement.style.display = 'none';
            this.reorderIndicatorDownViewChild.nativeElement.style.display = 'none';
            this.draggedColumn.draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }
    handleRowClick(event) {
        let targetNode = event.originalEvent.target.nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || DomHandler.hasClass(event.originalEvent.target, 'p-clickable')) {
            return;
        }
        if (this.selectionMode) {
            this.preventSelectionSetterPropagation = true;
            let rowNode = event.rowNode;
            let selected = this.isSelected(rowNode.node);
            let metaSelection = this.rowTouched ? false : this.metaKeySelection;
            let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(rowNode.node.data, this.dataKey)) : null;
            if (metaSelection) {
                let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;
                if (selected && metaKey) {
                    if (this.isSingleSelectionMode()) {
                        this._selection = null;
                        this.selectionKeys = {};
                        this.selectionChange.emit(null);
                    }
                    else {
                        let selectionIndex = this.findIndexInSelection(rowNode.node);
                        this._selection = this.selection.filter((val, i) => i != selectionIndex);
                        this.selectionChange.emit(this.selection);
                        if (dataKeyValue) {
                            delete this.selectionKeys[dataKeyValue];
                        }
                    }
                    this.onNodeUnselect.emit({ originalEvent: event.originalEvent, node: rowNode.node, type: 'row' });
                }
                else {
                    if (this.isSingleSelectionMode()) {
                        this._selection = rowNode.node;
                        this.selectionChange.emit(rowNode.node);
                        if (dataKeyValue) {
                            this.selectionKeys = {};
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                    else if (this.isMultipleSelectionMode()) {
                        if (metaKey) {
                            this._selection = this.selection || [];
                        }
                        else {
                            this._selection = [];
                            this.selectionKeys = {};
                        }
                        this._selection = [...this.selection, rowNode.node];
                        this.selectionChange.emit(this.selection);
                        if (dataKeyValue) {
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                    this.onNodeSelect.emit({ originalEvent: event.originalEvent, node: rowNode.node, type: 'row', index: event.rowIndex });
                }
            }
            else {
                if (this.selectionMode === 'single') {
                    if (selected) {
                        this._selection = null;
                        this.selectionKeys = {};
                        this.selectionChange.emit(this.selection);
                        this.onNodeUnselect.emit({ originalEvent: event.originalEvent, node: rowNode.node, type: 'row' });
                    }
                    else {
                        this._selection = rowNode.node;
                        this.selectionChange.emit(this.selection);
                        this.onNodeSelect.emit({ originalEvent: event.originalEvent, node: rowNode.node, type: 'row', index: event.rowIndex });
                        if (dataKeyValue) {
                            this.selectionKeys = {};
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                }
                else if (this.selectionMode === 'multiple') {
                    if (selected) {
                        let selectionIndex = this.findIndexInSelection(rowNode.node);
                        this._selection = this.selection.filter((val, i) => i != selectionIndex);
                        this.selectionChange.emit(this.selection);
                        this.onNodeUnselect.emit({ originalEvent: event.originalEvent, node: rowNode.node, type: 'row' });
                        if (dataKeyValue) {
                            delete this.selectionKeys[dataKeyValue];
                        }
                    }
                    else {
                        this._selection = this.selection ? [...this.selection, rowNode.node] : [rowNode.node];
                        this.selectionChange.emit(this.selection);
                        this.onNodeSelect.emit({ originalEvent: event.originalEvent, node: rowNode.node, type: 'row', index: event.rowIndex });
                        if (dataKeyValue) {
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                }
            }
            this.tableService.onSelectionChange();
        }
        this.rowTouched = false;
    }
    handleRowTouchEnd(event) {
        this.rowTouched = true;
    }
    handleRowRightClick(event) {
        if (this.contextMenu) {
            const node = event.rowNode.node;
            if (this.contextMenuSelectionMode === 'separate') {
                this.contextMenuSelection = node;
                this.contextMenuSelectionChange.emit(node);
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, node: node });
                this.contextMenu.show(event.originalEvent);
                this.tableService.onContextMenu(node);
            }
            else if (this.contextMenuSelectionMode === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(node);
                let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(node.data, this.dataKey)) : null;
                if (!selected) {
                    if (this.isSingleSelectionMode()) {
                        this.selection = node;
                        this.selectionChange.emit(node);
                    }
                    else if (this.isMultipleSelectionMode()) {
                        this.selection = [node];
                        this.selectionChange.emit(this.selection);
                    }
                    if (dataKeyValue) {
                        this.selectionKeys[dataKeyValue] = 1;
                    }
                }
                this.contextMenu.show(event.originalEvent);
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, node: node });
            }
        }
    }
    toggleNodeWithCheckbox(event) {
        this.selection = this.selection || [];
        this.preventSelectionSetterPropagation = true;
        let node = event.rowNode.node;
        let selected = this.isSelected(node);
        if (selected) {
            this.propagateSelectionDown(node, false);
            if (event.rowNode.parent) {
                this.propagateSelectionUp(node.parent, false);
            }
            this.selectionChange.emit(this.selection);
            this.onNodeUnselect.emit({ originalEvent: event, node: node });
        }
        else {
            this.propagateSelectionDown(node, true);
            if (event.rowNode.parent) {
                this.propagateSelectionUp(node.parent, true);
            }
            this.selectionChange.emit(this.selection);
            this.onNodeSelect.emit({ originalEvent: event, node: node });
        }
        this.tableService.onSelectionChange();
    }
    toggleNodesWithCheckbox(event, check) {
        let data = this.filteredNodes || this.value;
        this._selection = check && data ? data.slice() : [];
        if (check) {
            if (data && data.length) {
                for (let node of data) {
                    this.propagateSelectionDown(node, true);
                }
            }
        }
        else {
            this._selection = [];
            this.selectionKeys = {};
        }
        this.preventSelectionSetterPropagation = true;
        this.selectionChange.emit(this._selection);
        this.tableService.onSelectionChange();
        this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked: check });
    }
    propagateSelectionUp(node, select) {
        if (node.children && node.children.length) {
            let selectedChildCount = 0;
            let childPartialSelected = false;
            let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(node.data, this.dataKey)) : null;
            for (let child of node.children) {
                if (this.isSelected(child))
                    selectedChildCount++;
                else if (child.partialSelected)
                    childPartialSelected = true;
            }
            if (select && selectedChildCount == node.children.length) {
                this._selection = [...(this.selection || []), node];
                node.partialSelected = false;
                if (dataKeyValue) {
                    this.selectionKeys[dataKeyValue] = 1;
                }
            }
            else {
                if (!select) {
                    let index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this._selection = this.selection.filter((val, i) => i != index);
                        if (dataKeyValue) {
                            delete this.selectionKeys[dataKeyValue];
                        }
                    }
                }
                if (childPartialSelected || (selectedChildCount > 0 && selectedChildCount != node.children.length))
                    node.partialSelected = true;
                else
                    node.partialSelected = false;
            }
        }
        let parent = node.parent;
        if (parent) {
            this.propagateSelectionUp(parent, select);
        }
    }
    propagateSelectionDown(node, select) {
        let index = this.findIndexInSelection(node);
        let dataKeyValue = this.dataKey ? String(ObjectUtils.resolveFieldData(node.data, this.dataKey)) : null;
        if (select && index == -1) {
            this._selection = [...(this.selection || []), node];
            if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
            }
        }
        else if (!select && index > -1) {
            this._selection = this.selection.filter((val, i) => i != index);
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
        }
        node.partialSelected = false;
        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateSelectionDown(child, select);
            }
        }
    }
    isSelected(node) {
        if (node && this.selection) {
            if (this.dataKey) {
                return this.selectionKeys[ObjectUtils.resolveFieldData(node.data, this.dataKey)] !== undefined;
            }
            else {
                if (Array.isArray(this.selection))
                    return this.findIndexInSelection(node) > -1;
                else
                    return this.equals(node, this.selection);
            }
        }
        return false;
    }
    findIndexInSelection(node) {
        let index = -1;
        if (this.selection && this.selection.length) {
            for (let i = 0; i < this.selection.length; i++) {
                if (this.equals(node, this.selection[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    isSingleSelectionMode() {
        return this.selectionMode === 'single';
    }
    isMultipleSelectionMode() {
        return this.selectionMode === 'multiple';
    }
    equals(node1, node2) {
        return this.compareSelectionBy === 'equals' ? node1 === node2 : ObjectUtils.equals(node1.data, node2.data, this.dataKey);
    }
    filter(value, field, matchMode) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        if (!this.isFilterBlank(value)) {
            this.filters[field] = { value: value, matchMode: matchMode };
        }
        else if (this.filters[field]) {
            delete this.filters[field];
        }
        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay);
    }
    filterGlobal(value, matchMode) {
        this.filter(value, 'global', matchMode);
    }
    isFilterBlank(filter) {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (Array.isArray(filter) && filter.length == 0))
                return true;
            else
                return false;
        }
        return true;
    }
    _filter() {
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            if (!this.value) {
                return;
            }
            if (!this.hasFilter()) {
                this.filteredNodes = null;
                if (this.paginator) {
                    this.totalRecords = this.value ? this.value.length : 0;
                }
            }
            else {
                let globalFilterFieldsArray;
                if (this.filters['global']) {
                    if (!this.columns && !this.globalFilterFields)
                        throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else
                        globalFilterFieldsArray = this.globalFilterFields || this.columns;
                }
                this.filteredNodes = [];
                const isStrictMode = this.filterMode === 'strict';
                let isValueChanged = false;
                for (let node of this.value) {
                    let copyNode = { ...node };
                    let localMatch = true;
                    let globalMatch = false;
                    let paramsWithoutNode;
                    for (let prop in this.filters) {
                        if (this.filters.hasOwnProperty(prop) && prop !== 'global') {
                            let filterMeta = this.filters[prop];
                            let filterField = prop;
                            let filterValue = filterMeta.value;
                            let filterMatchMode = filterMeta.matchMode || 'startsWith';
                            let filterConstraint = this.filterService.filters[filterMatchMode];
                            paramsWithoutNode = { filterField, filterValue, filterConstraint, isStrictMode };
                            if ((isStrictMode && !(this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode))) ||
                                (!isStrictMode && !(this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode)))) {
                                localMatch = false;
                            }
                            if (!localMatch) {
                                break;
                            }
                        }
                    }
                    if (this.filters['global'] && !globalMatch && globalFilterFieldsArray) {
                        for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                            let copyNodeForGlobal = { ...copyNode };
                            let filterField = globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
                            let filterValue = this.filters['global'].value;
                            let filterConstraint = this.filterService.filters[this.filters['global'].matchMode];
                            paramsWithoutNode = { filterField, filterValue, filterConstraint, isStrictMode };
                            if ((isStrictMode && (this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode) || this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode))) ||
                                (!isStrictMode && (this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode) || this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode)))) {
                                globalMatch = true;
                                copyNode = copyNodeForGlobal;
                            }
                        }
                    }
                    let matches = localMatch;
                    if (this.filters['global']) {
                        matches = localMatch && globalMatch;
                    }
                    if (matches) {
                        this.filteredNodes.push(copyNode);
                    }
                    isValueChanged = isValueChanged || !localMatch || globalMatch || (localMatch && this.filteredNodes.length > 0) || (!globalMatch && this.filteredNodes.length === 0);
                }
                if (!isValueChanged) {
                    this.filteredNodes = null;
                }
                if (this.paginator) {
                    this.totalRecords = this.filteredNodes ? this.filteredNodes.length : this.value ? this.value.length : 0;
                }
            }
        }
        this.first = 0;
        const filteredValue = this.filteredNodes || this.value;
        this.onFilter.emit({
            filters: this.filters,
            filteredValue: filteredValue
        });
        this.tableService.onUIUpdate(filteredValue);
        this.updateSerializedValue();
        if (this.scrollable) {
            this.resetScrollTop();
        }
    }
    findFilteredNodes(node, paramsWithoutNode) {
        if (node) {
            let matched = false;
            if (node.children) {
                let childNodes = [...node.children];
                node.children = [];
                for (let childNode of childNodes) {
                    let copyChildNode = { ...childNode };
                    if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                        matched = true;
                        node.children.push(copyChildNode);
                    }
                }
            }
            if (matched) {
                return true;
            }
        }
    }
    isFilterMatched(node, { filterField, filterValue, filterConstraint, isStrictMode }) {
        let matched = false;
        let dataFieldValue = ObjectUtils.resolveFieldData(node.data, filterField);
        if (filterConstraint(dataFieldValue, filterValue, this.filterLocale)) {
            matched = true;
        }
        if (!matched || (isStrictMode && !this.isNodeLeaf(node))) {
            matched = this.findFilteredNodes(node, { filterField, filterValue, filterConstraint, isStrictMode }) || matched;
        }
        return matched;
    }
    isNodeLeaf(node) {
        return node.leaf === false ? false : !(node.children && node.children.length);
    }
    hasFilter() {
        let empty = true;
        for (let prop in this.filters) {
            if (this.filters.hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }
        return !empty;
    }
    reset() {
        this._sortField = null;
        this._sortOrder = 1;
        this._multiSortMeta = null;
        this.tableService.onSort(null);
        this.filteredNodes = null;
        this.filters = {};
        this.first = 0;
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            this.totalRecords = this._value ? this._value.length : 0;
        }
    }
    updateEditingCell(cell, data, field) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.bindDocumentEditListener();
    }
    isEditingCellValid() {
        return this.editingCell && DomHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length === 0;
    }
    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = this.renderer.listen(this.document, 'click', (event) => {
                if (this.editingCell && !this.editingCellClick && this.isEditingCellValid()) {
                    DomHandler.removeClass(this.editingCell, 'p-cell-editing');
                    this.editingCell = null;
                    this.onEditComplete.emit({ field: this.editingCellField, data: this.editingCellData });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.unbindDocumentEditListener();
                }
                this.editingCellClick = false;
            });
        }
    }
    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.documentEditListener();
            this.documentEditListener = null;
        }
    }
    ngOnDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.editingCellField = null;
        this.editingCellData = null;
        this.initialized = null;
    }
}
TreeTable.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTable, deps: [{ token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: TreeTableService }, { token: i1.FilterService }], target: i0.ɵɵFactoryTarget.Component });
TreeTable.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TreeTable, selector: "p-treeTable", inputs: { columns: "columns", style: "style", styleClass: "styleClass", tableStyle: "tableStyle", tableStyleClass: "tableStyleClass", autoLayout: "autoLayout", lazy: "lazy", lazyLoadOnInit: "lazyLoadOnInit", paginator: "paginator", rows: "rows", first: "first", pageLinks: "pageLinks", rowsPerPageOptions: "rowsPerPageOptions", alwaysShowPaginator: "alwaysShowPaginator", paginatorPosition: "paginatorPosition", paginatorDropdownAppendTo: "paginatorDropdownAppendTo", currentPageReportTemplate: "currentPageReportTemplate", showCurrentPageReport: "showCurrentPageReport", showJumpToPageDropdown: "showJumpToPageDropdown", showFirstLastIcon: "showFirstLastIcon", showPageLinks: "showPageLinks", defaultSortOrder: "defaultSortOrder", sortMode: "sortMode", resetPageOnSort: "resetPageOnSort", customSort: "customSort", selectionMode: "selectionMode", contextMenuSelection: "contextMenuSelection", contextMenuSelectionMode: "contextMenuSelectionMode", dataKey: "dataKey", metaKeySelection: "metaKeySelection", compareSelectionBy: "compareSelectionBy", rowHover: "rowHover", loading: "loading", loadingIcon: "loadingIcon", showLoader: "showLoader", scrollable: "scrollable", scrollHeight: "scrollHeight", virtualScroll: "virtualScroll", virtualScrollItemSize: "virtualScrollItemSize", virtualScrollOptions: "virtualScrollOptions", virtualScrollDelay: "virtualScrollDelay", frozenWidth: "frozenWidth", frozenColumns: "frozenColumns", resizableColumns: "resizableColumns", columnResizeMode: "columnResizeMode", reorderableColumns: "reorderableColumns", contextMenu: "contextMenu", rowTrackBy: "rowTrackBy", filters: "filters", globalFilterFields: "globalFilterFields", filterDelay: "filterDelay", filterMode: "filterMode", filterLocale: "filterLocale", virtualRowHeight: "virtualRowHeight", value: "value", totalRecords: "totalRecords", sortField: "sortField", sortOrder: "sortOrder", multiSortMeta: "multiSortMeta", selection: "selection" }, outputs: { selectionChange: "selectionChange", contextMenuSelectionChange: "contextMenuSelectionChange", onFilter: "onFilter", onNodeExpand: "onNodeExpand", onNodeCollapse: "onNodeCollapse", onPage: "onPage", onSort: "onSort", onLazyLoad: "onLazyLoad", sortFunction: "sortFunction", onColResize: "onColResize", onColReorder: "onColReorder", onNodeSelect: "onNodeSelect", onNodeUnselect: "onNodeUnselect", onContextMenuSelect: "onContextMenuSelect", onHeaderCheckboxToggle: "onHeaderCheckboxToggle", onEditInit: "onEditInit", onEditComplete: "onEditComplete", onEditCancel: "onEditCancel" }, host: { classAttribute: "p-element" }, providers: [TreeTableService], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }, { propertyName: "resizeHelperViewChild", first: true, predicate: ["resizeHelper"], descendants: true }, { propertyName: "reorderIndicatorUpViewChild", first: true, predicate: ["reorderIndicatorUp"], descendants: true }, { propertyName: "reorderIndicatorDownViewChild", first: true, predicate: ["reorderIndicatorDown"], descendants: true }, { propertyName: "tableViewChild", first: true, predicate: ["table"], descendants: true }, { propertyName: "scrollableViewChild", first: true, predicate: ["scrollableView"], descendants: true }, { propertyName: "scrollableFrozenViewChild", first: true, predicate: ["scrollableFrozenView"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div
            #container
            [ngStyle]="style"
            [class]="styleClass"
            data-scrollselectors=".p-treetable-scrollable-body"
            [ngClass]="{
                'p-treetable p-component': true,
                'p-treetable-hoverable-rows': rowHover || selectionMode === 'single' || selectionMode === 'multiple',
                'p-treetable-auto-layout': autoLayout,
                'p-treetable-resizable': resizableColumns,
                'p-treetable-resizable-fit': resizableColumns && columnResizeMode === 'fit',
                'p-treetable-flex-scrollable': scrollable && scrollHeight === 'flex'
            }"
        >
            <div class="p-treetable-loading" *ngIf="loading && showLoader">
                <div class="p-treetable-loading-overlay p-component-overlay">
                    <i *ngIf="loadingIcon" [class]="'p-treetable-loading-icon pi-spin ' + loadingIcon"></i>
                    <ng-container *ngIf="!loadingIcon">
                        <SpinnerIcon *ngIf="!loadingIconTemplate" [spin]="true" [styleClass]="'p-treetable-loading-icon'" />
                        <span *ngIf="loadingIconTemplate" class="p-treetable-loading-icon">
                            <ng-template *ngTemplateOutlet="loadingIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </div>
            </div>
            <div *ngIf="captionTemplate" class="p-treetable-header">
                <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
            </div>
            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-top"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showPageLinks]="showPageLinks"
            >
                <ng-template pTemplate="firstpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="previouspagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="lastpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="nextpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate"></ng-container>
                </ng-template>
            </p-paginator>

            <div class="p-treetable-wrapper" *ngIf="!scrollable">
                <table #table [ngClass]="tableStyleClass" [ngStyle]="tableStyle">
                    <ng-container *ngTemplateOutlet="colGroupTemplate; context: { $implicit: columns }"></ng-container>
                    <thead class="p-treetable-thead">
                        <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: columns }"></ng-container>
                    </thead>
                    <tbody class="p-treetable-tbody" [pTreeTableBody]="columns" [pTreeTableBodyTemplate]="bodyTemplate"></tbody>
                    <tfoot class="p-treetable-tfoot">
                        <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: columns }"></ng-container>
                    </tfoot>
                </table>
            </div>

            <div class="p-treetable-scrollable-wrapper" *ngIf="scrollable">
                <div
                    class="p-treetable-scrollable-view p-treetable-frozen-view"
                    *ngIf="frozenColumns || frozenBodyTemplate"
                    #scrollableFrozenView
                    [ttScrollableView]="frozenColumns"
                    [frozen]="true"
                    [ngStyle]="{ width: frozenWidth }"
                    [scrollHeight]="scrollHeight"
                ></div>
                <div class="p-treetable-scrollable-view" #scrollableView [ttScrollableView]="columns" [frozen]="false" [scrollHeight]="scrollHeight" [ngStyle]="{ left: frozenWidth, width: 'calc(100% - ' + frozenWidth + ')' }"></div>
            </div>

            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-bottom"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showPageLinks]="showPageLinks"
            >
                <ng-template pTemplate="firstpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="previouspagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="lastpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="nextpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate"></ng-container>
                </ng-template>
            </p-paginator>
            <div *ngIf="summaryTemplate" class="p-treetable-footer">
                <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
            </div>

            <div #resizeHelper class="p-column-resizer-helper" style="display:none" *ngIf="resizableColumns"></div>
            <span #reorderIndicatorUp class="p-treetable-reorder-indicator-up" style="display: none;" *ngIf="reorderableColumns">
                <ArrowDownIcon *ngIf="!reorderIndicatorUpIconTemplate" />
                <ng-template *ngTemplateOutlet="reorderIndicatorUpIconTemplate"></ng-template>
            </span>
            <span #reorderIndicatorDown class="p-treetable-reorder-indicator-down" style="display: none;" *ngIf="reorderableColumns">
                <ArrowUpIcon *ngIf="!reorderIndicatorDownIconTemplate" />
                <ng-template *ngTemplateOutlet="reorderIndicatorDownIconTemplate"></ng-template>
            </span>
        </div>
    `, isInline: true, styles: [".p-treetable{position:relative}.p-treetable table{border-collapse:collapse;width:100%;table-layout:fixed}.p-treetable .p-sortable-column{cursor:pointer;-webkit-user-select:none;user-select:none}.p-treetable .p-sortable-column .p-column-title,.p-treetable .p-sortable-column .p-sortable-column-icon,.p-treetable .p-sortable-column .p-sortable-column-badge{vertical-align:middle}.p-treetable .p-sortable-column .p-sortable-column-badge{display:inline-flex;align-items:center;justify-content:center}.p-treetable-auto-layout>.p-treetable-wrapper{overflow-x:auto}.p-treetable-auto-layout>.p-treetable-wrapper>table{table-layout:auto}.p-treetable-hoverable-rows .p-treetable-tbody>tr{cursor:pointer}.p-treetable-toggler{cursor:pointer;-webkit-user-select:none;user-select:none;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;overflow:hidden;position:relative}p-treetabletoggler+p-treetablecheckbox .p-checkbox{vertical-align:middle}p-treetabletoggler+p-treetablecheckbox+span{vertical-align:middle}.p-treetable-scrollable-wrapper{position:relative}.p-treetable-scrollable-header,.p-treetable-scrollable-footer{overflow:hidden}.p-treetable-scrollable-body{overflow:auto;position:relative}.p-treetable-scrollable-body>table>.p-treetable-tbody>tr:first-child>td{border-top:0 none}.p-treetable-virtual-table{position:absolute}.p-treetable-frozen-view .p-treetable-scrollable-body{overflow:hidden}.p-treetable-frozen-view>.p-treetable-scrollable-body>table>.p-treetable-tbody>tr>td:last-child{border-right:0 none}.p-treetable-unfrozen-view{position:absolute;top:0}.p-treetable-flex-scrollable,.p-treetable-flex-scrollable .p-treetable-scrollable-wrapper,.p-treetable-flex-scrollable .p-treetable-scrollable-view{display:flex;flex-direction:column;flex:1;height:100%}.p-treetable-flex-scrollable .p-treetable-virtual-scrollable-body{flex:1}.p-treetable-resizable>.p-treetable-wrapper{overflow-x:auto}.p-treetable-resizable .p-treetable-thead>tr>th,.p-treetable-resizable .p-treetable-tfoot>tr>td,.p-treetable-resizable .p-treetable-tbody>tr>td{overflow:hidden}.p-treetable-resizable .p-resizable-column{background-clip:padding-box;position:relative}.p-treetable-resizable-fit .p-resizable-column:last-child .p-column-resizer{display:none}.p-treetable .p-column-resizer{display:block;position:absolute!important;top:0;right:0;margin:0;width:.5rem;height:100%;padding:0;cursor:col-resize;border:1px solid transparent}.p-treetable .p-column-resizer-helper{width:1px;position:absolute;z-index:10;display:none}.p-treetable .p-row-editor-init,.p-treetable .p-row-editor-save,.p-treetable .p-row-editor-cancel,.p-treetable .p-row-toggler{display:inline-flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-treetable-reorder-indicator-up,.p-treetable-reorder-indicator-down{position:absolute;display:none}[ttReorderableColumn]{cursor:move}.p-treetable .p-treetable-loading-overlay{position:absolute;display:flex;align-items:center;justify-content:center;z-index:2}.p-treetable .p-scroller-loading{transform:none!important;min-height:0;position:sticky;top:0;left:0}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return i3.Paginator; }), selector: "p-paginator", inputs: ["pageLinkSize", "style", "styleClass", "alwaysShow", "templateLeft", "templateRight", "dropdownAppendTo", "dropdownScrollHeight", "currentPageReportTemplate", "showCurrentPageReport", "showFirstLastIcon", "totalRecords", "rows", "rowsPerPageOptions", "showJumpToPageDropdown", "showJumpToPageInput", "showPageLinks", "dropdownItemTemplate", "first"], outputs: ["onPageChange"] }, { kind: "directive", type: i0.forwardRef(function () { return i1.PrimeTemplate; }), selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i0.forwardRef(function () { return SpinnerIcon; }), selector: "SpinnerIcon" }, { kind: "component", type: i0.forwardRef(function () { return ArrowDownIcon; }), selector: "ArrowDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return ArrowUpIcon; }), selector: "ArrowUpIcon" }, { kind: "component", type: i0.forwardRef(function () { return TTScrollableView; }), selector: "[ttScrollableView]", inputs: ["ttScrollableView", "frozen", "scrollHeight"] }, { kind: "component", type: i0.forwardRef(function () { return TTBody; }), selector: "[pTreeTableBody]", inputs: ["pTreeTableBody", "pTreeTableBodyTemplate", "frozen", "serializedNodes", "scrollerOptions"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTable, decorators: [{
            type: Component,
            args: [{ selector: 'p-treeTable', template: `
        <div
            #container
            [ngStyle]="style"
            [class]="styleClass"
            data-scrollselectors=".p-treetable-scrollable-body"
            [ngClass]="{
                'p-treetable p-component': true,
                'p-treetable-hoverable-rows': rowHover || selectionMode === 'single' || selectionMode === 'multiple',
                'p-treetable-auto-layout': autoLayout,
                'p-treetable-resizable': resizableColumns,
                'p-treetable-resizable-fit': resizableColumns && columnResizeMode === 'fit',
                'p-treetable-flex-scrollable': scrollable && scrollHeight === 'flex'
            }"
        >
            <div class="p-treetable-loading" *ngIf="loading && showLoader">
                <div class="p-treetable-loading-overlay p-component-overlay">
                    <i *ngIf="loadingIcon" [class]="'p-treetable-loading-icon pi-spin ' + loadingIcon"></i>
                    <ng-container *ngIf="!loadingIcon">
                        <SpinnerIcon *ngIf="!loadingIconTemplate" [spin]="true" [styleClass]="'p-treetable-loading-icon'" />
                        <span *ngIf="loadingIconTemplate" class="p-treetable-loading-icon">
                            <ng-template *ngTemplateOutlet="loadingIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </div>
            </div>
            <div *ngIf="captionTemplate" class="p-treetable-header">
                <ng-container *ngTemplateOutlet="captionTemplate"></ng-container>
            </div>
            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-top"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'top' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showPageLinks]="showPageLinks"
            >
                <ng-template pTemplate="firstpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="previouspagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="lastpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="nextpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate"></ng-container>
                </ng-template>
            </p-paginator>

            <div class="p-treetable-wrapper" *ngIf="!scrollable">
                <table #table [ngClass]="tableStyleClass" [ngStyle]="tableStyle">
                    <ng-container *ngTemplateOutlet="colGroupTemplate; context: { $implicit: columns }"></ng-container>
                    <thead class="p-treetable-thead">
                        <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: columns }"></ng-container>
                    </thead>
                    <tbody class="p-treetable-tbody" [pTreeTableBody]="columns" [pTreeTableBodyTemplate]="bodyTemplate"></tbody>
                    <tfoot class="p-treetable-tfoot">
                        <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: columns }"></ng-container>
                    </tfoot>
                </table>
            </div>

            <div class="p-treetable-scrollable-wrapper" *ngIf="scrollable">
                <div
                    class="p-treetable-scrollable-view p-treetable-frozen-view"
                    *ngIf="frozenColumns || frozenBodyTemplate"
                    #scrollableFrozenView
                    [ttScrollableView]="frozenColumns"
                    [frozen]="true"
                    [ngStyle]="{ width: frozenWidth }"
                    [scrollHeight]="scrollHeight"
                ></div>
                <div class="p-treetable-scrollable-view" #scrollableView [ttScrollableView]="columns" [frozen]="false" [scrollHeight]="scrollHeight" [ngStyle]="{ left: frozenWidth, width: 'calc(100% - ' + frozenWidth + ')' }"></div>
            </div>

            <p-paginator
                [rows]="rows"
                [first]="first"
                [totalRecords]="totalRecords"
                [pageLinkSize]="pageLinks"
                styleClass="p-paginator-bottom"
                [alwaysShow]="alwaysShowPaginator"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions"
                *ngIf="paginator && (paginatorPosition === 'bottom' || paginatorPosition == 'both')"
                [templateLeft]="paginatorLeftTemplate"
                [templateRight]="paginatorRightTemplate"
                [dropdownAppendTo]="paginatorDropdownAppendTo"
                [currentPageReportTemplate]="currentPageReportTemplate"
                [showFirstLastIcon]="showFirstLastIcon"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate"
                [showCurrentPageReport]="showCurrentPageReport"
                [showJumpToPageDropdown]="showJumpToPageDropdown"
                [showPageLinks]="showPageLinks"
            >
                <ng-template pTemplate="firstpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="previouspagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="lastpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate"></ng-container>
                </ng-template>

                <ng-template pTemplate="nextpagelinkicon">
                    <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate"></ng-container>
                </ng-template>
            </p-paginator>
            <div *ngIf="summaryTemplate" class="p-treetable-footer">
                <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
            </div>

            <div #resizeHelper class="p-column-resizer-helper" style="display:none" *ngIf="resizableColumns"></div>
            <span #reorderIndicatorUp class="p-treetable-reorder-indicator-up" style="display: none;" *ngIf="reorderableColumns">
                <ArrowDownIcon *ngIf="!reorderIndicatorUpIconTemplate" />
                <ng-template *ngTemplateOutlet="reorderIndicatorUpIconTemplate"></ng-template>
            </span>
            <span #reorderIndicatorDown class="p-treetable-reorder-indicator-down" style="display: none;" *ngIf="reorderableColumns">
                <ArrowUpIcon *ngIf="!reorderIndicatorDownIconTemplate" />
                <ng-template *ngTemplateOutlet="reorderIndicatorDownIconTemplate"></ng-template>
            </span>
        </div>
    `, providers: [TreeTableService], encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-treetable{position:relative}.p-treetable table{border-collapse:collapse;width:100%;table-layout:fixed}.p-treetable .p-sortable-column{cursor:pointer;-webkit-user-select:none;user-select:none}.p-treetable .p-sortable-column .p-column-title,.p-treetable .p-sortable-column .p-sortable-column-icon,.p-treetable .p-sortable-column .p-sortable-column-badge{vertical-align:middle}.p-treetable .p-sortable-column .p-sortable-column-badge{display:inline-flex;align-items:center;justify-content:center}.p-treetable-auto-layout>.p-treetable-wrapper{overflow-x:auto}.p-treetable-auto-layout>.p-treetable-wrapper>table{table-layout:auto}.p-treetable-hoverable-rows .p-treetable-tbody>tr{cursor:pointer}.p-treetable-toggler{cursor:pointer;-webkit-user-select:none;user-select:none;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;overflow:hidden;position:relative}p-treetabletoggler+p-treetablecheckbox .p-checkbox{vertical-align:middle}p-treetabletoggler+p-treetablecheckbox+span{vertical-align:middle}.p-treetable-scrollable-wrapper{position:relative}.p-treetable-scrollable-header,.p-treetable-scrollable-footer{overflow:hidden}.p-treetable-scrollable-body{overflow:auto;position:relative}.p-treetable-scrollable-body>table>.p-treetable-tbody>tr:first-child>td{border-top:0 none}.p-treetable-virtual-table{position:absolute}.p-treetable-frozen-view .p-treetable-scrollable-body{overflow:hidden}.p-treetable-frozen-view>.p-treetable-scrollable-body>table>.p-treetable-tbody>tr>td:last-child{border-right:0 none}.p-treetable-unfrozen-view{position:absolute;top:0}.p-treetable-flex-scrollable,.p-treetable-flex-scrollable .p-treetable-scrollable-wrapper,.p-treetable-flex-scrollable .p-treetable-scrollable-view{display:flex;flex-direction:column;flex:1;height:100%}.p-treetable-flex-scrollable .p-treetable-virtual-scrollable-body{flex:1}.p-treetable-resizable>.p-treetable-wrapper{overflow-x:auto}.p-treetable-resizable .p-treetable-thead>tr>th,.p-treetable-resizable .p-treetable-tfoot>tr>td,.p-treetable-resizable .p-treetable-tbody>tr>td{overflow:hidden}.p-treetable-resizable .p-resizable-column{background-clip:padding-box;position:relative}.p-treetable-resizable-fit .p-resizable-column:last-child .p-column-resizer{display:none}.p-treetable .p-column-resizer{display:block;position:absolute!important;top:0;right:0;margin:0;width:.5rem;height:100%;padding:0;cursor:col-resize;border:1px solid transparent}.p-treetable .p-column-resizer-helper{width:1px;position:absolute;z-index:10;display:none}.p-treetable .p-row-editor-init,.p-treetable .p-row-editor-save,.p-treetable .p-row-editor-cancel,.p-treetable .p-row-toggler{display:inline-flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-treetable-reorder-indicator-up,.p-treetable-reorder-indicator-down{position:absolute;display:none}[ttReorderableColumn]{cursor:move}.p-treetable .p-treetable-loading-overlay{position:absolute;display:flex;align-items:center;justify-content:center;z-index:2}.p-treetable .p-scroller-loading{transform:none!important;min-height:0;position:sticky;top:0;left:0}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: TreeTableService }, { type: i1.FilterService }]; }, propDecorators: { columns: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tableStyle: [{
                type: Input
            }], tableStyleClass: [{
                type: Input
            }], autoLayout: [{
                type: Input
            }], lazy: [{
                type: Input
            }], lazyLoadOnInit: [{
                type: Input
            }], paginator: [{
                type: Input
            }], rows: [{
                type: Input
            }], first: [{
                type: Input
            }], pageLinks: [{
                type: Input
            }], rowsPerPageOptions: [{
                type: Input
            }], alwaysShowPaginator: [{
                type: Input
            }], paginatorPosition: [{
                type: Input
            }], paginatorDropdownAppendTo: [{
                type: Input
            }], currentPageReportTemplate: [{
                type: Input
            }], showCurrentPageReport: [{
                type: Input
            }], showJumpToPageDropdown: [{
                type: Input
            }], showFirstLastIcon: [{
                type: Input
            }], showPageLinks: [{
                type: Input
            }], defaultSortOrder: [{
                type: Input
            }], sortMode: [{
                type: Input
            }], resetPageOnSort: [{
                type: Input
            }], customSort: [{
                type: Input
            }], selectionMode: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }], contextMenuSelection: [{
                type: Input
            }], contextMenuSelectionChange: [{
                type: Output
            }], contextMenuSelectionMode: [{
                type: Input
            }], dataKey: [{
                type: Input
            }], metaKeySelection: [{
                type: Input
            }], compareSelectionBy: [{
                type: Input
            }], rowHover: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], showLoader: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], virtualScrollItemSize: [{
                type: Input
            }], virtualScrollOptions: [{
                type: Input
            }], virtualScrollDelay: [{
                type: Input
            }], frozenWidth: [{
                type: Input
            }], frozenColumns: [{
                type: Input
            }], resizableColumns: [{
                type: Input
            }], columnResizeMode: [{
                type: Input
            }], reorderableColumns: [{
                type: Input
            }], contextMenu: [{
                type: Input
            }], rowTrackBy: [{
                type: Input
            }], filters: [{
                type: Input
            }], globalFilterFields: [{
                type: Input
            }], filterDelay: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], onFilter: [{
                type: Output
            }], onNodeExpand: [{
                type: Output
            }], onNodeCollapse: [{
                type: Output
            }], onPage: [{
                type: Output
            }], onSort: [{
                type: Output
            }], onLazyLoad: [{
                type: Output
            }], sortFunction: [{
                type: Output
            }], onColResize: [{
                type: Output
            }], onColReorder: [{
                type: Output
            }], onNodeSelect: [{
                type: Output
            }], onNodeUnselect: [{
                type: Output
            }], onContextMenuSelect: [{
                type: Output
            }], onHeaderCheckboxToggle: [{
                type: Output
            }], onEditInit: [{
                type: Output
            }], onEditComplete: [{
                type: Output
            }], onEditCancel: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], resizeHelperViewChild: [{
                type: ViewChild,
                args: ['resizeHelper']
            }], reorderIndicatorUpViewChild: [{
                type: ViewChild,
                args: ['reorderIndicatorUp']
            }], reorderIndicatorDownViewChild: [{
                type: ViewChild,
                args: ['reorderIndicatorDown']
            }], tableViewChild: [{
                type: ViewChild,
                args: ['table']
            }], scrollableViewChild: [{
                type: ViewChild,
                args: ['scrollableView']
            }], scrollableFrozenViewChild: [{
                type: ViewChild,
                args: ['scrollableFrozenView']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], virtualRowHeight: [{
                type: Input
            }], value: [{
                type: Input
            }], totalRecords: [{
                type: Input
            }], sortField: [{
                type: Input
            }], sortOrder: [{
                type: Input
            }], multiSortMeta: [{
                type: Input
            }], selection: [{
                type: Input
            }] } });
export class TTBody {
    constructor(tt, treeTableService, cd) {
        this.tt = tt;
        this.treeTableService = treeTableService;
        this.cd = cd;
        this.subscription = this.tt.tableService.uiUpdateSource$.subscribe(() => {
            if (this.tt.virtualScroll) {
                this.cd.detectChanges();
            }
        });
    }
    getScrollerOption(option, options) {
        if (this.tt.virtualScroll) {
            options = options || this.scrollerOptions;
            return options ? options[option] : null;
        }
        return null;
    }
    getRowIndex(rowIndex) {
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(rowIndex).index : rowIndex;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTBody.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTBody, deps: [{ token: TreeTable }, { token: TreeTableService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TTBody.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TTBody, selector: "[pTreeTableBody]", inputs: { columns: ["pTreeTableBody", "columns"], template: ["pTreeTableBodyTemplate", "template"], frozen: "frozen", serializedNodes: "serializedNodes", scrollerOptions: "scrollerOptions" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <ng-template ngFor let-serializedNode let-rowIndex="index" [ngForOf]="serializedNodes || tt.serializedValue" [ngForTrackBy]="tt.rowTrackBy">
            <ng-container *ngIf="serializedNode.visible">
                <ng-container *ngTemplateOutlet="template; context: { $implicit: serializedNode, node: serializedNode.node, rowData: serializedNode.node.data, columns: columns }"></ng-container>
            </ng-container>
        </ng-template>
        <ng-container *ngIf="tt.isEmpty()">
            <ng-container *ngTemplateOutlet="tt.emptyMessageTemplate; context: { $implicit: columns, frozen: frozen }"></ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTBody, decorators: [{
            type: Component,
            args: [{
                    selector: '[pTreeTableBody]',
                    template: `
        <ng-template ngFor let-serializedNode let-rowIndex="index" [ngForOf]="serializedNodes || tt.serializedValue" [ngForTrackBy]="tt.rowTrackBy">
            <ng-container *ngIf="serializedNode.visible">
                <ng-container *ngTemplateOutlet="template; context: { $implicit: serializedNode, node: serializedNode.node, rowData: serializedNode.node.data, columns: columns }"></ng-container>
            </ng-container>
        </ng-template>
        <ng-container *ngIf="tt.isEmpty()">
            <ng-container *ngTemplateOutlet="tt.emptyMessageTemplate; context: { $implicit: columns, frozen: frozen }"></ng-container>
        </ng-container>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TreeTableService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { columns: [{
                type: Input,
                args: ['pTreeTableBody']
            }], template: [{
                type: Input,
                args: ['pTreeTableBodyTemplate']
            }], frozen: [{
                type: Input
            }], serializedNodes: [{
                type: Input
            }], scrollerOptions: [{
                type: Input
            }] } });
export class TTScrollableView {
    constructor(platformId, renderer, tt, el, zone) {
        this.platformId = platformId;
        this.renderer = renderer;
        this.tt = tt;
        this.el = el;
        this.zone = zone;
    }
    get scrollHeight() {
        return this._scrollHeight;
    }
    set scrollHeight(val) {
        this._scrollHeight = val;
        if (val != null && (val.includes('%') || val.includes('calc'))) {
            console.log('Percentage scroll height calculation is removed in favor of the more performant CSS based flex mode, use scrollHeight="flex" instead.');
        }
    }
    ngAfterViewInit() {
        if (!this.frozen) {
            if (this.tt.frozenColumns || this.tt.frozenBodyTemplate) {
                DomHandler.addClass(this.el.nativeElement, 'p-treetable-unfrozen-view');
            }
            let frozenView = this.el.nativeElement.previousElementSibling;
            if (frozenView) {
                if (this.tt.virtualScroll)
                    this.frozenSiblingBody = DomHandler.findSingle(frozenView, '.p-scroller-viewport');
                else
                    this.frozenSiblingBody = DomHandler.findSingle(frozenView, '.p-treetable-scrollable-body');
            }
            let scrollBarWidth = DomHandler.calculateScrollbarWidth();
            this.scrollHeaderBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
            if (this.scrollFooterBoxViewChild && this.scrollFooterBoxViewChild.nativeElement) {
                this.scrollFooterBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
            }
        }
        else {
            if (this.scrollableAlignerViewChild && this.scrollableAlignerViewChild.nativeElement) {
                this.scrollableAlignerViewChild.nativeElement.style.height = DomHandler.calculateScrollbarHeight() + 'px';
            }
        }
        this.bindEvents();
    }
    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
                    this.headerScrollListener = this.renderer.listen(this.scrollHeaderBoxViewChild.nativeElement, 'scroll', this.onHeaderScroll.bind(this));
                }
                if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
                    this.footerScrollListener = this.renderer.listen(this.scrollFooterViewChild.nativeElement, 'scroll', this.onFooterScroll.bind(this));
                }
                if (!this.frozen) {
                    if (this.tt.virtualScroll) {
                        this.bodyScrollListener = this.renderer.listen(this.scroller.getElementRef().nativeElement, 'scroll', this.onBodyScroll.bind(this));
                    }
                    else {
                        this.bodyScrollListener = this.renderer.listen(this.scrollBodyViewChild.nativeElement, 'scroll', this.onBodyScroll.bind(this));
                    }
                }
            });
        }
    }
    unbindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
                if (this.headerScrollListener) {
                    this.headerScrollListener();
                    this.headerScrollListener = null;
                }
            }
            if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
                if (this.footerScrollListener) {
                    this.footerScrollListener();
                    this.footerScrollListener = null;
                }
            }
            if (this.scrollBodyViewChild && this.scrollBodyViewChild.nativeElement) {
                if (this.bodyScrollListener) {
                    this.bodyScrollListener();
                    this.bodyScrollListener = null;
                }
            }
            if (this.scroller && this.scroller.getElementRef()) {
                if (this.bodyScrollListener) {
                    this.bodyScrollListener();
                    this.bodyScrollListener = null;
                }
            }
        }
    }
    onHeaderScroll() {
        const scrollLeft = this.scrollHeaderViewChild.nativeElement.scrollLeft;
        this.scrollBodyViewChild.nativeElement.scrollLeft = scrollLeft;
        if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
            this.scrollFooterViewChild.nativeElement.scrollLeft = scrollLeft;
        }
        this.preventBodyScrollPropagation = true;
    }
    onFooterScroll() {
        const scrollLeft = this.scrollFooterViewChild.nativeElement.scrollLeft;
        this.scrollBodyViewChild.nativeElement.scrollLeft = scrollLeft;
        if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
            this.scrollHeaderViewChild.nativeElement.scrollLeft = scrollLeft;
        }
        this.preventBodyScrollPropagation = true;
    }
    onBodyScroll(event) {
        if (this.preventBodyScrollPropagation) {
            this.preventBodyScrollPropagation = false;
            return;
        }
        if (this.scrollHeaderViewChild && this.scrollHeaderViewChild.nativeElement) {
            this.scrollHeaderBoxViewChild.nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }
        if (this.scrollFooterViewChild && this.scrollFooterViewChild.nativeElement) {
            this.scrollFooterBoxViewChild.nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }
        if (this.frozenSiblingBody) {
            this.frozenSiblingBody.scrollTop = event.target.scrollTop;
        }
    }
    scrollToVirtualIndex(index) {
        if (this.scroller) {
            this.scroller.scrollToIndex(index);
        }
    }
    scrollTo(options) {
        if (this.scroller) {
            this.scroller.scrollTo(options);
        }
        else {
            if (this.scrollBodyViewChild.nativeElement.scrollTo) {
                this.scrollBodyViewChild.nativeElement.scrollTo(options);
            }
            else {
                this.scrollBodyViewChild.nativeElement.scrollLeft = options.left;
                this.scrollBodyViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }
    ngOnDestroy() {
        this.unbindEvents();
        this.frozenSiblingBody = null;
    }
}
TTScrollableView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTScrollableView, deps: [{ token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: TreeTable }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
TTScrollableView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TTScrollableView, selector: "[ttScrollableView]", inputs: { columns: ["ttScrollableView", "columns"], frozen: "frozen", scrollHeight: "scrollHeight" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "scrollHeaderViewChild", first: true, predicate: ["scrollHeader"], descendants: true }, { propertyName: "scrollHeaderBoxViewChild", first: true, predicate: ["scrollHeaderBox"], descendants: true }, { propertyName: "scrollBodyViewChild", first: true, predicate: ["scrollBody"], descendants: true }, { propertyName: "scrollTableViewChild", first: true, predicate: ["scrollTable"], descendants: true }, { propertyName: "scrollLoadingTableViewChild", first: true, predicate: ["loadingTable"], descendants: true }, { propertyName: "scrollFooterViewChild", first: true, predicate: ["scrollFooter"], descendants: true }, { propertyName: "scrollFooterBoxViewChild", first: true, predicate: ["scrollFooterBox"], descendants: true }, { propertyName: "scrollableAlignerViewChild", first: true, predicate: ["scrollableAligner"], descendants: true }, { propertyName: "scroller", first: true, predicate: ["scroller"], descendants: true }], ngImport: i0, template: `
        <div #scrollHeader class="p-treetable-scrollable-header">
            <div #scrollHeaderBox class="p-treetable-scrollable-header-box">
                <table class="p-treetable-scrollable-header-table" [ngClass]="tt.tableStyleClass" [ngStyle]="tt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? tt.frozenColGroupTemplate || tt.colGroupTemplate : tt.colGroupTemplate; context: { $implicit: columns }"></ng-container>
                    <thead class="p-treetable-thead">
                        <ng-container *ngTemplateOutlet="frozen ? tt.frozenHeaderTemplate || tt.headerTemplate : tt.headerTemplate; context: { $implicit: columns }"></ng-container>
                    </thead>
                </table>
            </div>
        </div>

        <p-scroller
            *ngIf="tt.virtualScroll"
            #scroller
            [items]="tt.serializedValue"
            styleClass="p-treetable-scrollable-body"
            [style]="{ height: tt.scrollHeight !== 'flex' ? tt.scrollHeight : undefined }"
            [scrollHeight]="scrollHeight !== 'flex' ? undefined : '100%'"
            [itemSize]="tt.virtualScrollItemSize || tt._virtualRowHeight"
            [lazy]="tt.lazy"
            (onLazyLoad)="tt.onLazyItemLoad($event)"
            [options]="tt.virtualScrollOptions"
        >
            <ng-template pTemplate="content" let-items let-scrollerOptions="options">
                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
            </ng-template>
            <ng-container *ngIf="loaderTemplate">
                <ng-template pTemplate="loader" let-scrollerOptions="options">
                    <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                </ng-template>
            </ng-container>
        </p-scroller>
        <ng-container *ngIf="!tt.virtualScroll">
            <div #scrollBody class="p-treetable-scrollable-body" [ngStyle]="{ 'max-height': tt.scrollHeight !== 'flex' ? scrollHeight : undefined, 'overflow-y': !frozen && tt.scrollHeight ? 'scroll' : undefined }">
                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: serializedValue, options: {} }"></ng-container>
            </div>
        </ng-container>

        <ng-template #buildInItems let-items let-scrollerOptions="options">
            <table #scrollTable [class]="tt.tableStyleClass" [ngClass]="scrollerOptions.contentStyleClass" [ngStyle]="tt.tableStyle" [style]="scrollerOptions.contentStyle">
                <ng-container *ngTemplateOutlet="frozen ? tt.frozenColGroupTemplate || tt.colGroupTemplate : tt.colGroupTemplate; context: { $implicit: columns }"></ng-container>
                <tbody class="p-treetable-tbody" [pTreeTableBody]="columns" [pTreeTableBodyTemplate]="frozen ? tt.frozenBodyTemplate || tt.bodyTemplate : tt.bodyTemplate" [serializedNodes]="items" [frozen]="frozen"></tbody>
            </table>
            <div #scrollableAligner style="background-color:transparent" *ngIf="frozen"></div>
        </ng-template>

        <div #scrollFooter *ngIf="tt.footerTemplate" class="p-treetable-scrollable-footer">
            <div #scrollFooterBox class="p-treetable-scrollable-footer-box">
                <table class="p-treetable-scrollable-footer-table" [ngClass]="tt.tableStyleClass" [ngStyle]="tt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? tt.frozenColGroupTemplate || tt.colGroupTemplate : tt.colGroupTemplate; context: { $implicit: columns }"></ng-container>
                    <tfoot class="p-treetable-tfoot">
                        <ng-container *ngTemplateOutlet="frozen ? tt.frozenFooterTemplate || tt.footerTemplate : tt.footerTemplate; context: { $implicit: columns }"></ng-container>
                    </tfoot>
                </table>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i1.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i4.Scroller, selector: "p-scroller", inputs: ["id", "style", "styleClass", "tabindex", "items", "itemSize", "scrollHeight", "scrollWidth", "orientation", "step", "delay", "resizeDelay", "appendOnly", "inline", "lazy", "disabled", "loaderDisabled", "columns", "showSpacer", "showLoader", "numToleratedItems", "loading", "autoSize", "trackBy", "options"], outputs: ["onLazyLoad", "onScroll", "onScrollIndexChange"] }, { kind: "component", type: TTBody, selector: "[pTreeTableBody]", inputs: ["pTreeTableBody", "pTreeTableBodyTemplate", "frozen", "serializedNodes", "scrollerOptions"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTScrollableView, decorators: [{
            type: Component,
            args: [{
                    selector: '[ttScrollableView]',
                    template: `
        <div #scrollHeader class="p-treetable-scrollable-header">
            <div #scrollHeaderBox class="p-treetable-scrollable-header-box">
                <table class="p-treetable-scrollable-header-table" [ngClass]="tt.tableStyleClass" [ngStyle]="tt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? tt.frozenColGroupTemplate || tt.colGroupTemplate : tt.colGroupTemplate; context: { $implicit: columns }"></ng-container>
                    <thead class="p-treetable-thead">
                        <ng-container *ngTemplateOutlet="frozen ? tt.frozenHeaderTemplate || tt.headerTemplate : tt.headerTemplate; context: { $implicit: columns }"></ng-container>
                    </thead>
                </table>
            </div>
        </div>

        <p-scroller
            *ngIf="tt.virtualScroll"
            #scroller
            [items]="tt.serializedValue"
            styleClass="p-treetable-scrollable-body"
            [style]="{ height: tt.scrollHeight !== 'flex' ? tt.scrollHeight : undefined }"
            [scrollHeight]="scrollHeight !== 'flex' ? undefined : '100%'"
            [itemSize]="tt.virtualScrollItemSize || tt._virtualRowHeight"
            [lazy]="tt.lazy"
            (onLazyLoad)="tt.onLazyItemLoad($event)"
            [options]="tt.virtualScrollOptions"
        >
            <ng-template pTemplate="content" let-items let-scrollerOptions="options">
                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
            </ng-template>
            <ng-container *ngIf="loaderTemplate">
                <ng-template pTemplate="loader" let-scrollerOptions="options">
                    <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                </ng-template>
            </ng-container>
        </p-scroller>
        <ng-container *ngIf="!tt.virtualScroll">
            <div #scrollBody class="p-treetable-scrollable-body" [ngStyle]="{ 'max-height': tt.scrollHeight !== 'flex' ? scrollHeight : undefined, 'overflow-y': !frozen && tt.scrollHeight ? 'scroll' : undefined }">
                <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: serializedValue, options: {} }"></ng-container>
            </div>
        </ng-container>

        <ng-template #buildInItems let-items let-scrollerOptions="options">
            <table #scrollTable [class]="tt.tableStyleClass" [ngClass]="scrollerOptions.contentStyleClass" [ngStyle]="tt.tableStyle" [style]="scrollerOptions.contentStyle">
                <ng-container *ngTemplateOutlet="frozen ? tt.frozenColGroupTemplate || tt.colGroupTemplate : tt.colGroupTemplate; context: { $implicit: columns }"></ng-container>
                <tbody class="p-treetable-tbody" [pTreeTableBody]="columns" [pTreeTableBodyTemplate]="frozen ? tt.frozenBodyTemplate || tt.bodyTemplate : tt.bodyTemplate" [serializedNodes]="items" [frozen]="frozen"></tbody>
            </table>
            <div #scrollableAligner style="background-color:transparent" *ngIf="frozen"></div>
        </ng-template>

        <div #scrollFooter *ngIf="tt.footerTemplate" class="p-treetable-scrollable-footer">
            <div #scrollFooterBox class="p-treetable-scrollable-footer-box">
                <table class="p-treetable-scrollable-footer-table" [ngClass]="tt.tableStyleClass" [ngStyle]="tt.tableStyle">
                    <ng-container *ngTemplateOutlet="frozen ? tt.frozenColGroupTemplate || tt.colGroupTemplate : tt.colGroupTemplate; context: { $implicit: columns }"></ng-container>
                    <tfoot class="p-treetable-tfoot">
                        <ng-container *ngTemplateOutlet="frozen ? tt.frozenFooterTemplate || tt.footerTemplate : tt.footerTemplate; context: { $implicit: columns }"></ng-container>
                    </tfoot>
                </table>
            </div>
        </div>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: TreeTable }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { columns: [{
                type: Input,
                args: ['ttScrollableView']
            }], frozen: [{
                type: Input
            }], scrollHeaderViewChild: [{
                type: ViewChild,
                args: ['scrollHeader']
            }], scrollHeaderBoxViewChild: [{
                type: ViewChild,
                args: ['scrollHeaderBox']
            }], scrollBodyViewChild: [{
                type: ViewChild,
                args: ['scrollBody']
            }], scrollTableViewChild: [{
                type: ViewChild,
                args: ['scrollTable']
            }], scrollLoadingTableViewChild: [{
                type: ViewChild,
                args: ['loadingTable']
            }], scrollFooterViewChild: [{
                type: ViewChild,
                args: ['scrollFooter']
            }], scrollFooterBoxViewChild: [{
                type: ViewChild,
                args: ['scrollFooterBox']
            }], scrollableAlignerViewChild: [{
                type: ViewChild,
                args: ['scrollableAligner']
            }], scroller: [{
                type: ViewChild,
                args: ['scroller']
            }], scrollHeight: [{
                type: Input
            }] } });
export class TTSortableColumn {
    constructor(tt) {
        this.tt = tt;
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.sortSource$.subscribe((sortMeta) => {
                this.updateSortState();
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }
    updateSortState() {
        this.sorted = this.tt.isSorted(this.field);
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.updateSortState();
            this.tt.sort({
                originalEvent: event,
                field: this.field
            });
            DomHandler.clearSelection();
        }
    }
    onEnterKey(event) {
        this.onClick(event);
    }
    isEnabled() {
        return this.ttSortableColumnDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTSortableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSortableColumn, deps: [{ token: TreeTable }], target: i0.ɵɵFactoryTarget.Directive });
TTSortableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTSortableColumn, selector: "[ttSortableColumn]", inputs: { field: ["ttSortableColumn", "field"], ttSortableColumnDisabled: "ttSortableColumnDisabled" }, host: { listeners: { "click": "onClick($event)", "keydown.enter": "onEnterKey($event)" }, properties: { "class.p-sortable-column": "isEnabled()", "class.p-highlight": "sorted", "attr.tabindex": "isEnabled() ? \"0\" : null", "attr.role": "\"columnheader\"" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSortableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttSortableColumn]',
                    host: {
                        class: 'p-element',
                        '[class.p-sortable-column]': 'isEnabled()',
                        '[class.p-highlight]': 'sorted',
                        '[attr.tabindex]': 'isEnabled() ? "0" : null',
                        '[attr.role]': '"columnheader"'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }]; }, propDecorators: { field: [{
                type: Input,
                args: ['ttSortableColumn']
            }], ttSortableColumnDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onEnterKey: [{
                type: HostListener,
                args: ['keydown.enter', ['$event']]
            }] } });
export class TTSortIcon {
    constructor(tt, cd) {
        this.tt = tt;
        this.cd = cd;
        this.subscription = this.tt.tableService.sortSource$.subscribe((sortMeta) => {
            this.updateSortState();
            this.cd.markForCheck();
        });
    }
    ngOnInit() {
        this.updateSortState();
    }
    onClick(event) {
        event.preventDefault();
    }
    updateSortState() {
        if (this.tt.sortMode === 'single') {
            this.sortOrder = this.tt.isSorted(this.field) ? this.tt.sortOrder : 0;
        }
        else if (this.tt.sortMode === 'multiple') {
            let sortMeta = this.tt.getSortMeta(this.field);
            this.sortOrder = sortMeta ? sortMeta.order : 0;
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTSortIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSortIcon, deps: [{ token: TreeTable }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TTSortIcon.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TTSortIcon, selector: "p-treeTableSortIcon", inputs: { field: "field", ariaLabelDesc: "ariaLabelDesc", ariaLabelAsc: "ariaLabelAsc" }, host: { classAttribute: "p-element" }, ngImport: i0, template: ` <ng-container *ngIf="!tt.sortIconTemplate">
            <SortAltIcon [styleClass]="'p-sortable-column-icon'" *ngIf="sortOrder === 0" />
            <SortAmountUpAltIcon [styleClass]="'p-sortable-column-icon'" *ngIf="sortOrder === 1" />
            <SortAmountDownIcon [styleClass]="'p-sortable-column-icon'" *ngIf="sortOrder === -1" />
        </ng-container>
        <span *ngIf="tt.sortIconTemplate" class="p-sortable-column-icon">
            <ng-template *ngTemplateOutlet="tt.sortIconTemplate; context: { $implicit: sortOrder }"></ng-template>
        </span>`, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i0.forwardRef(function () { return SortAltIcon; }), selector: "SortAltIcon" }, { kind: "component", type: i0.forwardRef(function () { return SortAmountUpAltIcon; }), selector: "SortAmountUpAltIcon" }, { kind: "component", type: i0.forwardRef(function () { return SortAmountDownIcon; }), selector: "SortAmountDownIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSortIcon, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-treeTableSortIcon',
                    template: ` <ng-container *ngIf="!tt.sortIconTemplate">
            <SortAltIcon [styleClass]="'p-sortable-column-icon'" *ngIf="sortOrder === 0" />
            <SortAmountUpAltIcon [styleClass]="'p-sortable-column-icon'" *ngIf="sortOrder === 1" />
            <SortAmountDownIcon [styleClass]="'p-sortable-column-icon'" *ngIf="sortOrder === -1" />
        </ng-container>
        <span *ngIf="tt.sortIconTemplate" class="p-sortable-column-icon">
            <ng-template *ngTemplateOutlet="tt.sortIconTemplate; context: { $implicit: sortOrder }"></ng-template>
        </span>`,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { field: [{
                type: Input
            }], ariaLabelDesc: [{
                type: Input
            }], ariaLabelAsc: [{
                type: Input
            }] } });
export class TTResizableColumn {
    constructor(document, platformId, renderer, tt, el, zone) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.tt = tt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isEnabled()) {
                DomHandler.addClass(this.el.nativeElement, 'p-resizable-column');
                this.resizer = this.renderer.createElement('span');
                this.renderer.addClass(this.resizer, 'p-column-resizer');
                this.renderer.appendChild(this.el.nativeElement, this.resizer);
                this.zone.runOutsideAngular(() => {
                    this.resizerMouseDownListener = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown.bind(this));
                });
            }
        }
    }
    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this));
            this.documentMouseUpListener = this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this));
        });
    }
    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            this.documentMouseMoveListener();
            this.documentMouseMoveListener = null;
        }
        if (this.documentMouseUpListener) {
            this.documentMouseUpListener();
            this.documentMouseUpListener = null;
        }
    }
    onMouseDown(event) {
        this.tt.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }
    onDocumentMouseMove(event) {
        this.tt.onColumnResize(event);
    }
    onDocumentMouseUp(event) {
        this.tt.onColumnResizeEnd(event, this.el.nativeElement);
        this.unbindDocumentEvents();
    }
    isEnabled() {
        return this.ttResizableColumnDisabled !== true;
    }
    ngOnDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizerMouseDownListener();
            this.resizerMouseDownListener = null;
        }
        this.unbindDocumentEvents();
    }
}
TTResizableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTResizableColumn, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: TreeTable }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
TTResizableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTResizableColumn, selector: "[ttResizableColumn]", inputs: { ttResizableColumnDisabled: "ttResizableColumnDisabled" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTResizableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttResizableColumn]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: TreeTable }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { ttResizableColumnDisabled: [{
                type: Input
            }] } });
export class TTReorderableColumn {
    constructor(document, platformId, renderer, tt, el, zone) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.tt = tt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            this.bindEvents();
        }
    }
    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
                this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));
                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragEnter.bind(this));
                this.dragEnterListener = this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this));
                this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
            });
        }
    }
    unbindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mouseDownListener) {
                this.mouseDownListener();
                this.mouseDownListener = null;
            }
            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }
            if (this.dragEnterListener) {
                this.dragEnterListener();
                this.dragEnterListener = null;
            }
            if (this.dragEnterListener) {
                this.dragEnterListener();
                this.dragEnterListener = null;
            }
            if (this.dragLeaveListener) {
                this.dragLeaveListener();
                this.dragLeaveListener = null;
            }
        }
    }
    onMouseDown(event) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || DomHandler.hasClass(event.target, 'p-column-resizer'))
            this.el.nativeElement.draggable = false;
        else
            this.el.nativeElement.draggable = true;
    }
    onDragStart(event) {
        this.tt.onColumnDragStart(event, this.el.nativeElement);
    }
    onDragOver(event) {
        event.preventDefault();
    }
    onDragEnter(event) {
        this.tt.onColumnDragEnter(event, this.el.nativeElement);
    }
    onDragLeave(event) {
        this.tt.onColumnDragLeave(event);
    }
    onDrop(event) {
        if (this.isEnabled()) {
            this.tt.onColumnDrop(event, this.el.nativeElement);
        }
    }
    isEnabled() {
        return this.ttReorderableColumnDisabled !== true;
    }
    ngOnDestroy() {
        this.unbindEvents();
    }
}
TTReorderableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTReorderableColumn, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: TreeTable }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
TTReorderableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTReorderableColumn, selector: "[ttReorderableColumn]", inputs: { ttReorderableColumnDisabled: "ttReorderableColumnDisabled" }, host: { listeners: { "drop": "onDrop($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTReorderableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttReorderableColumn]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: TreeTable }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { ttReorderableColumnDisabled: [{
                type: Input
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
export class TTSelectableRow {
    constructor(tt, tableService) {
        this.tt = tt;
        this.tableService = tableService;
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.tt.isSelected(this.rowNode.node);
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.selected = this.tt.isSelected(this.rowNode.node);
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.tt.handleRowClick({
                originalEvent: event,
                rowNode: this.rowNode
            });
        }
    }
    onEnterKey(event) {
        if (event.which === 13) {
            this.onClick(event);
        }
    }
    onTouchEnd(event) {
        if (this.isEnabled()) {
            this.tt.handleRowTouchEnd(event);
        }
    }
    isEnabled() {
        return this.ttSelectableRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTSelectableRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSelectableRow, deps: [{ token: TreeTable }, { token: TreeTableService }], target: i0.ɵɵFactoryTarget.Directive });
TTSelectableRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTSelectableRow, selector: "[ttSelectableRow]", inputs: { rowNode: ["ttSelectableRow", "rowNode"], ttSelectableRowDisabled: "ttSelectableRowDisabled" }, host: { listeners: { "click": "onClick($event)", "keydown": "onEnterKey($event)", "touchend": "onTouchEnd($event)" }, properties: { "class.p-highlight": "selected" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSelectableRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttSelectableRow]',
                    host: {
                        class: 'p-element',
                        '[class.p-highlight]': 'selected'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TreeTableService }]; }, propDecorators: { rowNode: [{
                type: Input,
                args: ['ttSelectableRow']
            }], ttSelectableRowDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onEnterKey: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onTouchEnd: [{
                type: HostListener,
                args: ['touchend', ['$event']]
            }] } });
export class TTSelectableRowDblClick {
    constructor(tt, tableService) {
        this.tt = tt;
        this.tableService = tableService;
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.tt.isSelected(this.rowNode.node);
            });
        }
    }
    ngOnInit() {
        if (this.isEnabled()) {
            this.selected = this.tt.isSelected(this.rowNode.node);
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.tt.handleRowClick({
                originalEvent: event,
                rowNode: this.rowNode
            });
        }
    }
    isEnabled() {
        return this.ttSelectableRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTSelectableRowDblClick.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSelectableRowDblClick, deps: [{ token: TreeTable }, { token: TreeTableService }], target: i0.ɵɵFactoryTarget.Directive });
TTSelectableRowDblClick.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTSelectableRowDblClick, selector: "[ttSelectableRowDblClick]", inputs: { rowNode: ["ttSelectableRowDblClick", "rowNode"], ttSelectableRowDisabled: "ttSelectableRowDisabled" }, host: { listeners: { "dblclick": "onClick($event)" }, properties: { "class.p-highlight": "selected" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTSelectableRowDblClick, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttSelectableRowDblClick]',
                    host: {
                        class: 'p-element',
                        '[class.p-highlight]': 'selected'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TreeTableService }]; }, propDecorators: { rowNode: [{
                type: Input,
                args: ['ttSelectableRowDblClick']
            }], ttSelectableRowDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['dblclick', ['$event']]
            }] } });
export class TTContextMenuRow {
    constructor(tt, tableService, el) {
        this.tt = tt;
        this.tableService = tableService;
        this.el = el;
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.contextMenuSource$.subscribe((node) => {
                this.selected = this.tt.equals(this.rowNode.node, node);
            });
        }
    }
    onContextMenu(event) {
        if (this.isEnabled()) {
            this.tt.handleRowRightClick({
                originalEvent: event,
                rowNode: this.rowNode
            });
            this.el.nativeElement.focus();
            event.preventDefault();
        }
    }
    isEnabled() {
        return this.ttContextMenuRowDisabled !== true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTContextMenuRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTContextMenuRow, deps: [{ token: TreeTable }, { token: TreeTableService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
TTContextMenuRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTContextMenuRow, selector: "[ttContextMenuRow]", inputs: { rowNode: ["ttContextMenuRow", "rowNode"], ttContextMenuRowDisabled: "ttContextMenuRowDisabled" }, host: { listeners: { "contextmenu": "onContextMenu($event)" }, properties: { "class.p-highlight-contextmenu": "selected", "attr.tabindex": "isEnabled() ? 0 : undefined" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTContextMenuRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttContextMenuRow]',
                    host: {
                        class: 'p-element',
                        '[class.p-highlight-contextmenu]': 'selected',
                        '[attr.tabindex]': 'isEnabled() ? 0 : undefined'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TreeTableService }, { type: i0.ElementRef }]; }, propDecorators: { rowNode: [{
                type: Input,
                args: ['ttContextMenuRow']
            }], ttContextMenuRowDisabled: [{
                type: Input
            }], onContextMenu: [{
                type: HostListener,
                args: ['contextmenu', ['$event']]
            }] } });
export class TTCheckbox {
    constructor(tt, tableService, cd) {
        this.tt = tt;
        this.tableService = tableService;
        this.cd = cd;
        this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.tt.isSelected(this.rowNode.node);
            this.cd.markForCheck();
        });
    }
    ngOnInit() {
        this.checked = this.tt.isSelected(this.rowNode.node);
    }
    onClick(event) {
        if (!this.disabled) {
            this.tt.toggleNodeWithCheckbox({
                originalEvent: event,
                rowNode: this.rowNode
            });
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
TTCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTCheckbox, deps: [{ token: TreeTable }, { token: TreeTableService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TTCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TTCheckbox, selector: "p-treeTableCheckbox", inputs: { disabled: "disabled", rowNode: ["value", "rowNode"] }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input type="checkbox" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box': true, 'p-highlight': checked, 'p-focus': focused, 'p-indeterminate': rowNode.node.partialSelected, 'p-disabled': disabled }" role="checkbox" [attr.aria-checked]="checked">
                <ng-container *ngIf="!tt.checkboxIconTemplate">
                    <CheckIcon [styleClass]="'p-checkbox-icon'" *ngIf="checked" />
                    <MinusIcon [styleClass]="'p-checkbox-icon'" *ngIf="rowNode.node.partialSelected" />
                </ng-container>
                <span *ngIf="tt.checkboxIconTemplate">
                    <ng-template *ngTemplateOutlet="tt.checkboxIconTemplate; context: { $implicit: checked, partialSelected: rowNode.node.partialSelected }"></ng-template>
                </span>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i0.forwardRef(function () { return CheckIcon; }), selector: "CheckIcon" }, { kind: "component", type: i0.forwardRef(function () { return MinusIcon; }), selector: "MinusIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTCheckbox, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-treeTableCheckbox',
                    template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused }" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input type="checkbox" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box': true, 'p-highlight': checked, 'p-focus': focused, 'p-indeterminate': rowNode.node.partialSelected, 'p-disabled': disabled }" role="checkbox" [attr.aria-checked]="checked">
                <ng-container *ngIf="!tt.checkboxIconTemplate">
                    <CheckIcon [styleClass]="'p-checkbox-icon'" *ngIf="checked" />
                    <MinusIcon [styleClass]="'p-checkbox-icon'" *ngIf="rowNode.node.partialSelected" />
                </ng-container>
                <span *ngIf="tt.checkboxIconTemplate">
                    <ng-template *ngTemplateOutlet="tt.checkboxIconTemplate; context: { $implicit: checked, partialSelected: rowNode.node.partialSelected }"></ng-template>
                </span>
            </div>
        </div>
    `,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TreeTableService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], rowNode: [{
                type: Input,
                args: ['value']
            }] } });
export class TTHeaderCheckbox {
    constructor(tt, tableService, cd) {
        this.tt = tt;
        this.tableService = tableService;
        this.cd = cd;
        this.valueChangeSubscription = this.tt.tableService.uiUpdateSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
        this.selectionChangeSubscription = this.tt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
    }
    ngOnInit() {
        this.checked = this.updateCheckedState();
    }
    onClick(event, checked) {
        if (this.tt.value && this.tt.value.length > 0) {
            this.tt.toggleNodesWithCheckbox(event, !checked);
        }
        DomHandler.clearSelection();
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    ngOnDestroy() {
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }
        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }
    updateCheckedState() {
        this.cd.markForCheck();
        let checked;
        const data = this.tt.filteredNodes || this.tt.value;
        if (data) {
            for (let node of data) {
                if (this.tt.isSelected(node)) {
                    checked = true;
                }
                else {
                    checked = false;
                    break;
                }
            }
        }
        else {
            checked = false;
        }
        return checked;
    }
}
TTHeaderCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTHeaderCheckbox, deps: [{ token: TreeTable }, { token: TreeTableService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TTHeaderCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TTHeaderCheckbox, selector: "p-treeTableHeaderCheckbox", host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "boxViewChild", first: true, predicate: ["box"], descendants: true }], ngImport: i0, template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused }" (click)="onClick($event, cb.checked)">
            <div class="p-hidden-accessible">
                <input #cb type="checkbox" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="!tt.value || tt.value.length === 0" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': !tt.value || tt.value.length === 0 }" role="checkbox" [attr.aria-checked]="checked">
                <ng-container *ngIf="!tt.headerCheckboxIconTemplate">
                    <CheckIcon *ngIf="checked" [styleClass]="'p-checkbox-icon'" />
                </ng-container>
                <span class="p-checkbox-icon" *ngIf="tt.headerCheckboxIconTemplate">
                    <ng-template *ngTemplateOutlet="tt.headerCheckboxIconTemplate; context: { $implicit: checked }"></ng-template>
                </span>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i0.forwardRef(function () { return CheckIcon; }), selector: "CheckIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTHeaderCheckbox, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-treeTableHeaderCheckbox',
                    template: `
        <div class="p-checkbox p-component" [ngClass]="{ 'p-checkbox-focused': focused }" (click)="onClick($event, cb.checked)">
            <div class="p-hidden-accessible">
                <input #cb type="checkbox" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="!tt.value || tt.value.length === 0" />
            </div>
            <div #box [ngClass]="{ 'p-checkbox-box': true, 'p-highlight': checked, 'p-focus': focused, 'p-disabled': !tt.value || tt.value.length === 0 }" role="checkbox" [attr.aria-checked]="checked">
                <ng-container *ngIf="!tt.headerCheckboxIconTemplate">
                    <CheckIcon *ngIf="checked" [styleClass]="'p-checkbox-icon'" />
                </ng-container>
                <span class="p-checkbox-icon" *ngIf="tt.headerCheckboxIconTemplate">
                    <ng-template *ngTemplateOutlet="tt.headerCheckboxIconTemplate; context: { $implicit: checked }"></ng-template>
                </span>
            </div>
        </div>
    `,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TreeTableService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { boxViewChild: [{
                type: ViewChild,
                args: ['box']
            }] } });
export class TTEditableColumn {
    constructor(tt, el, zone) {
        this.tt = tt;
        this.el = el;
        this.zone = zone;
    }
    ngAfterViewInit() {
        if (this.isEnabled()) {
            DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
        }
    }
    onClick(event) {
        if (this.isEnabled()) {
            this.tt.editingCellClick = true;
            if (this.tt.editingCell) {
                if (this.tt.editingCell !== this.el.nativeElement) {
                    if (!this.tt.isEditingCellValid()) {
                        return;
                    }
                    DomHandler.removeClass(this.tt.editingCell, 'p-cell-editing');
                    this.openCell();
                }
            }
            else {
                this.openCell();
            }
        }
    }
    openCell() {
        this.tt.updateEditingCell(this.el.nativeElement, this.data, this.field);
        DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
        this.tt.onEditInit.emit({ field: this.field, data: this.data });
        this.tt.editingCellClick = true;
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusable = DomHandler.findSingle(this.el.nativeElement, 'input, textarea');
                if (focusable) {
                    focusable.focus();
                }
            }, 50);
        });
    }
    closeEditingCell() {
        DomHandler.removeClass(this.tt.editingCell, 'p-checkbox-icon');
        this.tt.editingCell = null;
        this.tt.unbindDocumentEditListener();
    }
    onKeyDown(event) {
        if (this.isEnabled()) {
            //enter
            if (event.keyCode == 13) {
                if (this.tt.isEditingCellValid()) {
                    DomHandler.removeClass(this.tt.editingCell, 'p-cell-editing');
                    this.closeEditingCell();
                    this.tt.onEditComplete.emit({ field: this.field, data: this.data });
                }
                event.preventDefault();
            }
            //escape
            else if (event.keyCode == 27) {
                if (this.tt.isEditingCellValid()) {
                    DomHandler.removeClass(this.tt.editingCell, 'p-cell-editing');
                    this.closeEditingCell();
                    this.tt.onEditCancel.emit({ field: this.field, data: this.data });
                }
                event.preventDefault();
            }
            //tab
            else if (event.keyCode == 9) {
                this.tt.onEditComplete.emit({ field: this.field, data: this.data });
                if (event.shiftKey)
                    this.moveToPreviousCell(event);
                else
                    this.moveToNextCell(event);
            }
        }
    }
    findCell(element) {
        if (element) {
            let cell = element;
            while (cell && !DomHandler.hasClass(cell, 'p-cell-editing')) {
                cell = cell.parentElement;
            }
            return cell;
        }
        else {
            return null;
        }
    }
    moveToPreviousCell(event) {
        let currentCell = this.findCell(event.target);
        let row = currentCell.parentElement;
        let targetCell = this.findPreviousEditableColumn(currentCell);
        if (targetCell) {
            DomHandler.invokeElementMethod(targetCell, 'click');
            event.preventDefault();
        }
    }
    moveToNextCell(event) {
        let currentCell = this.findCell(event.target);
        let row = currentCell.parentElement;
        let targetCell = this.findNextEditableColumn(currentCell);
        if (targetCell) {
            DomHandler.invokeElementMethod(targetCell, 'click');
            event.preventDefault();
        }
    }
    findPreviousEditableColumn(cell) {
        let prevCell = cell.previousElementSibling;
        if (!prevCell) {
            let previousRow = cell.parentElement ? cell.parentElement.previousElementSibling : null;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }
        if (prevCell) {
            if (DomHandler.hasClass(prevCell, 'p-editable-column'))
                return prevCell;
            else
                return this.findPreviousEditableColumn(prevCell);
        }
        else {
            return null;
        }
    }
    findNextEditableColumn(cell) {
        let nextCell = cell.nextElementSibling;
        if (!nextCell) {
            let nextRow = cell.parentElement ? cell.parentElement.nextElementSibling : null;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }
        if (nextCell) {
            if (DomHandler.hasClass(nextCell, 'p-editable-column'))
                return nextCell;
            else
                return this.findNextEditableColumn(nextCell);
        }
        else {
            return null;
        }
    }
    isEnabled() {
        return this.ttEditableColumnDisabled !== true;
    }
}
TTEditableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTEditableColumn, deps: [{ token: TreeTable }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
TTEditableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTEditableColumn, selector: "[ttEditableColumn]", inputs: { data: ["ttEditableColumn", "data"], field: ["ttEditableColumnField", "field"], ttEditableColumnDisabled: "ttEditableColumnDisabled" }, host: { listeners: { "click": "onClick($event)", "keydown": "onKeyDown($event)" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTEditableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttEditableColumn]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { data: [{
                type: Input,
                args: ['ttEditableColumn']
            }], field: [{
                type: Input,
                args: ['ttEditableColumnField']
            }], ttEditableColumnDisabled: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
export class TreeTableCellEditor {
    constructor(tt, editableColumn) {
        this.tt = tt;
        this.editableColumn = editableColumn;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;
                case 'output':
                    this.outputTemplate = item.template;
                    break;
            }
        });
    }
}
TreeTableCellEditor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableCellEditor, deps: [{ token: TreeTable }, { token: TTEditableColumn }], target: i0.ɵɵFactoryTarget.Component });
TreeTableCellEditor.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TreeTableCellEditor, selector: "p-treeTableCellEditor", host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <ng-container *ngIf="tt.editingCell === editableColumn.el.nativeElement">
            <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
        </ng-container>
        <ng-container *ngIf="!tt.editingCell || tt.editingCell !== editableColumn.el.nativeElement">
            <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableCellEditor, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-treeTableCellEditor',
                    template: `
        <ng-container *ngIf="tt.editingCell === editableColumn.el.nativeElement">
            <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
        </ng-container>
        <ng-container *ngIf="!tt.editingCell || tt.editingCell !== editableColumn.el.nativeElement">
            <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
        </ng-container>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: TTEditableColumn }]; }, propDecorators: { templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class TTRow {
    constructor(tt, el, zone) {
        this.tt = tt;
        this.el = el;
        this.zone = zone;
    }
    onKeyDown(event) {
        switch (event.which) {
            //down arrow
            case 40:
                let nextRow = this.el.nativeElement.nextElementSibling;
                if (nextRow) {
                    nextRow.focus();
                }
                event.preventDefault();
                break;
            //down arrow
            case 38:
                let prevRow = this.el.nativeElement.previousElementSibling;
                if (prevRow) {
                    prevRow.focus();
                }
                event.preventDefault();
                break;
            //left arrow
            case 37:
                if (this.rowNode.node.expanded) {
                    this.tt.toggleRowIndex = DomHandler.index(this.el.nativeElement);
                    this.rowNode.node.expanded = false;
                    this.tt.onNodeCollapse.emit({
                        originalEvent: event,
                        node: this.rowNode.node
                    });
                    this.tt.updateSerializedValue();
                    this.tt.tableService.onUIUpdate(this.tt.value);
                    this.restoreFocus();
                }
                break;
            //right arrow
            case 39:
                if (!this.rowNode.node.expanded) {
                    this.tt.toggleRowIndex = DomHandler.index(this.el.nativeElement);
                    this.rowNode.node.expanded = true;
                    this.tt.onNodeExpand.emit({
                        originalEvent: event,
                        node: this.rowNode.node
                    });
                    this.tt.updateSerializedValue();
                    this.tt.tableService.onUIUpdate(this.tt.value);
                    this.restoreFocus();
                }
                break;
        }
    }
    restoreFocus() {
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let row = DomHandler.findSingle(this.tt.containerViewChild.nativeElement, '.p-treetable-tbody').children[this.tt.toggleRowIndex];
                if (row) {
                    row.focus();
                }
            }, 25);
        });
    }
}
TTRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTRow, deps: [{ token: TreeTable }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
TTRow.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.8", type: TTRow, selector: "[ttRow]", inputs: { rowNode: ["ttRow", "rowNode"] }, host: { listeners: { "keydown": "onKeyDown($event)" }, properties: { "attr.tabindex": "\"0\"" }, classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TTRow, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ttRow]',
                    host: {
                        class: 'p-element',
                        '[attr.tabindex]': '"0"'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { rowNode: [{
                type: Input,
                args: ['ttRow']
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
export class TreeTableToggler {
    constructor(tt) {
        this.tt = tt;
    }
    onClick(event) {
        this.rowNode.node.expanded = !this.rowNode.node.expanded;
        if (this.rowNode.node.expanded) {
            this.tt.onNodeExpand.emit({
                originalEvent: event,
                node: this.rowNode.node
            });
        }
        else {
            this.tt.onNodeCollapse.emit({
                originalEvent: event,
                node: this.rowNode.node
            });
        }
        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt.value);
        event.preventDefault();
    }
}
TreeTableToggler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableToggler, deps: [{ token: TreeTable }], target: i0.ɵɵFactoryTarget.Component });
TreeTableToggler.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.8", type: TreeTableToggler, selector: "p-treeTableToggler", inputs: { rowNode: "rowNode" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <button
            type="button"
            class="p-treetable-toggler p-link"
            (click)="onClick($event)"
            tabindex="-1"
            pRipple
            [style.visibility]="rowNode.node.leaf === false || (rowNode.node.children && rowNode.node.children.length) ? 'visible' : 'hidden'"
            [style.marginLeft]="rowNode.level * 16 + 'px'"
        >
            <ng-container *ngIf="!tt.togglerIconTemplate">
                <ChevronDownIcon *ngIf="rowNode.node.expanded" />
                <ChevronRightIcon *ngIf="!rowNode.node.expanded" />
            </ng-container>
            <ng-template *ngTemplateOutlet="tt.togglerIconTemplate; context: { $implicit: rowNode.node.expanded }"></ng-template>
        </button>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i5.Ripple; }), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(function () { return ChevronDownIcon; }), selector: "ChevronDownIcon" }, { kind: "component", type: i0.forwardRef(function () { return ChevronRightIcon; }), selector: "ChevronRightIcon" }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableToggler, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-treeTableToggler',
                    template: `
        <button
            type="button"
            class="p-treetable-toggler p-link"
            (click)="onClick($event)"
            tabindex="-1"
            pRipple
            [style.visibility]="rowNode.node.leaf === false || (rowNode.node.children && rowNode.node.children.length) ? 'visible' : 'hidden'"
            [style.marginLeft]="rowNode.level * 16 + 'px'"
        >
            <ng-container *ngIf="!tt.togglerIconTemplate">
                <ChevronDownIcon *ngIf="rowNode.node.expanded" />
                <ChevronRightIcon *ngIf="!rowNode.node.expanded" />
            </ng-container>
            <ng-template *ngTemplateOutlet="tt.togglerIconTemplate; context: { $implicit: rowNode.node.expanded }"></ng-template>
        </button>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: TreeTable }]; }, propDecorators: { rowNode: [{
                type: Input
            }] } });
export class TreeTableModule {
}
TreeTableModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TreeTableModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.8", ngImport: i0, type: TreeTableModule, declarations: [TreeTable, TreeTableToggler, TTScrollableView, TTBody, TTSortableColumn, TTSortIcon, TTResizableColumn, TTRow, TTReorderableColumn, TTSelectableRow, TTSelectableRowDblClick, TTContextMenuRow, TTCheckbox, TTHeaderCheckbox, TTEditableColumn, TreeTableCellEditor], imports: [CommonModule, PaginatorModule, RippleModule, ScrollerModule, SpinnerIcon, ArrowDownIcon, ArrowUpIcon, SortAltIcon, SortAmountUpAltIcon, SortAmountDownIcon, CheckIcon, MinusIcon, ChevronDownIcon, ChevronRightIcon], exports: [TreeTable, SharedModule, TreeTableToggler, TTSortableColumn, TTSortIcon, TTResizableColumn, TTRow, TTReorderableColumn, TTSelectableRow, TTSelectableRowDblClick, TTContextMenuRow, TTCheckbox, TTHeaderCheckbox, TTEditableColumn, TreeTableCellEditor, ScrollerModule] });
TreeTableModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableModule, imports: [CommonModule, PaginatorModule, RippleModule, ScrollerModule, SpinnerIcon, ArrowDownIcon, ArrowUpIcon, SortAltIcon, SortAmountUpAltIcon, SortAmountDownIcon, CheckIcon, MinusIcon, ChevronDownIcon, ChevronRightIcon, SharedModule,
        ScrollerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: TreeTableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, PaginatorModule, RippleModule, ScrollerModule, SpinnerIcon, ArrowDownIcon, ArrowUpIcon, SortAltIcon, SortAmountUpAltIcon, SortAmountDownIcon, CheckIcon, MinusIcon, ChevronDownIcon, ChevronRightIcon],
                    exports: [
                        TreeTable,
                        SharedModule,
                        TreeTableToggler,
                        TTSortableColumn,
                        TTSortIcon,
                        TTResizableColumn,
                        TTRow,
                        TTReorderableColumn,
                        TTSelectableRow,
                        TTSelectableRowDblClick,
                        TTContextMenuRow,
                        TTCheckbox,
                        TTHeaderCheckbox,
                        TTEditableColumn,
                        TreeTableCellEditor,
                        ScrollerModule
                    ],
                    declarations: [
                        TreeTable,
                        TreeTableToggler,
                        TTScrollableView,
                        TTBody,
                        TTSortableColumn,
                        TTSortIcon,
                        TTResizableColumn,
                        TTRow,
                        TTReorderableColumn,
                        TTSelectableRow,
                        TTSelectableRowDblClick,
                        TTContextMenuRow,
                        TTCheckbox,
                        TTHeaderCheckbox,
                        TTEditableColumn,
                        TreeTableCellEditor
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3RyZWV0YWJsZS90cmVldGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBR0gsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osTUFBTSxFQUNOLFVBQVUsRUFDVixLQUFLLEVBQ0wsUUFBUSxFQUtSLE1BQU0sRUFDTixXQUFXLEVBS1gsU0FBUyxFQUNULGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQThDLGFBQWEsRUFBRSxZQUFZLEVBQXNCLE1BQU0sYUFBYSxDQUFDO0FBQzFILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQVksY0FBYyxFQUFtQixNQUFNLGtCQUFrQixDQUFDO0FBQzdFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFC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Z0JBQWdCO3dCQUNoQixVQUFVO3dCQUNWLGlCQUFpQjt3QkFDakIsS0FBSzt3QkFDTCxtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2QixnQkFBZ0I7d0JBQ2hCLFVBQVU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixnQkFBZ0I7d0JBQ2hCLG1CQUFtQjt3QkFDbkIsY0FBYztxQkFDakI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNWLFNBQVM7d0JBQ1QsZ0JBQWdCO3dCQUNoQixnQkFBZ0I7d0JBQ2hCLE1BQU07d0JBQ04sZ0JBQWdCO3dCQUNoQixVQUFVO3dCQUNWLGlCQUFpQjt3QkFDakIsS0FBSzt3QkFDTCxtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2QixnQkFBZ0I7d0JBQ2hCLFVBQVU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixnQkFBZ0I7d0JBQ2hCLG1CQUFtQjtxQkFDdEI7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIERpcmVjdGl2ZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgSW5qZWN0LFxuICAgIEluamVjdGFibGUsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgTmdab25lLFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBQTEFURk9STV9JRCxcbiAgICBRdWVyeUxpc3QsXG4gICAgUmVuZGVyZXIyLFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmxvY2thYmxlVUksIEZpbHRlck1ldGFkYXRhLCBGaWx0ZXJTZXJ2aWNlLCBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUsIFNvcnRNZXRhLCBUcmVlTm9kZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBQYWdpbmF0b3JNb2R1bGUgfSBmcm9tICdwcmltZW5nL3BhZ2luYXRvcic7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBTY3JvbGxlciwgU2Nyb2xsZXJNb2R1bGUsIFNjcm9sbGVyT3B0aW9ucyB9IGZyb20gJ3ByaW1lbmcvc2Nyb2xsZXInO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU29ydEFtb3VudERvd25JY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9zb3J0YW1vdW50ZG93bic7XG5pbXBvcnQgeyBDaGV2cm9uUmlnaHRJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9jaGV2cm9ucmlnaHQnO1xuaW1wb3J0IHsgQXJyb3dEb3duSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvYXJyb3dkb3duJztcbmltcG9ydCB7IEFycm93VXBJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9hcnJvd3VwJztcbmltcG9ydCB7IENoZWNrSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvY2hlY2snO1xuaW1wb3J0IHsgQ2hldnJvbkRvd25JY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9jaGV2cm9uZG93bic7XG5pbXBvcnQgeyBNaW51c0ljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL21pbnVzJztcbmltcG9ydCB7IFNvcnRBbHRJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9zb3J0YWx0JztcbmltcG9ydCB7IFNvcnRBbW91bnRVcEFsdEljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL3NvcnRhbW91bnR1cGFsdCc7XG5pbXBvcnQgeyBTcGlubmVySWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvc3Bpbm5lcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUcmVlVGFibGVTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHNvcnRTb3VyY2UgPSBuZXcgU3ViamVjdDxTb3J0TWV0YSB8IFNvcnRNZXRhW10+KCk7XG4gICAgcHJpdmF0ZSBzZWxlY3Rpb25Tb3VyY2UgPSBuZXcgU3ViamVjdCgpO1xuICAgIHByaXZhdGUgY29udGV4dE1lbnVTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgcHJpdmF0ZSB1aVVwZGF0ZVNvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBwcml2YXRlIHRvdGFsUmVjb3Jkc1NvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIHNvcnRTb3VyY2UkID0gdGhpcy5zb3J0U291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHNlbGVjdGlvblNvdXJjZSQgPSB0aGlzLnNlbGVjdGlvblNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICBjb250ZXh0TWVudVNvdXJjZSQgPSB0aGlzLmNvbnRleHRNZW51U291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHVpVXBkYXRlU291cmNlJCA9IHRoaXMudWlVcGRhdGVTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgdG90YWxSZWNvcmRzU291cmNlJCA9IHRoaXMudG90YWxSZWNvcmRzU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgb25Tb3J0KHNvcnRNZXRhOiBTb3J0TWV0YSB8IFNvcnRNZXRhW10pIHtcbiAgICAgICAgdGhpcy5zb3J0U291cmNlLm5leHQoc29ydE1ldGEpO1xuICAgIH1cblxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNvdXJjZS5uZXh0KG51bGwpO1xuICAgIH1cblxuICAgIG9uQ29udGV4dE1lbnUobm9kZTogYW55KSB7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVTb3VyY2UubmV4dChub2RlKTtcbiAgICB9XG5cbiAgICBvblVJVXBkYXRlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy51aVVwZGF0ZVNvdXJjZS5uZXh0KHZhbHVlKTtcbiAgICB9XG5cbiAgICBvblRvdGFsUmVjb3Jkc0NoYW5nZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudG90YWxSZWNvcmRzU291cmNlLm5leHQodmFsdWUpO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRyZWVUYWJsZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgI2NvbnRhaW5lclxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgZGF0YS1zY3JvbGxzZWxlY3RvcnM9XCIucC10cmVldGFibGUtc2Nyb2xsYWJsZS1ib2R5XCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAncC10cmVldGFibGUgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdwLXRyZWV0YWJsZS1ob3ZlcmFibGUtcm93cyc6IHJvd0hvdmVyIHx8IHNlbGVjdGlvbk1vZGUgPT09ICdzaW5nbGUnIHx8IHNlbGVjdGlvbk1vZGUgPT09ICdtdWx0aXBsZScsXG4gICAgICAgICAgICAgICAgJ3AtdHJlZXRhYmxlLWF1dG8tbGF5b3V0JzogYXV0b0xheW91dCxcbiAgICAgICAgICAgICAgICAncC10cmVldGFibGUtcmVzaXphYmxlJzogcmVzaXphYmxlQ29sdW1ucyxcbiAgICAgICAgICAgICAgICAncC10cmVldGFibGUtcmVzaXphYmxlLWZpdCc6IHJlc2l6YWJsZUNvbHVtbnMgJiYgY29sdW1uUmVzaXplTW9kZSA9PT0gJ2ZpdCcsXG4gICAgICAgICAgICAgICAgJ3AtdHJlZXRhYmxlLWZsZXgtc2Nyb2xsYWJsZSc6IHNjcm9sbGFibGUgJiYgc2Nyb2xsSGVpZ2h0ID09PSAnZmxleCdcbiAgICAgICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10cmVldGFibGUtbG9hZGluZ1wiICpuZ0lmPVwibG9hZGluZyAmJiBzaG93TG9hZGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdHJlZXRhYmxlLWxvYWRpbmctb3ZlcmxheSBwLWNvbXBvbmVudC1vdmVybGF5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpICpuZ0lmPVwibG9hZGluZ0ljb25cIiBbY2xhc3NdPVwiJ3AtdHJlZXRhYmxlLWxvYWRpbmctaWNvbiBwaS1zcGluICcgKyBsb2FkaW5nSWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFsb2FkaW5nSWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFNwaW5uZXJJY29uICpuZ0lmPVwiIWxvYWRpbmdJY29uVGVtcGxhdGVcIiBbc3Bpbl09XCJ0cnVlXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtdHJlZXRhYmxlLWxvYWRpbmctaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCJsb2FkaW5nSWNvblRlbXBsYXRlXCIgY2xhc3M9XCJwLXRyZWV0YWJsZS1sb2FkaW5nLWljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsb2FkaW5nSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJjYXB0aW9uVGVtcGxhdGVcIiBjbGFzcz1cInAtdHJlZXRhYmxlLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjYXB0aW9uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAtcGFnaW5hdG9yXG4gICAgICAgICAgICAgICAgW3Jvd3NdPVwicm93c1wiXG4gICAgICAgICAgICAgICAgW2ZpcnN0XT1cImZpcnN0XCJcbiAgICAgICAgICAgICAgICBbdG90YWxSZWNvcmRzXT1cInRvdGFsUmVjb3Jkc1wiXG4gICAgICAgICAgICAgICAgW3BhZ2VMaW5rU2l6ZV09XCJwYWdlTGlua3NcIlxuICAgICAgICAgICAgICAgIHN0eWxlQ2xhc3M9XCJwLXBhZ2luYXRvci10b3BcIlxuICAgICAgICAgICAgICAgIFthbHdheXNTaG93XT1cImFsd2F5c1Nob3dQYWdpbmF0b3JcIlxuICAgICAgICAgICAgICAgIChvblBhZ2VDaGFuZ2UpPVwib25QYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtyb3dzUGVyUGFnZU9wdGlvbnNdPVwicm93c1BlclBhZ2VPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cInBhZ2luYXRvciAmJiAocGFnaW5hdG9yUG9zaXRpb24gPT09ICd0b3AnIHx8IHBhZ2luYXRvclBvc2l0aW9uID09ICdib3RoJylcIlxuICAgICAgICAgICAgICAgIFt0ZW1wbGF0ZUxlZnRdPVwicGFnaW5hdG9yTGVmdFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbdGVtcGxhdGVSaWdodF09XCJwYWdpbmF0b3JSaWdodFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbZHJvcGRvd25BcHBlbmRUb109XCJwYWdpbmF0b3JEcm9wZG93bkFwcGVuZFRvXCJcbiAgICAgICAgICAgICAgICBbY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZV09XCJjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbc2hvd0ZpcnN0TGFzdEljb25dPVwic2hvd0ZpcnN0TGFzdEljb25cIlxuICAgICAgICAgICAgICAgIFtkcm9wZG93bkl0ZW1UZW1wbGF0ZV09XCJwYWdpbmF0b3JEcm9wZG93bkl0ZW1UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgW3Nob3dDdXJyZW50UGFnZVJlcG9ydF09XCJzaG93Q3VycmVudFBhZ2VSZXBvcnRcIlxuICAgICAgICAgICAgICAgIFtzaG93SnVtcFRvUGFnZURyb3Bkb3duXT1cInNob3dKdW1wVG9QYWdlRHJvcGRvd25cIlxuICAgICAgICAgICAgICAgIFtzaG93UGFnZUxpbmtzXT1cInNob3dQYWdlTGlua3NcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJmaXJzdHBhZ2VsaW5raWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicGFnaW5hdG9yRmlyc3RQYWdlTGlua0ljb25UZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwicHJldmlvdXNwYWdlbGlua2ljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInBhZ2luYXRvclByZXZpb3VzUGFnZUxpbmtJY29uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImxhc3RwYWdlbGlua2ljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInBhZ2luYXRvckxhc3RQYWdlTGlua0ljb25UZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwibmV4dHBhZ2VsaW5raWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicGFnaW5hdG9yTmV4dFBhZ2VMaW5rSWNvblRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvcC1wYWdpbmF0b3I+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXRyZWV0YWJsZS13cmFwcGVyXCIgKm5nSWY9XCIhc2Nyb2xsYWJsZVwiPlxuICAgICAgICAgICAgICAgIDx0YWJsZSAjdGFibGUgW25nQ2xhc3NdPVwidGFibGVTdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwidGFibGVTdHlsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29sR3JvdXBUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGNvbHVtbnMgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJwLXRyZWV0YWJsZS10aGVhZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzcz1cInAtdHJlZXRhYmxlLXRib2R5XCIgW3BUcmVlVGFibGVCb2R5XT1cImNvbHVtbnNcIiBbcFRyZWVUYWJsZUJvZHlUZW1wbGF0ZV09XCJib2R5VGVtcGxhdGVcIj48L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICA8dGZvb3QgY2xhc3M9XCJwLXRyZWV0YWJsZS10Zm9vdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZvb3RlclRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGZvb3Q+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10cmVldGFibGUtc2Nyb2xsYWJsZS13cmFwcGVyXCIgKm5nSWY9XCJzY3JvbGxhYmxlXCI+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtdHJlZXRhYmxlLXNjcm9sbGFibGUtdmlldyBwLXRyZWV0YWJsZS1mcm96ZW4tdmlld1wiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiZnJvemVuQ29sdW1ucyB8fCBmcm96ZW5Cb2R5VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAjc2Nyb2xsYWJsZUZyb3plblZpZXdcbiAgICAgICAgICAgICAgICAgICAgW3R0U2Nyb2xsYWJsZVZpZXddPVwiZnJvemVuQ29sdW1uc1wiXG4gICAgICAgICAgICAgICAgICAgIFtmcm96ZW5dPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgd2lkdGg6IGZyb3plbldpZHRoIH1cIlxuICAgICAgICAgICAgICAgICAgICBbc2Nyb2xsSGVpZ2h0XT1cInNjcm9sbEhlaWdodFwiXG4gICAgICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXRyZWV0YWJsZS1zY3JvbGxhYmxlLXZpZXdcIiAjc2Nyb2xsYWJsZVZpZXcgW3R0U2Nyb2xsYWJsZVZpZXddPVwiY29sdW1uc1wiIFtmcm96ZW5dPVwiZmFsc2VcIiBbc2Nyb2xsSGVpZ2h0XT1cInNjcm9sbEhlaWdodFwiIFtuZ1N0eWxlXT1cInsgbGVmdDogZnJvemVuV2lkdGgsIHdpZHRoOiAnY2FsYygxMDAlIC0gJyArIGZyb3plbldpZHRoICsgJyknIH1cIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8cC1wYWdpbmF0b3JcbiAgICAgICAgICAgICAgICBbcm93c109XCJyb3dzXCJcbiAgICAgICAgICAgICAgICBbZmlyc3RdPVwiZmlyc3RcIlxuICAgICAgICAgICAgICAgIFt0b3RhbFJlY29yZHNdPVwidG90YWxSZWNvcmRzXCJcbiAgICAgICAgICAgICAgICBbcGFnZUxpbmtTaXplXT1cInBhZ2VMaW5rc1wiXG4gICAgICAgICAgICAgICAgc3R5bGVDbGFzcz1cInAtcGFnaW5hdG9yLWJvdHRvbVwiXG4gICAgICAgICAgICAgICAgW2Fsd2F5c1Nob3ddPVwiYWx3YXlzU2hvd1BhZ2luYXRvclwiXG4gICAgICAgICAgICAgICAgKG9uUGFnZUNoYW5nZSk9XCJvblBhZ2VDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW3Jvd3NQZXJQYWdlT3B0aW9uc109XCJyb3dzUGVyUGFnZU9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICpuZ0lmPVwicGFnaW5hdG9yICYmIChwYWdpbmF0b3JQb3NpdGlvbiA9PT0gJ2JvdHRvbScgfHwgcGFnaW5hdG9yUG9zaXRpb24gPT0gJ2JvdGgnKVwiXG4gICAgICAgICAgICAgICAgW3RlbXBsYXRlTGVmdF09XCJwYWdpbmF0b3JMZWZ0VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFt0ZW1wbGF0ZVJpZ2h0XT1cInBhZ2luYXRvclJpZ2h0VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFtkcm9wZG93bkFwcGVuZFRvXT1cInBhZ2luYXRvckRyb3Bkb3duQXBwZW5kVG9cIlxuICAgICAgICAgICAgICAgIFtjdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXT1cImN1cnJlbnRQYWdlUmVwb3J0VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFtzaG93Rmlyc3RMYXN0SWNvbl09XCJzaG93Rmlyc3RMYXN0SWNvblwiXG4gICAgICAgICAgICAgICAgW2Ryb3Bkb3duSXRlbVRlbXBsYXRlXT1cInBhZ2luYXRvckRyb3Bkb3duSXRlbVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbc2hvd0N1cnJlbnRQYWdlUmVwb3J0XT1cInNob3dDdXJyZW50UGFnZVJlcG9ydFwiXG4gICAgICAgICAgICAgICAgW3Nob3dKdW1wVG9QYWdlRHJvcGRvd25dPVwic2hvd0p1bXBUb1BhZ2VEcm9wZG93blwiXG4gICAgICAgICAgICAgICAgW3Nob3dQYWdlTGlua3NdPVwic2hvd1BhZ2VMaW5rc1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImZpcnN0cGFnZWxpbmtpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwYWdpbmF0b3JGaXJzdFBhZ2VMaW5rSWNvblRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJwcmV2aW91c3BhZ2VsaW5raWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicGFnaW5hdG9yUHJldmlvdXNQYWdlTGlua0ljb25UZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwibGFzdHBhZ2VsaW5raWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicGFnaW5hdG9yTGFzdFBhZ2VMaW5rSWNvblRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJuZXh0cGFnZWxpbmtpY29uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwYWdpbmF0b3JOZXh0UGFnZUxpbmtJY29uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9wLXBhZ2luYXRvcj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJzdW1tYXJ5VGVtcGxhdGVcIiBjbGFzcz1cInAtdHJlZXRhYmxlLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzdW1tYXJ5VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2ICNyZXNpemVIZWxwZXIgY2xhc3M9XCJwLWNvbHVtbi1yZXNpemVyLWhlbHBlclwiIHN0eWxlPVwiZGlzcGxheTpub25lXCIgKm5nSWY9XCJyZXNpemFibGVDb2x1bW5zXCI+PC9kaXY+XG4gICAgICAgICAgICA8c3BhbiAjcmVvcmRlckluZGljYXRvclVwIGNsYXNzPVwicC10cmVldGFibGUtcmVvcmRlci1pbmRpY2F0b3ItdXBcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCIgKm5nSWY9XCJyZW9yZGVyYWJsZUNvbHVtbnNcIj5cbiAgICAgICAgICAgICAgICA8QXJyb3dEb3duSWNvbiAqbmdJZj1cIiFyZW9yZGVySW5kaWNhdG9yVXBJY29uVGVtcGxhdGVcIiAvPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cInJlb3JkZXJJbmRpY2F0b3JVcEljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAjcmVvcmRlckluZGljYXRvckRvd24gY2xhc3M9XCJwLXRyZWV0YWJsZS1yZW9yZGVyLWluZGljYXRvci1kb3duXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiICpuZ0lmPVwicmVvcmRlcmFibGVDb2x1bW5zXCI+XG4gICAgICAgICAgICAgICAgPEFycm93VXBJY29uICpuZ0lmPVwiIXJlb3JkZXJJbmRpY2F0b3JEb3duSWNvblRlbXBsYXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJyZW9yZGVySW5kaWNhdG9yRG93bkljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbVHJlZVRhYmxlU2VydmljZV0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi90cmVldGFibGUuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRyZWVUYWJsZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uSW5pdCwgT25EZXN0cm95LCBCbG9ja2FibGVVSSwgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKSBjb2x1bW5zOiBhbnlbXTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0YWJsZVN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSB0YWJsZVN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGF1dG9MYXlvdXQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBsYXp5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBsYXp5TG9hZE9uSW5pdDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBwYWdpbmF0b3I6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSByb3dzOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBmaXJzdDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIHBhZ2VMaW5rczogbnVtYmVyID0gNTtcblxuICAgIEBJbnB1dCgpIHJvd3NQZXJQYWdlT3B0aW9uczogYW55W107XG5cbiAgICBASW5wdXQoKSBhbHdheXNTaG93UGFnaW5hdG9yOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHBhZ2luYXRvclBvc2l0aW9uOiBzdHJpbmcgPSAnYm90dG9tJztcblxuICAgIEBJbnB1dCgpIHBhZ2luYXRvckRyb3Bkb3duQXBwZW5kVG86IGFueTtcblxuICAgIEBJbnB1dCgpIGN1cnJlbnRQYWdlUmVwb3J0VGVtcGxhdGU6IHN0cmluZyA9ICd7Y3VycmVudFBhZ2V9IG9mIHt0b3RhbFBhZ2VzfSc7XG5cbiAgICBASW5wdXQoKSBzaG93Q3VycmVudFBhZ2VSZXBvcnQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzaG93SnVtcFRvUGFnZURyb3Bkb3duOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2hvd0ZpcnN0TGFzdEljb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2hvd1BhZ2VMaW5rczogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBkZWZhdWx0U29ydE9yZGVyOiBudW1iZXIgPSAxO1xuXG4gICAgQElucHV0KCkgc29ydE1vZGU6IHN0cmluZyA9ICdzaW5nbGUnO1xuXG4gICAgQElucHV0KCkgcmVzZXRQYWdlT25Tb3J0OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGN1c3RvbVNvcnQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzZWxlY3Rpb25Nb2RlOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBJbnB1dCgpIGNvbnRleHRNZW51U2VsZWN0aW9uOiBhbnk7XG5cbiAgICBAT3V0cHV0KCkgY29udGV4dE1lbnVTZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgY29udGV4dE1lbnVTZWxlY3Rpb25Nb2RlOiBzdHJpbmcgPSAnc2VwYXJhdGUnO1xuXG4gICAgQElucHV0KCkgZGF0YUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbWV0YUtleVNlbGVjdGlvbjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGNvbXBhcmVTZWxlY3Rpb25CeTogc3RyaW5nID0gJ2RlZXBFcXVhbHMnO1xuXG4gICAgQElucHV0KCkgcm93SG92ZXI6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBsb2FkaW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbG9hZGluZ0ljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNob3dMb2FkZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHNjcm9sbEhlaWdodDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdmlydHVhbFNjcm9sbDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGxJdGVtU2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgdmlydHVhbFNjcm9sbE9wdGlvbnM6IFNjcm9sbGVyT3B0aW9ucztcblxuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGxEZWxheTogbnVtYmVyID0gMTUwO1xuXG4gICAgQElucHV0KCkgZnJvemVuV2lkdGg6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGZyb3plbkNvbHVtbnM6IGFueVtdO1xuXG4gICAgQElucHV0KCkgcmVzaXphYmxlQ29sdW1uczogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGNvbHVtblJlc2l6ZU1vZGU6IHN0cmluZyA9ICdmaXQnO1xuXG4gICAgQElucHV0KCkgcmVvcmRlcmFibGVDb2x1bW5zOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgY29udGV4dE1lbnU6IGFueTtcblxuICAgIEBJbnB1dCgpIHJvd1RyYWNrQnk6IEZ1bmN0aW9uID0gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gaXRlbTtcblxuICAgIEBJbnB1dCgpIGZpbHRlcnM6IHsgW3M6IHN0cmluZ106IEZpbHRlck1ldGFkYXRhIHwgdW5kZWZpbmVkIH0gPSB7fTtcblxuICAgIEBJbnB1dCgpIGdsb2JhbEZpbHRlckZpZWxkczogc3RyaW5nW107XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJEZWxheTogbnVtYmVyID0gMzAwO1xuXG4gICAgQElucHV0KCkgZmlsdGVyTW9kZTogc3RyaW5nID0gJ2xlbmllbnQnO1xuXG4gICAgQElucHV0KCkgZmlsdGVyTG9jYWxlOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25GaWx0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uTm9kZUV4cGFuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ob2RlQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uUGFnZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Tb3J0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkxhenlMb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBzb3J0RnVuY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ29sUmVzaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkNvbFJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uTm9kZVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ob2RlVW5zZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ29udGV4dE1lbnVTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uSGVhZGVyQ2hlY2tib3hUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRWRpdEluaXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRWRpdENvbXBsZXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkVkaXRDYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY29udGFpbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncmVzaXplSGVscGVyJykgcmVzaXplSGVscGVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncmVvcmRlckluZGljYXRvclVwJykgcmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncmVvcmRlckluZGljYXRvckRvd24nKSByZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RhYmxlJykgdGFibGVWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlVmlldycpIHNjcm9sbGFibGVWaWV3Q2hpbGQ7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlRnJvemVuVmlldycpIHNjcm9sbGFibGVGcm96ZW5WaWV3Q2hpbGQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+O1xuXG4gICAgLyogQGRlcHJlY2F0ZWQgKi9cbiAgICBfdmlydHVhbFJvd0hlaWdodDogbnVtYmVyID0gMjg7XG4gICAgQElucHV0KCkgZ2V0IHZpcnR1YWxSb3dIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpcnR1YWxSb3dIZWlnaHQ7XG4gICAgfVxuICAgIHNldCB2aXJ0dWFsUm93SGVpZ2h0KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3ZpcnR1YWxSb3dIZWlnaHQgPSB2YWw7XG4gICAgICAgIGNvbnNvbGUud2FybignVGhlIHZpcnR1YWxSb3dIZWlnaHQgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCwgdXNlIHZpcnR1YWxTY3JvbGxJdGVtU2l6ZSBwcm9wZXJ0eSBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIF92YWx1ZTogVHJlZU5vZGVbXSA9IFtdO1xuXG4gICAgc2VyaWFsaXplZFZhbHVlOiBhbnlbXTtcblxuICAgIF90b3RhbFJlY29yZHM6IG51bWJlciA9IDA7XG5cbiAgICBfbXVsdGlTb3J0TWV0YTogU29ydE1ldGFbXTtcblxuICAgIF9zb3J0RmllbGQ6IHN0cmluZztcblxuICAgIF9zb3J0T3JkZXI6IG51bWJlciA9IDE7XG5cbiAgICBmaWx0ZXJlZE5vZGVzOiBhbnlbXTtcblxuICAgIGZpbHRlclRpbWVvdXQ6IGFueTtcblxuICAgIGNvbEdyb3VwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjYXB0aW9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGJvZHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGxvYWRpbmdCb2R5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHN1bW1hcnlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGVtcHR5TWVzc2FnZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yTGVmdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yUmlnaHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHBhZ2luYXRvckRyb3Bkb3duSXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZnJvemVuSGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmcm96ZW5Cb2R5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmcm96ZW5Gb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZyb3plbkNvbEdyb3VwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBsb2FkaW5nSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcmVvcmRlckluZGljYXRvclVwSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcmVvcmRlckluZGljYXRvckRvd25JY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBzb3J0SWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY2hlY2tib3hJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJDaGVja2JveEljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHRvZ2dsZXJJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwYWdpbmF0b3JGaXJzdFBhZ2VMaW5rSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yTGFzdFBhZ2VMaW5rSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcGFnaW5hdG9yUHJldmlvdXNQYWdlTGlua0ljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHBhZ2luYXRvck5leHRQYWdlTGlua0ljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGxhc3RSZXNpemVySGVscGVyWDogbnVtYmVyO1xuXG4gICAgcmVvcmRlckljb25XaWR0aDogbnVtYmVyO1xuXG4gICAgcmVvcmRlckljb25IZWlnaHQ6IG51bWJlcjtcblxuICAgIGRyYWdnZWRDb2x1bW46IGFueTtcblxuICAgIGRyb3BQb3NpdGlvbjogbnVtYmVyO1xuXG4gICAgcHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uOiBib29sZWFuO1xuXG4gICAgX3NlbGVjdGlvbjogYW55O1xuXG4gICAgc2VsZWN0aW9uS2V5czogYW55ID0ge307XG5cbiAgICByb3dUb3VjaGVkOiBib29sZWFuO1xuXG4gICAgZWRpdGluZ0NlbGw6IEVsZW1lbnQ7XG5cbiAgICBlZGl0aW5nQ2VsbERhdGE6IGFueTtcblxuICAgIGVkaXRpbmdDZWxsRmllbGQ6IGFueTtcblxuICAgIGVkaXRpbmdDZWxsQ2xpY2s6IGJvb2xlYW47XG5cbiAgICBkb2N1bWVudEVkaXRMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gICAgdG9nZ2xlUm93SW5kZXg6IG51bWJlcjtcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHRoaXMubGF6eUxvYWRPbkluaXQgJiYgIXRoaXMudmlydHVhbFNjcm9sbCkge1xuICAgICAgICAgICAgdGhpcy5vbkxhenlMb2FkLmVtaXQodGhpcy5jcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NhcHRpb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhcHRpb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnYm9keSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsb2FkaW5nYm9keSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0JvZHlUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc3VtbWFyeSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb2xncm91cCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sR3JvdXBUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHltZXNzYWdlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eU1lc3NhZ2VUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncGFnaW5hdG9ybGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yTGVmdFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwYWdpbmF0b3JyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yUmlnaHRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncGFnaW5hdG9yZHJvcGRvd25pdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3JEcm9wZG93bkl0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZnJvemVuaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm96ZW5IZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZnJvemVuYm9keSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJvemVuQm9keVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5mb290ZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZyb3plbkZvb3RlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmcm96ZW5jb2xncm91cCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZnJvemVuQ29sR3JvdXBUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbG9hZGluZ2ljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3Jlb3JkZXJpbmRpY2F0b3J1cGljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcEljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncmVvcmRlcmluZGljYXRvcmRvd25pY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93bkljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc29ydGljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NoZWNrYm94aWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tib3hJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2hlYWRlcmNoZWNrYm94aWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyQ2hlY2tib3hJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZXJpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGVySWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwYWdpbmF0b3JmaXJzdHBhZ2VsaW5raWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yRmlyc3RQYWdlTGlua0ljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncGFnaW5hdG9ybGFzdHBhZ2VsaW5raWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yTGFzdFBhZ2VMaW5rSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwYWdpbmF0b3JwcmV2aW91c3BhZ2VsaW5raWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yUHJldmlvdXNQYWdlTGlua0ljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncGFnaW5hdG9ybmV4dHBhZ2VsaW5raWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yTmV4dFBhZ2VMaW5rSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHVibGljIHRhYmxlU2VydmljZTogVHJlZVRhYmxlU2VydmljZSwgcHVibGljIGZpbHRlclNlcnZpY2U6IEZpbHRlclNlcnZpY2UpIHt9XG5cbiAgICBuZ09uQ2hhbmdlcyhzaW1wbGVDaGFuZ2U6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSBzaW1wbGVDaGFuZ2UudmFsdWUuY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMubGF6eSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxSZWNvcmRzID0gdGhpcy5fdmFsdWUgPyB0aGlzLl92YWx1ZS5sZW5ndGggOiAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc29ydE1vZGUgPT0gJ3NpbmdsZScgJiYgdGhpcy5zb3J0RmllbGQpIHRoaXMuc29ydFNpbmdsZSgpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc29ydE1vZGUgPT0gJ211bHRpcGxlJyAmJiB0aGlzLm11bHRpU29ydE1ldGEpIHRoaXMuc29ydE11bHRpcGxlKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5oYXNGaWx0ZXIoKSlcbiAgICAgICAgICAgICAgICAgICAgLy9zb3J0IGFscmVhZHkgZmlsdGVyc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWx0ZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZXJpYWxpemVkVmFsdWUoKTtcbiAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uVUlVcGRhdGUodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnNvcnRGaWVsZCkge1xuICAgICAgICAgICAgdGhpcy5fc29ydEZpZWxkID0gc2ltcGxlQ2hhbmdlLnNvcnRGaWVsZC5jdXJyZW50VmFsdWU7XG5cbiAgICAgICAgICAgIC8vYXZvaWQgdHJpZ2dlcmluZyBsYXp5IGxvYWQgcHJpb3IgdG8gbGF6eSBpbml0aWFsaXphdGlvbiBhdCBvbkluaXRcbiAgICAgICAgICAgIGlmICghdGhpcy5sYXp5IHx8IHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3J0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0U2luZ2xlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5zb3J0T3JkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRPcmRlciA9IHNpbXBsZUNoYW5nZS5zb3J0T3JkZXIuY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICAvL2F2b2lkIHRyaWdnZXJpbmcgbGF6eSBsb2FkIHByaW9yIHRvIGxhenkgaW5pdGlhbGl6YXRpb24gYXQgb25Jbml0XG4gICAgICAgICAgICBpZiAoIXRoaXMubGF6eSB8fCB0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc29ydE1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydFNpbmdsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UubXVsdGlTb3J0TWV0YSkge1xuICAgICAgICAgICAgdGhpcy5fbXVsdGlTb3J0TWV0YSA9IHNpbXBsZUNoYW5nZS5tdWx0aVNvcnRNZXRhLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0TXVsdGlwbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2Uuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBzaW1wbGVDaGFuZ2Uuc2VsZWN0aW9uLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnByZXZlbnRTZWxlY3Rpb25TZXR0ZXJQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uS2V5cygpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByZXZlbnRTZWxlY3Rpb25TZXR0ZXJQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHZhbHVlKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgICBzZXQgdmFsdWUodmFsOiBhbnlbXSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcbiAgICB9XG5cbiAgICB1cGRhdGVTZXJpYWxpemVkVmFsdWUoKSB7XG4gICAgICAgIHRoaXMuc2VyaWFsaXplZFZhbHVlID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB0aGlzLnNlcmlhbGl6ZVBhZ2VOb2RlcygpO1xuICAgICAgICBlbHNlIHRoaXMuc2VyaWFsaXplTm9kZXMobnVsbCwgdGhpcy5maWx0ZXJlZE5vZGVzIHx8IHRoaXMudmFsdWUsIDAsIHRydWUpO1xuICAgIH1cblxuICAgIHNlcmlhbGl6ZU5vZGVzKHBhcmVudCwgbm9kZXMsIGxldmVsLCB2aXNpYmxlKSB7XG4gICAgICAgIGlmIChub2RlcyAmJiBub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dOb2RlID0ge1xuICAgICAgICAgICAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWw6IGxldmVsLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB2aXNpYmxlICYmIChwYXJlbnQgPyBwYXJlbnQuZXhwYW5kZWQgOiB0cnVlKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJpYWxpemVkVmFsdWUucHVzaChyb3dOb2RlKTtcblxuICAgICAgICAgICAgICAgIGlmIChyb3dOb2RlLnZpc2libGUgJiYgbm9kZS5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vZGVzKG5vZGUsIG5vZGUuY2hpbGRyZW4sIGxldmVsICsgMSwgcm93Tm9kZS52aXNpYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXJpYWxpemVQYWdlTm9kZXMoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5maWx0ZXJlZE5vZGVzIHx8IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMuc2VyaWFsaXplZFZhbHVlID0gW107XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMubGF6eSA/IDAgOiB0aGlzLmZpcnN0O1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZmlyc3Q7IGkgPCBmaXJzdCArIHRoaXMucm93czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VyaWFsaXplZFZhbHVlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldmVsOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcmlhbGl6ZU5vZGVzKG5vZGUsIG5vZGUuY2hpbGRyZW4sIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB0b3RhbFJlY29yZHMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvdGFsUmVjb3JkcztcbiAgICB9XG4gICAgc2V0IHRvdGFsUmVjb3Jkcyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90b3RhbFJlY29yZHMgPSB2YWw7XG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uVG90YWxSZWNvcmRzQ2hhbmdlKHRoaXMuX3RvdGFsUmVjb3Jkcyk7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNvcnRGaWVsZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ydEZpZWxkO1xuICAgIH1cblxuICAgIHNldCBzb3J0RmllbGQodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc29ydEZpZWxkID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzb3J0T3JkZXIoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvcnRPcmRlcjtcbiAgICB9XG4gICAgc2V0IHNvcnRPcmRlcih2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG11bHRpU29ydE1ldGEoKTogU29ydE1ldGFbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aVNvcnRNZXRhO1xuICAgIH1cblxuICAgIHNldCBtdWx0aVNvcnRNZXRhKHZhbDogU29ydE1ldGFbXSkge1xuICAgICAgICB0aGlzLl9tdWx0aVNvcnRNZXRhID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzZWxlY3Rpb24oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0aW9uKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHZhbDtcbiAgICB9XG5cbiAgICB1cGRhdGVTZWxlY3Rpb25LZXlzKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhS2V5ICYmIHRoaXMuX3NlbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl9zZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiB0aGlzLl9zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW1N0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKG5vZGUuZGF0YSwgdGhpcy5kYXRhS2V5KSldID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YSh0aGlzLl9zZWxlY3Rpb24uZGF0YSwgdGhpcy5kYXRhS2V5KSldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUGFnZUNoYW5nZShldmVudCkge1xuICAgICAgICB0aGlzLmZpcnN0ID0gZXZlbnQuZmlyc3Q7XG4gICAgICAgIHRoaXMucm93cyA9IGV2ZW50LnJvd3M7XG5cbiAgICAgICAgaWYgKHRoaXMubGF6eSkgdGhpcy5vbkxhenlMb2FkLmVtaXQodGhpcy5jcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCkpO1xuICAgICAgICBlbHNlIHRoaXMuc2VyaWFsaXplUGFnZU5vZGVzKCk7XG5cbiAgICAgICAgdGhpcy5vblBhZ2UuZW1pdCh7XG4gICAgICAgICAgICBmaXJzdDogdGhpcy5maXJzdCxcbiAgICAgICAgICAgIHJvd3M6IHRoaXMucm93c1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblVJVXBkYXRlKHRoaXMudmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsRXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50O1xuXG4gICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgdGhpcy5fc29ydE9yZGVyID0gdGhpcy5zb3J0RmllbGQgPT09IGV2ZW50LmZpZWxkID8gdGhpcy5zb3J0T3JkZXIgKiAtMSA6IHRoaXMuZGVmYXVsdFNvcnRPcmRlcjtcbiAgICAgICAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IGV2ZW50LmZpZWxkO1xuICAgICAgICAgICAgdGhpcy5zb3J0U2luZ2xlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0UGFnZU9uU29ydCAmJiB0aGlzLnNjcm9sbGFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc29ydE1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICAgIGxldCBtZXRhS2V5ID0gb3JpZ2luYWxFdmVudC5tZXRhS2V5IHx8IG9yaWdpbmFsRXZlbnQuY3RybEtleTtcbiAgICAgICAgICAgIGxldCBzb3J0TWV0YSA9IHRoaXMuZ2V0U29ydE1ldGEoZXZlbnQuZmllbGQpO1xuXG4gICAgICAgICAgICBpZiAoc29ydE1ldGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1ldGFLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlTb3J0TWV0YSA9IFt7IGZpZWxkOiBldmVudC5maWVsZCwgb3JkZXI6IHNvcnRNZXRhLm9yZGVyICogLTEgfV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVzZXRQYWdlT25Tb3J0ICYmIHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydE1ldGEub3JkZXIgPSBzb3J0TWV0YS5vcmRlciAqIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtZXRhS2V5IHx8ICF0aGlzLm11bHRpU29ydE1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlTb3J0TWV0YSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0UGFnZU9uU29ydCAmJiB0aGlzLnNjcm9sbGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm11bHRpU29ydE1ldGEucHVzaCh7IGZpZWxkOiBldmVudC5maWVsZCwgb3JkZXI6IHRoaXMuZGVmYXVsdFNvcnRPcmRlciB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zb3J0TXVsdGlwbGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRTaW5nbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnNvcnRGaWVsZCAmJiB0aGlzLnNvcnRPcmRlcikge1xuICAgICAgICAgICAgaWYgKHRoaXMubGF6eSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydE5vZGVzKHRoaXMudmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzRmlsdGVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc29ydE1ldGE6IFNvcnRNZXRhID0ge1xuICAgICAgICAgICAgICAgIGZpZWxkOiB0aGlzLnNvcnRGaWVsZCxcbiAgICAgICAgICAgICAgICBvcmRlcjogdGhpcy5zb3J0T3JkZXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMub25Tb3J0LmVtaXQoc29ydE1ldGEpO1xuICAgICAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25Tb3J0KHNvcnRNZXRhKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VyaWFsaXplZFZhbHVlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0Tm9kZXMobm9kZXMpIHtcbiAgICAgICAgaWYgKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1c3RvbVNvcnQpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydEZ1bmN0aW9uLmVtaXQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IG5vZGVzLFxuICAgICAgICAgICAgICAgIG1vZGU6IHRoaXMuc29ydE1vZGUsXG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuc29ydEZpZWxkLFxuICAgICAgICAgICAgICAgIG9yZGVyOiB0aGlzLnNvcnRPcmRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2Rlcy5zb3J0KChub2RlMSwgbm9kZTIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUxID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShub2RlMS5kYXRhLCB0aGlzLnNvcnRGaWVsZCk7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlMiA9IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEobm9kZTIuZGF0YSwgdGhpcy5zb3J0RmllbGQpO1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiAhPSBudWxsKSByZXN1bHQgPSAtMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgIT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUxID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdmFsdWUyID09PSAnc3RyaW5nJykgcmVzdWx0ID0gdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyLCB1bmRlZmluZWQsIHsgbnVtZXJpYzogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdCA9IHZhbHVlMSA8IHZhbHVlMiA/IC0xIDogdmFsdWUxID4gdmFsdWUyID8gMSA6IDA7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zb3J0T3JkZXIgKiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydE5vZGVzKG5vZGUuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ydE11bHRpcGxlKCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aVNvcnRNZXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sYXp5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkxhenlMb2FkLmVtaXQodGhpcy5jcmVhdGVMYXp5TG9hZE1ldGFkYXRhKCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0TXVsdGlwbGVOb2Rlcyh0aGlzLnZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc0ZpbHRlcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbHRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5vblNvcnQuZW1pdCh7XG4gICAgICAgICAgICAgICAgbXVsdGlzb3J0bWV0YTogdGhpcy5tdWx0aVNvcnRNZXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VyaWFsaXplZFZhbHVlKCk7XG4gICAgICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblNvcnQodGhpcy5tdWx0aVNvcnRNZXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRNdWx0aXBsZU5vZGVzKG5vZGVzKSB7XG4gICAgICAgIGlmICghbm9kZXMgfHwgbm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXN0b21Tb3J0KSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRGdW5jdGlvbi5lbWl0KHtcbiAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgICAgIG1vZGU6IHRoaXMuc29ydE1vZGUsXG4gICAgICAgICAgICAgICAgbXVsdGlTb3J0TWV0YTogdGhpcy5tdWx0aVNvcnRNZXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVzLnNvcnQoKG5vZGUxLCBub2RlMikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRpc29ydEZpZWxkKG5vZGUxLCBub2RlMiwgdGhpcy5tdWx0aVNvcnRNZXRhLCAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgdGhpcy5zb3J0TXVsdGlwbGVOb2Rlcyhub2RlLmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG11bHRpc29ydEZpZWxkKG5vZGUxLCBub2RlMiwgbXVsdGlTb3J0TWV0YSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKE9iamVjdFV0aWxzLmlzRW1wdHkodGhpcy5tdWx0aVNvcnRNZXRhKSB8fCBPYmplY3RVdGlscy5pc0VtcHR5KG11bHRpU29ydE1ldGFbaW5kZXhdKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUxID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShub2RlMS5kYXRhLCBtdWx0aVNvcnRNZXRhW2luZGV4XS5maWVsZCk7XG4gICAgICAgIGxldCB2YWx1ZTIgPSBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKG5vZGUyLmRhdGEsIG11bHRpU29ydE1ldGFbaW5kZXhdLmZpZWxkKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiAhPSBudWxsKSByZXN1bHQgPSAtMTtcbiAgICAgICAgZWxzZSBpZiAodmFsdWUxICE9IG51bGwgJiYgdmFsdWUyID09IG51bGwpIHJlc3VsdCA9IDE7XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiA9PSBudWxsKSByZXN1bHQgPSAwO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlMSA9PSAnc3RyaW5nJyB8fCB2YWx1ZTEgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZTEubG9jYWxlQ29tcGFyZSAmJiB2YWx1ZTEgIT0gdmFsdWUyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG11bHRpU29ydE1ldGFbaW5kZXhdLm9yZGVyICogdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyLCB1bmRlZmluZWQsIHsgbnVtZXJpYzogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlMSA8IHZhbHVlMiA/IC0xIDogMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZTEgPT0gdmFsdWUyKSB7XG4gICAgICAgICAgICByZXR1cm4gbXVsdGlTb3J0TWV0YS5sZW5ndGggLSAxID4gaW5kZXggPyB0aGlzLm11bHRpc29ydEZpZWxkKG5vZGUxLCBub2RlMiwgbXVsdGlTb3J0TWV0YSwgaW5kZXggKyAxKSA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbXVsdGlTb3J0TWV0YVtpbmRleF0ub3JkZXIgKiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZ2V0U29ydE1ldGEoZmllbGQ6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5tdWx0aVNvcnRNZXRhICYmIHRoaXMubXVsdGlTb3J0TWV0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tdWx0aVNvcnRNZXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YVtpXS5maWVsZCA9PT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlTb3J0TWV0YVtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpc1NvcnRlZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc29ydEZpZWxkICYmIHRoaXMuc29ydEZpZWxkID09PSBmaWVsZDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNvcnRNb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICBsZXQgc29ydGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5tdWx0aVNvcnRNZXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm11bHRpU29ydE1ldGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlTb3J0TWV0YVtpXS5maWVsZCA9PSBmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNvcnRlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgcm93czogdGhpcy5yb3dzLFxuICAgICAgICAgICAgc29ydEZpZWxkOiB0aGlzLnNvcnRGaWVsZCxcbiAgICAgICAgICAgIHNvcnRPcmRlcjogdGhpcy5zb3J0T3JkZXIsXG4gICAgICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgICBnbG9iYWxGaWx0ZXI6IHRoaXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnNbJ2dsb2JhbCddID8gdGhpcy5maWx0ZXJzWydnbG9iYWwnXS52YWx1ZSA6IG51bGwsXG4gICAgICAgICAgICBtdWx0aVNvcnRNZXRhOiB0aGlzLm11bHRpU29ydE1ldGEsXG4gICAgICAgICAgICBmb3JjZVVwZGF0ZTogKCkgPT4gdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvbkxhenlJdGVtTG9hZChldmVudCkge1xuICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh7XG4gICAgICAgICAgICAuLi50aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSxcbiAgICAgICAgICAgIC4uLmV2ZW50LFxuICAgICAgICAgICAgcm93czogZXZlbnQubGFzdCAtIGV2ZW50LmZpcnN0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldFNjcm9sbFRvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCkgdGhpcy5zY3JvbGxUb1ZpcnR1YWxJbmRleCgwKTtcbiAgICAgICAgZWxzZSB0aGlzLnNjcm9sbFRvKHsgdG9wOiAwIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzY3JvbGxUb1ZpcnR1YWxJbmRleChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGVWaWV3Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZVZpZXdDaGlsZC5zY3JvbGxUb1ZpcnR1YWxJbmRleChpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlRnJvemVuVmlld0NoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGFibGVGcm96ZW5WaWV3Q2hpbGQuc2Nyb2xsVG9WaXJ0dWFsSW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNjcm9sbFRvKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZVZpZXdDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxhYmxlVmlld0NoaWxkLnNjcm9sbFRvKG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZUZyb3plblZpZXdDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxhYmxlRnJvemVuVmlld0NoaWxkLnNjcm9sbFRvKG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmZpbHRlcmVkTm9kZXMgfHwgdGhpcy52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGRhdGEgPT0gbnVsbCB8fCBkYXRhLmxlbmd0aCA9PSAwO1xuICAgIH1cblxuICAgIGdldEJsb2NrYWJsZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdO1xuICAgIH1cblxuICAgIG9uQ29sdW1uUmVzaXplQmVnaW4oZXZlbnQpIHtcbiAgICAgICAgbGV0IGNvbnRhaW5lckxlZnQgPSBEb21IYW5kbGVyLmdldE9mZnNldCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KS5sZWZ0O1xuICAgICAgICB0aGlzLmxhc3RSZXNpemVySGVscGVyWCA9IGV2ZW50LnBhZ2VYIC0gY29udGFpbmVyTGVmdCArIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkNvbHVtblJlc2l6ZShldmVudCkge1xuICAgICAgICBsZXQgY29udGFpbmVyTGVmdCA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLmxlZnQ7XG4gICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJ3AtdW5zZWxlY3RhYmxlLXRleHQnKTtcbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICAgIHRoaXMucmVzaXplSGVscGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gMCArICdweCc7XG4gICAgICAgIHRoaXMucmVzaXplSGVscGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnBhZ2VYIC0gY29udGFpbmVyTGVmdCArIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCArICdweCc7XG5cbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBvbkNvbHVtblJlc2l6ZUVuZChldmVudCwgY29sdW1uKSB7XG4gICAgICAgIGxldCBkZWx0YSA9IHRoaXMucmVzaXplSGVscGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtIHRoaXMubGFzdFJlc2l6ZXJIZWxwZXJYO1xuICAgICAgICBsZXQgY29sdW1uV2lkdGggPSBjb2x1bW4ub2Zmc2V0V2lkdGg7XG4gICAgICAgIGxldCBuZXdDb2x1bW5XaWR0aCA9IGNvbHVtbldpZHRoICsgZGVsdGE7XG4gICAgICAgIGxldCBtaW5XaWR0aCA9IGNvbHVtbi5zdHlsZS5taW5XaWR0aCB8fCAxNTtcblxuICAgICAgICBpZiAoY29sdW1uV2lkdGggKyBkZWx0YSA+IHBhcnNlSW50KG1pbldpZHRoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29sdW1uUmVzaXplTW9kZSA9PT0gJ2ZpdCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dENvbHVtbiA9IGNvbHVtbi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCFuZXh0Q29sdW1uLm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0Q29sdW1uID0gbmV4dENvbHVtbi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRDb2x1bW5XaWR0aCA9IG5leHRDb2x1bW4ub2Zmc2V0V2lkdGggLSBkZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRDb2x1bW5NaW5XaWR0aCA9IG5leHRDb2x1bW4uc3R5bGUubWluV2lkdGggfHwgMTU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NvbHVtbldpZHRoID4gMTUgJiYgbmV4dENvbHVtbldpZHRoID4gcGFyc2VJbnQobmV4dENvbHVtbk1pbldpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY3JvbGxhYmxlVmlldyA9IHRoaXMuZmluZFBhcmVudFNjcm9sbGFibGVWaWV3KGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbGFibGVCb2R5VGFibGUgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZVZpZXcsICcucC10cmVldGFibGUtc2Nyb2xsYWJsZS1ib2R5IHRhYmxlJykgfHwgRG9tSGFuZGxlci5maW5kU2luZ2xlKHNjcm9sbGFibGVWaWV3LCAnLnAtc2Nyb2xsZXItdmlld3BvcnQgdGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsYWJsZUhlYWRlclRhYmxlID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHNjcm9sbGFibGVWaWV3LCAndGFibGUucC10cmVldGFibGUtc2Nyb2xsYWJsZS1oZWFkZXItdGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsYWJsZUZvb3RlclRhYmxlID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHNjcm9sbGFibGVWaWV3LCAndGFibGUucC10cmVldGFibGUtc2Nyb2xsYWJsZS1mb290ZXItdGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzaXplQ29sdW1uSW5kZXggPSBEb21IYW5kbGVyLmluZGV4KGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUNvbEdyb3VwKHNjcm9sbGFibGVIZWFkZXJUYWJsZSwgcmVzaXplQ29sdW1uSW5kZXgsIG5ld0NvbHVtbldpZHRoLCBuZXh0Q29sdW1uV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplQ29sR3JvdXAoc2Nyb2xsYWJsZUJvZHlUYWJsZSwgcmVzaXplQ29sdW1uSW5kZXgsIG5ld0NvbHVtbldpZHRoLCBuZXh0Q29sdW1uV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplQ29sR3JvdXAoc2Nyb2xsYWJsZUZvb3RlclRhYmxlLCByZXNpemVDb2x1bW5JbmRleCwgbmV3Q29sdW1uV2lkdGgsIG5leHRDb2x1bW5XaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbi5zdHlsZS53aWR0aCA9IG5ld0NvbHVtbldpZHRoICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dENvbHVtbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0Q29sdW1uLnN0eWxlLndpZHRoID0gbmV4dENvbHVtbldpZHRoICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29sdW1uUmVzaXplTW9kZSA9PT0gJ2V4cGFuZCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzY3JvbGxhYmxlVmlldyA9IHRoaXMuZmluZFBhcmVudFNjcm9sbGFibGVWaWV3KGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzY3JvbGxhYmxlQm9keSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJy5wLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWJvZHknKSB8fCBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZVZpZXcsICcucC1zY3JvbGxlci12aWV3cG9ydCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsYWJsZUhlYWRlciA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJy5wLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWhlYWRlcicpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsYWJsZUZvb3RlciA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJy5wLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWZvb3RlcicpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsYWJsZUJvZHlUYWJsZSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJy5wLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWJvZHkgdGFibGUnKSB8fCBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc2Nyb2xsYWJsZVZpZXcsICcucC1zY3JvbGxlci12aWV3cG9ydCB0YWJsZScpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsYWJsZUhlYWRlclRhYmxlID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHNjcm9sbGFibGVWaWV3LCAndGFibGUucC10cmVldGFibGUtc2Nyb2xsYWJsZS1oZWFkZXItdGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbGFibGVGb290ZXJUYWJsZSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzY3JvbGxhYmxlVmlldywgJ3RhYmxlLnAtdHJlZXRhYmxlLXNjcm9sbGFibGUtZm9vdGVyLXRhYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVCb2R5VGFibGUuc3R5bGUud2lkdGggPSBzY3JvbGxhYmxlQm9keVRhYmxlLm9mZnNldFdpZHRoICsgZGVsdGEgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxhYmxlSGVhZGVyVGFibGUuc3R5bGUud2lkdGggPSBzY3JvbGxhYmxlSGVhZGVyVGFibGUub2Zmc2V0V2lkdGggKyBkZWx0YSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxhYmxlRm9vdGVyVGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVGb290ZXJUYWJsZS5zdHlsZS53aWR0aCA9IHNjcm9sbGFibGVGb290ZXJUYWJsZS5vZmZzZXRXaWR0aCArIGRlbHRhICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzaXplQ29sdW1uSW5kZXggPSBEb21IYW5kbGVyLmluZGV4KGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Nyb2xsYWJsZUJvZHlUYWJsZVdpZHRoID0gY29sdW1uID8gc2Nyb2xsYWJsZUJvZHlUYWJsZS5vZmZzZXRXaWR0aCArIGRlbHRhIDogbmV3Q29sdW1uV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbGFibGVIZWFkZXJUYWJsZVdpZHRoID0gY29sdW1uID8gc2Nyb2xsYWJsZUhlYWRlclRhYmxlLm9mZnNldFdpZHRoICsgZGVsdGEgOiBuZXdDb2x1bW5XaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNDb250YWluZXJJblZpZXdwb3J0ID0gdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCA+PSBzY3JvbGxhYmxlQm9keVRhYmxlV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNldFdpZHRoID0gKGNvbnRhaW5lciwgdGFibGUsIHdpZHRoLCBpc0NvbnRhaW5lckluVmlld3BvcnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250YWluZXIgJiYgdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBpc0NvbnRhaW5lckluVmlld3BvcnQgPyB3aWR0aCArIERvbUhhbmRsZXIuY2FsY3VsYXRlU2Nyb2xsYmFyV2lkdGgoc2Nyb2xsYWJsZUJvZHkpICsgJ3B4JyA6ICdhdXRvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRXaWR0aChzY3JvbGxhYmxlQm9keSwgc2Nyb2xsYWJsZUJvZHlUYWJsZSwgc2Nyb2xsYWJsZUJvZHlUYWJsZVdpZHRoLCBpc0NvbnRhaW5lckluVmlld3BvcnQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRXaWR0aChzY3JvbGxhYmxlSGVhZGVyLCBzY3JvbGxhYmxlSGVhZGVyVGFibGUsIHNjcm9sbGFibGVIZWFkZXJUYWJsZVdpZHRoLCBpc0NvbnRhaW5lckluVmlld3BvcnQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRXaWR0aChzY3JvbGxhYmxlRm9vdGVyLCBzY3JvbGxhYmxlRm9vdGVyVGFibGUsIHNjcm9sbGFibGVIZWFkZXJUYWJsZVdpZHRoLCBpc0NvbnRhaW5lckluVmlld3BvcnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplQ29sR3JvdXAoc2Nyb2xsYWJsZUhlYWRlclRhYmxlLCByZXNpemVDb2x1bW5JbmRleCwgbmV3Q29sdW1uV2lkdGgsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUNvbEdyb3VwKHNjcm9sbGFibGVCb2R5VGFibGUsIHJlc2l6ZUNvbHVtbkluZGV4LCBuZXdDb2x1bW5XaWR0aCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplQ29sR3JvdXAoc2Nyb2xsYWJsZUZvb3RlclRhYmxlLCByZXNpemVDb2x1bW5JbmRleCwgbmV3Q29sdW1uV2lkdGgsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFibGVWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMudGFibGVWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCArIGRlbHRhICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLnN0eWxlLndpZHRoID0gbmV3Q29sdW1uV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyV2lkdGggPSB0aGlzLnRhYmxlVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSBjb250YWluZXJXaWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9uQ29sUmVzaXplLmVtaXQoe1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGNvbHVtbixcbiAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNpemVIZWxwZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLXVuc2VsZWN0YWJsZS10ZXh0Jyk7XG4gICAgfVxuXG4gICAgZmluZFBhcmVudFNjcm9sbGFibGVWaWV3KGNvbHVtbikge1xuICAgICAgICBpZiAoY29sdW1uKSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gY29sdW1uLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmICFEb21IYW5kbGVyLmhhc0NsYXNzKHBhcmVudCwgJ3AtdHJlZXRhYmxlLXNjcm9sbGFibGUtdmlldycpKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2l6ZUNvbEdyb3VwKHRhYmxlLCByZXNpemVDb2x1bW5JbmRleCwgbmV3Q29sdW1uV2lkdGgsIG5leHRDb2x1bW5XaWR0aCkge1xuICAgICAgICBpZiAodGFibGUpIHtcbiAgICAgICAgICAgIGxldCBjb2xHcm91cCA9IHRhYmxlLmNoaWxkcmVuWzBdLm5vZGVOYW1lID09PSAnQ09MR1JPVVAnID8gdGFibGUuY2hpbGRyZW5bMF0gOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoY29sR3JvdXApIHtcbiAgICAgICAgICAgICAgICBsZXQgY29sID0gY29sR3JvdXAuY2hpbGRyZW5bcmVzaXplQ29sdW1uSW5kZXhdO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0Q29sID0gY29sLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBjb2wuc3R5bGUud2lkdGggPSBuZXdDb2x1bW5XaWR0aCArICdweCc7XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dENvbCAmJiBuZXh0Q29sdW1uV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dENvbC5zdHlsZS53aWR0aCA9IG5leHRDb2x1bW5XaWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnU2Nyb2xsYWJsZSB0YWJsZXMgcmVxdWlyZSBhIGNvbGdyb3VwIHRvIHN1cHBvcnQgcmVzaXphYmxlIGNvbHVtbnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db2x1bW5EcmFnU3RhcnQoZXZlbnQsIGNvbHVtbkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5yZW9yZGVySWNvbldpZHRoID0gRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJXaWR0aCh0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdGhpcy5yZW9yZGVySWNvbkhlaWdodCA9IERvbUhhbmRsZXIuZ2V0SGlkZGVuRWxlbWVudE91dGVySGVpZ2h0KHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuZHJhZ2dlZENvbHVtbiA9IGNvbHVtbkVsZW1lbnQ7XG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCd0ZXh0JywgJ2InKTsgLy8gRm9yIGZpcmVmb3hcbiAgICB9XG5cbiAgICBvbkNvbHVtbkRyYWdFbnRlcihldmVudCwgZHJvcEhlYWRlcikge1xuICAgICAgICBpZiAodGhpcy5yZW9yZGVyYWJsZUNvbHVtbnMgJiYgdGhpcy5kcmFnZ2VkQ29sdW1uICYmIGRyb3BIZWFkZXIpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyT2Zmc2V0ID0gRG9tSGFuZGxlci5nZXRPZmZzZXQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgZHJvcEhlYWRlck9mZnNldCA9IERvbUhhbmRsZXIuZ2V0T2Zmc2V0KGRyb3BIZWFkZXIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2VkQ29sdW1uICE9IGRyb3BIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0TGVmdCA9IGRyb3BIZWFkZXJPZmZzZXQubGVmdCAtIGNvbnRhaW5lck9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRUb3AgPSBjb250YWluZXJPZmZzZXQudG9wIC0gZHJvcEhlYWRlck9mZnNldC50b3A7XG4gICAgICAgICAgICAgICAgbGV0IGNvbHVtbkNlbnRlciA9IGRyb3BIZWFkZXJPZmZzZXQubGVmdCArIGRyb3BIZWFkZXIub2Zmc2V0V2lkdGggLyAyO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yVXBWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBkcm9wSGVhZGVyT2Zmc2V0LnRvcCAtIGNvbnRhaW5lck9mZnNldC50b3AgLSAodGhpcy5yZW9yZGVySWNvbkhlaWdodCAtIDEpICsgJ3B4JztcbiAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JEb3duVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gZHJvcEhlYWRlck9mZnNldC50b3AgLSBjb250YWluZXJPZmZzZXQudG9wICsgZHJvcEhlYWRlci5vZmZzZXRIZWlnaHQgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnBhZ2VYID4gY29sdW1uQ2VudGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvclVwVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IHRhcmdldExlZnQgKyBkcm9wSGVhZGVyLm9mZnNldFdpZHRoIC0gTWF0aC5jZWlsKHRoaXMucmVvcmRlckljb25XaWR0aCAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSB0YXJnZXRMZWZ0ICsgZHJvcEhlYWRlci5vZmZzZXRXaWR0aCAtIE1hdGguY2VpbCh0aGlzLnJlb3JkZXJJY29uV2lkdGggLyAyKSArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcFBvc2l0aW9uID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSB0YXJnZXRMZWZ0IC0gTWF0aC5jZWlsKHRoaXMucmVvcmRlckljb25XaWR0aCAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSB0YXJnZXRMZWZ0IC0gTWF0aC5jZWlsKHRoaXMucmVvcmRlckljb25XaWR0aCAvIDIpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wUG9zaXRpb24gPSAtMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIHRoaXMucmVvcmRlckluZGljYXRvckRvd25WaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNvbHVtbkRyYWdMZWF2ZShldmVudCkge1xuICAgICAgICBpZiAodGhpcy5yZW9yZGVyYWJsZUNvbHVtbnMgJiYgdGhpcy5kcmFnZ2VkQ29sdW1uKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yVXBWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdGhpcy5yZW9yZGVySW5kaWNhdG9yRG93blZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNvbHVtbkRyb3AoZXZlbnQsIGRyb3BDb2x1bW4pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dlZENvbHVtbikge1xuICAgICAgICAgICAgbGV0IGRyYWdJbmRleCA9IERvbUhhbmRsZXIuaW5kZXhXaXRoaW5Hcm91cCh0aGlzLmRyYWdnZWRDb2x1bW4sICd0dHJlb3JkZXJhYmxlY29sdW1uJyk7XG4gICAgICAgICAgICBsZXQgZHJvcEluZGV4ID0gRG9tSGFuZGxlci5pbmRleFdpdGhpbkdyb3VwKGRyb3BDb2x1bW4sICd0dHJlb3JkZXJhYmxlY29sdW1uJyk7XG4gICAgICAgICAgICBsZXQgYWxsb3dEcm9wID0gZHJhZ0luZGV4ICE9IGRyb3BJbmRleDtcbiAgICAgICAgICAgIGlmIChhbGxvd0Ryb3AgJiYgKChkcm9wSW5kZXggLSBkcmFnSW5kZXggPT0gMSAmJiB0aGlzLmRyb3BQb3NpdGlvbiA9PT0gLTEpIHx8IChkcmFnSW5kZXggLSBkcm9wSW5kZXggPT0gMSAmJiB0aGlzLmRyb3BQb3NpdGlvbiA9PT0gMSkpKSB7XG4gICAgICAgICAgICAgICAgYWxsb3dEcm9wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbGxvd0Ryb3AgJiYgZHJvcEluZGV4IDwgZHJhZ0luZGV4ICYmIHRoaXMuZHJvcFBvc2l0aW9uID09PSAxKSB7XG4gICAgICAgICAgICAgICAgZHJvcEluZGV4ID0gZHJvcEluZGV4ICsgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbG93RHJvcCAmJiBkcm9wSW5kZXggPiBkcmFnSW5kZXggJiYgdGhpcy5kcm9wUG9zaXRpb24gPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZHJvcEluZGV4ID0gZHJvcEluZGV4IC0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFsbG93RHJvcCkge1xuICAgICAgICAgICAgICAgIE9iamVjdFV0aWxzLnJlb3JkZXJBcnJheSh0aGlzLmNvbHVtbnMsIGRyYWdJbmRleCwgZHJvcEluZGV4KTtcblxuICAgICAgICAgICAgICAgIHRoaXMub25Db2xSZW9yZGVyLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBkcmFnSW5kZXg6IGRyYWdJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgZHJvcEluZGV4OiBkcm9wSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1uc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JVcFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB0aGlzLnJlb3JkZXJJbmRpY2F0b3JEb3duVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZENvbHVtbi5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZENvbHVtbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRyb3BQb3NpdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVSb3dDbGljayhldmVudCkge1xuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9ICg8SFRNTEVsZW1lbnQ+ZXZlbnQub3JpZ2luYWxFdmVudC50YXJnZXQpLm5vZGVOYW1lO1xuICAgICAgICBpZiAodGFyZ2V0Tm9kZSA9PSAnSU5QVVQnIHx8IHRhcmdldE5vZGUgPT0gJ0JVVFRPTicgfHwgdGFyZ2V0Tm9kZSA9PSAnQScgfHwgRG9tSGFuZGxlci5oYXNDbGFzcyhldmVudC5vcmlnaW5hbEV2ZW50LnRhcmdldCwgJ3AtY2xpY2thYmxlJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMucHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCByb3dOb2RlID0gZXZlbnQucm93Tm9kZTtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuaXNTZWxlY3RlZChyb3dOb2RlLm5vZGUpO1xuICAgICAgICAgICAgbGV0IG1ldGFTZWxlY3Rpb24gPSB0aGlzLnJvd1RvdWNoZWQgPyBmYWxzZSA6IHRoaXMubWV0YUtleVNlbGVjdGlvbjtcbiAgICAgICAgICAgIGxldCBkYXRhS2V5VmFsdWUgPSB0aGlzLmRhdGFLZXkgPyBTdHJpbmcoT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShyb3dOb2RlLm5vZGUuZGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAobWV0YVNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhS2V5ID0gZXZlbnQub3JpZ2luYWxFdmVudC5tZXRhS2V5IHx8IGV2ZW50Lm9yaWdpbmFsRXZlbnQuY3RybEtleTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCAmJiBtZXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihyb3dOb2RlLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKCh2YWwsIGkpID0+IGkgIT0gc2VsZWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5vZGVVbnNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgbm9kZTogcm93Tm9kZS5ub2RlLCB0eXBlOiAncm93JyB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NpbmdsZVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gcm93Tm9kZS5ub2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChyb3dOb2RlLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGVTZWxlY3Rpb25Nb2RlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBbLi4udGhpcy5zZWxlY3Rpb24sIHJvd05vZGUubm9kZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTm9kZVNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQub3JpZ2luYWxFdmVudCwgbm9kZTogcm93Tm9kZS5ub2RlLCB0eXBlOiAncm93JywgaW5kZXg6IGV2ZW50LnJvd0luZGV4IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Ob2RlVW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIG5vZGU6IHJvd05vZGUubm9kZSwgdHlwZTogJ3JvdycgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSByb3dOb2RlLm5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Ob2RlU2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudC5vcmlnaW5hbEV2ZW50LCBub2RlOiByb3dOb2RlLm5vZGUsIHR5cGU6ICdyb3cnLCBpbmRleDogZXZlbnQucm93SW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0aW9uSW5kZXggPSB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKHJvd05vZGUubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5maWx0ZXIoKHZhbCwgaSkgPT4gaSAhPSBzZWxlY3Rpb25JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Ob2RlVW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIG5vZGU6IHJvd05vZGUubm9kZSwgdHlwZTogJ3JvdycgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YUtleVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gPyBbLi4udGhpcy5zZWxlY3Rpb24sIHJvd05vZGUubm9kZV0gOiBbcm93Tm9kZS5ub2RlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5vZGVTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIG5vZGU6IHJvd05vZGUubm9kZSwgdHlwZTogJ3JvdycsIGluZGV4OiBldmVudC5yb3dJbmRleCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvd1RvdWNoZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoYW5kbGVSb3dUb3VjaEVuZChldmVudCkge1xuICAgICAgICB0aGlzLnJvd1RvdWNoZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGhhbmRsZVJvd1JpZ2h0Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnUpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBldmVudC5yb3dOb2RlLm5vZGU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51U2VsZWN0aW9uTW9kZSA9PT0gJ3NlcGFyYXRlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb24gPSBub2RlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb25DaGFuZ2UuZW1pdChub2RlKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29udGV4dE1lbnVTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIG5vZGU6IG5vZGUgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5zaG93KGV2ZW50Lm9yaWdpbmFsRXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uQ29udGV4dE1lbnUobm9kZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGV4dE1lbnVTZWxlY3Rpb25Nb2RlID09PSAnam9pbnQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2ZW50U2VsZWN0aW9uU2V0dGVyUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuaXNTZWxlY3RlZChub2RlKTtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEobm9kZS5kYXRhLCB0aGlzLmRhdGFLZXkpKSA6IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0aW9uTW9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IG5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNdWx0aXBsZVNlbGVjdGlvbk1vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSBbbm9kZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuc2hvdyhldmVudC5vcmlnaW5hbEV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29udGV4dE1lbnVTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50Lm9yaWdpbmFsRXZlbnQsIG5vZGU6IG5vZGUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVOb2RlV2l0aENoZWNrYm94KGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24gfHwgW107XG4gICAgICAgIHRoaXMucHJldmVudFNlbGVjdGlvblNldHRlclByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgbGV0IG5vZGUgPSBldmVudC5yb3dOb2RlLm5vZGU7XG4gICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuaXNTZWxlY3RlZChub2RlKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGFnYXRlU2VsZWN0aW9uRG93bihub2RlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZXZlbnQucm93Tm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZVNlbGVjdGlvblVwKG5vZGUucGFyZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMub25Ob2RlVW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBub2RlOiBub2RlIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVTZWxlY3Rpb25Eb3duKG5vZGUsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGV2ZW50LnJvd05vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVTZWxlY3Rpb25VcChub2RlLnBhcmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMub25Ob2RlU2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgbm9kZTogbm9kZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVTZXJ2aWNlLm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlTm9kZXNXaXRoQ2hlY2tib3goZXZlbnQ6IEV2ZW50LCBjaGVjazogYm9vbGVhbikge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZmlsdGVyZWROb2RlcyB8fCB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSBjaGVjayAmJiBkYXRhID8gZGF0YS5zbGljZSgpIDogW107XG4gICAgICAgIGlmIChjaGVjaykge1xuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBub2RlIG9mIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVTZWxlY3Rpb25Eb3duKG5vZGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZXZlbnRTZWxlY3Rpb25TZXR0ZXJQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5fc2VsZWN0aW9uKTtcbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25TZWxlY3Rpb25DaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5vbkhlYWRlckNoZWNrYm94VG9nZ2xlLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgY2hlY2tlZDogY2hlY2sgfSk7XG4gICAgfVxuXG4gICAgcHJvcGFnYXRlU2VsZWN0aW9uVXAobm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikge1xuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ2hpbGRDb3VudDogbnVtYmVyID0gMDtcbiAgICAgICAgICAgIGxldCBjaGlsZFBhcnRpYWxTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGRhdGFLZXlWYWx1ZSA9IHRoaXMuZGF0YUtleSA/IFN0cmluZyhPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKG5vZGUuZGF0YSwgdGhpcy5kYXRhS2V5KSkgOiBudWxsO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChjaGlsZCkpIHNlbGVjdGVkQ2hpbGRDb3VudCsrO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoaWxkLnBhcnRpYWxTZWxlY3RlZCkgY2hpbGRQYXJ0aWFsU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ICYmIHNlbGVjdGVkQ2hpbGRDb3VudCA9PSBub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IFsuLi4odGhpcy5zZWxlY3Rpb24gfHwgW10pLCBub2RlXTtcbiAgICAgICAgICAgICAgICBub2RlLnBhcnRpYWxTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmZpbHRlcigodmFsLCBpKSA9PiBpICE9IGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNlbGVjdGlvbktleXNbZGF0YUtleVZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjaGlsZFBhcnRpYWxTZWxlY3RlZCB8fCAoc2VsZWN0ZWRDaGlsZENvdW50ID4gMCAmJiBzZWxlY3RlZENoaWxkQ291bnQgIT0gbm9kZS5jaGlsZHJlbi5sZW5ndGgpKSBub2RlLnBhcnRpYWxTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZWxzZSBub2RlLnBhcnRpYWxTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZVNlbGVjdGlvblVwKHBhcmVudCwgc2VsZWN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3BhZ2F0ZVNlbGVjdGlvbkRvd24obm9kZTogVHJlZU5vZGUsIHNlbGVjdDogYm9vbGVhbikge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKG5vZGUpO1xuICAgICAgICBsZXQgZGF0YUtleVZhbHVlID0gdGhpcy5kYXRhS2V5ID8gU3RyaW5nKE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEobm9kZS5kYXRhLCB0aGlzLmRhdGFLZXkpKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHNlbGVjdCAmJiBpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gWy4uLih0aGlzLnNlbGVjdGlvbiB8fCBbXSksIG5vZGVdO1xuICAgICAgICAgICAgaWYgKGRhdGFLZXlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uS2V5c1tkYXRhS2V5VmFsdWVdID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghc2VsZWN0ICYmIGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmZpbHRlcigodmFsLCBpKSA9PiBpICE9IGluZGV4KTtcbiAgICAgICAgICAgIGlmIChkYXRhS2V5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zZWxlY3Rpb25LZXlzW2RhdGFLZXlWYWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLnBhcnRpYWxTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVTZWxlY3Rpb25Eb3duKGNoaWxkLCBzZWxlY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTZWxlY3RlZChub2RlKSB7XG4gICAgICAgIGlmIChub2RlICYmIHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uS2V5c1tPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKG5vZGUuZGF0YSwgdGhpcy5kYXRhS2V5KV0gIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zZWxlY3Rpb24pKSByZXR1cm4gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihub2RlKSA+IC0xO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZXF1YWxzKG5vZGUsIHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmaW5kSW5kZXhJblNlbGVjdGlvbihub2RlOiBhbnkpIHtcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uICYmIHRoaXMuc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVxdWFscyhub2RlLCB0aGlzLnNlbGVjdGlvbltpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgaXNTaW5nbGVTZWxlY3Rpb25Nb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSAnc2luZ2xlJztcbiAgICB9XG5cbiAgICBpc011bHRpcGxlU2VsZWN0aW9uTW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ211bHRpcGxlJztcbiAgICB9XG5cbiAgICBlcXVhbHMobm9kZTEsIG5vZGUyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmVTZWxlY3Rpb25CeSA9PT0gJ2VxdWFscycgPyBub2RlMSA9PT0gbm9kZTIgOiBPYmplY3RVdGlscy5lcXVhbHMobm9kZTEuZGF0YSwgbm9kZTIuZGF0YSwgdGhpcy5kYXRhS2V5KTtcbiAgICB9XG5cbiAgICBmaWx0ZXIodmFsdWUsIGZpZWxkLCBtYXRjaE1vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZmlsdGVyVGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNGaWx0ZXJCbGFuayh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyc1tmaWVsZF0gPSB7IHZhbHVlOiB2YWx1ZSwgbWF0Y2hNb2RlOiBtYXRjaE1vZGUgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5maWx0ZXJzW2ZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9LCB0aGlzLmZpbHRlckRlbGF5KTtcbiAgICB9XG5cbiAgICBmaWx0ZXJHbG9iYWwodmFsdWUsIG1hdGNoTW9kZSkge1xuICAgICAgICB0aGlzLmZpbHRlcih2YWx1ZSwgJ2dsb2JhbCcsIG1hdGNoTW9kZSk7XG4gICAgfVxuXG4gICAgaXNGaWx0ZXJCbGFuayhmaWx0ZXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoZmlsdGVyICE9PSBudWxsICYmIGZpbHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnICYmIGZpbHRlci50cmltKCkubGVuZ3RoID09IDApIHx8IChBcnJheS5pc0FycmF5KGZpbHRlcikgJiYgZmlsdGVyLmxlbmd0aCA9PSAwKSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZmlsdGVyKCkge1xuICAgICAgICBpZiAodGhpcy5sYXp5KSB7XG4gICAgICAgICAgICB0aGlzLm9uTGF6eUxvYWQuZW1pdCh0aGlzLmNyZWF0ZUxhenlMb2FkTWV0YWRhdGEoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNGaWx0ZXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWROb2RlcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxSZWNvcmRzID0gdGhpcy52YWx1ZSA/IHRoaXMudmFsdWUubGVuZ3RoIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBnbG9iYWxGaWx0ZXJGaWVsZHNBcnJheTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzWydnbG9iYWwnXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29sdW1ucyAmJiAhdGhpcy5nbG9iYWxGaWx0ZXJGaWVsZHMpIHRocm93IG5ldyBFcnJvcignR2xvYmFsIGZpbHRlcmluZyByZXF1aXJlcyBkeW5hbWljIGNvbHVtbnMgb3IgZ2xvYmFsRmlsdGVyRmllbGRzIHRvIGJlIGRlZmluZWQuJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgZ2xvYmFsRmlsdGVyRmllbGRzQXJyYXkgPSB0aGlzLmdsb2JhbEZpbHRlckZpZWxkcyB8fCB0aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZE5vZGVzID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgaXNTdHJpY3RNb2RlID0gdGhpcy5maWx0ZXJNb2RlID09PSAnc3RyaWN0JztcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWx1ZUNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29weU5vZGUgPSB7IC4uLm5vZGUgfTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZ2xvYmFsTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc1dpdGhvdXROb2RlO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzLmhhc093blByb3BlcnR5KHByb3ApICYmIHByb3AgIT09ICdnbG9iYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlck1ldGEgPSB0aGlzLmZpbHRlcnNbcHJvcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlckZpZWxkID0gcHJvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyVmFsdWUgPSBmaWx0ZXJNZXRhLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJNYXRjaE1vZGUgPSBmaWx0ZXJNZXRhLm1hdGNoTW9kZSB8fCAnc3RhcnRzV2l0aCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlckNvbnN0cmFpbnQgPSB0aGlzLmZpbHRlclNlcnZpY2UuZmlsdGVyc1tmaWx0ZXJNYXRjaE1vZGVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1dpdGhvdXROb2RlID0geyBmaWx0ZXJGaWVsZCwgZmlsdGVyVmFsdWUsIGZpbHRlckNvbnN0cmFpbnQsIGlzU3RyaWN0TW9kZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlzU3RyaWN0TW9kZSAmJiAhKHRoaXMuZmluZEZpbHRlcmVkTm9kZXMoY29weU5vZGUsIHBhcmFtc1dpdGhvdXROb2RlKSB8fCB0aGlzLmlzRmlsdGVyTWF0Y2hlZChjb3B5Tm9kZSwgcGFyYW1zV2l0aG91dE5vZGUpKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFpc1N0cmljdE1vZGUgJiYgISh0aGlzLmlzRmlsdGVyTWF0Y2hlZChjb3B5Tm9kZSwgcGFyYW1zV2l0aG91dE5vZGUpIHx8IHRoaXMuZmluZEZpbHRlcmVkTm9kZXMoY29weU5vZGUsIHBhcmFtc1dpdGhvdXROb2RlKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWxvY2FsTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyc1snZ2xvYmFsJ10gJiYgIWdsb2JhbE1hdGNoICYmIGdsb2JhbEZpbHRlckZpZWxkc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvcHlOb2RlRm9yR2xvYmFsID0geyAuLi5jb3B5Tm9kZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJGaWVsZCA9IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5W2pdLmZpZWxkIHx8IGdsb2JhbEZpbHRlckZpZWxkc0FycmF5W2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJWYWx1ZSA9IHRoaXMuZmlsdGVyc1snZ2xvYmFsJ10udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlckNvbnN0cmFpbnQgPSB0aGlzLmZpbHRlclNlcnZpY2UuZmlsdGVyc1t0aGlzLmZpbHRlcnNbJ2dsb2JhbCddLm1hdGNoTW9kZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zV2l0aG91dE5vZGUgPSB7IGZpbHRlckZpZWxkLCBmaWx0ZXJWYWx1ZSwgZmlsdGVyQ29uc3RyYWludCwgaXNTdHJpY3RNb2RlIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpc1N0cmljdE1vZGUgJiYgKHRoaXMuZmluZEZpbHRlcmVkTm9kZXMoY29weU5vZGVGb3JHbG9iYWwsIHBhcmFtc1dpdGhvdXROb2RlKSB8fCB0aGlzLmlzRmlsdGVyTWF0Y2hlZChjb3B5Tm9kZUZvckdsb2JhbCwgcGFyYW1zV2l0aG91dE5vZGUpKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFpc1N0cmljdE1vZGUgJiYgKHRoaXMuaXNGaWx0ZXJNYXRjaGVkKGNvcHlOb2RlRm9yR2xvYmFsLCBwYXJhbXNXaXRob3V0Tm9kZSkgfHwgdGhpcy5maW5kRmlsdGVyZWROb2Rlcyhjb3B5Tm9kZUZvckdsb2JhbCwgcGFyYW1zV2l0aG91dE5vZGUpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3B5Tm9kZSA9IGNvcHlOb2RlRm9yR2xvYmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGVzID0gbG9jYWxNYXRjaDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyc1snZ2xvYmFsJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBsb2NhbE1hdGNoICYmIGdsb2JhbE1hdGNoO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWROb2Rlcy5wdXNoKGNvcHlOb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsdWVDaGFuZ2VkID0gaXNWYWx1ZUNoYW5nZWQgfHwgIWxvY2FsTWF0Y2ggfHwgZ2xvYmFsTWF0Y2ggfHwgKGxvY2FsTWF0Y2ggJiYgdGhpcy5maWx0ZXJlZE5vZGVzLmxlbmd0aCA+IDApIHx8ICghZ2xvYmFsTWF0Y2ggJiYgdGhpcy5maWx0ZXJlZE5vZGVzLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbHVlQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkTm9kZXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2luYXRvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsUmVjb3JkcyA9IHRoaXMuZmlsdGVyZWROb2RlcyA/IHRoaXMuZmlsdGVyZWROb2Rlcy5sZW5ndGggOiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlyc3QgPSAwO1xuXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkVmFsdWUgPSB0aGlzLmZpbHRlcmVkTm9kZXMgfHwgdGhpcy52YWx1ZTtcblxuICAgICAgICB0aGlzLm9uRmlsdGVyLmVtaXQoe1xuICAgICAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICAgICAgZmlsdGVyZWRWYWx1ZTogZmlsdGVyZWRWYWx1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRhYmxlU2VydmljZS5vblVJVXBkYXRlKGZpbHRlcmVkVmFsdWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNlcmlhbGl6ZWRWYWx1ZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTY3JvbGxUb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRGaWx0ZXJlZE5vZGVzKG5vZGUsIHBhcmFtc1dpdGhvdXROb2RlKSB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGROb2RlcyA9IFsuLi5ub2RlLmNoaWxkcmVuXTtcbiAgICAgICAgICAgICAgICBub2RlLmNoaWxkcmVuID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGROb2RlIG9mIGNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvcHlDaGlsZE5vZGUgPSB7IC4uLmNoaWxkTm9kZSB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ZpbHRlck1hdGNoZWQoY29weUNoaWxkTm9kZSwgcGFyYW1zV2l0aG91dE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4ucHVzaChjb3B5Q2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRmlsdGVyTWF0Y2hlZChub2RlLCB7IGZpbHRlckZpZWxkLCBmaWx0ZXJWYWx1ZSwgZmlsdGVyQ29uc3RyYWludCwgaXNTdHJpY3RNb2RlIH0pIHtcbiAgICAgICAgbGV0IG1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGRhdGFGaWVsZFZhbHVlID0gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShub2RlLmRhdGEsIGZpbHRlckZpZWxkKTtcbiAgICAgICAgaWYgKGZpbHRlckNvbnN0cmFpbnQoZGF0YUZpZWxkVmFsdWUsIGZpbHRlclZhbHVlLCB0aGlzLmZpbHRlckxvY2FsZSkpIHtcbiAgICAgICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXRjaGVkIHx8IChpc1N0cmljdE1vZGUgJiYgIXRoaXMuaXNOb2RlTGVhZihub2RlKSkpIHtcbiAgICAgICAgICAgIG1hdGNoZWQgPSB0aGlzLmZpbmRGaWx0ZXJlZE5vZGVzKG5vZGUsIHsgZmlsdGVyRmllbGQsIGZpbHRlclZhbHVlLCBmaWx0ZXJDb25zdHJhaW50LCBpc1N0cmljdE1vZGUgfSkgfHwgbWF0Y2hlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXRjaGVkO1xuICAgIH1cblxuICAgIGlzTm9kZUxlYWYobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5sZWFmID09PSBmYWxzZSA/IGZhbHNlIDogIShub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBoYXNGaWx0ZXIoKSB7XG4gICAgICAgIGxldCBlbXB0eSA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhZW1wdHk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9zb3J0RmllbGQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSAxO1xuICAgICAgICB0aGlzLl9tdWx0aVNvcnRNZXRhID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWJsZVNlcnZpY2Uub25Tb3J0KG51bGwpO1xuXG4gICAgICAgIHRoaXMuZmlsdGVyZWROb2RlcyA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IHt9O1xuXG4gICAgICAgIHRoaXMuZmlyc3QgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmxhenkpIHtcbiAgICAgICAgICAgIHRoaXMub25MYXp5TG9hZC5lbWl0KHRoaXMuY3JlYXRlTGF6eUxvYWRNZXRhZGF0YSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG90YWxSZWNvcmRzID0gdGhpcy5fdmFsdWUgPyB0aGlzLl92YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlRWRpdGluZ0NlbGwoY2VsbCwgZGF0YSwgZmllbGQpIHtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbCA9IGNlbGw7XG4gICAgICAgIHRoaXMuZWRpdGluZ0NlbGxEYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbEZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgaXNFZGl0aW5nQ2VsbFZhbGlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lZGl0aW5nQ2VsbCAmJiBEb21IYW5kbGVyLmZpbmQodGhpcy5lZGl0aW5nQ2VsbCwgJy5uZy1pbnZhbGlkLm5nLWRpcnR5JykubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEVkaXRMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50RWRpdExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RWRpdExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWRpdGluZ0NlbGwgJiYgIXRoaXMuZWRpdGluZ0NlbGxDbGljayAmJiB0aGlzLmlzRWRpdGluZ0NlbGxWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5lZGl0aW5nQ2VsbCwgJ3AtY2VsbC1lZGl0aW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWRpdGluZ0NlbGwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRWRpdENvbXBsZXRlLmVtaXQoeyBmaWVsZDogdGhpcy5lZGl0aW5nQ2VsbEZpZWxkLCBkYXRhOiB0aGlzLmVkaXRpbmdDZWxsRGF0YSB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbEZpZWxkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbERhdGEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50RWRpdExpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudEVkaXRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVkaXRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVkaXRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudEVkaXRMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLmVkaXRpbmdDZWxsID0gbnVsbDtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbEZpZWxkID0gbnVsbDtcbiAgICAgICAgdGhpcy5lZGl0aW5nQ2VsbERhdGEgPSBudWxsO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gbnVsbDtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnW3BUcmVlVGFibGVCb2R5XScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1zZXJpYWxpemVkTm9kZSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtuZ0Zvck9mXT1cInNlcmlhbGl6ZWROb2RlcyB8fCB0dC5zZXJpYWxpemVkVmFsdWVcIiBbbmdGb3JUcmFja0J5XT1cInR0LnJvd1RyYWNrQnlcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJzZXJpYWxpemVkTm9kZS52aXNpYmxlXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogc2VyaWFsaXplZE5vZGUsIG5vZGU6IHNlcmlhbGl6ZWROb2RlLm5vZGUsIHJvd0RhdGE6IHNlcmlhbGl6ZWROb2RlLm5vZGUuZGF0YSwgY29sdW1uczogY29sdW1ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInR0LmlzRW1wdHkoKVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInR0LmVtcHR5TWVzc2FnZVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1ucywgZnJvemVuOiBmcm96ZW4gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICBgLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRUQm9keSB7XG4gICAgQElucHV0KCdwVHJlZVRhYmxlQm9keScpIGNvbHVtbnM6IGFueVtdO1xuXG4gICAgQElucHV0KCdwVHJlZVRhYmxlQm9keVRlbXBsYXRlJykgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBASW5wdXQoKSBmcm96ZW46IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzZXJpYWxpemVkTm9kZXM6IGFueTtcblxuICAgIEBJbnB1dCgpIHNjcm9sbGVyT3B0aW9uczogYW55O1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHQ6IFRyZWVUYWJsZSwgcHVibGljIHRyZWVUYWJsZVNlcnZpY2U6IFRyZWVUYWJsZVNlcnZpY2UsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLnR0LnRhYmxlU2VydmljZS51aVVwZGF0ZVNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnR0LnZpcnR1YWxTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0U2Nyb2xsZXJPcHRpb24ob3B0aW9uLCBvcHRpb25zPykge1xuICAgICAgICBpZiAodGhpcy50dC52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB0aGlzLnNjcm9sbGVyT3B0aW9ucztcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zID8gb3B0aW9uc1tvcHRpb25dIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldFJvd0luZGV4KHJvd0luZGV4KSB7XG4gICAgICAgIGNvbnN0IGdldEl0ZW1PcHRpb25zID0gdGhpcy5nZXRTY3JvbGxlck9wdGlvbignZ2V0SXRlbU9wdGlvbnMnKTtcbiAgICAgICAgcmV0dXJuIGdldEl0ZW1PcHRpb25zID8gZ2V0SXRlbU9wdGlvbnMocm93SW5kZXgpLmluZGV4IDogcm93SW5kZXg7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdbdHRTY3JvbGxhYmxlVmlld10nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI3Njcm9sbEhlYWRlciBjbGFzcz1cInAtdHJlZXRhYmxlLXNjcm9sbGFibGUtaGVhZGVyXCI+XG4gICAgICAgICAgICA8ZGl2ICNzY3JvbGxIZWFkZXJCb3ggY2xhc3M9XCJwLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWhlYWRlci1ib3hcIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJwLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWhlYWRlci10YWJsZVwiIFtuZ0NsYXNzXT1cInR0LnRhYmxlU3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInR0LnRhYmxlU3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZyb3plbiA/IHR0LmZyb3plbkNvbEdyb3VwVGVtcGxhdGUgfHwgdHQuY29sR3JvdXBUZW1wbGF0ZSA6IHR0LmNvbEdyb3VwVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBjb2x1bW5zIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkIGNsYXNzPVwicC10cmVldGFibGUtdGhlYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJmcm96ZW4gPyB0dC5mcm96ZW5IZWFkZXJUZW1wbGF0ZSB8fCB0dC5oZWFkZXJUZW1wbGF0ZSA6IHR0LmhlYWRlclRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8cC1zY3JvbGxlclxuICAgICAgICAgICAgKm5nSWY9XCJ0dC52aXJ0dWFsU2Nyb2xsXCJcbiAgICAgICAgICAgICNzY3JvbGxlclxuICAgICAgICAgICAgW2l0ZW1zXT1cInR0LnNlcmlhbGl6ZWRWYWx1ZVwiXG4gICAgICAgICAgICBzdHlsZUNsYXNzPVwicC10cmVldGFibGUtc2Nyb2xsYWJsZS1ib2R5XCJcbiAgICAgICAgICAgIFtzdHlsZV09XCJ7IGhlaWdodDogdHQuc2Nyb2xsSGVpZ2h0ICE9PSAnZmxleCcgPyB0dC5zY3JvbGxIZWlnaHQgOiB1bmRlZmluZWQgfVwiXG4gICAgICAgICAgICBbc2Nyb2xsSGVpZ2h0XT1cInNjcm9sbEhlaWdodCAhPT0gJ2ZsZXgnID8gdW5kZWZpbmVkIDogJzEwMCUnXCJcbiAgICAgICAgICAgIFtpdGVtU2l6ZV09XCJ0dC52aXJ0dWFsU2Nyb2xsSXRlbVNpemUgfHwgdHQuX3ZpcnR1YWxSb3dIZWlnaHRcIlxuICAgICAgICAgICAgW2xhenldPVwidHQubGF6eVwiXG4gICAgICAgICAgICAob25MYXp5TG9hZCk9XCJ0dC5vbkxhenlJdGVtTG9hZCgkZXZlbnQpXCJcbiAgICAgICAgICAgIFtvcHRpb25zXT1cInR0LnZpcnR1YWxTY3JvbGxPcHRpb25zXCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImNvbnRlbnRcIiBsZXQtaXRlbXMgbGV0LXNjcm9sbGVyT3B0aW9ucz1cIm9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYnVpbGRJbkl0ZW1zOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbXMsIG9wdGlvbnM6IHNjcm9sbGVyT3B0aW9ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImxvYWRlclwiIGxldC1zY3JvbGxlck9wdGlvbnM9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsb2FkZXJUZW1wbGF0ZTsgY29udGV4dDogeyBvcHRpb25zOiBzY3JvbGxlck9wdGlvbnMgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9wLXNjcm9sbGVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIXR0LnZpcnR1YWxTY3JvbGxcIj5cbiAgICAgICAgICAgIDxkaXYgI3Njcm9sbEJvZHkgY2xhc3M9XCJwLXRyZWV0YWJsZS1zY3JvbGxhYmxlLWJvZHlcIiBbbmdTdHlsZV09XCJ7ICdtYXgtaGVpZ2h0JzogdHQuc2Nyb2xsSGVpZ2h0ICE9PSAnZmxleCcgPyBzY3JvbGxIZWlnaHQgOiB1bmRlZmluZWQsICdvdmVyZmxvdy15JzogIWZyb3plbiAmJiB0dC5zY3JvbGxIZWlnaHQgPyAnc2Nyb2xsJyA6IHVuZGVmaW5lZCB9XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImJ1aWxkSW5JdGVtczsgY29udGV4dDogeyAkaW1wbGljaXQ6IHNlcmlhbGl6ZWRWYWx1ZSwgb3B0aW9uczoge30gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbGRJbkl0ZW1zIGxldC1pdGVtcyBsZXQtc2Nyb2xsZXJPcHRpb25zPVwib3B0aW9uc1wiPlxuICAgICAgICAgICAgPHRhYmxlICNzY3JvbGxUYWJsZSBbY2xhc3NdPVwidHQudGFibGVTdHlsZUNsYXNzXCIgW25nQ2xhc3NdPVwic2Nyb2xsZXJPcHRpb25zLmNvbnRlbnRTdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwidHQudGFibGVTdHlsZVwiIFtzdHlsZV09XCJzY3JvbGxlck9wdGlvbnMuY29udGVudFN0eWxlXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZyb3plbiA/IHR0LmZyb3plbkNvbEdyb3VwVGVtcGxhdGUgfHwgdHQuY29sR3JvdXBUZW1wbGF0ZSA6IHR0LmNvbEdyb3VwVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBjb2x1bW5zIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3M9XCJwLXRyZWV0YWJsZS10Ym9keVwiIFtwVHJlZVRhYmxlQm9keV09XCJjb2x1bW5zXCIgW3BUcmVlVGFibGVCb2R5VGVtcGxhdGVdPVwiZnJvemVuID8gdHQuZnJvemVuQm9keVRlbXBsYXRlIHx8IHR0LmJvZHlUZW1wbGF0ZSA6IHR0LmJvZHlUZW1wbGF0ZVwiIFtzZXJpYWxpemVkTm9kZXNdPVwiaXRlbXNcIiBbZnJvemVuXT1cImZyb3plblwiPjwvdGJvZHk+XG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPGRpdiAjc2Nyb2xsYWJsZUFsaWduZXIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50XCIgKm5nSWY9XCJmcm96ZW5cIj48L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICA8ZGl2ICNzY3JvbGxGb290ZXIgKm5nSWY9XCJ0dC5mb290ZXJUZW1wbGF0ZVwiIGNsYXNzPVwicC10cmVldGFibGUtc2Nyb2xsYWJsZS1mb290ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgI3Njcm9sbEZvb3RlckJveCBjbGFzcz1cInAtdHJlZXRhYmxlLXNjcm9sbGFibGUtZm9vdGVyLWJveFwiPlxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInAtdHJlZXRhYmxlLXNjcm9sbGFibGUtZm9vdGVyLXRhYmxlXCIgW25nQ2xhc3NdPVwidHQudGFibGVTdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwidHQudGFibGVTdHlsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZnJvemVuID8gdHQuZnJvemVuQ29sR3JvdXBUZW1wbGF0ZSB8fCB0dC5jb2xHcm91cFRlbXBsYXRlIDogdHQuY29sR3JvdXBUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGNvbHVtbnMgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8dGZvb3QgY2xhc3M9XCJwLXRyZWV0YWJsZS10Zm9vdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZyb3plbiA/IHR0LmZyb3plbkZvb3RlclRlbXBsYXRlIHx8IHR0LmZvb3RlclRlbXBsYXRlIDogdHQuZm9vdGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBjb2x1bW5zIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC90Zm9vdD5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVFRTY3JvbGxhYmxlVmlldyBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCd0dFNjcm9sbGFibGVWaWV3JykgY29sdW1uczogYW55W107XG5cbiAgICBASW5wdXQoKSBmcm96ZW46IGJvb2xlYW47XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxIZWFkZXInKSBzY3JvbGxIZWFkZXJWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxIZWFkZXJCb3gnKSBzY3JvbGxIZWFkZXJCb3hWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxCb2R5Jykgc2Nyb2xsQm9keVZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Njcm9sbFRhYmxlJykgc2Nyb2xsVGFibGVWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdsb2FkaW5nVGFibGUnKSBzY3JvbGxMb2FkaW5nVGFibGVWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxGb290ZXInKSBzY3JvbGxGb290ZXJWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxGb290ZXJCb3gnKSBzY3JvbGxGb290ZXJCb3hWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlQWxpZ25lcicpIHNjcm9sbGFibGVBbGlnbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnc2Nyb2xsZXInKSBzY3JvbGxlcjogU2Nyb2xsZXI7XG5cbiAgICBoZWFkZXJTY3JvbGxMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGJvZHlTY3JvbGxMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIGZvb3RlclNjcm9sbExpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZnJvemVuU2libGluZ0JvZHk6IEVsZW1lbnQ7XG5cbiAgICB0b3RhbFJlY29yZHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIF9zY3JvbGxIZWlnaHQ6IHN0cmluZztcblxuICAgIHByZXZlbnRCb2R5U2Nyb2xsUHJvcGFnYXRpb246IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBnZXQgc2Nyb2xsSGVpZ2h0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxIZWlnaHQ7XG4gICAgfVxuICAgIHNldCBzY3JvbGxIZWlnaHQodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gdmFsO1xuICAgICAgICBpZiAodmFsICE9IG51bGwgJiYgKHZhbC5pbmNsdWRlcygnJScpIHx8IHZhbC5pbmNsdWRlcygnY2FsYycpKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BlcmNlbnRhZ2Ugc2Nyb2xsIGhlaWdodCBjYWxjdWxhdGlvbiBpcyByZW1vdmVkIGluIGZhdm9yIG9mIHRoZSBtb3JlIHBlcmZvcm1hbnQgQ1NTIGJhc2VkIGZsZXggbW9kZSwgdXNlIHNjcm9sbEhlaWdodD1cImZsZXhcIiBpbnN0ZWFkLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIHR0OiBUcmVlVGFibGUsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSkge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZyb3plbikge1xuICAgICAgICAgICAgaWYgKHRoaXMudHQuZnJvemVuQ29sdW1ucyB8fCB0aGlzLnR0LmZyb3plbkJvZHlUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncC10cmVldGFibGUtdW5mcm96ZW4tdmlldycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZnJvemVuVmlldyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGZyb3plblZpZXcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50dC52aXJ0dWFsU2Nyb2xsKSB0aGlzLmZyb3plblNpYmxpbmdCb2R5ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKGZyb3plblZpZXcsICcucC1zY3JvbGxlci12aWV3cG9ydCcpO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5mcm96ZW5TaWJsaW5nQm9keSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShmcm96ZW5WaWV3LCAnLnAtdHJlZXRhYmxlLXNjcm9sbGFibGUtYm9keScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc2Nyb2xsQmFyV2lkdGggPSBEb21IYW5kbGVyLmNhbGN1bGF0ZVNjcm9sbGJhcldpZHRoKCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhlYWRlckJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHNjcm9sbEJhcldpZHRoICsgJ3B4JztcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsRm9vdGVyQm94Vmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsRm9vdGVyQm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbEZvb3RlckJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHNjcm9sbEJhcldpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbGFibGVBbGlnbmVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsYWJsZUFsaWduZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZUFsaWduZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBEb21IYW5kbGVyLmNhbGN1bGF0ZVNjcm9sbGJhckhlaWdodCgpICsgJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIH1cblxuICAgIGJpbmRFdmVudHMoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZCAmJiB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyU2Nyb2xsTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLnNjcm9sbEhlYWRlckJveFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnc2Nyb2xsJywgdGhpcy5vbkhlYWRlclNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvb3RlclNjcm9sbExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJ3Njcm9sbCcsIHRoaXMub25Gb290ZXJTY3JvbGwuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZyb3plbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50dC52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuc2Nyb2xsZXIuZ2V0RWxlbWVudFJlZigpLm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnLCB0aGlzLm9uQm9keVNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keVNjcm9sbExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnLCB0aGlzLm9uQm9keVNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRXZlbnRzKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGVhZGVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsSGVhZGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oZWFkZXJTY3JvbGxMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyU2Nyb2xsTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb290ZXJTY3JvbGxMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvb3RlclNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyU2Nyb2xsTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsQm9keVZpZXdDaGlsZCAmJiB0aGlzLnNjcm9sbEJvZHlWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxlciAmJiB0aGlzLnNjcm9sbGVyLmdldEVsZW1lbnRSZWYoKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTY3JvbGxMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25IZWFkZXJTY3JvbGwoKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSB0aGlzLnNjcm9sbEhlYWRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQ7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZXZlbnRCb2R5U2Nyb2xsUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIG9uRm9vdGVyU2Nyb2xsKCkge1xuICAgICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gdGhpcy5zY3JvbGxGb290ZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICB0aGlzLnNjcm9sbEJvZHlWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxIZWFkZXJWaWV3Q2hpbGQgJiYgdGhpcy5zY3JvbGxIZWFkZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIZWFkZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJldmVudEJvZHlTY3JvbGxQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgb25Cb2R5U2Nyb2xsKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRCb2R5U2Nyb2xsUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMucHJldmVudEJvZHlTY3JvbGxQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGVhZGVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsSGVhZGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGVhZGVyQm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdCA9IC0xICogZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkICYmIHRoaXMuc2Nyb2xsRm9vdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRm9vdGVyQm94Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdCA9IC0xICogZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZnJvemVuU2libGluZ0JvZHkpIHtcbiAgICAgICAgICAgIHRoaXMuZnJvemVuU2libGluZ0JvZHkuc2Nyb2xsVG9wID0gZXZlbnQudGFyZ2V0LnNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNjcm9sbFRvVmlydHVhbEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZXIuc2Nyb2xsVG9JbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzY3JvbGxUbyhvcHRpb25zKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyLnNjcm9sbFRvKG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsQm9keVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG8ob3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm9keVZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSBvcHRpb25zLmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxCb2R5Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gb3B0aW9ucy50b3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmZyb3plblNpYmxpbmdCb2R5ID0gbnVsbDtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3R0U29ydGFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50JyxcbiAgICAgICAgJ1tjbGFzcy5wLXNvcnRhYmxlLWNvbHVtbl0nOiAnaXNFbmFibGVkKCknLFxuICAgICAgICAnW2NsYXNzLnAtaGlnaGxpZ2h0XSc6ICdzb3J0ZWQnLFxuICAgICAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2lzRW5hYmxlZCgpID8gXCIwXCIgOiBudWxsJyxcbiAgICAgICAgJ1thdHRyLnJvbGVdJzogJ1wiY29sdW1uaGVhZGVyXCInXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUVFNvcnRhYmxlQ29sdW1uIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgndHRTb3J0YWJsZUNvbHVtbicpIGZpZWxkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0dFNvcnRhYmxlQ29sdW1uRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBzb3J0ZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0dDogVHJlZVRhYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudHQudGFibGVTZXJ2aWNlLnNvcnRTb3VyY2UkLnN1YnNjcmliZSgoc29ydE1ldGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNvcnRTdGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU29ydFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVTb3J0U3RhdGUoKSB7XG4gICAgICAgIHRoaXMuc29ydGVkID0gdGhpcy50dC5pc1NvcnRlZCh0aGlzLmZpZWxkKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTb3J0U3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMudHQuc29ydCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmVudGVyJywgWyckZXZlbnQnXSlcbiAgICBvbkVudGVyS2V5KGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMub25DbGljayhldmVudCk7XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50dFNvcnRhYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRyZWVUYWJsZVNvcnRJY29uJyxcbiAgICB0ZW1wbGF0ZTogYCA8bmctY29udGFpbmVyICpuZ0lmPVwiIXR0LnNvcnRJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgIDxTb3J0QWx0SWNvbiBbc3R5bGVDbGFzc109XCIncC1zb3J0YWJsZS1jb2x1bW4taWNvbidcIiAqbmdJZj1cInNvcnRPcmRlciA9PT0gMFwiIC8+XG4gICAgICAgICAgICA8U29ydEFtb3VudFVwQWx0SWNvbiBbc3R5bGVDbGFzc109XCIncC1zb3J0YWJsZS1jb2x1bW4taWNvbidcIiAqbmdJZj1cInNvcnRPcmRlciA9PT0gMVwiIC8+XG4gICAgICAgICAgICA8U29ydEFtb3VudERvd25JY29uIFtzdHlsZUNsYXNzXT1cIidwLXNvcnRhYmxlLWNvbHVtbi1pY29uJ1wiICpuZ0lmPVwic29ydE9yZGVyID09PSAtMVwiIC8+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8c3BhbiAqbmdJZj1cInR0LnNvcnRJY29uVGVtcGxhdGVcIiBjbGFzcz1cInAtc29ydGFibGUtY29sdW1uLWljb25cIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cInR0LnNvcnRJY29uVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBzb3J0T3JkZXIgfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvc3Bhbj5gLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRUU29ydEljb24gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgZmllbGQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbERlc2M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbEFzYzogc3RyaW5nO1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBzb3J0T3JkZXI6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0dDogVHJlZVRhYmxlLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy50dC50YWJsZVNlcnZpY2Uuc29ydFNvdXJjZSQuc3Vic2NyaWJlKChzb3J0TWV0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTb3J0U3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNvcnRTdGF0ZSgpO1xuICAgIH1cblxuICAgIG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTb3J0U3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnR0LnNvcnRNb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgdGhpcy5zb3J0T3JkZXIgPSB0aGlzLnR0LmlzU29ydGVkKHRoaXMuZmllbGQpID8gdGhpcy50dC5zb3J0T3JkZXIgOiAwO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHQuc29ydE1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICAgIGxldCBzb3J0TWV0YSA9IHRoaXMudHQuZ2V0U29ydE1ldGEodGhpcy5maWVsZCk7XG4gICAgICAgICAgICB0aGlzLnNvcnRPcmRlciA9IHNvcnRNZXRhID8gc29ydE1ldGEub3JkZXIgOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbdHRSZXNpemFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVFRSZXNpemFibGVDb2x1bW4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIHR0UmVzaXphYmxlQ29sdW1uRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICByZXNpemVyOiBIVE1MU3BhbkVsZW1lbnQ7XG5cbiAgICByZXNpemVyTW91c2VEb3duTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBkb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCwgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIHR0OiBUcmVlVGFibGUsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSkge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLXJlc2l6YWJsZS1jb2x1bW4nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZXIgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMucmVzaXplciwgJ3AtY29sdW1uLXJlc2l6ZXInKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5yZXNpemVyKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplck1vdXNlRG93bkxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5yZXNpemVyLCAnbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZU1vdmVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLm9uRG9jdW1lbnRNb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VVcExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLm9uRG9jdW1lbnRNb3VzZVVwLmJpbmQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudEV2ZW50cygpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRNb3VzZU1vdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudE1vdXNlTW92ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZVVwTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZURvd24oZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMudHQub25Db2x1bW5SZXNpemVCZWdpbihldmVudCk7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgb25Eb2N1bWVudE1vdXNlTW92ZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgdGhpcy50dC5vbkNvbHVtblJlc2l6ZShldmVudCk7XG4gICAgfVxuXG4gICAgb25Eb2N1bWVudE1vdXNlVXAoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMudHQub25Db2x1bW5SZXNpemVFbmQoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR0UmVzaXphYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZXJNb3VzZURvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5yZXNpemVyTW91c2VEb3duTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplck1vdXNlRG93bkxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRFdmVudHMoKTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3R0UmVvcmRlcmFibGVDb2x1bW5dJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVFRSZW9yZGVyYWJsZUNvbHVtbiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgdHRSZW9yZGVyYWJsZUNvbHVtbkRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgZHJhZ1N0YXJ0TGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBkcmFnT3Zlckxpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgZHJhZ0VudGVyTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGw7XG5cbiAgICBkcmFnTGVhdmVMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIG1vdXNlRG93bkxpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyB0dDogVHJlZVRhYmxlLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRFdmVudHMoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0TGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkcmFnc3RhcnQnLCB0aGlzLm9uRHJhZ1N0YXJ0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RyYWdvdmVyJywgdGhpcy5vbkRyYWdFbnRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdFbnRlckxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ2VudGVyJywgdGhpcy5vbkRyYWdFbnRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZHJhZ2xlYXZlJywgdGhpcy5vbkRyYWdMZWF2ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRXZlbnRzKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubW91c2VEb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlRG93bkxpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZURvd25MaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdPdmVyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnRW50ZXJMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0VudGVyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdFbnRlckxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ0VudGVyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdFbnRlckxpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXJMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdMZWF2ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnTGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0xlYXZlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3VzZURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lOUFVUJyB8fCBldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdURVhUQVJFQScgfHwgRG9tSGFuZGxlci5oYXNDbGFzcyhldmVudC50YXJnZXQsICdwLWNvbHVtbi1yZXNpemVyJykpIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgZWxzZSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkRyYWdTdGFydChldmVudCkge1xuICAgICAgICB0aGlzLnR0Lm9uQ29sdW1uRHJhZ1N0YXJ0KGV2ZW50LCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIG9uRHJhZ092ZXIoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkRyYWdFbnRlcihldmVudCkge1xuICAgICAgICB0aGlzLnR0Lm9uQ29sdW1uRHJhZ0VudGVyKGV2ZW50LCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIG9uRHJhZ0xlYXZlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMudHQub25Db2x1bW5EcmFnTGVhdmUoZXZlbnQpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxuICAgIG9uRHJvcChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy50dC5vbkNvbHVtbkRyb3AoZXZlbnQsIHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR0UmVvcmRlcmFibGVDb2x1bW5EaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRFdmVudHMoKTtcbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3R0U2VsZWN0YWJsZVJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtaGlnaGxpZ2h0XSc6ICdzZWxlY3RlZCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRUU2VsZWN0YWJsZVJvdyBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoJ3R0U2VsZWN0YWJsZVJvdycpIHJvd05vZGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHR0U2VsZWN0YWJsZVJvd0Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0dDogVHJlZVRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUcmVlVGFibGVTZXJ2aWNlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudHQudGFibGVTZXJ2aWNlLnNlbGVjdGlvblNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50dC5pc1NlbGVjdGVkKHRoaXMucm93Tm9kZS5ub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50dC5pc1NlbGVjdGVkKHRoaXMucm93Tm9kZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy50dC5oYW5kbGVSb3dDbGljayh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93Tm9kZTogdGhpcy5yb3dOb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIG9uRW50ZXJLZXkoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgICAgICAgdGhpcy5vbkNsaWNrKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJywgWyckZXZlbnQnXSlcbiAgICBvblRvdWNoRW5kKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy50dC5oYW5kbGVSb3dUb3VjaEVuZChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR0U2VsZWN0YWJsZVJvd0Rpc2FibGVkICE9PSB0cnVlO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3R0U2VsZWN0YWJsZVJvd0RibENsaWNrXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCcsXG4gICAgICAgICdbY2xhc3MucC1oaWdobGlnaHRdJzogJ3NlbGVjdGVkJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVFRTZWxlY3RhYmxlUm93RGJsQ2xpY2sgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCd0dFNlbGVjdGFibGVSb3dEYmxDbGljaycpIHJvd05vZGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHR0U2VsZWN0YWJsZVJvd0Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0dDogVHJlZVRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUcmVlVGFibGVTZXJ2aWNlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudHQudGFibGVTZXJ2aWNlLnNlbGVjdGlvblNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50dC5pc1NlbGVjdGVkKHRoaXMucm93Tm9kZS5ub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50dC5pc1NlbGVjdGVkKHRoaXMucm93Tm9kZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2RibGNsaWNrJywgWyckZXZlbnQnXSlcbiAgICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgdGhpcy50dC5oYW5kbGVSb3dDbGljayh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93Tm9kZTogdGhpcy5yb3dOb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRW5hYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHRTZWxlY3RhYmxlUm93RGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbdHRDb250ZXh0TWVudVJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtaGlnaGxpZ2h0LWNvbnRleHRtZW51XSc6ICdzZWxlY3RlZCcsXG4gICAgICAgICdbYXR0ci50YWJpbmRleF0nOiAnaXNFbmFibGVkKCkgPyAwIDogdW5kZWZpbmVkJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVFRDb250ZXh0TWVudVJvdyB7XG4gICAgQElucHV0KCd0dENvbnRleHRNZW51Um93Jykgcm93Tm9kZTogYW55O1xuXG4gICAgQElucHV0KCkgdHRDb250ZXh0TWVudVJvd0Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0dDogVHJlZVRhYmxlLCBwdWJsaWMgdGFibGVTZXJ2aWNlOiBUcmVlVGFibGVTZXJ2aWNlLCBwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudHQudGFibGVTZXJ2aWNlLmNvbnRleHRNZW51U291cmNlJC5zdWJzY3JpYmUoKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy50dC5lcXVhbHModGhpcy5yb3dOb2RlLm5vZGUsIG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gICAgb25Db250ZXh0TWVudShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHQuaGFuZGxlUm93UmlnaHRDbGljayh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcm93Tm9kZTogdGhpcy5yb3dOb2RlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0VuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR0Q29udGV4dE1lbnVSb3dEaXNhYmxlZCAhPT0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdHJlZVRhYmxlQ2hlY2tib3gnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLWNoZWNrYm94IHAtY29tcG9uZW50XCIgW25nQ2xhc3NdPVwieyAncC1jaGVja2JveC1mb2N1c2VkJzogZm9jdXNlZCB9XCIgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgW2NoZWNrZWRdPVwiY2hlY2tlZFwiIChmb2N1cyk9XCJvbkZvY3VzKClcIiAoYmx1cik9XCJvbkJsdXIoKVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgI2JveCBbbmdDbGFzc109XCJ7ICdwLWNoZWNrYm94LWJveCc6IHRydWUsICdwLWhpZ2hsaWdodCc6IGNoZWNrZWQsICdwLWZvY3VzJzogZm9jdXNlZCwgJ3AtaW5kZXRlcm1pbmF0ZSc6IHJvd05vZGUubm9kZS5wYXJ0aWFsU2VsZWN0ZWQsICdwLWRpc2FibGVkJzogZGlzYWJsZWQgfVwiIHJvbGU9XCJjaGVja2JveFwiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF0dC5jaGVja2JveEljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8Q2hlY2tJY29uIFtzdHlsZUNsYXNzXT1cIidwLWNoZWNrYm94LWljb24nXCIgKm5nSWY9XCJjaGVja2VkXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPE1pbnVzSWNvbiBbc3R5bGVDbGFzc109XCIncC1jaGVja2JveC1pY29uJ1wiICpuZ0lmPVwicm93Tm9kZS5ub2RlLnBhcnRpYWxTZWxlY3RlZFwiIC8+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCJ0dC5jaGVja2JveEljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0dC5jaGVja2JveEljb25UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGNoZWNrZWQsIHBhcnRpYWxTZWxlY3RlZDogcm93Tm9kZS5ub2RlLnBhcnRpYWxTZWxlY3RlZCB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUVENoZWNrYm94IHtcbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgndmFsdWUnKSByb3dOb2RlOiBhbnk7XG5cbiAgICBjaGVja2VkOiBib29sZWFuO1xuXG4gICAgZm9jdXNlZDogYm9vbGVhbjtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHR0OiBUcmVlVGFibGUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRyZWVUYWJsZVNlcnZpY2UsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLnR0LnRhYmxlU2VydmljZS5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0aGlzLnR0LmlzU2VsZWN0ZWQodGhpcy5yb3dOb2RlLm5vZGUpO1xuICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMudHQuaXNTZWxlY3RlZCh0aGlzLnJvd05vZGUubm9kZSk7XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnR0LnRvZ2dsZU5vZGVXaXRoQ2hlY2tib3goe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHJvd05vZGU6IHRoaXMucm93Tm9kZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgRG9tSGFuZGxlci5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cblxuICAgIG9uRm9jdXMoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25CbHVyKCkge1xuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdHJlZVRhYmxlSGVhZGVyQ2hlY2tib3gnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLWNoZWNrYm94IHAtY29tcG9uZW50XCIgW25nQ2xhc3NdPVwieyAncC1jaGVja2JveC1mb2N1c2VkJzogZm9jdXNlZCB9XCIgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCBjYi5jaGVja2VkKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgI2NiIHR5cGU9XCJjaGVja2JveFwiIFtjaGVja2VkXT1cImNoZWNrZWRcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGJsdXIpPVwib25CbHVyKClcIiBbZGlzYWJsZWRdPVwiIXR0LnZhbHVlIHx8IHR0LnZhbHVlLmxlbmd0aCA9PT0gMFwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgI2JveCBbbmdDbGFzc109XCJ7ICdwLWNoZWNrYm94LWJveCc6IHRydWUsICdwLWhpZ2hsaWdodCc6IGNoZWNrZWQsICdwLWZvY3VzJzogZm9jdXNlZCwgJ3AtZGlzYWJsZWQnOiAhdHQudmFsdWUgfHwgdHQudmFsdWUubGVuZ3RoID09PSAwIH1cIiByb2xlPVwiY2hlY2tib3hcIiBbYXR0ci5hcmlhLWNoZWNrZWRdPVwiY2hlY2tlZFwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhdHQuaGVhZGVyQ2hlY2tib3hJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPENoZWNrSWNvbiAqbmdJZj1cImNoZWNrZWRcIiBbc3R5bGVDbGFzc109XCIncC1jaGVja2JveC1pY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWNoZWNrYm94LWljb25cIiAqbmdJZj1cInR0LmhlYWRlckNoZWNrYm94SWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cInR0LmhlYWRlckNoZWNrYm94SWNvblRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY2hlY2tlZCB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUVEhlYWRlckNoZWNrYm94IHtcbiAgICBAVmlld0NoaWxkKCdib3gnKSBib3hWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBjaGVja2VkOiBib29sZWFuO1xuXG4gICAgZm9jdXNlZDogYm9vbGVhbjtcblxuICAgIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICB2YWx1ZUNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHR0OiBUcmVlVGFibGUsIHB1YmxpYyB0YWJsZVNlcnZpY2U6IFRyZWVUYWJsZVNlcnZpY2UsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnR0LnRhYmxlU2VydmljZS51aVVwZGF0ZVNvdXJjZSQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMudXBkYXRlQ2hlY2tlZFN0YXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy50dC50YWJsZVNlcnZpY2Uuc2VsZWN0aW9uU291cmNlJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gdGhpcy51cGRhdGVDaGVja2VkU3RhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMudXBkYXRlQ2hlY2tlZFN0YXRlKCk7XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudDogRXZlbnQsIGNoZWNrZWQpIHtcbiAgICAgICAgaWYgKHRoaXMudHQudmFsdWUgJiYgdGhpcy50dC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnR0LnRvZ2dsZU5vZGVzV2l0aENoZWNrYm94KGV2ZW50LCAhY2hlY2tlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBEb21IYW5kbGVyLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgb25Gb2N1cygpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkJsdXIoKSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52YWx1ZUNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQ2hlY2tlZFN0YXRlKCkge1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICBsZXQgY2hlY2tlZDogYm9vbGVhbjtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMudHQuZmlsdGVyZWROb2RlcyB8fCB0aGlzLnR0LnZhbHVlO1xuXG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBub2RlIG9mIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50dC5pc1NlbGVjdGVkKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoZWNrZWQ7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1t0dEVkaXRhYmxlQ29sdW1uXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRURWRpdGFibGVDb2x1bW4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgICBASW5wdXQoJ3R0RWRpdGFibGVDb2x1bW4nKSBkYXRhOiBhbnk7XG5cbiAgICBASW5wdXQoJ3R0RWRpdGFibGVDb2x1bW5GaWVsZCcpIGZpZWxkOiBhbnk7XG5cbiAgICBASW5wdXQoKSB0dEVkaXRhYmxlQ29sdW1uRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHQ6IFRyZWVUYWJsZSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLWVkaXRhYmxlLWNvbHVtbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHQuZWRpdGluZ0NlbGxDbGljayA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnR0LmVkaXRpbmdDZWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHQuZWRpdGluZ0NlbGwgIT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50dC5lZGl0aW5nQ2VsbCwgJ3AtY2VsbC1lZGl0aW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkNlbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkNlbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5DZWxsKCkge1xuICAgICAgICB0aGlzLnR0LnVwZGF0ZUVkaXRpbmdDZWxsKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5kYXRhLCB0aGlzLmZpZWxkKTtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdwLWNlbGwtZWRpdGluZycpO1xuICAgICAgICB0aGlzLnR0Lm9uRWRpdEluaXQuZW1pdCh7IGZpZWxkOiB0aGlzLmZpZWxkLCBkYXRhOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgIHRoaXMudHQuZWRpdGluZ0NlbGxDbGljayA9IHRydWU7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZm9jdXNhYmxlID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2lucHV0LCB0ZXh0YXJlYScpO1xuICAgICAgICAgICAgICAgIGlmIChmb2N1c2FibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjbG9zZUVkaXRpbmdDZWxsKCkge1xuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudHQuZWRpdGluZ0NlbGwsICdwLWNoZWNrYm94LWljb24nKTtcbiAgICAgICAgdGhpcy50dC5lZGl0aW5nQ2VsbCA9IG51bGw7XG4gICAgICAgIHRoaXMudHQudW5iaW5kRG9jdW1lbnRFZGl0TGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIC8vZW50ZXJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHQuaXNFZGl0aW5nQ2VsbFZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLnR0LmVkaXRpbmdDZWxsLCAncC1jZWxsLWVkaXRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUVkaXRpbmdDZWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHQub25FZGl0Q29tcGxldGUuZW1pdCh7IGZpZWxkOiB0aGlzLmZpZWxkLCBkYXRhOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9lc2NhcGVcbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT0gMjcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50dC5pc0VkaXRpbmdDZWxsVmFsaWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudHQuZWRpdGluZ0NlbGwsICdwLWNlbGwtZWRpdGluZycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRWRpdGluZ0NlbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dC5vbkVkaXRDYW5jZWwuZW1pdCh7IGZpZWxkOiB0aGlzLmZpZWxkLCBkYXRhOiB0aGlzLmRhdGEgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90YWJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT0gOSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHQub25FZGl0Q29tcGxldGUuZW1pdCh7IGZpZWxkOiB0aGlzLmZpZWxkLCBkYXRhOiB0aGlzLmRhdGEgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHRoaXMubW92ZVRvUHJldmlvdXNDZWxsKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMubW92ZVRvTmV4dENlbGwoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZENlbGwoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgbGV0IGNlbGwgPSBlbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUgKGNlbGwgJiYgIURvbUhhbmRsZXIuaGFzQ2xhc3MoY2VsbCwgJ3AtY2VsbC1lZGl0aW5nJykpIHtcbiAgICAgICAgICAgICAgICBjZWxsID0gY2VsbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVRvUHJldmlvdXNDZWxsKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IHRoaXMuZmluZENlbGwoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgbGV0IHJvdyA9IGN1cnJlbnRDZWxsLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGxldCB0YXJnZXRDZWxsID0gdGhpcy5maW5kUHJldmlvdXNFZGl0YWJsZUNvbHVtbihjdXJyZW50Q2VsbCk7XG5cbiAgICAgICAgaWYgKHRhcmdldENlbGwpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0YXJnZXRDZWxsLCAnY2xpY2snKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlVG9OZXh0Q2VsbChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBsZXQgY3VycmVudENlbGwgPSB0aGlzLmZpbmRDZWxsKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIGxldCByb3cgPSBjdXJyZW50Q2VsbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICBsZXQgdGFyZ2V0Q2VsbCA9IHRoaXMuZmluZE5leHRFZGl0YWJsZUNvbHVtbihjdXJyZW50Q2VsbCk7XG5cbiAgICAgICAgaWYgKHRhcmdldENlbGwpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0YXJnZXRDZWxsLCAnY2xpY2snKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldmlvdXNFZGl0YWJsZUNvbHVtbihjZWxsOiBFbGVtZW50KSB7XG4gICAgICAgIGxldCBwcmV2Q2VsbCA9IGNlbGwucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgICBpZiAoIXByZXZDZWxsKSB7XG4gICAgICAgICAgICBsZXQgcHJldmlvdXNSb3cgPSBjZWxsLnBhcmVudEVsZW1lbnQgPyBjZWxsLnBhcmVudEVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZyA6IG51bGw7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNSb3cpIHtcbiAgICAgICAgICAgICAgICBwcmV2Q2VsbCA9IHByZXZpb3VzUm93Lmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJldkNlbGwpIHtcbiAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKHByZXZDZWxsLCAncC1lZGl0YWJsZS1jb2x1bW4nKSkgcmV0dXJuIHByZXZDZWxsO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5maW5kUHJldmlvdXNFZGl0YWJsZUNvbHVtbihwcmV2Q2VsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmROZXh0RWRpdGFibGVDb2x1bW4oY2VsbDogRWxlbWVudCkge1xuICAgICAgICBsZXQgbmV4dENlbGwgPSBjZWxsLm5leHRFbGVtZW50U2libGluZztcblxuICAgICAgICBpZiAoIW5leHRDZWxsKSB7XG4gICAgICAgICAgICBsZXQgbmV4dFJvdyA9IGNlbGwucGFyZW50RWxlbWVudCA/IGNlbGwucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG5leHRSb3cpIHtcbiAgICAgICAgICAgICAgICBuZXh0Q2VsbCA9IG5leHRSb3cuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dENlbGwpIHtcbiAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKG5leHRDZWxsLCAncC1lZGl0YWJsZS1jb2x1bW4nKSkgcmV0dXJuIG5leHRDZWxsO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5maW5kTmV4dEVkaXRhYmxlQ29sdW1uKG5leHRDZWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50dEVkaXRhYmxlQ29sdW1uRGlzYWJsZWQgIT09IHRydWU7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdHJlZVRhYmxlQ2VsbEVkaXRvcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInR0LmVkaXRpbmdDZWxsID09PSBlZGl0YWJsZUNvbHVtbi5lbC5uYXRpdmVFbGVtZW50XCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaW5wdXRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF0dC5lZGl0aW5nQ2VsbCB8fCB0dC5lZGl0aW5nQ2VsbCAhPT0gZWRpdGFibGVDb2x1bW4uZWwubmF0aXZlRWxlbWVudFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIm91dHB1dFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIGAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVHJlZVRhYmxlQ2VsbEVkaXRvciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT47XG5cbiAgICBpbnB1dFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgb3V0cHV0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHQ6IFRyZWVUYWJsZSwgcHVibGljIGVkaXRhYmxlQ29sdW1uOiBUVEVkaXRhYmxlQ29sdW1uKSB7fVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ291dHB1dCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1t0dFJvd10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2F0dHIudGFiaW5kZXhdJzogJ1wiMFwiJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVFRSb3cge1xuICAgIEBJbnB1dCgndHRSb3cnKSByb3dOb2RlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHQ6IFRyZWVUYWJsZSwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lKSB7fVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gICAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgIC8vZG93biBhcnJvd1xuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBsZXQgbmV4dFJvdyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFJvdy5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vZG93biBhcnJvd1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICBsZXQgcHJldlJvdyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2Um93KSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZSb3cuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL2xlZnQgYXJyb3dcbiAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm93Tm9kZS5ub2RlLmV4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHQudG9nZ2xlUm93SW5kZXggPSBEb21IYW5kbGVyLmluZGV4KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93Tm9kZS5ub2RlLmV4cGFuZGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dC5vbk5vZGVDb2xsYXBzZS5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogdGhpcy5yb3dOb2RlLm5vZGVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dC51cGRhdGVTZXJpYWxpemVkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dC50YWJsZVNlcnZpY2Uub25VSVVwZGF0ZSh0aGlzLnR0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vcmlnaHQgYXJyb3dcbiAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvd05vZGUubm9kZS5leHBhbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR0LnRvZ2dsZVJvd0luZGV4ID0gRG9tSGFuZGxlci5pbmRleCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd05vZGUubm9kZS5leHBhbmRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dC5vbk5vZGVFeHBhbmQuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IHRoaXMucm93Tm9kZS5ub2RlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHQudXBkYXRlU2VyaWFsaXplZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHQudGFibGVTZXJ2aWNlLm9uVUlVcGRhdGUodGhpcy50dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZUZvY3VzKCkge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLnR0LmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnLnAtdHJlZXRhYmxlLXRib2R5JykuY2hpbGRyZW5bdGhpcy50dC50b2dnbGVSb3dJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHJvdykge1xuICAgICAgICAgICAgICAgICAgICByb3cuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyNSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRyZWVUYWJsZVRvZ2dsZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCJwLXRyZWV0YWJsZS10b2dnbGVyIHAtbGlua1wiXG4gICAgICAgICAgICAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgW3N0eWxlLnZpc2liaWxpdHldPVwicm93Tm9kZS5ub2RlLmxlYWYgPT09IGZhbHNlIHx8IChyb3dOb2RlLm5vZGUuY2hpbGRyZW4gJiYgcm93Tm9kZS5ub2RlLmNoaWxkcmVuLmxlbmd0aCkgPyAndmlzaWJsZScgOiAnaGlkZGVuJ1wiXG4gICAgICAgICAgICBbc3R5bGUubWFyZ2luTGVmdF09XCJyb3dOb2RlLmxldmVsICogMTYgKyAncHgnXCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF0dC50b2dnbGVySWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPENoZXZyb25Eb3duSWNvbiAqbmdJZj1cInJvd05vZGUubm9kZS5leHBhbmRlZFwiIC8+XG4gICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb24gKm5nSWY9XCIhcm93Tm9kZS5ub2RlLmV4cGFuZGVkXCIgLz5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwidHQudG9nZ2xlckljb25UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHJvd05vZGUubm9kZS5leHBhbmRlZCB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUcmVlVGFibGVUb2dnbGVyIHtcbiAgICBASW5wdXQoKSByb3dOb2RlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHQ6IFRyZWVUYWJsZSkge31cblxuICAgIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMucm93Tm9kZS5ub2RlLmV4cGFuZGVkID0gIXRoaXMucm93Tm9kZS5ub2RlLmV4cGFuZGVkO1xuXG4gICAgICAgIGlmICh0aGlzLnJvd05vZGUubm9kZS5leHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy50dC5vbk5vZGVFeHBhbmQuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgbm9kZTogdGhpcy5yb3dOb2RlLm5vZGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50dC5vbk5vZGVDb2xsYXBzZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBub2RlOiB0aGlzLnJvd05vZGUubm9kZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnR0LnVwZGF0ZVNlcmlhbGl6ZWRWYWx1ZSgpO1xuICAgICAgICB0aGlzLnR0LnRhYmxlU2VydmljZS5vblVJVXBkYXRlKHRoaXMudHQudmFsdWUpO1xuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFBhZ2luYXRvck1vZHVsZSwgUmlwcGxlTW9kdWxlLCBTY3JvbGxlck1vZHVsZSwgU3Bpbm5lckljb24sIEFycm93RG93bkljb24sIEFycm93VXBJY29uLCBTb3J0QWx0SWNvbiwgU29ydEFtb3VudFVwQWx0SWNvbiwgU29ydEFtb3VudERvd25JY29uLCBDaGVja0ljb24sIE1pbnVzSWNvbiwgQ2hldnJvbkRvd25JY29uLCBDaGV2cm9uUmlnaHRJY29uXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFRyZWVUYWJsZSxcbiAgICAgICAgU2hhcmVkTW9kdWxlLFxuICAgICAgICBUcmVlVGFibGVUb2dnbGVyLFxuICAgICAgICBUVFNvcnRhYmxlQ29sdW1uLFxuICAgICAgICBUVFNvcnRJY29uLFxuICAgICAgICBUVFJlc2l6YWJsZUNvbHVtbixcbiAgICAgICAgVFRSb3csXG4gICAgICAgIFRUUmVvcmRlcmFibGVDb2x1bW4sXG4gICAgICAgIFRUU2VsZWN0YWJsZVJvdyxcbiAgICAgICAgVFRTZWxlY3RhYmxlUm93RGJsQ2xpY2ssXG4gICAgICAgIFRUQ29udGV4dE1lbnVSb3csXG4gICAgICAgIFRUQ2hlY2tib3gsXG4gICAgICAgIFRUSGVhZGVyQ2hlY2tib3gsXG4gICAgICAgIFRURWRpdGFibGVDb2x1bW4sXG4gICAgICAgIFRyZWVUYWJsZUNlbGxFZGl0b3IsXG4gICAgICAgIFNjcm9sbGVyTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgVHJlZVRhYmxlLFxuICAgICAgICBUcmVlVGFibGVUb2dnbGVyLFxuICAgICAgICBUVFNjcm9sbGFibGVWaWV3LFxuICAgICAgICBUVEJvZHksXG4gICAgICAgIFRUU29ydGFibGVDb2x1bW4sXG4gICAgICAgIFRUU29ydEljb24sXG4gICAgICAgIFRUUmVzaXphYmxlQ29sdW1uLFxuICAgICAgICBUVFJvdyxcbiAgICAgICAgVFRSZW9yZGVyYWJsZUNvbHVtbixcbiAgICAgICAgVFRTZWxlY3RhYmxlUm93LFxuICAgICAgICBUVFNlbGVjdGFibGVSb3dEYmxDbGljayxcbiAgICAgICAgVFRDb250ZXh0TWVudVJvdyxcbiAgICAgICAgVFRDaGVja2JveCxcbiAgICAgICAgVFRIZWFkZXJDaGVja2JveCxcbiAgICAgICAgVFRFZGl0YWJsZUNvbHVtbixcbiAgICAgICAgVHJlZVRhYmxlQ2VsbEVkaXRvclxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVHJlZVRhYmxlTW9kdWxlIHt9XG4iXX0=