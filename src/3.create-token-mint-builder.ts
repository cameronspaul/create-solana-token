import {
  createSolanaClient,
  generateKeyPairSigner,
  getExplorerLink,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { buildCreateTokenTransaction, TOKEN_PROGRAM_ADDRESS } from "gill/programs/token";

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "devnet",
});

const signer = await loadKeypairSignerFromFile("bosYRnpXtejtDXF79Pj4MnTPfHaZiJEFGSs1PsbkXne.json");
console.log("signer:", signer.address);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const tokenProgram = TOKEN_PROGRAM_ADDRESS;
const mint = await generateKeyPairSigner();
console.log("mint:", mint.address);

const tx = await buildCreateTokenTransaction({
  feePayer: signer,
  version: "legacy",
  decimals: 9,
  metadata: {
    isMutable: true,
    name: "Extreme 4D Coin Setup",
    symbol: "4DGAMING",
    uri: "https://ipfs.io/ipfs/QmUAmFqqHJoMG6s5RoveuVg5Bv3d4T73Ycp2fyUxTSoSuB",
  },
  mint,
  latestBlockhash,
  // defaults to `TOKEN_PROGRAM_ADDRESS`

});

const signedTransaction = await signTransactionMessageWithSigners(tx);

console.log(
  "Explorer:",
  getExplorerLink({
    cluster: "devnet",
    transaction: getSignatureFromTransaction(signedTransaction),
  }),
);

await sendAndConfirmTransaction(signedTransaction);
