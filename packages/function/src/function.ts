import { BigInt, ERC20Token, log, SwapBuilder, TokenAmount, TransferBuilder } from '@mimicprotocol/lib-ts'

import { ERC20 } from './types/ERC20'
import { inputs } from './types'

const BPS_DENOMINATOR = BigInt.fromI32(10_000)

export default function main(): void {
  const slippageBps = BigInt.fromI32(inputs.slippageBps as i32)
  if (slippageBps.gt(BPS_DENOMINATOR)) throw new Error('Slippage must be between 0 and 100 BPS')

  const tokenOutContract = new ERC20(inputs.destinationToken, inputs.destinationChain)
  const balance = tokenOutContract.balanceOf(inputs.recipient).unwrap()
  const tokenOut = ERC20Token.fromAddress(inputs.destinationToken, inputs.destinationChain)
  const threshold = BigInt.fromStringDecimal(inputs.thresholdAmount, tokenOut.decimals)
  const target = BigInt.fromStringDecimal(inputs.targetAmount, tokenOut.decimals)
  if (target.lt(threshold))
    throw new Error(
      `Invalid config, target (${target.toStringDecimal(tokenOut.decimals)}) is below threshold (${threshold.toStringDecimal(tokenOut.decimals)})`
    )

  if (balance.ge(threshold)) {
    log.info(
      `Balance (${balance.toStringDecimal(tokenOut.decimals)}) over threshold (${threshold.toStringDecimal(tokenOut.decimals)})`
    )
    return
  }

  const tokenIn = ERC20Token.fromAddress(inputs.sourceToken, inputs.sourceChain)
  const amountOut = target.minus(balance)

  if (inputs.sourceChain == inputs.destinationChain && tokenIn.equals(tokenOut)) {
    const topUpAmount = TokenAmount.fromBigInt(tokenIn, amountOut)
    const maxFee = TokenAmount.fromStringDecimal(tokenIn, inputs.maxFee)

    TransferBuilder.forChain(inputs.sourceChain)
      .addTransferFromTokenAmount(topUpAmount, inputs.recipient)
      .addMaxFee(maxFee)
      .build()
      .send()
  } else {
    const topUpAmountOut = TokenAmount.fromBigInt(tokenOut, amountOut)
    const minAmountOut = topUpAmountOut.applySlippageBps(inputs.slippageBps)
    const amountIn = topUpAmountOut.toTokenAmount(tokenIn).unwrap()

    SwapBuilder.forChains(inputs.sourceChain, inputs.destinationChain)
      .addTokenInFromTokenAmount(amountIn)
      .addTokenOutFromTokenAmount(minAmountOut, inputs.recipient)
      .build()
      .send()
  }
}
