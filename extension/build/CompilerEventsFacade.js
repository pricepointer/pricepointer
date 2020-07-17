/* eslint-disable */

module.exports = class CompilerEventsFacade {
    constructor(compiler, name) {
        this._compiler = compiler
        this._legacyTapable = !compiler.hooks
        this.extensionName = name
    }

    afterOptimizeChunkAssets(call) {
        return this._legacyTapable
            ? this._compiler.plugin('compilation', comp => comp.plugin('after-optimize-chunk-assets', chunks => call(comp, chunks)))
            : this._compiler.hooks.compilation.tap(
                this.extensionName,
                comp => comp.hooks.afterOptimizeChunkAssets.tap(
                    this.extensionName,
                    chunks => call(comp, chunks),
                ),
            )
    }

    afterEmit(call) {
        return this._legacyTapable
            ? this._compiler.plugin('after-emit', call)
            : this._compiler.hooks.afterEmit.tap(
                this.extensionName,
                call,
            )
    }
}
