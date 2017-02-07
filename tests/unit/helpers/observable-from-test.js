import Ember from 'ember';
import { observableFrom } from 'ember-cli-rxjs/helpers';
import { module, test, start } from 'qunit';

module('helpers/observable-from');

function testObservableFromPropertyChanges(useComputedProperty, assert) {
	stop();
	var expectedResults = ['Ben', 'Jeff', 'Ranjit'];

	var FooClass = Ember.Object.extend({
		name: null,
    nameAlias: Ember.computed.alias("name"),
    names: observableFrom(useComputedProperty ? 'nameAlias' : 'name'),
	});

	var foo = FooClass.create();
	var i = 0;

	foo.get('names').forEach(function(x) {
		assert.equal(x, expectedResults[i++]);
		if(i === expectedResults.length) {
			start();
		}
	});

	foo.set('name', 'Ben');
	foo.set('name', 'Jeff');
	foo.set('name', 'Ranjit');
}

test('it should observe property changes and emit them via an observable (normal properties)', function(assert) {
  testObservableFromPropertyChanges(false, assert);
});

test('it should observe property changes and emit them via an observable (computed properties)', function(assert) {
  testObservableFromPropertyChanges(true, assert);
});

test('it should support array.[] observation', function(assert) {
	stop();
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
			start();
		}
	});

	foo.set('stuff', ['wokka']);
	foo.get('stuff').pushObject('foo');
	foo.get('stuff').pushObject('bar');
});

