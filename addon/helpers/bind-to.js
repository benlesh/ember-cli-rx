/* globals Ember */
import emberActionScheduler from '../schedulers/ember-action-scheduler';

/**
  @method bindTo
  @param sourcePropName {String} the name of the property containing the Observable to bind this
    property to.
  @return {Ember.ComputedProperty}
*/
export default function bindTo(sourcePropName) {
  return Ember.computed(sourcePropName, function(key, value) {
    var self = this;
    var backingPropName = '_' + key;
    var subscribedTo = backingPropName + '_observable';
    var observable = this.get(sourcePropName);

    if(!this._bindToSubscriptions) {
      this._bindToSubscriptions = new Rx.CompositeDisposable();
      this.on('willDestroy', this, function(){
        this._bindToSubscriptions.dispose();
      });
    }

    if(this[subscribedTo] !== observable){
      this[subscribedTo] = observable;
      var backingDisposable = backingPropName + '_disposable';
      var disposable = this[backingDisposable];

      if(!disposable) {
        disposable = this[backingDisposable] = new Rx.SerialDisposable();
        this._bindToSubscriptions.add(disposable);
      }

      disposable.setDisposable(observable.observeOn(emberActionScheduler(self)).subscribe(function(nextValue) {
        self.set(key, nextValue);
      }, function(err) {
        Ember.Logger.error('Error binding property: %o', err);
        self.set(key, undefined);
      }));
    }

    if(arguments.length > 1) {
      this[backingPropName] = value;
    }

    return this[backingPropName];
  });
}