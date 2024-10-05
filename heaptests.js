import Heap from './heap.js'

const comparator = (a,b) => a-b

function assert(condition, msg) {
    if (!condition) console.log("Test failed: ", msg)
}

function testLengthAfterPop() {
    const h = new Heap(comparator)
    h.insert(42)
    h.insert(99)
    h.insert(-1)
    assert(h.length() === 3, "length is 3 after insertion")
    h.pop()
    assert(h.length() === 2, "length is 2 after one pop")
    h.pop()
    assert(h.length() === 1, "length is 1 after two pops")
    h.pop()
    assert(h.length() === 0, "length is 0 after popping everything")
}

// test case: should work when popping on an empty heap

// test case: should work after emptying and adding again after

testLengthAfterPop()


console.log("Done")