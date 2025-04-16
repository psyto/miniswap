# MiniSwap DEX

MiniSwap is a decentralized exchange (DEX) built on the Ethereum blockchain, specifically designed for the Sepolia test network. It allows users to swap between two custom ERC20 tokens and provide liquidity to the exchange.

## Features

-   **Wallet Integration**: Connect your MetaMask wallet to interact with the DEX
-   **Token Swapping**: Swap between two custom ERC20 tokens (TT1 and TT2)
-   **Liquidity Provision**: Add liquidity to the exchange to earn trading fees
-   **User-Friendly Interface**: Clean and intuitive UI for all DEX operations
-   **Real-time Updates**: Automatic updates for wallet connection and transaction status

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [MetaMask](https://metamask.io/) browser extension
-   [Sepolia Test Network](https://sepolia.dev/) configured in MetaMask
-   Test ETH on Sepolia network (can be obtained from [Sepolia Faucet](https://sepoliafaucet.com/))

## Project Structure

```
miniswap/
├── contracts/           # Smart contracts
│   ├── DEX.sol         # Main DEX contract
│   ├── Token1.sol      # First ERC20 token
│   └── Token2.sol      # Second ERC20 token
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   └── contracts/  # Contract ABIs and addresses
│   └── public/         # Static assets
└── README.md           # Project documentation
```

## Smart Contracts

The project includes three main smart contracts:

1. **DEX.sol**: The main decentralized exchange contract that handles:

    - Token swaps
    - Liquidity provision
    - Price calculations
    - Fee management

2. **Token1.sol & Token2.sol**: Custom ERC20 tokens used for trading on the DEX

## Frontend Application

The frontend is built with:

-   Next.js 15
-   React 19
-   TypeScript
-   Tailwind CSS
-   Ethers.js

### Key Components

-   **Web3Context**: Manages wallet connection and blockchain interaction
-   **DEXInterface**: Main interface for token swapping and liquidity provision
-   **WalletButton**: Persistent wallet connection button

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/miniswap.git
cd miniswap
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_DEX_ADDRESS=your_dex_contract_address
NEXT_PUBLIC_TOKEN1_ADDRESS=your_token1_contract_address
NEXT_PUBLIC_TOKEN2_ADDRESS=your_token2_contract_address
```

### 4. Start the Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Connecting Your Wallet

1. Click the "Connect Wallet" button in the top right corner
2. Approve the connection request in MetaMask
3. Ensure you're connected to the Sepolia test network

### Adding Liquidity

1. Enter the amount of TT1 and TT2 tokens you want to provide
2. Click "Add Liquidity"
3. Approve the token transfers in MetaMask
4. Confirm the liquidity addition transaction

### Swapping Tokens

1. Select the swap direction (TT1 → TT2 or TT2 → TT1)
2. Enter the amount you want to swap
3. Click "Swap Tokens"
4. Approve the token transfer in MetaMask
5. Confirm the swap transaction

## Security Considerations

-   Always verify you're on the Sepolia test network
-   Never share your private keys or seed phrases
-   Double-check transaction details before confirming
-   Use test tokens only for development purposes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   [Ethereum Foundation](https://ethereum.org/)
-   [MetaMask](https://metamask.io/)
-   [Sepolia Test Network](https://sepolia.dev/)
-   [Next.js](https://nextjs.org/)
-   [Ethers.js](https://docs.ethers.org/)
