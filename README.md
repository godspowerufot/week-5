 

```markdown
# Week 5: Raydium Composability Library - DeFi Yield Aggregator Use Case

## ✅ Overview

This week involved exploring the Raydium composability library deployed on `neondevnet`, analyzing its core primitives, and developing a creative DeFi use case.

After testing and deploying the library scripts, I designed a gamified DeFi system called:

> ## 🥊 PvP DeFi Battles – “Battle of the Pools”

It leverages Raydium’s AMM and composability instructions to allow users to **create competing liquidity pools**, **battle via swap activity or fees**, and **win pooled rewards or NFTs** after a 7-day epoch.

---

## 📦 Deployment Summary

| Parameter | Value |
|----------|-------|
| Network | `neondevnet` |
| NEON Airdrop | ✅ 100 NEON to `0x20Ba8169cF3833B13B2943C760A2449Dbf56d55E` |
| Deployer | `0xAaA11D5b2873af87c887CaaBE05109e903F1be6a` |
| Balance | `4210.71 NEON` |
| Contract | `CallRaydiumProgram` |
| EVM Address | `0x445E1b09649ee3E30dD83f5071F5d61636D094f9` |
| Token A (SPL) | `BTzkZLY1GmgFwLff2AyfyGfjbPLLQJKJtkrQAPQwuKf6` |
| Token B (WSOL) | `So11111111111111111111111111111111111111112` |
| ATA | `H5kUgSCo5UuhqV62LRTyhwCmJpsuQHotM5YUVMhD9Sm2` |
| Program | `LibRaydiumProgram` |

---

## ⚔️ Use Case: PvP DeFi Battles – “Battle of the Pools”

### 📘 Concept

Two (or more) users create identical token-pair liquidity pools on Raydium. Over the course of 7 days, users compete to generate:

- 🌀 Highest swap volume  
- 💰 Highest accumulated fees  
- 🧠 Most strategic liquidity moves

At the end of the epoch, the **winning pool** earns **fee rewards** from both pools and participants can be rewarded with **battle trophies (NFTs)**.

---

## 🛠 Instructions Used (Raydium Composability)

| Instruction | Purpose |
|-------------|---------|
| `createPoolInstruction` | Deploy isolated Raydium-style AMM pools for Token A/B |
| `addLiquidityInstruction` | Users add liquidity to their pool to compete |
| `swapInputInstruction` | Generates swap volume and trading activity |
| `collectFeesInstruction` | Track performance and fees |
| `withdrawLiquidityInstruction` | Exit the pool post-competition |

---

## 🔄 Technical Workflow

1. **Pool Creation**
   - User A and User B both call `createPoolInstruction` for the same token pair (e.g., WSOL/USDC).
   - These create isolated LP pools with separate fee tracking.

2. **Liquidity Phase**
   - Participants use `addLiquidityInstruction` to contribute tokens to either pool.

3. **Activity Phase (7 days)**
   - Swaps happen via `swapInputInstruction` on each pool.
   - Fees accumulate based on trading activity.
   - Optional: Use bots to simulate arbitrage or user activity.

4. **Evaluation Phase**
   - After 7 days, compare the result of `collectFeesInstruction` from both pools:
     - Pool with higher volume or fees is declared winner.

5. **Reward Distribution**
   - Winner pool's fees can be distributed to its LP providers.
   - Bonus NFT minted for LPs in the winning pool using `lockLiquidityInstruction`.

---

## 🧩 Optional Features

- **NFT Trophy Minting:**
  - Winning LPs can mint a Raydium-backed NFT showing victory stats.
  - `lockLiquidityInstruction` with metadata (pool address, epoch, rank)

- **Leaderboard / Stats UI:**
  - Show pool performance metrics over time: TVL, APR, swaps

- **Epoch DAO Voting:**
  - Governance for pool parameters or fee multiplier boosts.

- **Battle History:**
  - View past winners and top liquidity providers.

---

## 🧠 Benefits

- **Gamified DeFi**: Drives more user engagement into AMMs through competition.
- **Fair Ground**: Pools are isolated but use the same tokens — performance is all strategy.
- **Scalable**: Works with any token pair supported by Raydium.

---

## 📌 Conclusion

The PvP DeFi Battle system is a creative application of Raydium’s composability primitives. By combining AMM liquidity, isolated pools, and token incentives, it introduces a new **competitive dimension** to yield farming and community participation.

> This is a strong foundation for building more gamified, modular DeFi experiences on top of Raydium + Neon EVM.

---

## 📁 Files (Recommended)

```

/raydium-battle/
├── contracts/
│   └── BattlePoolFactory.sol
├── scripts/
│   └── deployPools.ts
│   └── monitorBattle.ts
├── frontend/
│   └── index.tsx
│   └── BattleDashboard.tsx
├── README.md

```

---


---
