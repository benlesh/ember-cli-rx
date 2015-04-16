import rxComponent from 'ember-cli-rx/helpers/component';

export default rxComponent((comp) => {
  var nums = comp.action('num').map(([n]) => ['append', n]);
  var propertyInput = comp.property('value', 0).map(p => ['set', p]);

  var clears = comp.action('clear').map('c');
  var adds = comp.action('add').map('+');
  var subs = comp.action('subtract').map('-');
  var mults = comp.action('multiply').map('*');
  var divs = comp.action('divide').map('/');
  var equals = comp.action('equals').map('=');

  var _clearState = false;

  var ops = Rx.Observable.merge(adds, subs, mults, divs, equals, clears);

  var entries = Rx.Observable.merge(propertyInput, nums, clears).startWith(['start']).
    scan(0, (state, [cmd, val]) => {
      if(_clearState) {
        _clearState = false;
        state = 0;
      }
      if(cmd === 'start' || cmd === 'clear') {
        state = 0;
      }
      else if(cmd === 'set') {
        state = parseFloat(val);
      }
      else if(cmd === 'append') {
        state = parseFloat('' + state + val);
      }
      return state;
    }).
    publish().refCount();


  var operations = ops.withLatestFrom(entries, (op, entry) => [op, entry]).merge(clears);

  var totals = operations.scan(null, (total, [op, value]) => {
    console.log(op, value, total);
    switch(op) {
      case '=':
        return total || 0;
      case 'c':
        return null;
      case '+':
        total = total === null ? 0 : total;
        return total + value;
      case '-':
        total = total === null ? 0 : total;
        return total - value;
      case '*':
        total = total === null ? 1 : total;
        return total * value;
      case '/':
        total = total === null ? 1 : total;
        return total / value;
    }
  }).
  do(total => console.log(total)).
  do(() => _clearState = true);

  var displayUpdates = entries.merge(totals).distinct();

  comp.update('display').when(displayUpdates);
});