import { computed } from "@ember/object";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import buildKey from "../utils/internal-key";

/**
  Creates a property that accepts Rx.Observables
  and returns a single observable that represents the latest observable
  passed.

  This can be used for any input to a component that is an observable.

  @method observable
  @return Ember.ComputedProperty
*/

export default function observable() {
  return computed({
    get(key) {
      let backingField = buildKey(key);
      if(!this[backingField]) {
        this[backingField] = new BehaviorSubject(Observable.empty());
      }
      return this[backingField]['switch']();
    },
    set(key, value) {
      var next = value && value instanceof Observable ? value : Observable.empty();
      let backingField = buildKey(key);
      this[backingField].onNext(next);
    }
  })
}
