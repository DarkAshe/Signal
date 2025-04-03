const Signal = require('../signal.js')

const n = new Signal.State(0)

const isOdd = new Signal.Computed(() => {
    console.log(1);
    return n.get() % 2
}, [n])

const result = new Signal.Computed(() => {
    console.log(2);
    return isOdd.get() ? "odd" : "even"
}, [isOdd])

new Signal.Computed(() => {
    console.log(3)
    return `${n.get()} ${result.get()}`
}, [n, result])

console.log("set from 0 to 1")
n.set(1)

console.log("set from 1 to 3")
n.set(3)