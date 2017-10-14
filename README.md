# equiv

A small JavaScript utility for comparing two javascript values by value.

# Installation

via npm
```sh
$ npm install equiv --save
```

# Usage
```javascript
equiv(valueA, valueB, [substituteFunc])
```

# Examples
```javascript
equiv(16384, '16384') // true
equiv(false, 'false') // true
equiv(null, 'null') // true
equiv(undefined, 'undefined') // true
equiv(NaN, NaN) // false
equiv([1, 2, 3], ['1', '2', '3']) // true
equiv({ a: 1, b: 2 }, { b: 2, a: 1 }) // true
equiv({ a: [ { b: 1 } ] }, { a: [ { b: '1' } ] }) // true
```

# Substitute function

A function may be provided to modify values before they are compared.  The function receives the value as the first parameter and must return the substituted value.

The default substitute function converts all primitives to strings with the exception of NaN which it leaves as is.

```javascript
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
```

# Substitute example

```javascript
equiv('foo', 'bar', () => 'foo') // true
equiv(true, 'true', (value) => typeof value !== 'string' ? value.toString() : value) // true
```

# Currying the substitute function

The substitute function may be curried by passing it to equiv as the first and only parameter

```javascript
const stringEquiv = equiv((value) => typeof value !== 'string' ? value.toString() : value);
stringEquiv(null, 'null'); // true
```

# License
MIT
