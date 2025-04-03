class Signal {
    static State = class {
        constructor(value = null) {
            this.value = value
            this.sinks = []
        }

        set(value) {
            if (this.value === value) return
            this.value = value
            this.sinks.forEach(sink => sink.markDirty())
            this.sinks.forEach(sink => sink.visiting = false)
            this.sinks.forEach(sink => sink.makeClean())
        }

        get() {
            return this.value
        }

        addSink(sink) {
            this.sinks.push(sink)
        }
    }

    static Computed = class {
        constructor(callback, sources = []) {
            this.callback = callback
            this.sources = sources
            this.sinks = []
            this.dirty = true
            this.value = undefined
            this.visiting = false
            this.prevSourceValues = []

            for (const src of this.sources) {
                if (src.addSink) src.addSink(this)
            }

            this.makeClean()
        }

        markDirty() {
            if (this.dirty) return
            this.dirty = true
            this.sinks.forEach(sink => sink.markDirty())
        }

        makeClean() {
            if (!this.dirty || this.visiting) return
            this.visiting = true

            this.sources.forEach(src => {
                if (src.makeClean) src.makeClean()
            })

            let isSourceModified = false
            const currentSourceValues = []

            for (let i = 0; i < this.sources.length; i++) {
                const sourceValue = this.sources[i].value
                if (sourceValue !== this.prevSourceValues[i]) isSourceModified = true
                currentSourceValues[i] = sourceValue
            }

            if (isSourceModified) {
                const newValue = this.callback()
                if (newValue !== this.value) {
                    this.value = newValue
                    this.sinks.forEach(sink => sink.markDirty())
                    this.sinks.forEach(sink => sink.makeClean())
                }
                this.prevSourceValues = currentSourceValues
            }
            this.dirty = false
            this.visiting = false
        }

        get() {
            return this.value
        }

        addSink(sink) {
            this.sinks.push(sink)
        }
    }
}

module.exports = Signal