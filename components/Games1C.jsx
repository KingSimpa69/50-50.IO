import { useState, useEffect } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import config from "@/config.json";
import ABI from "@/functions/ABI.json";
import styles from "@/styles/Index.module.css";
import Link from "next/link";

const Games1C = () => {
    const [gameRefreshing, setGameRefreshing] = useState(false);
    const [activeGames, setActiveGames] = useState({ ids: [], names: [] });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const gamesPerPage = 5; // Adjust the number of games per page to 5 since there are 6 pages for 30 results
  
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
        return newPage >= 0 && newPage < totalPages ? newPage : prev;
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
          <div>ACTIVE 50/50s</div>
          <div className={currentPage === totalPages - 1 || totalPages === 0 ? `${styles.gamesControl} invisible` : styles.gamesControl} onClick={() => handlePageChange(1)}>next</div>
        </div>
        {gameRefreshing && (
          <div className={styles.gamesLoadingFlex}>
            <div className="loader"></div>
          </div>
        )}
        <div className={styles.gamesCol1C}>
          {currentGames.ids.map((id, index) => (
            <Link key={id} href={`/${id}`}>
                <div className={styles.gameItemTitle}>{currentGames.names[index]} Fundraiser</div>
            </Link>
          ))}
        </div>
      </div>
    )
}

export default Games1C;
