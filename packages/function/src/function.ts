import { BigInt, environment, ERC20Token, log, SwapBuilder, TokenAmount, TransferBuilder } from '@mimicprotocol/lib-ts'

import { ERC20 } from './types/ERC20'
import { inputs } from './types'

export default function main(): void {
  const context = environment.getContext()
  const sourceChain = inputs.sourceChain
  const destinationChain = inputs.destinationChain
  const tokenIn = inputs.sourceToken
  const tokenOut = inputs.destinationToken

  const tokenContractOut = new ERC20(tokenOut, destinationChain)
  const balance = tokenContractOut.balanceOf(inputs.recipient).unwrap()

  const tokenOutMeta = ERC20Token.fromAddress(tokenOut, destinationChain)
  const threshold = BigInt.fromStringDecimal(inputs.thresholdAmount, tokenOutMeta.decimals)

  if (balance.ge(threshold)) {
    log.info(`balance over threshold, balance ${balance}, threshold ${threshold}`)
    return
  }

  const targetTokenOut = BigInt.fromStringDecimal(inputs.targetAmount, tokenOutMeta.decimals)

  if (targetTokenOut.lt(threshold)) {
    log.info(`invalid config, targetTokenOut ${targetTokenOut} is below threshold ${threshold}`)
    return
  }

  if (balance.ge(targetTokenOut)) return

  const amountOut = targetTokenOut.minus(balance)

  if (sourceChain == destinationChain && tokenIn.toHexString() == tokenOut.toHexString()) {
    const tokenInMeta = ERC20Token.fromAddress(tokenIn, sourceChain)
    const topUpAmount = TokenAmount.fromBigInt(tokenInMeta, amountOut)
    const maxFee = TokenAmount.fromStringDecimal(tokenInMeta, inputs.maxFee)

    TransferBuilder.forChain(sourceChain)
      .addTransferFromTokenAmount(topUpAmount, inputs.recipient)
      .addUser(context.user)
      .addMaxFee(maxFee)
      .build()
      .send()
  } else {
    const topUpAmountOut = TokenAmount.fromBigInt(tokenOutMeta, amountOut)
    const minAmountOut = topUpAmountOut.applySlippageBps(inputs.slippage as i32)
    const tokenInMeta = ERC20Token.fromAddress(tokenIn, sourceChain)
    const expectedIn = topUpAmountOut.toTokenAmount(tokenInMeta).unwrap()

    SwapBuilder.forChains(sourceChain, destinationChain)
      .addTokenInFromTokenAmount(expectedIn)
      .addTokenOutFromTokenAmount(minAmountOut, inputs.recipient)
      .addUser(context.user)
      .build()
      .send()
  }
}
