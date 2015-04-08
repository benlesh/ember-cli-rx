import rxComponent from 'ember-cli-rx/helpers/component';

export default rxComponent((comp) => {
  var i = 0;
  comp.update('output').when(comp.$('button').on('click').map(() => i++));
});