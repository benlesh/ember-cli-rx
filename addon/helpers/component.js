/* globals Ember */

/*
weird, crappy example
export default component({ tagName: 'ul' }, (component) => {
  component.set('bar').when(component.property('foo').map(x => x + '!!!'));

  component.send('barClickAction').when(component.action('barClicked').map((bar) => bar + Date.now()));

  component.trigger('didBarClick').when(component.action('barClicked'));

  component.update('buttonClicks').when(component.$('button').on('click').map(() => 'clickie click'));
});
*/

/*
the component template
<div {{action "barClicked" bar}}>{{bar}}</div>
*/

/*
the component usage
  {{my-comp barClickAction="barWasClicked" foo=val}}
*/

export default function component(mixins, setupFn) {
  if(arguments.length === 1) {
    setupFn = mixins;
    mixins = [];
  }

  var args = mixins.concat([{
    didInsertElement: function() {
      var rxContext = new RxComponentContext(this);
      this._disposable = new Rx.CompositeDisposable();
      setupFn(rxContext);
    },

    willDestroyElement: function(){
      if(this._disposable) {
        this._disposable.dispose();
      }
    }
  }]);

  return Ember.Component.extend.apply(Ember.Component, args);
}

function RxComponentContext (instance) {
  this.instance = instance;
  this.instance._rxActions = {};
}

RxComponentContext.prototype = Object.create(Object.prototype);
RxComponentContext.prototype.constructor = RxComponentContext;

Ember.mixin(RxComponentContext.prototype, {
  $: function (selector) {
    var self = this;
    return {
      on: function (eventName) { return Rx.Observable.fromEvent(self.instance.$(selector), eventName); }
    };
  },

  property: function (name, defaultValue) {
    var privateKey = '_' + name;
    var observableKey = privateKey + '_property_observable';
    if(!this.instance[observableKey]) {
      this.instance[privateKey] = defaultValue;
      this.instance[observableKey] = new Rx.BehaviorSubject(defaultValue);
      Ember.defineProperty(this.instance, name, Ember.computed({
        get: function () { return this[privateKey]; },
        set: function (val) { this[privateKey] = val; this[observableKey].onNext(val); }
      }));
    }
    return this.instance[observableKey];
  },

  send: function (name) {
    var self = this;
    return {
      when: function (observable) {
        self.instance._disposable.add(observable.subscribe(function (x) {
          self.instance.sendAction(name, x);
        }));
      }
    };
  },

  trigger: function (name) {
    var self = this;
    return {
      when: function (observable) {
        self.instance._disposable.add(observable.subscribe(function (x) {
          self.instance.trigger(name, x);
        }));
      }
    };
  },

  update: function (name) {
    var self = this;
    return {
      when: function (observable) {
        self.instance._disposable.add(observable.subscribe(function (x) {
          self.instance.set(name, x);
        }));
      }
    };
  },

  action: function (name) {
    if(!this.instance._rxActions[name]) {
      var subject = new Rx.Subject();
      this.instance._actions[name] = function() {
        var args = [].slice.call(arguments);
        subject.onNext(args);
      };
      this.instance._rxActions[name] = subject;
      this.instance._disposable.add(subject);
    }
    return this.instance._rxActions[name];
  }
});