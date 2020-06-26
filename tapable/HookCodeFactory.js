class HookCodeFactory {
  setup(hookInstance, options) {
      this.options = options;
      hookInstance._x = options.taps.map(t => t.fn);// fn的数组
  }
  args({ before, after } = {}) {
      let allArgs = this.options.args || [];//[name,age]
      if (before) allArgs = [before, ...allArgs];
      if (after) allArgs = [...allArgs, after];
      return allArgs.join(',');//name,age,_callback
  }
  header() {
      return `var _x = this._x;\n`;
  }
  content() {
      let code = ``;
      for (let i = 0; i < this.options.taps.length; i++) {
          code += `
            var _fn${i} = _x[${i}];
            _fn${i}(${this.args()});
            `
      }
      return code;
  }
  create() {
      return new Function(
          this.args(),
          this.header() + this.content()
      );
  }
}
module.exports = HookCodeFactory;