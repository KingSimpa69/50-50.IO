import styles from "@/styles/Game.module.css"
import formatETH from "@/functions/formatETH"
import { useEffect,useState } from "react"
import { JsonRpcProvider } from "ethers"
import config from "@/config.json"
import moment from "moment"
import timeTill from "@/functions/timeTill"
import LiveGameStats from "./LiveGameStats"
import EndedGameStats from "./EndedGameStats"

const GameStats = ({gameInfo,endBlockTimeRemaining, setEndBlockTimeRemaining,revealBlockTimeRemaining, setRevealBlockTimeRemaining,winner}) => {

    const pullEndblockDiff = async () => {
        try {
            const publicProvider = new JsonRpcProvider(config.publicRpc);
            const currentBlock = await publicProvider.getBlock()
            const endBlockSecondsTillEnd = (parseInt(gameInfo[4]) - currentBlock.number) * 2;
            const revealBlockSecondsTillEnd = (parseInt(gameInfo[7]) - currentBlock.number) * 2;
            updateEndblockTimeRemaining(endBlockSecondsTillEnd);
            updateRevealblockTimeRemaining(revealBlockSecondsTillEnd)
        } catch (e) {
            console.log(e);
        }
    }

    const updateEndblockTimeRemaining = (seconds) => {
        const countdownTimer = setInterval(() => {
            seconds -= 1;
            if (seconds <= 0) {
                clearInterval(countdownTimer);
                setEndBlockTimeRemaining("Time's up!");
            } else {
                setEndBlockTimeRemaining(timeTill(seconds));
            }
        }, 1000);
    }

    const updateRevealblockTimeRemaining = (seconds) => {
        const countdownTimer = setInterval(() => {
            seconds -= 1;
            if (seconds <= 0) {
                clearInterval(countdownTimer);
                setRevealBlockTimeRemaining("Time's up!");
            } else {
                setRevealBlockTimeRemaining(timeTill(seconds));
            }
        }, 1000);
    }

    useEffect(() => {
        revealBlockTimeRemaining === "--" & revealBlockTimeRemaining === "--" ? pullEndblockDiff() : null
    }, [endBlockTimeRemaining,revealBlockTimeRemaining]);
    

    return(
    <div className={styles.bottomHalf}>
        {winner === "" ? <LiveGameStats gameInfo={gameInfo} endBlockTimeRemaining={endBlockTimeRemaining} revealBlockTimeRemaining={revealBlockTimeRemaining} /> : 
        <EndedGameStats winner={winner} gameInfo={gameInfo}/>}
    </div>
    )
}

export default GameStats