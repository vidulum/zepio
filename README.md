# Experimental

# Vidulum Desktop Wallet | Cross-platform Sapling-enabled Full-node VDL Desktop Wallet

Vidulum Desktop Wallet is a Sapling-enabled shielded-address-first Vidulum wallet, featuring cross-platform applications (macOS, Windows and Linux), built-in full node with support for `mainnet` and `testnet`, as well as `dark` and `light` themes.

### [Latest Documentation](https://github.com/vidulum)

### [Latest Release](https://github.com/vidulum/DesktopWallet/releases)

![Vidulum Desktop Wallet](https://github.com/vidulum/Vidulum-Press-Kit/raw/master/DesktopWalletSnip.PNG)

## Stack Information

List of the main open source libraries and technologies used in building **Vidulum Desktop Wallet**:

- [vidulumd](https://github.com/vidulum/vidulum): Vidulum node daemon
- [Zepio](https://github.com/ZcashFoundation/zepio): Zepio Wallet
- [Electron](https://github.com/electron/electron): Desktop application builder
- [React](https://facebook.github.io/react/): User interface view layer
- [Redux](https://redux.js.org/): Predictable application state container
- [Styled Components](https://www.styled-components.com/): Visual primitives for theming and styling applications
- [webpack](https://webpack.github.io/): Application module bundler (and more)
- [Babel](https://babeljs.io/): ES7/JSX transpilling
- [ESLint](https://eslint.org/): Code linting rules
- [Flow](https://flow.org): JavaScript static type checker
- [Docz](https://docz.site): Documentation builder
- [BigNumber.js](https://github.com/MikeMcl/bignumber.js#readme): Arbitrary-precision decimal and non-decimal arithmetic with safety

## Installing and Running From Source

To run **Vidulum Desktop Wallet** from source you'll need to perform the following steps:
```bash
# Ensure you have Node LTS v8+
# https://nodejs.org/en/

# Clone Codebase
git clone git@github.com:vidulum/DesktopWallet.git

# Install Dependencies
# inside of the `DesktopWallet` folder
yarn install
# or
npm install

# Start Application
# webpack development server hosts the application on port
# 8080 and launches the Electron wrapper, which also hosts
# the `vidulumd` node daemon process.
yarn start
# or
npm start
```

## Building Application Locally

To build the application locally follow the instructions below:
```bash
# Make sure you are inside of the main `DesktopWallet` folder

# Run Build Script
yarn electron:distall

# Executables and binaries available under `/dist` folder
```

## Flow Coverage (Static Type Checker)

For a deeper look on the static typing coverage of the application, please follow below:
```bash
# Make sure you are inside of the main `DesktopWallet` folder

# Generate Flow Coverage Report
# this can take a couple seconds
yarn flow:report

# Browser should open with the file `index.html` opened
# Files are also available at `DesktopWallet/flow-coverage/source`
```

## Component Library (Docz)

To see Zepio's React component library, please visit https://zepio-components.now.sh. We're always looking for folks to help keep the styleguide updated.

To run the component library locally, run the following:
```bash
# Make sure you are inside of the main `DesktopWallet` folder

# Run Docz Development Script
yarn docz:dev

# Visit http://127.0.0.1:4000/
```

To build the component library locally, run the following:
```bash
# Make sure you are inside of the main `DesktopWallet` folder

# Run Build Script
yarn docz:build

# Check `/.docz/dist` folder for built static assets
```

## Tests

To run the application's tests, please run the below:
```bash
# Make sure you are inside of the main `DesktopWallet` folder

# For Unit Tests: Run Jest Unit Test Suite
yarn test:unit

# For E2E (end-to-end) Tests: Run Jest E2E Suite
yarn e2e:serve
# on another terminal window
yarn test e2e
```

## Contributing

In order to contribute and submit PRs to improve the **Vidulum Desktop Wallet** codebase, please check our [CONTRIBUTING](https://github.com/vidulum/DesktopWallet/blob/master/CONTRIBUTING.md) guide.

## License

MIT © Vidulum Foundation 2019 [zfnd.org](https://zfnd.org)
