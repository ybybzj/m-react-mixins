var pureRender = require('./pure-render');
module.exports = function(sf){
  return {
    mixins:[pureRender()],
    getInitialState: function(){
      var signals = this.signals;
      this.__facets = sf.state.store.createFacet({
        cursors: this.cursors,
        facets: this.facets
      }, [this.props]);

      this.cursors = this.__facets.cursors;
      this.facets = this.__facets.facets;
      if(Array.isArray(signals) && signals.length){
        this.signals = signals.reduce(function(m, name){
          m[name] = sf.signal.getEmitter(name);
          return m;
        }, {});
      }
      if(this.__facets) return this.__facets.get();
      return {};
    },
    componentDidMount: function(){
      if(!this.__facets) return;
      var handler = (function(){
        this.setState(this.__facets.get());
      }).bind(this);
      this.__facets.on('update', handler);
    },
    componentWillUnmount: function(){
      if(!this.__facets) return;
      this.__facets.release();
      this.__facets = null;
    },
    componentWillReceiveProps: function(props){
      if(!this.__facets) return;
      this.__facets.refresh([props]);
      this.setState(this.__facets.get(), true);
    }
  };
}