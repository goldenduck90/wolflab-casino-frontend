import {
  Brightness7 as Brightness7Icon,
  Brightness3 as Brightness3Icon,
  ComputerTwoTone as ComputerIcon,
  Person3TwoTone as PersonIcon,
} from '@mui/icons-material';
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
  const { coinflip_flip, coinflip_claim, getWOLFIESbalance, getFlipLastPlay } = useProgram();

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
          <span style={{ color: '#00ffff' }}>
            {Math.floor((Number(tokenAmount) / Math.pow(10, InfoCoinflip.token_decimals)) * 100) /
              100}
          </span>{' '}
          WOLFIES
        </h2>
      </div>
      {gameStatus === 0 ? (
        <div className="coinflip-gameboard">
          <div className="coin-select-panel">
            <div
              className={'front-coin coin-select-button ' + (selectedSide ? '' : 'active')}
              onClick={() => {
                setSelectedSide(false);
              }}
            >
              <Brightness7Icon style={{ fontSize: '80px' }} />
            </div>
            <div
              className={'back-coin coin-select-button ' + (selectedSide ? 'active' : '')}
              onClick={() => {
                setSelectedSide(true);
              }}
            >
              <Brightness3Icon style={{ fontSize: '80px' }} />
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
              color: 'rgb(118, 139, 173)',
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
      ) : gameStatus === 1 ? (
        <div className="coinflip-gameboard">
          <div className="coin-flipping-panel">
            <div className="coin-flipping-image animation-front-image front-coin">
              <Brightness7Icon style={{ fontSize: '160px' }} />
            </div>
            <div className="coin-flipping-image animation-back-image back-coin">
              <Brightness3Icon style={{ fontSize: '160px' }} />
            </div>
          </div>
          <h3 className="coinflip-gameboard-h3">F l i p p i n g . . .</h3>
        </div>
      ) : gameStatus === 2 ? (
        <div className="coinflip-gameboard">
          <div className="coin-select-panel">
            <div className={'coin-result ' + (selectedSide === false ? 'front-coin' : 'back-coin')}>
              {!selectedSide ? (
                <Brightness7Icon style={{ fontSize: '160px' }} />
              ) : (
                <Brightness3Icon style={{ fontSize: '160px' }} />
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
      ) : (
        <div className="coinflip-gameboard">
          <div className="coin-select-panel">
            <div className={'coin-result ' + (selectedSide === false ? 'back-coin' : 'front-coin')}>
              {!selectedSide ? (
                <Brightness3Icon style={{ fontSize: '160px' }} />
              ) : (
                <Brightness7Icon style={{ fontSize: '160px' }} />
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
      )}
      <div className="recent-game-header">Recent Games</div>
      <div className="recent-game-body">
        {recentGames.map((item, idx) => {
          return (
            <div
              className={
                'recent-game-item ' +
                ((item.result && item.select === 1) || (item.result === false && item.select === 2)
                  ? 'recent-game-blue-item '
                  : 'recent-game-red-item ') +
                (idx === 0 ? 'recent-game-top-item ' : '') +
                (idx === recentGames.length - 1 ? 'recent-game-bottom-item' : '')
              }
              key={idx}
            >
              <div
                className={
                  'recent-game-left-right recent-game-left ' +
                  ((item.result && item.select === 1) ||
                  (item.result === false && item.select === 2)
                    ? 'win-panel'
                    : '')
                }
              >
                <div className="item">
                  <div className="logo left-logo">
                    {item.select === 1 ? (
                      <PersonIcon className="logo-icon" />
                    ) : (
                      <ComputerIcon className="logo-icon" />
                    )}
                  </div>
                </div>
                <div className="item">
                  <div className="item-name">
                    {item.select === 1 ? item.player.substr(0, 8) : '(Flip Bot)'}
                  </div>
                </div>
                {((item.result && item.select === 1) ||
                  (item.result === false && item.select === 2)) && (
                  <div className="item item-flex">
                    <div className="bet-amount">
                      <div className="coin-image" />
                      <div className="amount">{item.amount}</div>
                    </div>
                    <div className="bet-image">
                      <img src="/images/crown.svg" width="14px" alt="crown" />
                    </div>
                  </div>
                )}
              </div>
              <div className="recent-game-center">
                {(item.result && item.select === 1) ||
                (item.result === false && item.select === 2) ? (
                  <div className="front-coin coin">
                    <Brightness7Icon />
                  </div>
                ) : (
                  <div className="back-coin coin">
                    <Brightness3Icon />
                  </div>
                )}
              </div>
              <div
                className={
                  'recent-game-left-right recent-game-right ' +
                  ((item.result && item.select === 1) ||
                  (item.result === false && item.select === 2)
                    ? ''
                    : 'win-panel')
                }
              >
                <div className="item">
                  <div className="logo right-logo">
                    {item.select === 1 ? (
                      <ComputerIcon className="logo-icon" />
                    ) : (
                      <PersonIcon className="logo-icon" />
                    )}
                  </div>
                </div>
                <div className="item">
                  <div className="item-name">
                    {item.select === 2 ? item.player.substr(0, 8) : '(Flip Bot)'}
                  </div>
                </div>
                {((item.result && item.select === 2) ||
                  (item.result === false && item.select === 1)) && (
                  <div className="item item-flex">
                    <div className="bet-amount">
                      <div className="coin-image" />
                      <div className="amount">{item.amount}</div>
                    </div>
                    <div className="bet-image">
                      <img src="/images/crown.svg" width="14px" alt="crown" />
                    </div>
                  </div>
                )}
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
