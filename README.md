<h1 align="center">
  <a href="https://mimic.fi">
    <img src="https://www.mimic.fi/logo.png" alt="Mimic Protocol" width="200">
  </a>
</h1>

<h4 align="center">Blockchain developer platform</h4>

<p align="center">
  <a href="https://discord.mimic.fi">
    <img src="https://img.shields.io/badge/discord-join-blue" alt="Discord">
  </a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#scope">Scope</a> •
  <a href="#setup">Setup</a> •
  <a href="#license">License</a>
</p>

---

## Overview

In this example, the card balance is monitored and, when it falls below a configured threshold, a top-up is triggered automatically. The funding source can be any supported token on any supported chain.

The application defines:

- Top-up threshold (minimum balance)
- Target balance (top up to this value)
- Funding preferences (token, chain, limits)

The application does not implement:

- Automation scheduling or trigger execution
- Cross-chain execution flows
- Token swaps from arbitrary tokens into the settlement asset
- Bridging or cross-chain transfers
- Transaction execution routing
- Execution retries and failure handling
- Gas management or native token funding
- RPC connections or oracle integrations

Mimic handles execution by abstracting:

- Threshold-based automation triggers
- Cross-chain routing (when the funding token is on a different chain)
- Token swaps and settlement operations required for the top-up
- Transaction execution, retries, and failure handling
- Gas payment and transaction submission

This allows a card program to implement top-up policies and user preferences while delegating automation and execution complexity to Mimic.

## Scope

Mimic supports execution across multiple chains, including cross-chain top-up flows where the funding token and the settlement asset are on different networks. The same top-up model can be applied to other supported networks without changes to execution orchestration.

This repository demonstrates how to build a card top up system on Ethereum using Mimic as the execution and automation layer.

In this example, users can configure a card top up function payments using:

- Any supported token
- Without holding native tokens for gas

The application does not implement:

- Scheduled transaction execution
- Token swaps for card top up payments
- Cross-chain transfers
- Gas management
- RPC connections or oracle integrations

Mimic handles automation and execution by:

- Executing top up when threshold is reached
- Routing execution across chains when required
- Managing gas payment and retries
- Ensuring reliable execution without user intervention

This allows the application to define top up logic without maintaining custom automation or execution infrastructure.

## Scope

This example uses Ethereum as the reference chain.

Mimic supports execution across multiple chains, including cross-chain payment flows. The same subscription model applies to other supported networks.

## Setup

To set up this project you'll need [git](https://git-scm.com) and [yarn](https://classic.yarnpkg.com) installed.

From your command line:

```bash
# Clone the repository
git clone https://github.com/mimic-fi/card-top-up-with-mimic.git

# Enter the repository
cd card-top-up-with-mimic

# Install dependencies
yarn
```

## License

MIT

---

> Website [mimic.fi](https://mimic.fi) &nbsp;&middot;&nbsp;
> Docs [docs.mimic.fi](https://docs.mimic.fi) &nbsp;&middot;&nbsp;
> GitHub [@mimic-fi](https://github.com/mimic-fi) &nbsp;&middot;&nbsp;
> Twitter [@mimicfi](https://twitter.com/mimicfi) &nbsp;&middot;&nbsp;
> Discord [mimic](https://discord.mimic.fi)
