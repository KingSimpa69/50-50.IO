import "@/styles/globals.css";
import 'animate.css';
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Web3Modal } from "@/context/context";
import { useState,useEffect } from "react";
import Alert from "@/components/Alert";
import MasterLoadingScreen from "@/components/MasterLoadingScreen";
import Cookies from 'js-cookie'
import TOS from "@/components/TOS";

export default function App({ Component, pageProps }) {

  const [acceptedTos, setAcceptedTos] = useState(false);
  const [loading,setLoading] = useState(true)
  const [alerts,setAlerts] = useState([])
  const alert = (type,message,tx) => {
    setAlerts(alerts=>[...alerts,{
      type:type,
      message:message,
      tx:tx
    }])
  }

  useEffect(() => {
    const removeLoadingScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setLoading(false)
    }
    removeLoadingScreen()
  }, [])

  useEffect(() => {
    const tosAccepted = Cookies.get('tosAccepted');
    setAcceptedTos(tosAccepted === 'true');
  }, [])
  
  return (
    <Web3Modal>
      <Alert setAlerts={setAlerts} alerts={alerts} />
      <Head>
          <title>50-50.IO | The future of 50/50s</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="theme-color" content="#ffffff"/>
      </Head>
      <Header />
      {!acceptedTos&&<TOS alert={alert} Cookies={Cookies} setAcceptedTos={setAcceptedTos} />}
      {loading&&<MasterLoadingScreen />}
      <Component alert={alert} {...pageProps} />
      <Footer />
    </Web3Modal>
  )
}
