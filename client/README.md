# client

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Jest Snippets

```javascript
{
	"describe": {
		"scope": "javascript,typescript",
		"prefix": "jd",
		"body": [
			"describe('${1:hit me}', () => {",
			"  ${2:// baby}",
			"});"
		],
		"description": "oooooooh"
	},
	"it": {
		"scope": "javascript,typescript",
		"prefix": "jit",
		"body": [
			"it('${1:one more}', () => {",
			"  ${2:// time}",
			"});"
		],
		"description": "oooooooh"
	},
	"jj": {
		"scope": "javascript,typescript",
		"prefix": "jj",
		"body": [
			"describe('${1:hit me}', () => {",
			"  it('${2:one more}', () => {",
			"    ${3:// time}",
			"  });",
			"});",
		],
		"description": "c-c-combo"
	},
}

```
