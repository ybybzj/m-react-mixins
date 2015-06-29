var pureRender = require('./pure-render');
module.exports = function(){
  return {
    mixins:[pureRender()],
    getInitialProps: function(props){
      if(props && props.sf && props.sf.$type === '__$sf$__'){
        props.sf.signal && this._setupSignals(props.sf);
        props.sf.state  && this._setupFacets(props.sf);
      }
    },
    getInitialState: function(){
      if(this.__facets) return this.__facets.get();
      return {};
    },
    _setupSignals: function(sf){
      var signals = this.signals;
      //setup signals
      if(Array.isArray(signals) && signals.length){
        this.signals = signals.reduce(function(m, name){
          m[name] = sf.signal.getEmitter(name);
          return m;
        }, {});
      }
    },
    _setupFacets: function(sf){
      //setup facets
      this.__facets = sf.state.store.createFacet({
        cursors: this.cursors,
        facets: this.facets
      }, [this.props]);
      this.cursors = this.__facets.cursors;
      this.facets = this.__facets.facets;
      
      //listen to facets' "update" event
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
};
