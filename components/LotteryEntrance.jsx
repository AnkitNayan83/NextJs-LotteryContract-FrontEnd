import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const [playersCount, setPlayersCount] = useState(0);
  const [entranceFee, setEntranceFee] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0x");
  const dispatch = useNotification();
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUi = async () => {
    const entranceFeeContract = (await getEntranceFee()).toString();
    setEntranceFee(entranceFeeContract);
    const playersCountNum = (await getNumberOfPlayers()).toString();
    setPlayersCount(playersCountNum);
    const winner = (await getRecentWinner()).toString();
    setRecentWinner(winner);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  const handelSuccess = async (tx) => {
    await tx.wait(1);
    handelNewNotification(tx);
    updateUi();
  };

  const handelNewNotification = () => {
    dispatch({
      type: "info",
      message: "transaction conplete",
      title: "Tx Notification",
      position: "topR",
    });
  };

  const handelEnter = async () => {
    await enterRaffle({
      onSuccess: handelSuccess,
      onError: (error) => console.log(error),
    });
  };

  return (
    <div className="lottertEntrance">
      <h1 className="text-xl font-bold mb-3">LotteryEntrance:</h1>
      {raffleAddress ? (
        <div>
          <button
            className="mb-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={handelEnter}
            disabled={isFetching || isLoading}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <h3 className="mb-3">
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} eth
          </h3>
          <h4 className="mb-3">Number of players: {playersCount}</h4>
          <h2 className="mb-3">Latest Winner: {recentWinner}</h2>
        </div>
      ) : (
        <div className="text-xl font-bold">No address detected</div>
      )}
    </div>
  );
}
