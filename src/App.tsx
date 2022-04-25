import React, { useEffect, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
// Import the client
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import KeyDidResolver from "key-did-resolver";
import { ThreeIdConnect } from "@3id/connect";

import * as ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";
import { SolanaAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";

import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

const threeID = new ThreeIdConnect("testnet-clay");

function CryptoApp() {
  const wallet = useWallet();
  useEffect(() => {
    if (!wallet.publicKey) return;
    const address = wallet.publicKey;
    (async () => {
      const authProvider = new SolanaAuthProvider(
        wallet,
        address.toString(),
        "EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
      );

      const rst = await authProvider.authenticate(
        "Allow this account to control your identity"
      );
      const signature = rst;

      await threeID.connect(authProvider);

      const ceramic = new CeramicClient("https://gateway-clay.ceramic.network");
      const resolver = {
        ...KeyDidResolver.getResolver(),
        ...ThreeIdResolver.getResolver(ceramic),
      };

      const did = new DID({ resolver, provider: threeID.getDidProvider() });
      ceramic.did = did;

      const querys = await ceramic.multiQuery([
        {
          "streamId":
            "kjzl6cwe1jw14807pl29zu7fzrybz1yl1sq3t3r0dzapnu1vzwv89rxcvn4bmto",
        },
        {
          "streamId":
            "k3y52l7qbv1fry0xitxs72usxqes559xxos9n2yo2rf06hhpfjdq2til7l0eqqayo",
        },
      ]);
      console.log({ querys });
      // const doc = await TileDocument.create(ceramic, { hello: "world" });

      // console.log(doc.content);

      // const streamId = doc.id.toString();

      // const streamId =
      //   "kjzl6cwe1jw146x5msls7fs2h9o24pdvnr07ps7b75tvewkk0cepwddtmfs8ya0";
      // const doc = await TileDocument.load(ceramic, streamId);
      // console.log(doc.content);
    })();
  }, [wallet]);
  return <div>cryptoApp</div>;
}

function App() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          {/* Your app's components go here, nested within the context providers. */}
          <CryptoApp />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
