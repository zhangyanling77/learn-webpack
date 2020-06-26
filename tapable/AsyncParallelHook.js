const HookCodeFactory = require('./HookCodeFactory');
const Hook = require('./Hook');

class AsyncParallelHookCodeFactory extends HookCodeFactory {
    create() {
        return new Function(
            this.args({ after: '_callback' }),
            this.header() + this.content()
        );
    }
    content() {
        let code = `
            var _counter = ${this.options.taps.length};
            var _done = () => {
                _callback();
            };
        `;
        for (let i = 0; i < this.options.taps.length; i++) {
            code += `
            var _fn${i} = _x[${i}];
            _fn${i}(name, age, _err${i} => {
                if (--_counter === 0) _done();
            });
                    `
        }
        return code;
    }
}

const factory = new AsyncParallelHookCodeFactory();

class SyncHook extends Hook {
    constructor(args) {
        super(args);
    }
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
}

module.exports = SyncHook;