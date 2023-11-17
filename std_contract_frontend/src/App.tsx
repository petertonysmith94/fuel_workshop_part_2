import { Fuel } from "@fuel-wallet/sdk";
import { useEffect, useState } from "react";
import "./App.css";
import { CounterContractAbi__factory } from "./contracts";

const CONTRACT_ID: string = "0xaf51c27e6241147d075d852e753cbc08a0551262219115c4bfb988cae834dc2f"

const fuel = new Fuel();

function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
 
  useEffect(() => {
    setTimeout(() => {
      checkConnection();
      setLoaded(true);
    }, 200)
    if (connected) getCount();
  }, [connected])

  useEffect(() => {
    if (connected) getCount();
  }, [connected])
 
  async function connect() {
    if (fuel) {
      try {
        await fuel.connect();
        const [account] = await fuel.accounts();
        console.log("account: ", account);
        setAccount(account);
        setConnected(true);
      } catch (err) {
        console.log("error connecting: ", err);
      }
    }
  }
 
  async function checkConnection() {
    if (fuel) {
      const isConnected = await fuel.isConnected();
      if (isConnected) {
        const [account] = await fuel.accounts();
        setAccount(account);
        setConnected(true);
      }
    }
  }
 
  async function getCount() {
    if (fuel) {
      const wallet = await fuel.getWallet(account);
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      const { value } = await contract.functions.count().call();
      setCounter(value.toNumber());
    }
  }
 
  async function increment() {
    if (fuel) {
      const wallet = await fuel.getWallet(account);
      console.log("wallet: ", )
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      // Creates a transactions to call the increment function
      // because it creates a TX and updates the contract state this requires the wallet to have enough coins to cover the costs and also to sign the Transaction
      try {
        const tx = contract.functions.increment().txParams({ gasPrice: 1 });
        await tx.call();
        // console.log("tx: ", tx);
        // await tx.callParams({
        //   forward: {
        //     amount: 1,
        //     assetId: CONTRACT_ID,
        //   },
        // }).call();
        getCount();
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
      }
    }
  }
 
  if (!loaded) return null
 
  return (
    <>
      <div className="App">
        {
          connected ? (
            <>
              <h3>Counter: {counter}</h3>
              <button style={buttonStyle} onClick={increment}>
                Increment
              </button>
            </>
          ) : (
            <button style={buttonStyle} onClick={connect}>Connect</button>
          )
        }
      </div>
    </>
  );
}
 
export default App;
 
const buttonStyle = {
  borderRadius: "48px",
  marginTop: "10px",
  backgroundColor: "#03ffc8",
  fontSize: "20px",
  fontWeight: "600",
  color: "rgba(0, 0, 0, .88)",
  border: "none",
  outline: "none",
  height: "60px",
  width: "400px",
  cursor: "pointer"
}