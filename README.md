# Real Estate Tokenization dApp (MANTRA Chain)

This repository contains both the **smart contracts** and **frontend dApp** for a simple demonstration of real estate tokenization on the **MANTRA EVM Chain (Dukong Testnet)**.

## Overview

This dApp demonstrates **tokenization of real-world assets** using ERC-20-compatible shares.  
Each real estate project is deployed as its own ERC-20 token contract with a fixed maximum supply of 100 shares.

### Key Contracts

| Contract | Purpose |
|-----------|----------|
| **Whitelist.sol** | Maintains investor approvals per project (only admin can approve or revoke). |
| **RealEstateToken.sol** | ERC-20 token representing shares in a single real estate project. Enforces whitelist and supply cap. |
| **RealEstateFactory.sol** | Deploys new `RealEstateToken` projects and tracks all deployed projects. |

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/real-estate-dapp.git
cd real-estate-dapp
