import Ember from 'ember';
import { module, test } from 'qunit';
import Rx from "rxjs";

import { bindTo } from 'ember-cli-rxjs/helpers';

module('helpers/bind-to');
// TODO: should use regular component test.
/*
test('it should bind to an observable in the specified property', function(assert){
  var subject = new Rx.Subject();

  var FooClass = Ember.Component.extend(Ember.Evented, {
    things: Ember.computed({
      get() {
        return subject;
      }
    }),

    thing: bindTo('things'),
  });

  var foo;
  var thing;

  Ember.run(function(){
    foo = FooClass.create();
    thing = foo.get('thing');
  });

  assert.equal(thing, undefined, 'property starts undefined');

  Ember.run(function() {
    subject.onNext('something');
    thing = foo.get('thing');
    assert.equal(thing, undefined, 'immediately after observable emits, the property should not update until actions queue is processed');
  });

  Ember.run(function() {
    thing = foo.get('thing');
    assert.equal(thing, 'something', 'previous actions queue has processed so property has updated');
  });

  assert.equal(typeof foo._thing_disposable, 'object', 'expect a disposable to be tracked on a private property');

  assert.equal(typeof foo._bindToDisposables, 'object', 'expect a composite disposable to have been registered');

  Ember.run(function(){
    foo.trigger('willDestroyElement');
  });

  assert.equal(foo._thing_disposable.isDisposed, true, 'expect disposal');
});
*/
test('it should assert components only', function(assert){
  var FooClass = Ember.Object.extend({
    something: Rx.Observable.return(42),
    whatever: bindTo('something')
  });

  assert.throws(function(){
    Ember.run(function(){
      var foo = FooClass.create();
      foo.get('whatever');
    });
  }, 'Assertion Failed: Must be applied to components only');
});
