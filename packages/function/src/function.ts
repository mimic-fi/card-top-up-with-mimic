import {
  Arbitrum,
  Base,
  BigInt,
  ChainId,
  environment,
  ERC20Token,
  Ethereum,
  Gnosis,
  log,
  Optimism,
  SwapBuilder,
  Token,
  TokenAmount,
  TransferBuilder,
} from '@mimicprotocol/lib-ts'

import { ERC20 } from './types/ERC20'
import { inputs } from './types'

export default function main(): void {
  const context = environment.getContext()
  const sourceChain = inputs.sourceChain
  const destinationChain = inputs.destinationChain

  const tokenIn = getUsdc(sourceChain)
  const tokenOut = getUsdc(destinationChain)

  const tokenContractOut = new ERC20(tokenOut.address, destinationChain)
  const balance = tokenContractOut.balanceOf(inputs.recipient).unwrap()

  const tokenOutMeta = ERC20Token.fromAddress(tokenOut.address, destinationChain)
  const threshold = BigInt.fromStringDecimal(inputs.threshold, tokenOutMeta.decimals)

  if (balance.ge(threshold)) {
    log.info(`balance over threshold, balance ${balance}, threshold ${threshold}`)
    return
  }

  const topUpOverThreshold = BigInt.fromStringDecimal(inputs.topUpOverThreshold, tokenOutMeta.decimals)
  const amount = threshold.plus(topUpOverThreshold).minus(balance)
  const topUpAmount = TokenAmount.fromBigInt(tokenIn, amount)

  if (sourceChain == destinationChain) {
    const maxFee = TokenAmount.fromStringDecimal(tokenIn, inputs.maxFee)

    TransferBuilder.forChain(sourceChain)
      .addTransferFromTokenAmount(topUpAmount, inputs.recipient)
      .addUser(context.user)
      .addMaxFee(maxFee)
      .build()
      .send()
  } else {
    const topUpAmountOut = TokenAmount.fromBigInt(tokenOut, amount)
    const maxFee = TokenAmount.fromStringDecimal(tokenOut, inputs.maxFee)

    SwapBuilder.forChains(sourceChain, destinationChain)
      .addTokenInFromTokenAmount(topUpAmount)
      .addTokenOutFromTokenAmount(topUpAmountOut, inputs.recipient)
      .addUser(context.user)
      .addMaxFee(maxFee)
      .build()
      .send()
  }
}

function getUsdc(chainId: i32): Token {
  if (chainId == ChainId.ARBITRUM) return Arbitrum.USDC
  if (chainId == ChainId.BASE) return Base.USDC
  if (chainId == ChainId.ETHEREUM) return Ethereum.USDC
  if (chainId == ChainId.OPTIMISM) return Optimism.USDC
  if (chainId == ChainId.GNOSIS) return Gnosis.USDC
  throw new Error(`Invalid chain ${chainId}`)
}
