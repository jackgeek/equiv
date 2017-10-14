const { expect } = require('chai');
const equiv = require('../equiv');

const equivalentPairs = [
	[null, null],
	[null, 'null'],
	[undefined, undefined],
	[undefined, 'undefined'],
	[1, 1],
	[true, true],
	[false, false],
	[true, 'true'],
	[false, 'false'],
	['foo', 'foo'],
	[[1, 2, 3], ['1', '2', '3']],
	[{ a: 1, b: 2 }, { a: '1', b: '2' }],
	[{ a: [1, 2, 3] }, { a: ['1', '2', '3'] }],
	[{ a: [{ a: 1 }] }, { a: [{ a: '1' }] }],
];

function perms(values) {
	const result = [];
	const len = values.length;
	for (let i = 0; i < len; i += 1) {
		for (let o = i + 1; o < len; o += 1) {
			result.push([values[i], values[o]]);
		}
	}
	return result;
}
const nonEquivalentPairs = [
	[NaN, NaN],
	[{ a: 1, b: 2, c: 3 }, { a: 1, b: 2 }],
	[{ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }],
].concat(perms([null, undefined, 0, false, true, NaN, 'foo', { a: 1, b: 2 }, [1, 2, 3]]));

describe('equiv', () => {
	equivalentPairs.forEach(pair => {
		const [a, b] = pair;
		it(`should find ${toString(a)} equiv to ${toString(b)}`, () => {
			expect(equiv(a, b)).to.be.true;
		});
	});

	nonEquivalentPairs.forEach(pair => {
		const [a, b] = pair;
		it(`should find ${toString(a)} not equiv to ${toString(b)}`, () => {
			expect(equiv(a, b)).to.be.false;
		});
	});

	it('should accept a substitute function as the third parameter which substitutes before for comparison', () => {
		const substitutedValues = [];
		function substitute(value) {
			substitutedValues.push(value);
			return 'foo';
		}
		expect(equiv('bar', 'foo', substitute)).to.be.true;
		expect(substitutedValues).to.deep.equal(['bar', 'foo']);
	});

	it('should allow currying the substitute function', () => {
		const substitutedValues = [];
		function substitute(value) {
			substitutedValues.push(value);
			return 'foo';
		}
		const curried = equiv(substitute);
		expect(curried('bar', 'foo')).to.be.true;
		expect(substitutedValues).to.deep.equal(['bar', 'foo']);
	});
});

function toString(a) {
	if (a !== a) {
		return 'NaN';
	}
	return JSON.stringify(a);
}
