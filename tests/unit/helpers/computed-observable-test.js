import Ember from 'ember';
import { computedObservable } from 'ember-rxjs/helpers';
import { module, test } from 'qunit';

module('helpers/computed-observable');

test('it should create an observable mapped from a stream of dependency changes', function(assert){
  let done = assert.async();

	var FooClass = Ember.Object.extend({
		testStream: computedObservable(function(deps) {
			return deps.map(function(d) {
				return d.foo + d.bar;
			});
		}, 'foo', 'bar'),

		foo: 'foo',

		bar: 'bar'
	});

	var foo = FooClass.create();
	var i = 0;
	var expectedResults = ['foobar', 'whatever'];

	foo.get('testStream').forEach(function(d) {
		assert.equal(d, expectedResults[i++]);

		if(i === expectedResults.length) {
			done();
		}
	});

	Ember.run(function(){
		foo.set('foo', 'what');
		foo.set('bar', 'ever');
	});
});


test('it should handle property names with .[] in them', function(assert){
	var done = assert.async();

	var FooClass = Ember.Object.extend({
		testStream: computedObservable(function(deps) {
			return deps.map(function(d) {
				return d.foo.join(',') + ',' +  d.bar;
			});
		}, 'foo.[]', 'bar'),

		foo: ['foo'],

		bar: 'bar'
	});

	var foo = FooClass.create();
	var i = 0;
	var expectedResults = ['foo,bar', 'foo,what,ever'];

	foo.get('testStream').forEach(function(d) {
		assert.equal(d, expectedResults[i++]);
		if(i === expectedResults.length) {
			done();
		}
	});

	Ember.run(function(){
		foo.get('foo').push('what');
		foo.set('bar', 'ever');
	});
});
