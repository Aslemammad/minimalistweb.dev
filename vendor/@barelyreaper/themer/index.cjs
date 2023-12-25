'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var LOCALSTORAGE = 'themer';
var THEME_DATA_ATTR = 'data-theme';

function storage(key, value) {
  var ctx = this || {};

  if (ctx.get) {
    return localStorage.getItem(key);
  }

  return localStorage.setItem(key, value);
}

var setStore = storage.bind({
  get: false
});
var getStore = storage.bind({
  get: true
});

function setTheme(themeName) {
  document.body.setAttribute(THEME_DATA_ATTR, themeName);
  setStore(LOCALSTORAGE, getCurrentTheme());
}
function getTargetTheme() {
  return document.body.getAttribute(THEME_DATA_ATTR) || 'default';
}
function getCurrentTheme() {
  return getTargetTheme();
}

var windowDarkMedia = function windowDarkMedia() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
};

function isDark() {
  return windowDarkMedia().matches;
}

function schemeChangeListener(_ref) {
  var _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function (_ref2) {
    _ref2.theme;
  } : _ref$onChange;

  var handler = function handler(_) {
    var pref = getStore(LOCALSTORAGE);
    setTheme(pref || 'default');
    onChange && typeof onChange === 'function' && onChange({
      theme: getCurrentTheme()
    });
  };

  windowDarkMedia().addEventListener('change', handler);
  return function () {
    return windowDarkMedia().removeEventListener('change', handler);
  };
}

function init(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      _ref$lightPref = _ref.lightPref,
      lightPref = _ref$lightPref === void 0 ? 'light' : _ref$lightPref,
      _ref$darkPref = _ref.darkPref,
      darkPref = _ref$darkPref === void 0 ? 'dark' : _ref$darkPref;

  var pref = getStore(LOCALSTORAGE);
  var dark = isDark();

  if (!(pref && pref.length)) {
    if (dark) {
      setTheme(darkPref);
    } else {
      setTheme(lightPref);
    }
  } else {
    setTheme(pref);
  }

  return schemeChangeListener({
    onChange: onChange
  });
}

exports.getCurrentTheme = getCurrentTheme;
exports.init = init;
exports.setTheme = setTheme;
