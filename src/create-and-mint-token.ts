import {
  address,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  getExplorerLink,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import {
  buildCreateTokenTransaction,
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenIdempotentInstruction,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "gill/programs/token";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "https://devnet.helius-rpc.com/?api-key=e3996982-5073-4b8b-942d-1d774b777012",
});

async function createAndMintToken() {
  // Load the signer keypair
  const signer = await loadKeypairSignerFromFile("bosYRnpXtejtDXF79Pj4MnTPfHaZiJEFGSs1PsbkXne.json");
  console.log("Signer:", signer.address);

  // Get latest blockhash
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  // Generate new mint keypair
  const mint = await generateKeyPairSigner();
  console.log("Mint address:", mint.address);

  // 1. Create the token mint
  const createTokenTx = await buildCreateTokenTransaction({
    feePayer: signer,
    version: "legacy",
    decimals: 9,
    metadata: {
      isMutable: true,
      name: "FartCoin69",
      symbol: "FC69",
      uri: "https://raw.githubusercontent.com/cameronspaul/create-solana-token/refs/heads/main/metadata-data.json",
    },
    mint,
    latestBlockhash,
  });

  const signedCreateTokenTx = await signTransactionMessageWithSigners(createTokenTx);
  console.log(
    "Token Creation Explorer:",
    getExplorerLink({
      cluster: "devnet",
      transaction: getSignatureFromTransaction(signedCreateTokenTx),
    }),
  );

  // Send and confirm token creation
  await sendAndConfirmTransaction(signedCreateTokenTx);
  console.log("Token created successfully!");

  // 2. Mint tokens to an account
  // Get fresh blockhash for the new transaction
  const { value: newBlockhash } = await rpc.getLatestBlockhash().send();

  // Set the owner address where tokens will be minted
  const owner = address("bosYRnpXtejtDXF79Pj4MnTPfHaZiJEFGSs1PsbkXne");
  
  // Get the associated token account address
  const ata = await getAssociatedTokenAccountAddress(mint.address, owner, TOKEN_PROGRAM_ADDRESS);

  // Create transaction for minting tokens
  const mintTokensTx = createTransaction({
    feePayer: signer,
    version: "legacy",
    instructions: [
      getCreateAssociatedTokenIdempotentInstruction({
        mint: mint.address,
        owner,
        payer: signer,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
        ata,
      }),
      getMintToInstruction(
        {
          mint: mint.address,
          mintAuthority: signer,
          token: ata,
          amount: 1000000000000000000,
        },
        {
          programAddress: TOKEN_PROGRAM_ADDRESS,
        },
      ),
    ],
    latestBlockhash: newBlockhash,
  });

  const signedMintTokensTx = await signTransactionMessageWithSigners(mintTokensTx);
  console.log(
    "Token Minting Explorer:",
    getExplorerLink({
      cluster: "devnet",
      transaction: getSignatureFromTransaction(signedMintTokensTx),
    }),
  );

  // Send and confirm minting transaction
  await sendAndConfirmTransaction(signedMintTokensTx);
  console.log("Tokens minted successfully!");

  console.log("View Token:")
  console.log(`https://solscan.io/token/${mint.address}?cluster=devnet`)
  console.log(`https://explorer.solana.com/address/${mint.address}?cluster=devnet`)
}

// Execute the combined process
createAndMintToken().catch(console.error);