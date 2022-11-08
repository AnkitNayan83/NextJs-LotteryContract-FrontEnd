import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div>
      <h1>Decentralized Lottery App</h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
