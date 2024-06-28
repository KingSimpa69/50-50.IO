import styles from "@/styles/Game.module.css"
import Image from "next/image"
import config from "@/config.json"
import formatETH from "@/functions/formatETH"
import ABI from "@/functions/ABI.json"
import { useWeb3Modal,useWeb3ModalProvider } from '@web3modal/ethers/react'
import { useEffect, useState } from "react"
import { BrowserProvider,Contract,parseUnits } from "ethers"
import LoadingFlex from "./LoadingFlex"


const GameInterface = ({gameInfo,connected,address,revealBlockTimeRemaining,endBlockTimeRemaining,alert,winner}) => {

    const [txing,setTxing] = useState(false)
    const [balance,setBalance] = useState(0)
    const [quantity,setQuantity] = useState(1)
    const { open } = useWeb3Modal()
    const { walletProvider } = useWeb3ModalProvider()
    const [txHash,setTxHash] = useState("")

    const quantityMod = (amount) => {
        if(amount === "less" && quantity !== 1){
            setQuantity(quantity-1)
        }
        if(amount === "more" && quantity !== 10){
            setQuantity(quantity+1)
        }
    }

    const buy = async () => {
        if(walletProvider === undefined) return;
        try {
            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner();
            const fiftyFifty = new Contract(gameInfo[6], ABI.FiftyFifty, signer)
            const ticketPriceWei = parseUnits((parseInt(gameInfo[2]) * quantity).toString(), 'wei');
            //console.log(ticketPriceWei);
            const tx = await fiftyFifty.buyTickets(quantity, {value: ticketPriceWei});
            setTxHash(tx.hash);
            await new Promise(resolve => setTimeout(resolve, 500));
            setTxing(true);
            await tx.wait();
            pullBalance();
            const grammar = quantity === 1 ? "ticket" : "tickets";
            alert("success", `You bought ${quantity} ${grammar}!`);
        } catch (e) {
            alert("error", e.reason);
            console.log(e);
        } finally {
            setTxing(false);
        }
    }
    

    const pullBalance = async () => {
        try{
            const provider = new BrowserProvider(walletProvider)
            const fiftyFifty = new Contract(gameInfo[6], ABI.FiftyFifty, provider)
            const balance = await fiftyFifty.balance(address)
            setBalance(parseInt(balance))
            } catch (e) {
                console.log(e)
            }
    }

    const revealWinner = async () => {
        try{
            const provider = new BrowserProvider(walletProvider)
            const signer = await provider.getSigner();
            const fiftyFifty = new Contract(gameInfo[6], ABI.FiftyFifty, signer)
            const tx = await fiftyFifty.drawWinner()
            setTxHash(tx.hash)
            await new Promise(resolve => setTimeout(resolve, 500));
            setTxing(true)
            await tx.wait()
            } catch (e) {
                alert("error",e.reason)
                console.log(e.reason)
            } finally {
                setTxing(false)
            }
    }

    function getButtonClass() {
        if (!connected) {
            return styles.buyButton;
        }
        if (endBlockTimeRemaining === "Time's up!" && revealBlockTimeRemaining === "Time's up!") {
            if (winner === "") {
                return styles.buyButton;
            } else {
                return styles.greyedOut;
            }
        } else if (endBlockTimeRemaining === "Time's up!") {
            return styles.greyedOut;
        } else {
            return styles.buyButton;
        }
    }
      
      function handleClick() {
        if (!connected) {
          open();
        } else if (endBlockTimeRemaining === "Time's up!" && revealBlockTimeRemaining === "Time's up!") {
            revealWinner();
        } else if (endBlockTimeRemaining === "Time's up!") {
            alert("info","Not time to pull a winner yet")
        } else {
          buy();
        }
      }
      
      function getButtonText() {
        if (!connected) {
          return "Connect";
        } else if (endBlockTimeRemaining === "Time's up!") {
          return "Draw Winner";
        } else {
          return "Buy";
        }
      }

    useEffect(() => {
        if(walletProvider !== undefined){
            pullBalance()
        }
    }, [walletProvider])
    
    
    return(
    <div className={styles.topHalf}>
        <div className={styles.topLeft}>
            <Image src={"/images/roll.png"} height={273} width={300} />
        </div>
        <div className={styles.topRight}>
            <div className={styles.fundraiserName}>{gameInfo[0]} FUNDRAISER</div>
            <div className={styles.addys}>
                <div className={styles.addyUrl}><a target={"_blank"} href={`${config.blockExplorer}address/${gameInfo[6]}`}>CONTRACT</a></div>
                <div className={styles.addyDivider}>/</div>
                <div className={styles.addyUrl}><a target={"_blank"} href={`${config.blockExplorer}address/${gameInfo[5]}`}>FUNDRAISER WALLET</a></div>
            </div>
            <br />
            <div className={styles.controlzCont}>
            {!txing?<>
            {connected?<div className={styles.userTix}>Your tickets: <div className={styles.userTixValue}>{balance}</div></div>:null}
            <div className={styles.quanityCont}>
                <div onClick={()=>quantityMod("less")} className={styles.increment}>{"-"}</div>
                <input className={styles.quantity} type="number" readOnly value={quantity} />
                <div onClick={()=>quantityMod("more")} className={styles.increment}>{"+"}</div></div>
            <div className={styles.costRender}>Buy {quantity} tickets for {formatETH((parseInt(gameInfo[2])/10**18)*quantity)} ETH</div>

            <div className={getButtonClass()} onClick={handleClick}>{getButtonText()}</div>

            </>:<LoadingFlex hash={txHash} />}
            </div>
        </div> 
    </div>
    )
}

export default GameInterface