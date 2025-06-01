# Gill Examples - Tokens Setup Guide

This guide explains how to properly set up and run the Gill token examples.

## Prerequisites

- Node.js v20.18.0 or higher
- pnpm v9 or higher

## Installation Steps

1. First, clean install the dependencies from the tokens example directory:
```bash
pnpm install
```

2. Make sure you have these dependencies in your package.json:
```json
{
  "dependencies": {
    "@solana/web3.js": "^1.91.0",
    "dotenv": "^16.4.5",
    "esrun": "^3.2.26",
    "gill": "0.9.0",
    "ws": "^8.18.0"
  }
}
```

3. Ensure your tsconfig.json has the correct module resolution settings:
```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "target": "ESNext",
    "lib": ["ESNext"]
  }
}
```

## Running the Examples

1. The examples can be run using esrun:
```bash
npx esrun src/<script-name>.ts
```

For example:
```bash
npx esrun src/1.intro.ts
```

## Common Issues & Solutions

### Module Resolution Errors
If you see errors like:
```
Cannot find module 'gill/node' or its corresponding type declarations
```
Make sure you have:
1. The correct module resolution settings in tsconfig.json
2. The gill package properly installed
3. Run `pnpm install` to refresh dependencies

### Solana Network Errors
If you see "Attempt to debit an account but found no record of a prior credit", this means your wallet needs SOL tokens on devnet to pay for transaction fees. You can get devnet SOL by:

1. Using the Solana CLI:
```bash
solana airdrop 1 <your-wallet-address> --url devnet
```

2. Or using a devnet faucet website

## Additional Notes
- The examples use devnet by default for testing
- Make sure you have a wallet with some devnet SOL before running transaction examples
- The gill package is used in ESM mode, so make sure your package.json has `"type": "module"`