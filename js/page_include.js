/** 
 * Include on static page to enable translations.
 *
 * Loads only necessary dict files.
 * 
 */

/**
 * @module Language
 * @desc
 * Language Translation Module used to process text and covert a string based on user defined language.
 * Language can be defined by Client's browser or API
 * @requires module:utils
 */
var Language =  {

    /**
     * @name module:Language#getLocale
     * @return {string} Defined ISO 639-1 Language Codes
     * @see https://www.w3schools.com/tags/ref_language_codes.asp
     * @example
     * en-us
     */
    getLocale: function() {
        var locale = window.navigator.userLanguage || window.navigator.language;

        // Get short locale for remapping purposes
        var short_locale = Language.getShortLocale(locale);

        // Remap known locales
        if (short_locale === "in") {
            short_locale = "id";
        }
        if (short_locale === "he") {
            short_locale = "iw";
        }
        if (short_locale === "nb") {
            short_locale = "no";
        }

        // need multiple versions for Chinese
        if (locale.includes("zh-CN")) {
            short_locale = locale;
        }

        return short_locale;
    },


    /**
     * @name module:Language#getShortLocale
     * @return {string} Restricts the ISO 639-1 Language Code to two chracters
     * @example
     * en-us > en
     */
    getShortLocale: function(locale) {
        return locale.substring(0, 2);
    }

};

var browser_lang = Language.getLocale();
var tr_root = 'https://assets.hcaptcha.com/website-tr/'
var tr_path = tr_root + browser_lang + '.json';

if (browser_lang !== "en") {
        // load correct lang JSON
        var element = document.createElement("script");
        element.src = tr_path;
        element.setAttribute("type", "application/json");
        element.setAttribute("data-vavilon-dict", browser_lang);
        document.body.appendChild(element);

        // load vavilon JS
        var element2 = document.createElement("script");
        element2.src = "https://assets.hcaptcha.com/website-tr-js/vavilon.min.js";
        document.body.appendChild(element2);

        // probably unnecessary
        setTimeout(function() {
            setLang(browser_lang)
        }, 750);
};

// only required if el exists
document.getElementById("switch-to-english").href = "javascript:setLang('en');";
