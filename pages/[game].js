import GameInterface from "@/components/GameInterface"
import GameLoading from "@/components/GameLoading"
import GameStats from "@/components/GameStats"
import InvalidGame from "@/components/InvalidGame"
import Wrapper from "@/components/Wrapper"
import { useRouter } from 'next/router'
import { useEffect,useState,useRef } from "react"
import { JsonRpcProvider,Contract, isAddress } from "ethers"
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import ABI from "@/functions/ABI.json"
import config from "@/config.json"

const Game = ({alert}) => {

    const [gameInfo,setGameInfo] = useState([
        "", // [0] Name
        "", // [1] Pot
        "", // [2] Ticket price
        "", // [3] Total tickets
        "", // [4] End block
        "", // [5] Fundraiser wallet
        "", // [6] 50/50 contract
        ""  // [7] Reveal block
    ])
    const [endBlockTimeRemaining, setEndBlockTimeRemaining] = useState("--");
    const [revealBlockTimeRemaining, setRevealBlockTimeRemaining] = useState("--");
    const [gameLoading,setGameLoading] = useState(true)
    const [validGame,setValidGame] = useState(false)
    const [connected,setConnected] = useState(false)
    const [listenerMounted, setListenerMounted] = useState(false);
    const router = useRouter()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [winner,setWinner] = useState("")

    const validateGame = async(gameId) => {
        try{
            const publicProvider = new JsonRpcProvider(config.publicRpc);
            const gameMaster = new Contract(config.gameMaster, ABI.TheGameMaster, publicProvider)
            const id2Addy = await gameMaster.gameIdToAddress(gameId)
            if(id2Addy === "0x0000000000000000000000000000000000000000"){
                setGameLoading(false)
            } else {
                getGameInfo(id2Addy.toString())
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getGameInfo = async (addy) => {
        try{
            const publicProvider = new JsonRpcProvider(config.publicRpc);
            const game = new Contract(addy, ABI.FiftyFifty, publicProvider)
            const info = await game.getRaffleInfo()
            const winner = await game.winner()
            if(winner!=="0x0000000000000000000000000000000000000000"){
                setWinner(winner)
            }
            setGameInfo([info[0],info[1],info[2],info[3],info[4],info[6],addy,info[5]])
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        router.query.game !== undefined ? validateGame(parseInt(router.query.game)) : null
    }, [router])
    
    useEffect(() => {
        if(
            gameInfo[0] !== "" &&
            gameInfo[1] !== "" &&
            gameInfo[2] !== "" &&
            gameInfo[3] !== "" &&
            gameInfo[4] !== "" &&
            gameInfo[5] !== "" &&
            gameInfo[6] !== ""
        ) {
            setValidGame(true)
            setGameLoading(false)
        }
    }, [gameInfo])

    useEffect(() => {
        isConnected ? setConnected(true) : setConnected(false)
    }, [isConnected])

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// The Biggest Headache ////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The useEffect below contains a ethersv6 wildcard event listener.
    // v6 event listeners contain a bug where duplicate events are triggered
    // Documented here: https://github.com/ethers-io/ethers.js/issues/4013
    // Only solution for this bug is to downgrade to v5. 
    // Downgrading to v5 is not an option for me as I NEED full smart wallet/account integration with appkit
    // Documented here: https://github.com/orgs/WalletConnect/discussions/4622
    // I spent way to many hours trying to figure out what the heck was going on here
    // Was 100% certain there was only one event listener mounted but I would keep getting duplicate events
    // Below is my hacky approach ensuring duplicate events aren't received. 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        let mounted = false
        if (isAddress(gameInfo[6]) && !listenerMounted) {
            const eventFound = async (event) => {
                if (mounted) {
                    return;
                }
                mounted = true
                try {
                    console.log(event.fragment.name)
                    if (event.fragment.name === "TicketPurchased") {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await getGameInfo(gameInfo[6])
                    } else if (event.fragment.name === "RevealBlockChanged") {
                        await getGameInfo(gameInfo[6])
                        await new Promise(resolve => setTimeout(resolve, 500));
                        setRevealBlockTimeRemaining("--")
                        setEndBlockTimeRemaining("--")
                        alert("info","Couldn't find blockhash, future block updated")
                    } else if (event.fragment.name === "WinnerDrawn") {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        setWinner(gameInfo[6])
                        alert("success","Winning ticket pulled")
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    mounted = false;
                }
            };
            setListenerMounted(true);
            const publicProvider = new JsonRpcProvider(config.publicRpc, undefined, { polling: true });
            const game = new Contract(gameInfo[6], ABI.FiftyFifty, publicProvider);
            game.on("*", eventFound);
            return () => {
                game.off("*", eventFound);
                game.removeAllListeners("*");
                setListenerMounted(false);
            };
        }
    }, [gameInfo[6]]);
    
    return(
        <Wrapper>{
            gameLoading ? <GameLoading /> :
            validGame ? <>
            <GameInterface 
            winner={winner} 
            alert={alert} 
            revealBlockTimeRemaining={revealBlockTimeRemaining} 
            endBlockTimeRemaining={endBlockTimeRemaining} 
            getGameInfo={getGameInfo} address={address} 
            connected={connected} gameInfo={gameInfo} />
            <GameStats
            winner={winner}
            gameInfo={gameInfo} 
            endBlockTimeRemaining={endBlockTimeRemaining} 
            setEndBlockTimeRemaining={setEndBlockTimeRemaining} 
            revealBlockTimeRemaining={revealBlockTimeRemaining} 
            setRevealBlockTimeRemaining={setRevealBlockTimeRemaining} />
            </> :
            <InvalidGame />
        }</Wrapper>
    )
}

export default Game