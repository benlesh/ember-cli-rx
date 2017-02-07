/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-rxjs',
  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/rxjs/dist/rx.all.js');
    app.import('vendor/rx.js', {
      exports: {
        Rx: ['default']
      }
    });
  }
};
