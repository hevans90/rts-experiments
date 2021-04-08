# client

## Project setup

```
yarn
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Prod build (minification & other webpack goodness)

```
yarn build
```

### Deploy to GH Pages

```
yarn deploy
```

### Run your unit tests

```
yarn test:unit
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
