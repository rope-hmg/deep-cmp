"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equals = exports.partialSubset = exports.strictSubset = exports.isObject = void 0;
function processObject(comparator, stack, a, b) {
    let result;
    if (Array.isArray(a)) {
        result = comparator.processArray(stack, a, b);
    }
    else if (a.constructor === Map) {
        result = comparator.processMap(stack, a, b);
    }
    else if (a.constructor === Set) {
        result = comparator.processSet(a, b);
    }
    else if (a.constructor === RegExp) {
        result = a.source === b.source && a.flags === b.flags;
    }
    else if (a.valueOf !== Object.prototype.valueOf) {
        result = a.valueOf() === b.valueOf();
    }
    else if (a.toString !== Object.prototype.toString) {
        result = a.toString() === b.toString();
    }
    else {
        result = comparator.processClassicObject(stack, a, b);
    }
    return result;
}
function pushNewSubjectAndFilter(stack, a, b, key) {
    const newSubject = a[key];
    const newFilter = b[key];
    if (newSubject !== newFilter) {
        stack.push(newSubject, newFilter);
    }
}
const every = {
    initialSearchState: true,
    processArray(stack, subject, filter) {
        let result = true;
        const filterLength = filter.length;
        // If the subject is shorter than the filter, then it doesn't contain all
        // the values and we can exit early from the search.
        if (subject.length < filterLength) {
            result = false;
        }
        else {
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
        }
        else {
            result = processObject(every, stack, subject, filter);
        }
        return result;
    },
    processMap(stack, subject, filter) {
        let result = true;
        if (subject.size < filter.size) {
            result = false;
        }
        else {
            for (const [key, newFilter] of filter.entries()) {
                const newSubject = subject.get(key);
                if (newSubject !== newFilter) {
                    result = false;
                    break;
                }
                else {
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
        }
        else {
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
        }
        else {
            for (let i = 0; i < filterLength && result; i += 1) {
                const key = filterKeys[i];
                if (!Object.prototype.hasOwnProperty.call(subject, key)) {
                    result = false;
                    break;
                }
                else {
                    pushNewSubjectAndFilter(stack, subject, filter, key);
                }
            }
        }
        return result;
    },
};
const some = {
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
                }
                else {
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
                }
                else {
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
            const newSubject = subject[i];
            const newFilter = filter[i];
            if (newSubject === newFilter) {
                result = true;
            }
            else {
                stack.push(newSubject, newFilter);
            }
        }
        return result;
    },
};
const equal = {
    initialSearchState: true,
    processArray(stack, a, b) {
        let result = true;
        const bLength = b.length;
        if (a.length !== bLength) {
            result = false;
        }
        else {
            for (let i = 0; i < bLength; i += 1) {
                pushNewSubjectAndFilter(stack, a, b, i);
            }
        }
        return result;
    },
    processObject(stack, a, b) {
        let result;
        if (a.constructor !== b.constructor) {
            result = false;
        }
        else {
            result = processObject(equal, stack, a, b);
        }
        return result;
    },
    processMap(stack, a, b) {
        let result = true;
        if (a.size !== b.size) {
            result = false;
        }
        else {
            for (const [key, newFilter] of b.entries()) {
                const newSubject = a.get(key);
                if (newSubject !== newFilter) {
                    result = false;
                    break;
                }
                else {
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
        }
        else {
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
        }
        else {
            for (let i = 0; i < bLength && result; i += 1) {
                const key = bKeys[i];
                if (!Object.prototype.hasOwnProperty.call(a, key)) {
                    result = false;
                    break;
                }
                else {
                    pushNewSubjectAndFilter(stack, a, b, key);
                }
            }
        }
        return result;
    },
};
function isObject(value) {
    return typeof value === "object" && value !== null;
}
exports.isObject = isObject;
function doSearch(comparator, a, b) {
    const stack = [a, b];
    const seen = new Map();
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
                }
                else {
                    const filterFor = seen.get(filter);
                    // If we have seen this pair before then we can skip processing.
                    // If we haven't should we keep the previous mapping or update?
                    if (filterFor !== filter) {
                        result = comparator.processObject(stack, subject, filter);
                    }
                }
                seen.set(subject, filter);
            }
            else {
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
function strictSubset(subject, filter) {
    return doSearch(every, subject, filter);
}
exports.strictSubset = strictSubset;
/**
 * Returns true if the subject contains any subset of the filter.
 */
function partialSubset(subject, filter) {
    return doSearch(some, subject, filter);
}
exports.partialSubset = partialSubset;
/**
 * Returns true if a and b are deep equal to each other.
 */
function equals(a, b) {
    return doSearch(equal, a, b);
}
exports.equals = equals;
