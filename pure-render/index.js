var shadowEqual = require('./shadowEqual');
module.exports = function() {
  return {
    shouldComponentUpdate: function(oldProps, oldState) {
      return !shadowEqual(this.props, oldProps) || !shadowEqual(this.state, oldState);
    }
  };
};