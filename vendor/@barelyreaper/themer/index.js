const LOCALSTORAGE = 'themer';
const THEME_DATA_ATTR = 'data-theme';

function storage(key, value) {
    const ctx = this || {};
    if (ctx.get) {
        return localStorage.getItem(key);
    }
    return localStorage.setItem(key, value);
}
const setStore = storage.bind({ get: false });
const getStore = storage.bind({ get: true });

function setTheme(themeName) {
    document.body.setAttribute(THEME_DATA_ATTR, themeName);
    setStore(LOCALSTORAGE, getCurrentTheme());
}
function getTargetTheme() {
    return document.body.getAttribute(THEME_DATA_ATTR) || 'default';
}
/**
 *
 * @description get the current theme based on current
 * active theme and system preference
 */
function getCurrentTheme() {
    return getTargetTheme();
}

const windowDarkMedia = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

function isDark() {
    return windowDarkMedia().matches;
}

function schemeChangeListener({ onChange = ({ theme = '' }) => { } }) {
    const handler = _ => {
        const pref = getStore(LOCALSTORAGE);
        setTheme(pref || 'default');
        onChange &&
            typeof onChange === 'function' &&
            onChange({ theme: getCurrentTheme() });
    };
    windowDarkMedia().addEventListener('change', handler);
    return () => {
        return windowDarkMedia().removeEventListener('change', handler);
    };
}

/**
 * @description to be run as soon as possible, maybe in your entry point file
 * so the Themer can setup the needed listeners for theme changes
 * @returns a function to cleanup the listeners
 */
function init({ onChange = () => { }, lightPref = 'light', darkPref = 'dark', } = {}) {
    const pref = getStore(LOCALSTORAGE);
    // Browser is in dark mode
    const dark = isDark();
    if (!(pref && pref.length)) {
        if (dark) {
            setTheme(darkPref);
        }
        else {
            setTheme(lightPref);
        }
    }
    else {
        setTheme(pref);
    }
    return schemeChangeListener({ onChange: onChange });
}

export { getCurrentTheme, init, setTheme };
