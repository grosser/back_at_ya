(function() {
  return {
    events: {
      'app.activated': 'init',
    },

    init: function() {
      this.switchTo('form');
    }
  };
}());
