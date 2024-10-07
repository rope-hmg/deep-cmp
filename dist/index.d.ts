export declare function isObject(value: unknown): value is object;
/**
 * Returns true if the subject contains all of the filter.
 */
export declare function strictSubset(subject: object, filter: object): boolean;
/**
 * Returns true if the subject contains any subset of the filter.
 */
export declare function partialSubset(subject: object, filter: object): boolean;
/**
 * Returns true if a and b are deep equal to each other.
 */
export declare function equals(a: unknown, b: unknown): boolean;
