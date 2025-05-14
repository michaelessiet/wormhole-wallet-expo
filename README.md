# Wormhole Wallet Expo

A simple mobile wallet using the Mayan Finance SDK and API, Yuna, and Expo. This app was built for the solana breakout hackathon. It was built in an effort to make cross-chain transfers/swaps seamless and as easy as making a transaction on a single chain. The app is built using React Native and Expo, and uses the Mayan Finance SDK to interact with the Solana blockchain. The app is designed to be simple and easy to use, with a focus on cross-chain transfers/swaps.

## Features
- Cross-chain transfers/swaps
- Simple and easy to use interface
- Built using React Native and Expo
- Uses the Mayan Finance SDK to interact with the Solana blockchain
- Uses Yuna for wallet balance data

## Getting Started

To get started with the app, you will need to have Node.js and Expo CLI installed on your machine. You can install Expo CLI by running the following command:

```bash
npm install -g expo-cli
```

Once you have Expo CLI installed, you can clone the repository and install the dependencies by running the following commands:

```bash
git clone https://github.com/michaelessiet/wormhole-wallet-expo.git
cd wormhole-wallet-expo
bun install
```

## Running the App
To run the app, you can use the following command:

```bash
bun ios
```

## Building the App

To build the app for production, you can use the Expo build service. Run the following command to start the build process:

```bash
bun run build:ios
```

## Philosophy

The world of cryptocurrency has become increasingly fragmented, with numerous blockchains operating in isolation. This fragmentation creates barriers for users and developers, as assets and functionalities are often locked within individual ecosystems. Many chains risk becoming obsolete unless a cross-chain future is realized.

**Wormhole Wallet Expo** was built with the vision of breaking down these barriers. By enabling seamless cross-chain transfers and swaps, the app empowers users to interact with multiple blockchains as if they were one unified network. We believe that the future of crypto lies in interoperability, where users can move assets and execute transactions across chains effortlessly.

Our goal is to make cross-chain interactions as simple as single-chain transactions, ensuring that no blockchain is left behind in the journey toward a decentralized and interconnected financial system.

## Example Transactions

Here are some example transactions carried out using the app:

1. [Transaction 1: SWIFT_0xb483bab016120db86198c51c1c5012a899742560f62ae418786a1198241ba379](https://explorer.mayan.finance/tx/SWIFT_0xb483bab016120db86198c51c1c5012a899742560f62ae418786a1198241ba379)
2. [Transaction 2: WH_PRSu6Mvv1T9JDbrozEBinHxS9pn6jZGzZFK5FiHgyzf3gppYGgXR5QwyTj3mixLMmyuK7xQrHNwQLHemE3dvWgQ__0](https://explorer.mayan.finance/tx/WH_PRSu6Mvv1T9JDbrozEBinHxS9pn6jZGzZFK5FiHgyzf3gppYGgXR5QwyTj3mixLMmyuK7xQrHNwQLHemE3dvWgQ__0)

These transactions demonstrate the app's ability to facilitate cross-chain swaps and transfers with speed and reliability.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GPLv3 License. See the LICENSE file for more details.
