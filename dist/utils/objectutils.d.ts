export declare class ObjectUtils {
    static equals(obj1: any, obj2: any, field?: string): boolean;
    static equalsByValue(obj1: any, obj2: any): boolean;
    static resolveFieldData(data: any, field: any): any;
    static isFunction(obj: any): boolean;
    static reorderArray(value: any[], from: number, to: number): void;
    static insertIntoOrderedArray(item: any, index: number, arr: any[], sourceArr: any[]): void;
    static findIndexInList(item: any, list: any): number;
    static contains(value: any, list: any): boolean;
    static removeAccents(str: any): any;
    static isDate(input: any): boolean;
    static isEmpty(value: any): boolean;
    static isNotEmpty(value: any): boolean;
    static compare(value1: any, value2: any, locale: any, order?: number): number;
    static sort(value1: any, value2: any, order: number, locale: any, nullSortOrder?: number): number;
    static merge(obj1?: any, obj2?: any): any;
}
