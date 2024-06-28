import styles from "@/styles/Header.module.css"
import { useWeb3ModalAccount,useWeb3Modal } from '@web3modal/ethers/react'
import {useState,useEffect} from "react"
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import { isAddress } from "ethers"
import Image from "next/image"

const Web3Button = () => {

    const [connected,setConnected] = useState(false)
    const [buttonText, setButtonText] = useState("Connect")

    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()

    const handleButton = () => {
        connected?open({ view: 'Account' }):open()
    }

    useEffect(() => {
        isConnected ? setConnected(true) : setConnected(false)
    }, [isConnected])
    
    useEffect(() => {
        isAddress(address) ? setButtonText(shortenEthAddy(address)) : setButtonText("Connect")
    }, [connected])
    

    return(
        <div onClick={()=>handleButton()} className={styles.web3Button}>
            <div>{buttonText}</div>
        </div>
    )
}

export default Web3Button