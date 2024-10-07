"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const absolute_unit_test_1 = require("absolute_unit_test");
const index_1 = require("./index");
const shared = Symbol();
const subject = {
    prop1: 10,
    prop2: {
        prop3: "amazing",
        prop4: new Map([
            ["key1", "value1"],
            ["key2", "value2"],
        ]),
        prop5: shared,
        prop6: new Set([1, 2, 3, 4]),
        prop7: /some regex/,
    },
    prop8: {
        different: 20,
        valueOf() {
            return true;
        },
    },
    prop9: {
        different: 20,
        toString() {
            return "the same";
        },
    },
    prop10: false,
};
class StrictSubset {
    "should return true if the subject contains a subset of the filter (number)"() {
        const filter = { prop1: 10 };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (string)"() {
        const filter = {
            prop2: { prop3: "amazing" },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (boolean)"() {
        const filter = { prop10: false };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (Symbol)"() {
        const filter = {
            prop2: { prop5: shared },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (Map)"() {
        const filter = {
            prop2: {
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
            },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (Set)"() {
        const filter = {
            prop2: {
                prop6: new Set([1, 2, 3, 4]),
            },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (Regexp)"() {
        const filter = {
            prop2: { prop7: /some regex/ },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (custom valueOf)"() {
        const filter = {
            prop8: {
                valueOf() {
                    return true;
                },
            },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
    "should return true if the subject contains a subset of the filter (custom toString)"() {
        const filter = {
            prop9: {
                toString() {
                    return "the same";
                },
            },
        };
        absolute_unit_test_1.assert(index_1.strictSubset(subject, filter), "");
    }
}
class PartialSubset {
    "should return true if the subject contains some of the filter (number)"() {
        const filter = {
            different: "different",
            prop1: 10,
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (string)"() {
        const filter = {
            different: "different",
            prop2: { prop3: "amazing" },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (boolean)"() {
        const filter = {
            different: "different",
            prop10: false,
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (Symbol)"() {
        const filter = {
            different: "different",
            prop2: { prop5: shared },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (Map)"() {
        const filter = {
            prop2: {
                different: "different",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
            },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (Set)"() {
        const filter = {
            prop2: {
                different: "different",
                prop6: new Set([1, 2, 3, 4]),
            },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (Regexp)"() {
        const filter = {
            different: "different",
            prop2: { prop7: /some regex/ },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (custom valueOf)"() {
        const filter = {
            different: "different",
            prop8: {
                valueOf() {
                    return true;
                },
            },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
    "should return true if the subject contains some of the filter (custom toString)"() {
        const filter = {
            different: "different",
            prop9: {
                toString() {
                    return "the same";
                },
            },
        };
        absolute_unit_test_1.assert(index_1.partialSubset(subject, filter), "");
    }
}
class Equals {
    "should return true if the objects are exactly equal"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (string)"() {
        const shared = Symbol();
        const a = {
            prop1: 10,
            prop2: {
                prop3: "not amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (number)"() {
        const shared = Symbol();
        const a = {
            prop1: 12,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (boolean)"() {
        const shared = Symbol();
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: true,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (Symbol)"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: Symbol(),
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (Map)"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                    ["key3", "value3"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (Set)"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4, 5]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (custom valueOf)"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return false;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (custom toString)"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "not the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
    "should return false if the objects are NOT exactly equal (RegExp)"() {
        const a = {
            prop1: 10,
            prop2: {
                prop3: "amazing",
                prop4: new Map([
                    ["key1", "value1"],
                    ["key2", "value2"],
                ]),
                prop5: shared,
                prop6: new Set([1, 2, 3, 4]),
                prop7: /some regex/i,
            },
            prop8: {
                different: 10,
                valueOf() {
                    return true;
                },
            },
            prop9: {
                different: 10,
                toString() {
                    return "the same";
                },
            },
            prop10: false,
        };
        absolute_unit_test_1.assert(!index_1.equals(subject, a), "");
    }
}
absolute_unit_test_1.runTests(StrictSubset, PartialSubset, Equals);
