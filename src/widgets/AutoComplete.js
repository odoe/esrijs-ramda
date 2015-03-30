import declare from 'dojo/_base/declare';
import on from 'dojo/on';
import { add, remove } from 'dojo/dom-class';
import _WidgetBase from 'dijit/_WidgetBase';
import _TemplatedMixin from 'dijit/_TemplatedMixin';
import { create } from 'dojo/dom-construct';
import { graphicsExtent } from 'esri/graphicsUtils';
import templateString from 'dojo/text!./templates/AutoComplete.html'

import {
  compose,
  curry,
  prop,
  filter,
  map,
  eq,
  take,
  last,
  sortBy
} from 'ramda';

var isValid = (a, b) => a.indexOf(b) > -1;
var getName = prop('NAME');
var getProps = prop('attributes');
var getPropName = compose(getName, getProps);
var upper = s => s.toUpperCase();
var filtername = name => filter(x => eq(upper(getPropName(x)), upper(name)));
var fuzzyname = name => filter(x => isValid(upper(getName(x)), upper(name)));
var getfuzzyname = name => compose(fuzzyname(name), map(getProps));

var makeListItem = x => {
  var a = create('a', {
    className: 'list-group-item',
    href: '',
    innerHTML: getName(x),
    'data-result-name': getName(x)
  });
  return a;
};

export default declare([_WidgetBase, _TemplatedMixin], {
  templateString,

  postCreate() {
    var layer = this.get('layer');
    on.once(layer, 'update-end', this.onLoaded.bind(this))
  },

  onLoaded(e) {
    this.set('features', e.target.graphics);
  },

  onKeyDown(e) {
    console.debug('keycode', e);
    switch(e.keyCode) {
      case 38: //up
        this.select(1);
        console.debug('key up', e);
        break;
      case 40: //down
        this.select(-1);
        console.debug('key down', e);
        break;
      default:
        console.debug('key default');
    }
  },

  onKeyUp(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      this.onKeyDown(e);
    } else {
      this.results.innerHTML = '';
      if (this.input.value.length > 2) {
        var results = getfuzzyname(this.input.value)(this.get('features'));
        this.resultElems = compose(map(x => {
          this.results.appendChild(x);
          this.own(on(x, 'click', this.itemSelected.bind(this)));
          return x;
        }), map(makeListItem), take(10))(results);
        this._count = -1;
      }
    }
  },

  select(i) {
    this._count = this._count - i;
    if (this._count < 0) this._count = this.resultElems.length - 1;
    if (this._count > this.resultElems.length - 1) this._count = 0;
    if (this._selection) {
      remove(this._selection, 'active');
      this._selection = this.resultElems[this._count];
    }
    if (!this._selection) {
      this._selection = this.resultElems[this._count];
      add(this._selection, 'active');
    }
    if (this._selection) {
      add(this._selection, 'active');
    }
  },

  resultSelected() {
    var elem = this._selection;
    var value = elem.innerHTML;
    this.results.innerHTML = '';
    this.input.value = elem.getAttribute('data-result-name');
    this._selection = null;
    this.find();
  },

  itemSelected(e) {
    if (e) e.preventDefault();
    var elem = e.target;
    var value = elem.innerHTML;
    this.input.value = elem.getAttribute('data-result-name');
    var result = filtername(this.input.value)(this.get('features'));
    var data = result.shift();
    if (data) {
      this.get('map').setExtent(graphicsExtent([data]))
    }
    this.results.innerHTML = '';
  },

  find(e) {
    if (e) e.preventDefault();
    if (this._selection) {
      this.resultSelected(e);
    } else {
      var data = last(filtername(this.input.value)(this.get('features')));
      if (data) {
        this.get('map').setExtent(graphicsExtent([data]))
      }
    }
  },
});
