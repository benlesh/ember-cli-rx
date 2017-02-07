import Ember from 'ember';
import { action, observable } from 'ember-cli-rxjs/helpers';
import { module, test } from 'qunit';

module('helpers/action');

var run = Ember.run;

test('it should create an observable of action arguments', function(assert){
  var done = assert.async();
	var expectedResults = [
		[1,2,3],
		['foo', 'bar', 'baz'],
		['Ocelot', 'buyer\'s', 'remorse']
	];

	var FooController = Ember.Controller.extend({
		doSomethings: observable(),
		actions: {
			doSomething: action('doSomethings')
		}
	});

	var ctrl = FooController.create({});
	var i = 0;

	ctrl.get('doSomethings').forEach((args) => {
		assert.deepEqual(args, expectedResults[i++]);
		if(i === expectedResults.length) {
      done();
		}
  });

  run(ctrl, 'send', 'doSomething', 1, 2, 3);
  run(ctrl, 'send', 'doSomething', 'foo', 'bar', 'baz');
  run(ctrl, 'send', 'doSomething', 'Ocelot', 'buyer\'s', 'remorse');
});
