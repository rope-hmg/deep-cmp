type UnknownMap = Map<unknown, unknown>;
type UnknownSet = Set<unknown>;

interface ObjectComparator {
    readonly initialSearchState: boolean;

    processArray(stack: unknown[], a: unknown[], b: unknown[]): boolean;
    processObject(stack: unknown[], a: object, b: object): boolean;
    processMap(stack: unknown[], a: UnknownMap, b: UnknownMap): boolean;
    processSet(a: UnknownSet, b: UnknownSet): boolean;
    processClassicObject(stack: unknown[], a: object, b: object): boolean;
}

function processObject(comparator: ObjectComparator, stack: unknown[], a: object, b: object): boolean {
    let result: boolean;

    if (Array.isArray(a)) {
        result = comparator.processArray(stack, a as unknown[], b as unknown[]);
    } else if (a.constructor === Map) {
        result = comparator.processMap(stack, a as UnknownMap, b as UnknownMap);
    } else if (a.constructor === Set) {
        result = comparator.processSet(a as UnknownSet, b as UnknownSet);
    } else if (a.constructor === RegExp) {
        result = (a as RegExp).source === (b as RegExp).source && (a as RegExp).flags === (b as RegExp).flags;
    } else if (a.valueOf !== Object.prototype.valueOf) {
        result = a.valueOf() === b.valueOf();
    } else if (a.toString !== Object.prototype.toString) {
        result = a.toString() === b.toString();
    } else {
        result = comparator.processClassicObject(stack, a, b);
    }

    return result;
}

function pushNewSubjectAndFilter(stack: unknown[], a: any, b: any, key: any): void {
    const newSubject = a[key];
    const newFilter = b[key];

    if (newSubject !== newFilter) {
        stack.push(newSubject, newFilter);
    }
}

const every: ObjectComparator = {
    initialSearchState: true,

    processArray(stack, subject, filter) {
        let result = true;

        const filterLength = filter.length;

        // If the subject is shorter than the filter, then it doesn't contain all
        // the values and we can exit early from the search.
        if (subject.length < filterLength) {
            result = false;
        } else {
            for (let i = 0; i < filterLength; i += 1) {
                pushNewSubjectAndFilter(stack, subject, filter, i);
            }
        }

        return result;
    },

    processObject(stack, subject, filter) {
        let result = true;

        // Every check after the check for the constructors only needs to confirm
        // the type of subject because we know they're both the same kind of object.
        if (subject.constructor !== filter.constructor) {
            result = false;
        } else {
            result = processObject(every, stack, subject, filter);
        }

        return result;
    },

    processMap(stack, subject, filter) {
        let result = true;

        if (subject.size < filter.size) {
            result = false;
        } else {
            for (const [key, newFilter] of filter.entries()) {
                const newSubject = subject.get(key);

                if (newSubject !== newFilter) {
                    result = false;
                    break;
                } else {
                    stack.push(newSubject, newFilter);
                }
            }
        }

        return result;
    },

    processSet(subject, filter) {
        let result = true;

        if (subject.size < filter.size) {
            result = false;
        } else {
            for (const value of filter.values()) {
                if (!subject.has(value)) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    },

    processClassicObject(stack, subject, filter) {
        let result = true;

        const filterKeys = Object.keys(filter);
        const filterLength = filterKeys.length;
        const subjectLength = Object.keys(subject).length;

        if (subjectLength < filterLength) {
            result = false;
        } else {
            for (let i = 0; i < filterLength && result; i += 1) {
                const key = filterKeys[i];

                if (!Object.prototype.hasOwnProperty.call(subject, key)) {
                    result = false;
                    break;
                } else {
                    pushNewSubjectAndFilter(stack, subject, filter, key);
                }
            }
        }

        return result;
    },
};

const some: ObjectComparator = {
    initialSearchState: false,

    processArray(stack, subject, filter) {
        let result = false;

        const filterLength = filter.length;

        if (subject.length >= filterLength) {
            for (let i = 0; i < filterLength; i += 1) {
                const newSubject = subject[i];
                const newFilter = filter[i];

                if (newSubject === newFilter) {
                    result = true;
                    break;
                } else {
                    stack.push(newSubject, newFilter);
                }
            }
        }

        return result;
    },

    processObject(stack, subject, filter) {
        let result = false;

        // Every check after the check for the constructors only needs to confirm
        // the type of subject because we know they're both the same kind of object.
        if (subject.constructor === filter.constructor) {
            result = processObject(some, stack, subject, filter);
        }

        return result;
    },

    processMap(stack, subject, filter) {
        let result = false;

        if (subject.size >= filter.size) {
            for (const [key, newFilter] of filter.entries()) {
                const newSubject = subject.get(key);

                if (newSubject === newFilter) {
                    result = true;
                    break;
                } else {
                    stack.push(newSubject, newFilter);
                }
            }
        }

        return result;
    },

    processSet(subject, filter) {
        let result = false;

        if (subject.size >= filter.size) {
            for (const value of filter.values()) {
                if (subject.has(value)) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    },

    processClassicObject(stack, subject, filter) {
        let result = false;

        const filterKeys = Object.keys(filter);
        const filterLength = filterKeys.length;

        for (let i = 0; i < filterLength; i += 1) {
            const newSubject = (subject as any)[i];
            const newFilter = (filter as any)[i];

            if (newSubject === newFilter) {
                result = true;
            } else {
                stack.push(newSubject, newFilter);
            }
        }

        return result;
    },
};

const equal: ObjectComparator = {
    initialSearchState: true,

    processArray(stack: unknown[], a: unknown[], b: unknown[]): boolean {
        let result = true;

        const bLength = b.length;

        if (a.length !== bLength) {
            result = false;
        } else {
            for (let i = 0; i < bLength; i += 1) {
                pushNewSubjectAndFilter(stack, a, b, i);
            }
        }

        return result;
    },

    processObject(stack: unknown[], a: object, b: object): boolean {
        let result: boolean;

        if (a.constructor !== b.constructor) {
            result = false;
        } else {
            result = processObject(equal, stack, a, b);
        }

        return result;
    },

    processMap(stack, a, b) {
        let result = true;

        if (a.size !== b.size) {
            result = false;
        } else {
            for (const [key, newFilter] of b.entries()) {
                const newSubject = a.get(key);

                if (newSubject !== newFilter) {
                    result = false;
                    break;
                } else {
                    stack.push(newSubject, newFilter);
                }
            }
        }

        return result;
    },

    processSet(a, b) {
        let result = true;

        if (a.size !== b.size) {
            result = false;
        } else {
            for (const value of b.values()) {
                if (!a.has(value)) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    },

    processClassicObject(stack, a, b) {
        let result = true;

        const bKeys = Object.keys(b);
        const bLength = bKeys.length;
        const aLength = Object.keys(a).length;

        if (aLength !== bLength) {
            result = false;
        } else {
            for (let i = 0; i < bLength && result; i += 1) {
                const key = bKeys[i];

                if (!Object.prototype.hasOwnProperty.call(a, key)) {
                    result = false;
                    break;
                } else {
                    pushNewSubjectAndFilter(stack, a, b, key);
                }
            }
        }

        return result;
    },
};

export function isObject(value: unknown): value is object {
    return typeof value === "object" && value !== null;
}

function doSearch(comparator: ObjectComparator, a: unknown, b: unknown): boolean {
    const stack: unknown[] = [a, b];
    const seen = new Map<unknown, unknown>();

    const { initialSearchState } = comparator;

    let result = initialSearchState;

    while (result === initialSearchState && stack.length > 0) {
        const filter = stack.pop();
        const subject = stack.pop();

        // If a and b are not equal, then there are two possibilities.
        // 1). One or both are different objects that contains the same keys and values.
        // 2). One or both are NaN.
        if (subject !== filter) {
            if (isObject(subject) && isObject(filter)) {
                const hasSubject = seen.has(subject);

                if (!hasSubject) {
                    result = comparator.processObject(stack, subject, filter);
                } else {
                    const filterFor = seen.get(filter)!;

                    // If we have seen this pair before then we can skip processing.
                    // If we haven't should we keep the previous mapping or update?
                    if (filterFor !== filter) {
                        result = comparator.processObject(stack, subject, filter);
                    }
                }

                seen.set(subject, filter);
            } else {
                // NaN is not equal to NaN.
                result = false;
            }
        }
    }

    // Make sure not to hold onto any references. We don't want
    // to keep random objects alive for no reason.
    seen.clear();

    return result;
}

/**
 * Returns true if the subject contains all of the filter.
 */
export function strictSubset(subject: object, filter: object): boolean {
    return doSearch(every, subject, filter);
}

/**
 * Returns true if the subject contains any subset of the filter.
 */
export function partialSubset(subject: object, filter: object): boolean {
    return doSearch(some, subject, filter);
}

/**
 * Returns true if a and b are deep equal to each other.
 */
export function equals(a: unknown, b: unknown): boolean {
    return doSearch(equal, a, b);
}
