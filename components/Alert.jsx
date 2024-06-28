import style from "@/styles/Alert.module.css";
import { useEffect, useState } from "react";
import { shortenEthAddy } from "@/functions/shortenEthAddy";

const Alert = ({ alerts, setAlerts }) => {
  const [exitAnimationIndexes, setExitAnimationIndexes] = useState([]);

  useEffect(() => {
    const animationTimeouts = [];

    alerts.forEach((alert, index) => {
      const timeoutId = setTimeout(() => {
        setExitAnimationIndexes(prevIndexes => [...prevIndexes, index]);
      }, 3500 * (index + 1));
      animationTimeouts.push(timeoutId);
    });

    return () => {
      animationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [alerts]);

  const handleAnimationEnd = index => {
    setExitAnimationIndexes(prevIndexes =>
      prevIndexes.filter(item => item !== index)
    );
    setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
  };

  return (
    <div className={style.wrapper}>
      {alerts.map((alert, index) => (
        <div key={index}
          className={`${style.container} ${style[alert.type]} ${
            exitAnimationIndexes.includes(index)
              ? "animate__animated animate__fadeOutUp"
              : ""
          }`}
          onAnimationEnd={() => handleAnimationEnd(index)}
        >
          <div className={style.alertInfo}>
            <h1>{alert.message}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alert;
