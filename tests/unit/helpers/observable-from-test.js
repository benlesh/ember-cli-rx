import Ember from 'ember';
import { observableFrom } from 'ember-cli-rxjs/helpers';
import { module, test} from 'qunit';

module('helpers/observable-from');

test('it should support array.[] observation', function(assert) {
  // Make sure array is applied.
  Ember.NativeArray.apply(Array.prototype);
	let done = assert.async();
	var expectedResults = [['wokka'], ['wokka', 'foo'], ['wokka', 'foo', 'bar']];

	var FooClass = Ember.Object.extend({
		stuff: [],
		names: observableFrom('stuff.[]'),
	});

	var foo = FooClass.create();
	var i = 0;

	foo.get('names').forEach(function(x) {
		assert.deepEqual(x, expectedResults[i++]);
		if(i === expectedResults.length) {
			done();
		}
	});

  foo.set('stuff', ['wokka']);
  foo.get('stuff').pushObject('foo');
  foo.get('stuff').pushObject('bar');
});

