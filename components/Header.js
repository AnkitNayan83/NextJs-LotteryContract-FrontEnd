import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="border-b-2 mb-10 font-extrabold text-2xl h-20 flex justify-between items-center">
      <h1>Decentralized Lottery App</h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
