import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { openNotification, sleep } from '../utils/components';
import { InfoCoinflip } from '../utils/constants';
import { useProgram } from '../utils/useProgram';
import { useWeb3 } from '../utils/useWeb3';

const mockRecentGames = [
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[0],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[1],
    result: false,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 2,
    amount: InfoCoinflip.wager_amount[3],
    result: false,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 2,
    amount: InfoCoinflip.wager_amount[0],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 2,
    amount: InfoCoinflip.wager_amount[5],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoCoinflip.wager_amount[1],
    result: true,
  },
];

export default function Coinflip() {
  const wallet = useWeb3().walletAddress;
  const {
    coinflipFlip: coinflip_flip,
    coinflipClaim: coinflip_claim,
    getWOLFIESbalance,
    getFlipLastPlay,
  } = useProgram();

  const [loading, setLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [selectedSide, setSelectedSide] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [winNumber, setWinNumber] = useState(0);
  const [recentGames] = useState<typeof mockRecentGames>(mockRecentGames);

  useEffect(() => {
    getPendingAmount();
  }, [wallet]);

  useEffect(() => {
    getTokenAmount();
    const interval = setInterval(() => {
      getTokenAmount();
    }, 5000);
    return () => clearInterval(interval);
  }, [wallet]);

  useEffect(() => {
    if (pendingAmount > 0) setGameStatus(2);
  }, [pendingAmount]);

  const getTokenAmount = async () => {
    setTokenAmount(Number(await getWOLFIESbalance()));
  };

  const getPendingAmount = async () => {
    let last = await getFlipLastPlay();
    setPendingAmount(Number(last.pendingAmount));
  };

  return (
    <div className="coinflip-dashboard">
      {/* <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} wind={-0.01} recycle={false}/> */}
      <div className="dashboard-header">
        <h2>
          COIN FLIP&nbsp;&nbsp;:&nbsp;&nbsp;
          <span style={{ color: '#00ff00' }}>
            {Math.floor((Number(tokenAmount) / Math.pow(10, InfoCoinflip.token_decimals)) * 100) /
              100}
          </span>{' '}
          WOLFIES
        </h2>
      </div>
      {gameStatus === 0 ? (
        <div className="coinflip-gameboard-wrapper">
          <div className="coinflip-gameboard">
            <div className="coin-select-panel">
              <div
                className={'front-coin coin-select-button ' + (selectedSide ? '' : 'active')}
                onClick={() => {
                  setSelectedSide(false);
                }}
              >
                <img src="/images/coin_front.png" className="coinimg" alt="Wolf Coin Front Side" />
              </div>
              <div
                className={'back-coin coin-select-button ' + (selectedSide ? 'active' : '')}
                onClick={() => {
                  setSelectedSide(true);
                }}
              >
                <img src="/images/coin_back.png" className="coinimg" alt="Wolf Coin Back Side" />
              </div>
            </div>
            <h3 className="coinflip-gameboard-h3">Choose your side</h3>
            <div className="wager-select-panel">
              {InfoCoinflip.wager_amount.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    type="button"
                    className={'btn-wager ' + (selectedAmount === idx ? 'active' : '')}
                    onClick={() => {
                      setSelectedAmount(idx);
                    }}
                  >
                    {item + ' WOLFIES'}
                  </button>
                );
              })}
            </div>
            <h3 className="coinflip-gameboard-h3">Choose amount</h3>
            <hr
              style={{
                width: '50%',
                color: 'rgb(158, 179, 213)',
                margin: '10px auto',
                opacity: 0.25,
              }}
            />
            <div className="btn-flip-wrapper">
              <button
                className="btn-flip"
                onClick={async () => {
                  try {
                    setGameStatus(1);
                    let res = await coinflip_flip(
                      selectedSide,
                      InfoCoinflip.wager_amount[selectedAmount]
                    );
                    if (res.result) {
                      setWinNumber(winNumber + 1);
                      setGameStatus(2);
                    } else {
                      setWinNumber(0);
                      setGameStatus(3);
                    }
                  } catch (err: any) {
                    openNotification('error', err.message);
                    setGameStatus(0);
                  }
                }}
              >
                Flip
              </button>
            </div>
          </div>
        </div>
      ) : gameStatus === 1 ? (
        <div className="coinflip-gameboard-wrapper">
          <div className="coinflip-gameboard">
            <div className="coin-flipping-panel">
              <div className="coin-flipping-image animation-front-image front-coin">
                <img src="/images/coin_front.png" alt="Wolf Coin Front Side" />
              </div>
              <div className="coin-flipping-image animation-back-image back-coin">
                <img src="/images/coin_back.png" alt="Wolf Coin Front Side" />
              </div>
            </div>
            <h3 className="coinflip-gameboard-h3">F l i p p i n g . . .</h3>
          </div>
        </div>
      ) : gameStatus === 2 ? (
        <div className="coinflip-gameboard-wrapper">
          <div className="coinflip-gameboard">
            <div className="coin-select-panel">
              <div
                className={'coin-result ' + (selectedSide === false ? 'front-coin' : 'back-coin')}
              >
                {!selectedSide ? (
                  <img src="/images/coin_front.png" alt="Wolf Coin Front Side" />
                ) : (
                  <img src="/images/coin_back.png" alt="Wolf Coin Back Side" />
                )}
              </div>
            </div>
            <h3 className="coinflip-gameboard-h3">
              Bet amount : {InfoCoinflip.wager_amount[selectedAmount]} WOLFIES
            </h3>
            <div className="btn-flip-wrapper">
              <button
                className="btn-flip"
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await coinflip_claim();
                    setLoading(false);
                    setGameStatus(0);
                    await sleep(100);
                  } catch (err: any) {
                    openNotification('error', err.message);
                    setLoading(false);
                  }
                }}
              >
                {loading ? <CircularProgress size={20} /> : ''} Redeem Reward
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="coinflip-gameboard-wrapper">
          <div className="coinflip-gameboard">
            <div className="coin-select-panel">
              <div
                className={'coin-result ' + (selectedSide === false ? 'back-coin' : 'front-coin')}
              >
                {!selectedSide ? (
                  <img src="/images/coin_front.png" alt="Wolf Coin Front Side" />
                ) : (
                  <img src="/images/coin_back.png" alt="Wolf Coin Back Side" />
                )}
              </div>
            </div>
            <h3 className="coinflip-gameboard-h3">
              You lost {InfoCoinflip.wager_amount[selectedAmount]} WOLFIES
            </h3>
            <div className="btn-flip-wrapper">
              <button
                className="btn-flip"
                onClick={async () => {
                  setGameStatus(0);
                }}
              >
                Back and Retry
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="recent-game-header">Recent Games</div>
      <div className="recent-game-body">
        {recentGames.map((item, idx) => {
          return (
            <div className="recent-game-item " key={idx}>
              <div className="recent-game-detail">
                <div className="item">
                  <div className="logo">
                    {item.result && item.select === 1 ? (
                      <img src="/images/coin_front.png" alt="Wolf Coin Front Side" />
                    ) : (
                      <img src="/images/coin_back.png" alt="Wolf Coin Back Side" />
                    )}
                  </div>
                </div>
                <div className="item">{item.player.substr(0, 10) + '...'}</div>
                <div className="item bet-amount">bet {item.amount} WOLFIES</div>
                {((item.result && item.select === 1) ||
                  (item.result === false && item.select === 2)) && (
                  <div className="item">
                    <div className="bet-image">
                      <img src="/images/crown.svg" width="14px" alt="crown" />
                    </div>
                  </div>
                )}
              </div>
              <div className="recent-game-time">
                <div className="item-name">5 MINUTES AGO</div>
              </div>
            </div>
          );
        })}
        <div className="show-more">
          <button className="btn-more">SHOW MORE</button>
        </div>
      </div>
    </div>
  );
}
