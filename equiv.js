'use strict';

module.exports = equiv;

function equiv(substitute) {
	if (typeof substitute === 'function' && arguments.length === 1) {
		// curry
		return function(a, b) {
			return equivalent(a, b, substitute);
		};
	}
	return equivalent.apply(this, arguments);
}

function equivalent(a, b, substitute = defaultSubstitute) {
	if (a === b) {
		return true;
	}
	const substitutedA = substitute(a);
	const substitutedB = substitute(b);
	if (substitutedA === substitutedB) {
		return true;
	}
	if (Array.isArray(substitutedA) && Array.isArray(substitutedB)) {
		return arrayEquivalent(substitutedA, substitutedB);
	}
	if (
		substitutedA !== null &&
		substitutedB !== null &&
		typeof substitutedA === 'object' &&
		typeof substitutedB === 'object'
	) {
		return objectEquivalent(substitutedA, substitutedB);
	}
	return false;
}

function arrayEquivalent(a, b) {
	if (a.length !== b.length) {
		return false;
	}
	const len = a.length;
	for (let i = 0; i < len; i += 1) {
		if (!equivalent(a[i], b[i])) {
			return false;
		}
	}
	return true;
}

function objectEquivalent(a, b) {
	const keys = Object.keys(a);
	const len = keys.length;
	if (len !== Object.keys(b).length) {
		return false;
	}
	for (let i = 0; i < len; i += 1) {
		if (!equivalent(a[keys[i]], b[keys[i]])) {
			return false;
		}
	}
	return true;
}

function defaultSubstitute(a) {
	// NaN check
	if (a !== a) {
		return a;
	}
	if (a === void 0) return 'undefined';
	if (a === null) return 'null';
	if (typeof a === 'object') {
		return a;
	}
	return a.toString();
}
