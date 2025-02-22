import { Injectable, Inject } from '@angular/core';
import { DynamicDialogComponent } from './dynamicdialog';
import { DynamicDialogInjector } from './dynamicdialog-injector';
import { DynamicDialogConfig } from './dynamicdialog-config';
import { DynamicDialogRef } from './dynamicdialog-ref';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export class DialogService {
    constructor(componentFactoryResolver, appRef, injector, document) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.injector = injector;
        this.document = document;
        this.dialogComponentRefMap = new Map();
    }
    open(componentType, config) {
        const dialogRef = this.appendDialogComponentToBody(config);
        this.dialogComponentRefMap.get(dialogRef).instance.childComponentType = componentType;
        return dialogRef;
    }
    appendDialogComponentToBody(config) {
        const map = new WeakMap();
        map.set(DynamicDialogConfig, config);
        const dialogRef = new DynamicDialogRef();
        map.set(DynamicDialogRef, dialogRef);
        const sub = dialogRef.onClose.subscribe(() => {
            this.dialogComponentRefMap.get(dialogRef).instance.close();
        });
        const destroySub = dialogRef.onDestroy.subscribe(() => {
            this.removeDialogComponentFromBody(dialogRef);
            destroySub.unsubscribe();
            sub.unsubscribe();
        });
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicDialogComponent);
        const componentRef = componentFactory.create(new DynamicDialogInjector(this.injector, map));
        this.appRef.attachView(componentRef.hostView);
        const domElem = componentRef.hostView.rootNodes[0];
        this.document.body.appendChild(domElem);
        this.dialogComponentRefMap.set(dialogRef, componentRef);
        return dialogRef;
    }
    removeDialogComponentFromBody(dialogRef) {
        if (!dialogRef || !this.dialogComponentRefMap.has(dialogRef)) {
            return;
        }
        const dialogComponentRef = this.dialogComponentRefMap.get(dialogRef);
        this.appRef.detachView(dialogComponentRef.hostView);
        dialogComponentRef.destroy();
        this.dialogComponentRefMap.delete(dialogRef);
    }
}
DialogService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DialogService, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
DialogService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DialogService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.8", ngImport: i0, type: DialogService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9keW5hbWljZGlhbG9nL2RpYWxvZ3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBMkYsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVJLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzdELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFHM0MsTUFBTSxPQUFPLGFBQWE7SUFHdEIsWUFBb0Isd0JBQWtELEVBQVUsTUFBc0IsRUFBVSxRQUFrQixFQUE0QixRQUFrQjtRQUE1Siw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQTRCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFGaEwsMEJBQXFCLEdBQWdFLElBQUksR0FBRyxFQUFFLENBQUM7SUFFb0YsQ0FBQztJQUU3SyxJQUFJLENBQUMsYUFBd0IsRUFBRSxNQUEyQjtRQUM3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsYUFBYSxDQUFDO1FBRXRGLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTywyQkFBMkIsQ0FBQyxNQUEyQjtRQUMzRCxNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFckMsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2xELElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekIsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN2RyxNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLE1BQU0sT0FBTyxHQUFJLFlBQVksQ0FBQyxRQUFpQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWdCLENBQUM7UUFDNUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXhELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFTyw2QkFBNkIsQ0FBQyxTQUEyQjtRQUM3RCxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxRCxPQUFPO1NBQ1Y7UUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDOzswR0FwRFEsYUFBYSxnSEFHc0gsUUFBUTs4R0FIM0ksYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFJOEgsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0b3IsIFR5cGUsIEVtYmVkZGVkVmlld1JlZiwgQ29tcG9uZW50UmVmLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IER5bmFtaWNEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2R5bmFtaWNkaWFsb2cnO1xuaW1wb3J0IHsgRHluYW1pY0RpYWxvZ0luamVjdG9yIH0gZnJvbSAnLi9keW5hbWljZGlhbG9nLWluamVjdG9yJztcbmltcG9ydCB7IER5bmFtaWNEaWFsb2dDb25maWcgfSBmcm9tICcuL2R5bmFtaWNkaWFsb2ctY29uZmlnJztcbmltcG9ydCB7IER5bmFtaWNEaWFsb2dSZWYgfSBmcm9tICcuL2R5bmFtaWNkaWFsb2ctcmVmJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERpYWxvZ1NlcnZpY2Uge1xuICAgIGRpYWxvZ0NvbXBvbmVudFJlZk1hcDogTWFwPER5bmFtaWNEaWFsb2dSZWYsIENvbXBvbmVudFJlZjxEeW5hbWljRGlhbG9nQ29tcG9uZW50Pj4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBwcml2YXRlIGFwcFJlZjogQXBwbGljYXRpb25SZWYsIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCkge31cblxuICAgIHB1YmxpYyBvcGVuKGNvbXBvbmVudFR5cGU6IFR5cGU8YW55PiwgY29uZmlnOiBEeW5hbWljRGlhbG9nQ29uZmlnKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuYXBwZW5kRGlhbG9nQ29tcG9uZW50VG9Cb2R5KGNvbmZpZyk7XG5cbiAgICAgICAgdGhpcy5kaWFsb2dDb21wb25lbnRSZWZNYXAuZ2V0KGRpYWxvZ1JlZikuaW5zdGFuY2UuY2hpbGRDb21wb25lbnRUeXBlID0gY29tcG9uZW50VHlwZTtcblxuICAgICAgICByZXR1cm4gZGlhbG9nUmVmO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwZW5kRGlhbG9nQ29tcG9uZW50VG9Cb2R5KGNvbmZpZzogRHluYW1pY0RpYWxvZ0NvbmZpZykge1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgICBtYXAuc2V0KER5bmFtaWNEaWFsb2dDb25maWcsIGNvbmZpZyk7XG5cbiAgICAgICAgY29uc3QgZGlhbG9nUmVmID0gbmV3IER5bmFtaWNEaWFsb2dSZWYoKTtcbiAgICAgICAgbWFwLnNldChEeW5hbWljRGlhbG9nUmVmLCBkaWFsb2dSZWYpO1xuXG4gICAgICAgIGNvbnN0IHN1YiA9IGRpYWxvZ1JlZi5vbkNsb3NlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZ0NvbXBvbmVudFJlZk1hcC5nZXQoZGlhbG9nUmVmKS5pbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkZXN0cm95U3ViID0gZGlhbG9nUmVmLm9uRGVzdHJveS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVEaWFsb2dDb21wb25lbnRGcm9tQm9keShkaWFsb2dSZWYpO1xuICAgICAgICAgICAgZGVzdHJveVN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEeW5hbWljRGlhbG9nQ29tcG9uZW50KTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50UmVmID0gY29tcG9uZW50RmFjdG9yeS5jcmVhdGUobmV3IER5bmFtaWNEaWFsb2dJbmplY3Rvcih0aGlzLmluamVjdG9yLCBtYXApKTtcblxuICAgICAgICB0aGlzLmFwcFJlZi5hdHRhY2hWaWV3KGNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG5cbiAgICAgICAgY29uc3QgZG9tRWxlbSA9IChjb21wb25lbnRSZWYuaG9zdFZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvbUVsZW0pO1xuXG4gICAgICAgIHRoaXMuZGlhbG9nQ29tcG9uZW50UmVmTWFwLnNldChkaWFsb2dSZWYsIGNvbXBvbmVudFJlZik7XG5cbiAgICAgICAgcmV0dXJuIGRpYWxvZ1JlZjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZURpYWxvZ0NvbXBvbmVudEZyb21Cb2R5KGRpYWxvZ1JlZjogRHluYW1pY0RpYWxvZ1JlZikge1xuICAgICAgICBpZiAoIWRpYWxvZ1JlZiB8fCAhdGhpcy5kaWFsb2dDb21wb25lbnRSZWZNYXAuaGFzKGRpYWxvZ1JlZikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRpYWxvZ0NvbXBvbmVudFJlZiA9IHRoaXMuZGlhbG9nQ29tcG9uZW50UmVmTWFwLmdldChkaWFsb2dSZWYpO1xuICAgICAgICB0aGlzLmFwcFJlZi5kZXRhY2hWaWV3KGRpYWxvZ0NvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG4gICAgICAgIGRpYWxvZ0NvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZGlhbG9nQ29tcG9uZW50UmVmTWFwLmRlbGV0ZShkaWFsb2dSZWYpO1xuICAgIH1cbn1cbiJdfQ==