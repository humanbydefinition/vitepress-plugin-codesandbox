# Custom Scripts Example

Load external libraries into your sandbox by configuring `scripts`.

## Configuration

```typescript
// .vitepress/theme/index.ts
useCodeSandbox({
  scripts: [
    'https://unpkg.com/lodash@4.17.21/lodash.min.js',
  ],
})
```

## Usage

With the configuration above, you can use Lodash in your code blocks:

```javascript
// Lodash is available as `_`
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
]

const sorted = _.sortBy(users, 'age')
const names = _.map(sorted, 'name')

document.body.innerHTML = `
  <h2>Users sorted by age:</h2>
  <ul>
    ${names.map(name => `<li>${name}</li>`).join('')}
  </ul>
`
```

## Multiple Scripts

You can load multiple libraries:

```typescript
useCodeSandbox({
  scripts: [
    'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js',
    'https://unpkg.com/three@0.160.0/build/three.min.js',
  ],
})
```

::: tip
Scripts are loaded in the order they are specified. Put dependencies first!
:::
