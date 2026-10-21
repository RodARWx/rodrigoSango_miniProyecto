/**
 * ==============================================================================
 * END-TO-END REGRESSION & CROSS-MODULE VERIFICATION SUITE (WEB-15)
 * ==============================================================================
 * Validates full system integrity across all extracted ES modules,
 * controllers, persistence, rate limiting, and chained API joins.
 * ==============================================================================
 */

import { pathToFileURL } from 'url';
import { resolve } from 'path';

const projectRoot = 'c:/Users/braya/Documents/Septimo/Programción Web/miniproyecto_plan_b/miniproyecto_rick_morty';

console.log('═══════════════════════════════════════════════════════════════');
console.log('🚀 RUNNING COMPREHENSIVE SPRINT 2 REGRESSION TEST SUITE (WEB-15)');
console.log('═══════════════════════════════════════════════════════════════\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
    totalTests++;
    if (!condition) {
        console.error(`❌ FAIL: ${testName}`);
        throw new Error(`Assertion failed: ${testName}`);
    }
    passedTests++;
    console.log(`  ✔ PASS: ${testName}`);
}

// ==============================================================================
// SUITE 1: FUNCTIONAL UTILITIES & RATE LIMITERS (js/utils/throttle.js)
// ==============================================================================
console.log('📦 SUITE 1: Functional Utilities (throttle.js)');

const { throttleLeading, throttle, debounce } = await import(
    pathToFileURL(resolve(projectRoot, 'js/utils/throttle.js')).href
);

// Test throttleLeading
let executionCount = 0;
const throttledAction = throttleLeading(() => { executionCount++; }, 150);
throttledAction();
throttledAction(); // blocked
throttledAction(); // blocked
assert(executionCount === 1, 'throttleLeading immediately executes first call and blocks bursts within cooldown');

await new Promise(r => setTimeout(r, 160));
throttledAction(); // allowed after cooldown
assert(executionCount === 2, 'throttleLeading allows next execution once cooldown expires');

// Test debounce
let debouncedValue = '';
const debouncedInput = debounce((val) => { debouncedValue = val; }, 100);
debouncedInput('a');
debouncedInput('ab');
debouncedInput('abc');
assert(debouncedValue === '', 'debounce postpones execution during rapid typing burst');

await new Promise(r => setTimeout(r, 120));
assert(debouncedValue === 'abc', 'debounce executes callback with latest argument after delay');

debouncedInput('cancelled');
debouncedInput.cancel();
await new Promise(r => setTimeout(r, 120));
assert(debouncedValue === 'abc', 'debounce .cancel() clears pending invocation');

// ==============================================================================
// SUITE 2: STORAGE SERVICE & NORMALIZATION (js/storage/favoritesStorage.js)
// ==============================================================================
console.log('\n📦 SUITE 2: Persistence & Storage Service (favoritesStorage.js)');

// Mock localStorage for node environment
let mockStore = {};
globalThis.window = {
    localStorage: {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => { mockStore[k] = String(v); },
        removeItem: (k) => { delete mockStore[k]; },
        clear: () => { mockStore = {}; }
    }
};

const {
    getFavorites,
    saveFavorites,
    toggleFavorite,
    isFavorite,
    getFavoriteIds,
    normalizeFavoriteCharacter,
    clearFavorites
} = await import(
    pathToFileURL(resolve(projectRoot, 'js/storage/favoritesStorage.js')).href
);

clearFavorites();
assert(getFavorites().length === 0, 'clearFavorites empties the collection');

const rawApiChar = {
    id: 101,
    name: 'Commander Rick',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://rickandmortyapi.com/api/character/avatar/101.jpeg',
    origin: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' }
};

const normalized = normalizeFavoriteCharacter(rawApiChar);
assert(normalized.nombre === 'Commander Rick' && normalized.name === 'Commander Rick', 'Normalizes both nombre and name properties');
assert(normalized.origen === 'Citadel of Ricks', 'Correctly resolves nested origin name');
assert(typeof normalized.fechaGuardado === 'string', 'Injects ISO timestamp on bookmarking');

const addRes = toggleFavorite(rawApiChar);
assert(addRes.isFavorite === true, 'toggleFavorite adds character when absent');
assert(isFavorite(101) === true, 'isFavorite returns true for bookmarked ID');
assert(getFavoriteIds().has(101), 'getFavoriteIds Set contains ID for O(1) checks');

const removeRes = toggleFavorite(rawApiChar);
assert(removeRes.isFavorite === false, 'toggleFavorite removes character when already present');
assert(isFavorite(101) === false, 'isFavorite returns false after removal');

// ==============================================================================
// SUITE 3: HTTP API CLIENT (js/api/rickMortyApi.js)
// ==============================================================================
console.log('\n📦 SUITE 3: HTTP API Client (rickMortyApi.js)');

const {
    getCharacters,
    getCharacterById,
    getLocation,
    getEpisodes,
    extractIdFromUrl
} = await import(
    pathToFileURL(resolve(projectRoot, 'js/api/rickMortyApi.js')).href
);

assert(extractIdFromUrl('https://rickandmortyapi.com/api/episode/15') === '15', 'extractIdFromUrl extracts numeric trailing ID');
assert(extractIdFromUrl('https://rickandmortyapi.com/api/location/3') === '3', 'extractIdFromUrl handles location URLs');

console.log('  📡 Executing live API connectivity tests...');
const liveCatalog = await getCharacters({ page: 1, name: 'Morty', status: 'alive' });
assert(Array.isArray(liveCatalog.results) && liveCatalog.results.length > 0, 'getCharacters retrieves filtered results');
assert(liveCatalog.info.pages > 0, 'getCharacters returns pagination metadata');

const emptyCatalog = await getCharacters({ name: 'XYZ_IMPOSSIBLE_NAME_NON_EXISTENT_99999' });
assert(emptyCatalog.results.length === 0 && emptyCatalog.info.count === 0, 'Normalizes API 404 into empty catalog response');

const singleChar = await getCharacterById(2);
assert(singleChar.name === 'Morty Smith', 'getCharacterById fetches individual character details');

const loc = await getLocation('https://rickandmortyapi.com/api/location/1');
assert(loc.name === 'Earth (C-137)', 'getLocation resolves full location URL');

const episodes = await getEpisodes(['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2']);
assert(Array.isArray(episodes) && episodes.length === 2, 'getEpisodes performs batch join and returns array');

// ==============================================================================
// SUITE 4: UI PRESENTATION RENDERERS (js/ui/renderers.js)
// ==============================================================================
console.log('\n📦 SUITE 4: UI Renderers (renderers.js)');

const {
    formatStatus,
    formatGender,
    createCharacterCardHtml,
    renderPaginationControls,
    renderEmptyState,
    renderErrorState,
    renderEpisodeItemHtml,
    renderCharacterProfile
} = await import(
    pathToFileURL(resolve(projectRoot, 'js/ui/renderers.js')).href
);

assert(formatStatus('alive').cssClass === 'estado-alive', 'formatStatus handles alive state');
assert(formatStatus('dead').cssClass === 'estado-dead', 'formatStatus handles dead state');
assert(formatStatus('unknown').cssClass === 'estado-unknown', 'formatStatus handles unknown state');

assert(formatGender('female') === 'Female', 'formatGender translates female');
assert(formatGender('male') === 'Male', 'formatGender translates male');
assert(formatGender('genderless') === 'Genderless', 'formatGender translates genderless');

const cardHtml = createCharacterCardHtml(rawApiChar, true);
assert(cardHtml.includes('es-favorito') && cardHtml.includes('★'), 'Card markup reflects favorite bookmark state');
assert(cardHtml.includes('Commander Rick'), 'Card markup contains sanitized name');

const pageState = renderPaginationControls(1, 10, 200);
assert(pageState.prevDisabled === true && pageState.nextDisabled === false, 'Page 1 boundary disables anterior button');
const lastPageState = renderPaginationControls(10, 10, 200);
assert(lastPageState.prevDisabled === false && lastPageState.nextDisabled === true, 'Last page boundary disables siguiente button');

const emptyHtml = renderEmptyState('No items', { actionButtonText: 'Reset' });
assert(emptyHtml.includes('No items') && emptyHtml.includes('Reset'), 'renderEmptyState builds placeholder with action');

const errorHtml = renderErrorState('Network timeout', 'index.html');
assert(errorHtml.includes('Network timeout') && errorHtml.includes('index.html'), 'renderErrorState builds back-link markup');

const epHtml = renderEpisodeItemHtml({ episode: 'S01E01', name: 'Pilot', air_date: 'Dec 2, 2013' });
assert(epHtml.includes('S01E01') && epHtml.includes('Pilot'), 'renderEpisodeItemHtml builds episode badge markup');

const profile = renderCharacterProfile(rawApiChar, loc, episodes);
assert(profile.character.name === 'Commander Rick', 'renderCharacterProfile maps character specs');
assert(profile.location.name === 'Earth (C-137)', 'renderCharacterProfile maps location specs');
assert(profile.episodes.length === 2, 'renderCharacterProfile maps episode badges');

// ==============================================================================
// SUITE 5: TOAST NOTIFICATIONS (js/ui/toast.js)
// ==============================================================================
console.log('\n📦 SUITE 5: Toast Notifications (toast.js)');

class MockHtmlElement {
    constructor(id = '', tag = 'div') {
        this.id = id;
        this.tagName = tag;
        this.className = '';
        this.children = [];
        this.attributes = {};
        this.style = {};
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    appendChild(c) { this.children.push(c); c.parentNode = this; }
    remove() {
        if (this.parentNode) {
            this.parentNode.children = this.parentNode.children.filter(x => x !== this);
        }
    }
    set textContent(t) { this._text = t; }
    get textContent() { return this._text; }
}

globalThis.document = {
    getElementById: (id) => (id === 'toast-contenedor' ? null : null),
    createElement: (tag) => new MockHtmlElement('', tag),
    body: new MockHtmlElement('body')
};

const { showToast, showSuccess, showError, showWarning } = await import(
    pathToFileURL(resolve(projectRoot, 'js/ui/toast.js')).href
);

const toastSuccess = showSuccess('Saved!');
assert(toastSuccess.className.includes('exito'), 'showSuccess applies .exito class');

const toastError = showError('Failed!');
assert(toastError.className.includes('error'), 'showError applies .error class');

const toastWarning = showWarning('Alert!');
assert(toastWarning.className.includes('warning'), 'showWarning applies .warning class');

// ==============================================================================
// SUMMARY
// ==============================================================================
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY! (0 REGRESSIONS)`);
console.log('═══════════════════════════════════════════════════════════════\n');
