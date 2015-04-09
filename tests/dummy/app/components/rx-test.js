import rxComponent from 'ember-cli-rx/helpers/component';

export default rxComponent((comp) => {

  var dateStrings = comp.property('input', 'original').merge(comp.action('iWantADate').map(() => new Date()).map(d => d.toString()));

  comp.update('output').when(dateStrings);
});


// export default Ember.Component.extend({

//   actions: {
//     iWantADate: function () {
//       this.set('output', (new Date()).toString());
//     }
//   }
// });


// class Foo {
//   zippedProps = zip(['a','b'], (a,b) => a + b);

//   @readStream('zippedProps'))
//   output = '';
// }