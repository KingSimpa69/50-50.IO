import styles from "@/styles/Create.module.css"
import CreateInput from "@/components/CreateInput"
import Conatiner from "@/components/Container"
import { useWeb3ModalProvider, useWeb3Modal } from "@web3modal/ethers/react"
import { useState,useEffect } from "react"
import { isAddress,Contract,BrowserProvider,parseUnits } from "ethers"
import moment from "moment"
import config from "@/config.json"
import ABI from "@/functions/ABI.json"
import LoadingFlex from "./LoadingFlex"
import GameCreated from "./GameCreated"

const CreateGame = ({alert}) => {

    const { walletProvider } = useWeb3ModalProvider()
    const { open } = useWeb3Modal()
    const [inputs,setInputs] = useState(["","","","",""])
    const [errors, setErrors] = useState(["", "", "", "", ""]);
    const [connected,setConnected] = useState(false)
    const [timeStamps,setTimestamps] = useState(["-","-"])
    const [loadingStatus,setLoadingStatus] = useState("none")
    const [txHash,setTxHash] = useState("")
    const [gameId,setGameID] = useState(0)

    const validateInputs = () => {
        let valid = true;
        const newErrors = ["", "", "", "", ""];

        if (inputs[0].length === 0) {
            newErrors[0] = "Fundraiser name is required";
            valid = false;
        }
        if (!parseFloat(inputs[1])) {
            newErrors[1] = "Invalid price";
            valid = false;
        }
        if (!parseInt(inputs[2])) {
            newErrors[2] = "Invalid duration for ticket sales";
            valid = false;
        }
        if (!parseInt(inputs[3])) {
            newErrors[3] = "Invalid duration to draw";
            valid = false;
        }
        if (!isAddress(inputs[4])) {
            newErrors[4] = "Invalid wallet address";
            valid = false;
        }
        if (valid === false) {
            alert("error","Incorrect game parameters")
        }
        setErrors(newErrors);
        return valid;
    };

    const priceValidation = (value) => {
        if (value.toString().length > 6) {
          return value.slice(0, 7);
        } else if (value > 1000) {
          return 1000;
        }
        return value.replace(/[^\d.]/g, "");
    } 

    const filters = {
        0: (value) => (value.length < 22 ? value : value.slice(0, 22)),
        1: (value) => priceValidation(value),
        2: (value) => (value.length < 5 ? value.replace(/\D/g, "") : value.slice(0, 5)),
        3: (value) => (value.length < 5 ? value.replace(/\D/g, "") : value.slice(0, 5)),
        4: (value) => (isAddress(value) ? value : "")
    };

      const handleInput = (e, inputID) => {
        const newInputs = [...inputs];
        const filteredValue = filters[inputID](e.target.value);
        newInputs[inputID] = filteredValue;
        setInputs(newInputs);
    };

    const calculateTimestamps = async () => {
        const currentTime = moment();
        const minutesTillDraw = parseInt(inputs[2], 10);
        const minutesTillReveal = parseInt(inputs[3], 10);
        var zone = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]
        const drawTime = currentTime.clone().add(minutesTillDraw, 'minutes').format('MMMM Do YYYY, HH:mm');
        const revealTime = currentTime.clone().add(minutesTillDraw + minutesTillReveal, 'minutes').format('MMMM Do YYYY, HH:mm');

        setTimestamps([`${drawTime} ${zone}`, `${revealTime} ${zone}`]);
    }

    const create = async () => {
        if(!validateInputs() || walletProvider === undefined)return
        try{
        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(signer.address);
        const gameMaster = new Contract(config.gameMaster, ABI.TheGameMaster, signer)
        const launchPrice = await gameMaster.launchPrice()
        if (balance < launchPrice) {
            alert("error","Insufficent funds")
            return
        } 
        const tx = await gameMaster.create(inputs[4],inputs[0],inputs[2]*60/2,(inputs[3]*60)/2,parseUnits(inputs[1].toString()),{value:launchPrice})
        setTxHash(await tx.hash)
        setLoadingStatus("txLoading")
        const receipt = await tx.wait()
        setGameID(parseInt(receipt.logs[1].args[0]))
        //console.log(receipt.logs)
        setLoadingStatus("gameCreated")
        } catch (e) {
            setLoadingStatus("none")
            console.log(e)
        }
    }

    useEffect(() => {
        inputs[2] !== "" && inputs[3] !== "" ? calculateTimestamps() : setTimestamps(["-","-"])
    }, [inputs[2],inputs[3]])
    

    useEffect(() => {
        walletProvider === undefined ? setConnected(false) : setConnected(true)
    }, [walletProvider])
    

    return(
        <Conatiner>{
        loadingStatus === "none" ?
        <div className={styles.create}>
            <CreateInput errors={errors} handleInput={handleInput} inputID={0} value={inputs[0]} placeholder={"Fella 50/50"} title={"Fundraiser Name"}/>
            <CreateInput errors={errors} handleInput={handleInput} inputID={1} value={inputs[1]} placeholder={"0.00015"} title={"Price per ticket in ETH"}/>
            <CreateInput errors={errors} handleInput={handleInput} inputID={2} value={inputs[2]} placeholder={"1440"} title={"Minutes till ticket sale end"}/>
            <CreateInput errors={errors} handleInput={handleInput} inputID={3} value={inputs[3]} placeholder={"60"} title={"Minutes after ticket sale to pull winning ticket"}/>
            <CreateInput errors={errors} handleInput={handleInput} inputID={4} value={inputs[4]} placeholder={"0xB5875473AC9e5dc4614905C46b2EA7712f296e30"} title={"Fundraiser Wallet"}/>
        <div>
            <div className={styles.gameInfo}>
                <div className={styles.gInfoValue}><div>{timeStamps[0]}</div><div className={styles.ginfoLabel}>Ticket sale ends</div></div>
                -
                <div className={styles.gInfoValue}><div>{timeStamps[1]}</div><div className={styles.ginfoLabel}>Winning ticket selected</div></div>
            </div>
            {
                connected ? <div onClick={()=> create()} className={styles.bigButton}>Create</div> :
                <div onClick={()=>open()} className={styles.bigButton}>Connect</div>
            }
        </div>
    </div> :
    loadingStatus === "txLoading" ? <LoadingFlex hash={txHash} /> :
    loadingStatus === "gameCreated" ? <GameCreated gameId={gameId}/> : null
    }</Conatiner>
    )
}

export default CreateGame