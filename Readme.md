# inline-image

Intended as a postprocessor for node-sass to resolve and add inline-image-commands.
resolves the commands `inline-image(url)`, `image-width(url)`, `image-height(url)`

## Usage
```js
var inlineImage = require('inline-image');
var fs = require('fs');

var file = 'css/style.css';
var imagePath = './images';

fs.writeFileSync(
	file, 
	inlineImage(
		fs.readFileSync(file), 
		imagePath
	)
)
```
##Options

### css
Type: `string` or `Buffer`

The css to parse

### imagePath
Type: `string`
Default: './'

Relative Image paths in the `css`-string get resolved relative to this path.
