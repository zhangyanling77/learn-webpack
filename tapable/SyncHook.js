const HookCodeFactory = require('./HookCodeFactory');
const Hook = require('./Hook');

const factory = new HookCodeFactory();

class SyncHook extends Hook {
    constructor(args) {
        super(args);
    }
    compile(options) { // {taps,args}
        factory.setup(this, options); // 做一些工厂准备工作
        return factory.create(options); // 真正创建函数的 (function anonymous(name, age) {}
    }
}

module.exports = SyncHook;