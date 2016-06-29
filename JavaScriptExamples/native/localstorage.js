/*
 * Interface for multiple level localstorage
 *
 * Stores data in memory as _cache, writes
 * to localStorage on 'beforeunloead' event
 */

function MTSLocalStorage(localStorageKey) {
    var self = this;
    this._key = localStorageKey;
    var noWrite = false;
    // Set the localstorage field to an empty array if nothing's there
    if (typeof window.localStorage[this._key] === 'undefined') {
        window.localStorage[this._key] = JSON.stringify({});
    }
    // _cache is used over the lifetime of the window, then written to
    // window.localStorage when the page closes
    this._cache = JSON.parse(window.localStorage[this._key]);
    $(window).bind('beforeunload', function() {
        if (noWrite === false) {
            window.localStorage[self._key] = JSON.stringify(self._cache);
        } else {
            window.localStorage.clear();
        }
    });
    // Clear the localStorage if the user logs out
    $(document).ready(function() {
        $('#logoutLinkLocal').on('click', function() {
            this._cache = {};
            noWrite = true;
            window.localStorage.clear();
        });
    });
}

MTSLocalStorage.prototype.getObject = function(key) {
    return this._cache[key];
};

MTSLocalStorage.prototype.setObject = function(key, value) {
    this._cache[key] = value;
};

MTSLocalStorage.prototype.getAllObjects = function() {
    return this._cache;
};

MTSLocalStorage.prototype.setAllObjects = function(obj) {
    this._cache = obj;
};

MTSLocalStorage.prototype.inStorage = function(key) {
    return key in this._cache;
};

// Clear the localStorage if the user logs out
$(document).ready(function() {
    $('#logoutLinkLocal').on('click', function() {
        window.localStorage.clear();
    });
});
