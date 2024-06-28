import { useState, useEffect } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import config from "@/config.json";
import ABI from "@/functions/ABI.json";
import styles from "@/styles/Index.module.css";
import Link from "next/link";

const Games = () => {

    const [gameRefreshing, setGameRefreshing] = useState(false);
    const [activeGames, setActiveGames] = useState({ ids: [], names: [] });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0)
    const gamesPerPage = 10;
  
    const getGames = async () => {
      try {
        const publicProvider = new JsonRpcProvider(config.publicRpc);
        const gameMaster = new Contract(config.gameMaster, ABI.TheGameMaster, publicProvider);
        const activeGamez = await gameMaster.getActiveGames();
        let games = { ids: [...activeGamez[0]], names: [...activeGamez[1]] };
        setActiveGames(games);
        setTotalPages(Math.ceil(activeGamez[0].length / gamesPerPage));
      } catch (e) {
        console.log(e);
      }
    };
  
    useEffect(() => {
      getGames();
      const interval = setInterval(async () => {
        setGameRefreshing(true);
        await getGames();
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGameRefreshing(false);
      }, 20000);
  
      return () => clearInterval(interval);
    }, []);
  
    const handlePageChange = (direction) => {
      setCurrentPage((prev) => {
        const newPage = prev + direction;
        return newPage >= 0 && newPage < Math.ceil(activeGames.ids.length / gamesPerPage) ? newPage : prev;
      });
    };
  
    const getGamesForPage = (page) => {
      const start = page * gamesPerPage;
      const end = start + gamesPerPage;
      return {
        ids: activeGames.ids.slice(start, end),
        names: activeGames.names.slice(start, end),
      };
    };
  
    const currentGames = getGamesForPage(currentPage);

    return(
        <div className={styles.gamesWrap}>
        <div className={styles.gamesHeader}>
          <div className={currentPage === 0 ? `${styles.gamesControl} invisible` : styles.gamesControl} onClick={() => handlePageChange(-1)}>prev</div>
          <div>ACTIVE GAMES</div>
          <div className={currentPage === totalPages - 1 || totalPages === 0 ? `${styles.gamesControl} invisible` : styles.gamesControl} onClick={() => handlePageChange(1)}>next</div>
        </div>
        {gameRefreshing && (
          <div className={styles.gamesLoadingFlex}>
            <div className="loader"></div>
          </div>
        )}
        <div className={styles.gamesCont}>
          <div className={styles.gamesCol}>
            {currentGames.ids.slice(0, 5).map((id, index) => (
            <Link href={`/${id}`}>
                <div className={styles.gameItemTitle}>{currentGames.names[index]} Fundraiser</div>
            </Link>
            ))}
          </div>
          <div className={styles.gamesCol}>
            {currentGames.ids.slice(5, 10).map((id, index) => (
            <Link href={`/${id}`}>
                <div className={styles.gameItemTitle}>{currentGames.names[index + 5]} Fundraiser</div>
            </Link>
            ))}
          </div>
        </div>
      </div>
    )
}

export default Games