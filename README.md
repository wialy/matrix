# Matrix

A demo application showing `Matrix` React component to edit grid-organized data and export to `CSV`.

## [Live demo 🐇](http://test13378.futurehost.pl/matrix/index.html)

## Usage

```javascript
import Matrix, { MatrixMode } from 'matrix'
...
<Matrix
  rows={[50, 100]}
  columns={[50, 100]}
  values={[['50x50', '50x100'], ['100x50', '100x100']]}
  onChange={handleMatrixChange}
  gridSize={50}
  mode={MatrixMode.data}
/>
```

## Development

Install dependecies and run a webpack dev server.
The output is opened in brower on `localhost:8080`

```console
yarn install
yarn start
```

## Production build

Production ready build is located in `dist` folder after running a command below:

```console
yarn build
```

## Author

Made with 💖 by [Alex Ilchenko](mailto:ilczenko@gmail.com)

## License

This project is licensed under the MIT License
