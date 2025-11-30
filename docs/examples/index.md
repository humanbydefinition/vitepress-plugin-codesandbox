# Examples

Try clicking the "Open in CodeSandbox" button on any of these code blocks!

## Basic JavaScript

```javascript
// A simple DOM manipulation example
const app = document.createElement('div')
app.innerHTML = `
  <h1 style="font-family: system-ui; color: #333;">
    Hello from CodeSandbox! 
  </h1>
  <p style="font-family: system-ui; color: #666;">
    This code was opened directly from VitePress documentation.
  </p>
`
document.body.appendChild(app)
```

## Interactive Example

```javascript
// Create an interactive counter
const container = document.createElement('div')
container.style.cssText = `
  font-family: system-ui;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`

let count = 0

const display = document.createElement('h1')
display.textContent = count
display.style.fontSize = '4rem'

const button = document.createElement('button')
button.textContent = 'Click me!'
button.style.cssText = `
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  border: none;
  background: #3eaf7c;
  color: white;
  border-radius: 8px;
`

button.addEventListener('click', () => {
  count++
  display.textContent = count
})

container.appendChild(display)
container.appendChild(button)
document.body.appendChild(container)
```

## Canvas Animation

```javascript
// Simple canvas animation
const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 400
canvas.style.border = '1px solid #ccc'
document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')
let hue = 0

function draw() {
  ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
  
  const x = Math.random() * canvas.width
  const y = Math.random() * canvas.height
  const size = Math.random() * 30 + 5
  
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fill()
  
  hue = (hue + 1) % 360
  requestAnimationFrame(draw)
}

draw()
```

## TypeScript Support

TypeScript code blocks also get the button:

```typescript
interface User {
  name: string
  email: string
  age: number
}

function createUserCard(user: User): HTMLElement {
  const card = document.createElement('div')
  card.style.cssText = `
    font-family: system-ui;
    max-width: 300px;
    padding: 1.5rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  `
  
  card.innerHTML = `
    <h2 style="margin: 0 0 0.5rem 0;">${user.name}</h2>
    <p style="margin: 0.25rem 0; opacity: 0.9;">📧 ${user.email}</p>
    <p style="margin: 0.25rem 0; opacity: 0.9;">🎂 ${user.age} years old</p>
  `
  
  return card
}

const user: User = {
  name: 'Alice',
  email: 'alice@example.com', 
  age: 30
}

document.body.style.cssText = `
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
`

document.body.appendChild(createUserCard(user))
```

## Non-supported languages

Code blocks with other languages won't have the button:

```python
# This Python code won't have the button
def hello():
    print("Hello, World!")
```

```css
/* CSS blocks also don't have the button */
.example {
  color: red;
}
```
