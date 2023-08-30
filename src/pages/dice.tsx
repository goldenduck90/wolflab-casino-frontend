import React, { useEffect, useState, useRef } from 'react';
import { openNotification } from '../utils/components';
import { CircularProgress } from '@mui/material';
import { InfoDice } from '../utils/constants';
import { useProgram } from '../utils/useProgram';
import ReactDice, { ReactDiceRef } from 'react-dice-complete';
import { useWeb3 } from '../utils/useWeb3';

const mockRecentGames = [
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[0],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[1],
    result: false,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 2,
    amount: InfoDice.wager_amount[3],
    result: false,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 2,
    amount: InfoDice.wager_amount[0],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 2,
    amount: InfoDice.wager_amount[5],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[1],
    result: true,
  },
  {
    player: '0xa72c7b4a20f553c581cfcac3b9a06020d13448c27892c6109971a2fa7144c296',
    select: 1,
    amount: InfoDice.wager_amount[1],
    result: true,
  },
];
export default function DiceGame() {
  const wallet = useWeb3().walletAddress;
  const {
    getWOLFIESbalance,
    diceRoll: dice_roll,
    diceClaim: dice_claim,
    getDiceLastPlay,
  } = useProgram();
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const [userData, setUserData] = useState<any>(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [selectedCase, setSelectedCase] = useState(2);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [isRoll, setIsRoll] = useState(false);
  const [loading, setLoading] = useState(false);

  const reactDice1 = useRef<ReactDiceRef>(null);
  const reactDice2 = useRef<ReactDiceRef>(null);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    getUserData();
    const interval = setInterval(() => {
      getTokenAmount();
    }, 5000);
    return () => clearInterval(interval);
  }, [wallet]);

  const getTokenAmount = async () => {
    setTokenAmount(Number(await getWOLFIESbalance()));
  };

  const getUserData = async () => {
    const ud = await getDiceLastPlay();
    if (ud != null && ud.result && !ud.claimed) {
      setUserData(ud);
    } else {
      setUserData(null);
    }
  };

  return (
    <div className="dice-dashboard">
      <div className="dashboard-header">
        <h2>
          DICE GAME&nbsp;&nbsp;:&nbsp;&nbsp;
          <span style={{ color: '#00ff00' }}>
            {Math.floor((tokenAmount / 10 ** InfoDice.token_decimals) * 100) / 100}
          </span>{' '}
          WOLFIES
        </h2>
      </div>
      <div className="dice-gameboard-wrapper">
        <div className="dice-gameboard">
          {userData == null ? (
            <div className="dice-panel">
              <div className="one-dice">
                <ReactDice
                  faceColor="linear-gradient(268.42deg, rgb(5, 38, 4) 0%, rgba(5, 38, 4, 0.9) 100.18%)"
                  ref={reactDice1}
                  dieSize={windowSize > 770 ? 160 : 120}
                  dieCornerRadius={5}
                  defaultRoll={(Math.floor(new Date().getTime() / 19) % 6) + 1}
                  numDice={1}
                  rollTime={7}
                  outline
                  rollDone={() => {
                    if (isRoll) reactDice1.current?.rollAll();
                  }}
                />
              </div>
              <div className="one-dice">
                <ReactDice
                  faceColor="linear-gradient(268.42deg, rgb(5, 38, 4) 0%, rgba(5, 38, 4, 0.9) 100.18%)"
                  ref={reactDice2}
                  dieSize={windowSize > 770 ? 160 : 120}
                  dieCornerRadius={5}
                  defaultRoll={(Math.floor(new Date().getTime() / 139) % 6) + 1}
                  numDice={1}
                  rollTime={7}
                  outline
                  rollDone={() => {
                    if (isRoll) reactDice2.current?.rollAll();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="dice-panel">
              <div className="one-dice first-dice">{userData.dice1}</div>
              <div className="one-dice second-dice">{userData.dice2}</div>
            </div>
          )}
          {userData == null ? (
            <div className="dice-option-panel">
              <div className="case-select-panel">
                <button
                  type="button"
                  className={'btn-case ' + (selectedCase === 2 ? 'active' : '')}
                  onClick={() => {
                    setSelectedCase(2);
                  }}
                >
                  Higher
                </button>
                <button
                  type="button"
                  className={'btn-case ' + (selectedCase === 1 ? 'active' : '')}
                  onClick={() => {
                    setSelectedCase(1);
                  }}
                >
                  Equal
                </button>
                <button
                  type="button"
                  className={'btn-case ' + (selectedCase === 0 ? 'active' : '')}
                  onClick={() => {
                    setSelectedCase(0);
                  }}
                >
                  Lower
                </button>
              </div>
              <h3 className="dice-gameboard-h3">Choose case</h3>
              <div className="wager-select-panel">
                {InfoDice.wager_amount.map((item, idx) => {
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
              <h3 className="dice-gameboard-h3">Choose amount</h3>
              <hr
                style={{
                  width: '50%',
                  color: 'rgb(118, 139, 173)',
                  margin: '10px auto',
                  opacity: 0.25,
                }}
              />
              <div className="btn-roll-wrapper">
                <button
                  className="btn-roll"
                  onClick={async () => {
                    setIsRoll(true);
                    try {
                      reactDice1.current?.rollAll();
                      reactDice2.current?.rollAll();
                      let res = await dice_roll(
                        selectedCase,
                        InfoDice.wager_amount[selectedAmount]
                      );
                      // console.log(res.events[0].parsedJson)

                      setUserData(res);
                    } catch (err: any) {
                      openNotification('error', err.message);
                    }
                    setIsRoll(false);
                  }}
                >
                  Roll
                </button>
              </div>
            </div>
          ) : userData.result ? (
            <div className="dice-option-panel dice-result">
              <div className="dice-result-banner">👍</div>
              <h3 className="dice-result-description win-result">You win</h3>
              <div className="btn-roll-wrapper">
                <button
                  className="btn-redeem"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await dice_claim();
                      setLoading(false);
                      setUserData(null);
                    } catch (err: any) {
                      openNotification('error', err.message);
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? <CircularProgress color="success" size={20} /> : ''} Redeem Reward
                </button>
              </div>
              ``
            </div>
          ) : (
            <div className="dice-option-panel dice-result">
              <div className="dice-result-banner">👎</div>
              <h3 className="dice-result-description lost-result">You lost</h3>
              <div className="btn-roll-wrapper">
                <button
                  className="btn-back"
                  onClick={async () => {
                    setUserData(null);
                  }}
                >
                  Back and Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="recent-game-header">Recent Games</div>
      <div className="recent-game-body">
        {mockRecentGames.map((item, idx) => {
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
