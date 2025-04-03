const Signal = require('../signal.js')

const a = new Signal.State(0)

const b = new Signal.Computed(() => {
    console.log(1);
    return a.get() + 1
}, [a])

const c = new Signal.Computed(() => {
    console.log(2);
    return a.get() + 2
}, [a])

const d = new Signal.Computed(() => {
    console.log(3);
    return b.get() + c.get()
}, [b, c])

new Signal.Computed(() => {
    console.log("result", d.get())
}, [d])

a.set(1)