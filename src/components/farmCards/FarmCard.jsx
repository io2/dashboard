import React, { useContext, useState } from "react";
import HarvestContext from '../../Context/HarvestContext';
import ethers from 'ethers';

import { FarmCardContainer, UnderlyingBalanceContainer, CardInputContainer } from "./FarmCardStyles";

export default function FarmCard({ summary_information }) {
  const { state, prettyBalance, currentExchangeRate, isCheckingBalance, harvestAndStakeMessage, setHarvestAndStakeMessage } = useContext(HarvestContext)
  const [amount, setAmount] = useState(summary_information.unstakedBalance);
  const [isStaking, setStaking] = useState(false);
  const [isWithdrawing, setWithdrawing] = useState(false);
  const pool = state.manager.pools.find((pool) => {
    return pool.address === summary_information.address;
  });

  function formatBalance(balance) {
    var bal = parseFloat(balance);
    return bal == 0 ? bal : (bal.toFixed(6) == 0 ? bal.toExponential(4) : bal.toFixed(6));
  };

  const stake = async () => {
    const doStake = async (stakeAmount) => {
      await pool
        .stake(stakeAmount)
        .then(async (res) => {
          setHarvestAndStakeMessage({
            ...harvestAndStakeMessage,
            first: `Staking your ${summary_information.pool.name} tokens`,
            second: "",
          });
          await res.wait().then(() => {
            setStaking(false);
            setAmount(0);
            setHarvestAndStakeMessage({
              ...harvestAndStakeMessage,
              first: `Success!`,
              second: `${amount} tokens has been staked on ${summary_information.pool.name} pool!`,
            });
            const timer = setTimeout(() => {
              setHarvestAndStakeMessage({
                ...harvestAndStakeMessage,
                first: ``,
                second: "",
              });
            }, 3000);
            return () => clearTimeout(timer);
          });
        })
        .catch((e) => {
          setStaking(false);
          if (e.code !== 4001 || e.code !== -32603) {
            setHarvestAndStakeMessage({
              ...harvestAndStakeMessage,
              first: ``,
              second: "",
            });
            console.log(
              `You don't have enough ${amount} token to stake on ${summary_information.pool.name} pool`,
            );
          }
        });
    };
    setStaking(true);
    const allowance = await pool.lptoken.allowance(
      state.address,
      pool.address,
    );
    const stakeAmount = ethers.utils.parseUnits(amount.toString(), 18);
    if (allowance.lt(stakeAmount))
      await pool.lptoken.approve(pool.address, ethers.constants.MaxUint256).then(async (res) => {
        await doStake(stakeAmount);
      }).catch(err => {
        console.error(err);
        setStaking(false);
      });
    else {
      await doStake(stakeAmount);
    }
  };
  const withDraw = async () => {
    const doWithdraw = async (withdrawAmount) => {
      await pool
        .withdraw(withdrawAmount)
        .then(async (res) => {
          setHarvestAndStakeMessage({
            ...harvestAndStakeMessage,
            first: `Withdrawing your ${summary_information.pool.name} tokens`,
            second: "",
          });
          await res.wait().then(() => {
            setWithdrawing(false);
            setAmount(0);
            setHarvestAndStakeMessage({
              ...harvestAndStakeMessage,
              first: `Success!`,
              second: `${amount} tokens has been withdrawn on ${summary_information.pool.name} pool!`,
            });
            const timer = setTimeout(() => {
              setHarvestAndStakeMessage({
                ...harvestAndStakeMessage,
                first: ``,
                second: "",
              });
            }, 3000);
            return () => clearTimeout(timer);
          });
        })
        .catch((e) => {
          setWithdrawing(false);
          if (e.code !== 4001 || e.code !== -32603) {
            setHarvestAndStakeMessage({
              ...harvestAndStakeMessage,
              first: ``,
              second: "",
            });
            console.log(
              `You do not have enough ${amount} tokens to withdraw on ${summary_information.pool.name} pool`,
            );
          }
        });
    };
    setWithdrawing(true);
    const withdrawAmount = ethers.utils.parseUnits(amount.toString(), 18);
    await doWithdraw(withdrawAmount);
  };
  return (
    <FarmCardContainer>
      <div className="farm_card_title">{summary_information.name}</div>
      <div className="farm_card_content">
        <div className="card_property_section farm_earning">
          <label className="card_property_title">Earning</label>
          {/* TODO: Add icon here */}
          <p className="card_property_value">{summary_information.isActive ? <span role="img" aria-label="green checkmark">✅</span> : <span role="img" aria-label="red x">❌</span>}</p>
        </div>
        <div className="card_property_section farm_staked">
          <label className="card_property_title">Staked</label>
          <p className="card_property_value">{formatBalance(summary_information.stakedBalance)}</p>
        </div>
        <div className="card_property_section farm_claimable">
          <label className="card_property_title">Claimable</label>
          <p className="card_property_value">{(Math.floor(parseFloat(summary_information.earnedRewards) * 1000000) / 1000000).toFixed(6)}</p>
        </div>
        <div className="card_property_section farm_unstaked">
          <label className="card_property_title">Unstaked</label>
          <p className="card_property_value">{formatBalance(summary_information.unstakedBalance)}</p>
        </div>
        <div className="card_property_section farm_pool_percentage">
          <label className="card_property_title">% of Pool</label>
          <p className="card_property_value">{summary_information.percentOfPool}</p>
        </div>
        <div className="card_property_section farm_value">
          <label className="card_property_title">Value</label>
          <p className="card_property_value">{prettyBalance(summary_information.usdValueOf * currentExchangeRate)}</p>
        </div>

      </div>
      <UnderlyingBalanceContainer>
        <label className="underlying_balance_label">Underlying Balance:</label> <span className="underlying_balance_value">{summary_information.name === "FARM Profit Sharing" ? "N/A" : formatBalance(summary_information.underlyingBalance)}</span>
      </UnderlyingBalanceContainer>
      {summary_information.name !== "FARM Profit Sharing" &&
        <div className="card_input_area">
          {!isCheckingBalance &&
            (<CardInputContainer>
              <input value={amount} onChange={(e) => { setAmount(e.target.value) }} placeholder="Amount" type="number" min="1" className="card_amount_input" />
              <button className="button" onClick={() => stake()} disabled={parseFloat(amount) && !isStaking ? false : true}>Stake</button>
              <button className="button" onClick={() => withDraw()} disabled={parseFloat(amount) && !isWithdrawing ? false : true}>Withdraw</button>
            </CardInputContainer>)
          }
        </div>
      }
    </FarmCardContainer >
  )
}
