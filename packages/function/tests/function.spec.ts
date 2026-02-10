import { Chains, fp, OpType, randomEvmAddress } from '@mimicprotocol/sdk'
import { Context, EvmCallQueryMock, runFunction, Swap, TokenPriceQueryMock, Transfer } from '@mimicprotocol/test-ts'
import { expect } from 'chai'
import { Interface } from 'ethers'

import ERC20Abi from '../abis/ERC20.json'

const ERC20Interface = new Interface(ERC20Abi)

describe('Function', () => {
  const buildDir = './build'

  const chainId = Chains.Optimism
  const context: Context = {
    user: randomEvmAddress(),
    settlers: [{ address: randomEvmAddress(), chainId }],
    timestamp: Date.now(),
  }

  const optimismUsdc = '0x0b2c639c533813f4aa9d7837caf62653d097ff85'
  const baseUsdc = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'

  const buildBalanceCalls = (
    destinationChain: number,
    destinationToken: string,
    recipient: string,
    balance: string
  ): EvmCallQueryMock[] => [
    {
      request: {
        to: destinationToken,
        chainId: destinationChain,
        fnSelector: ERC20Interface.getFunction('balanceOf')!.selector,
        params: [{ value: recipient, abiType: 'address' }],
      },
      response: { value: balance, abiType: 'uint256' },
    },
  ]

  const buildTokenCalls = (chain: number, token: string): EvmCallQueryMock[] => [
    {
      request: {
        to: token,
        chainId: chain,
        fnSelector: ERC20Interface.getFunction('decimals')!.selector,
      },
      response: { value: '6', abiType: 'uint8' },
    },
  ]

  const buildPrices = (chain: number, token: string, price: string): TokenPriceQueryMock[] => [
    {
      request: { token: { address: token, chainId: chain } },
      response: [fp(price).toString()],
    },
  ]

  describe('when the chain is supported', () => {
    describe('when the balance is over or equal to the threshold', () => {
      const inputs = {
        sourceChain: chainId,
        sourceToken: optimismUsdc,
        destinationChain: chainId,
        destinationToken: optimismUsdc,
        thresholdAmount: '0.02',
        targetAmount: '0.03',
        recipient: randomEvmAddress(),
        maxFee: '0.1',
        slippage: 1,
      }

      const balance = '21000' // 0.021 USDC
      const calls = [
        ...buildBalanceCalls(inputs.destinationChain, inputs.destinationToken, inputs.recipient, balance),
        ...buildTokenCalls(inputs.destinationChain, inputs.destinationToken),
      ]

      it('does not produce any intent', async () => {
        const result = await runFunction(buildDir, context, { inputs, calls })
        expect(result.success).to.be.true
        expect(result.intents).to.be.empty
      })
    })

    describe('when the balance is below the threshold', () => {
      const balance = '10000' // 0.01 USDC

      describe('when source and destination chain are the same', () => {
        const inputs = {
          sourceChain: chainId,
          sourceToken: optimismUsdc,
          destinationChain: chainId,
          destinationToken: optimismUsdc,
          thresholdAmount: '0.02',
          targetAmount: '0.03',
          recipient: randomEvmAddress(),
          maxFee: '0.1',
          slippage: 1,
        }

        const calls = [
          ...buildBalanceCalls(inputs.destinationChain, inputs.destinationToken, inputs.recipient, balance),
          ...buildTokenCalls(inputs.destinationChain, inputs.destinationToken),
          ...buildTokenCalls(inputs.sourceChain, inputs.sourceToken),
        ]

        it('produces the expected intents', async () => {
          const result = await runFunction(buildDir, context, { inputs, calls })

          expect(result.success).to.be.true
          expect(result.timestamp).to.be.equal(context.timestamp)

          const intents = result.intents as Transfer[]
          expect(intents).to.have.lengthOf(1)

          expect(intents[0].op).to.be.equal(OpType.Transfer)
          expect(intents[0].settler).to.be.equal(context.settlers?.[0].address)
          expect(intents[0].user).to.be.equal(context.user)
          expect(intents[0].chainId).to.be.equal(inputs.sourceChain)

          expect(intents[0].maxFees).to.have.lengthOf(1)
          expect(intents[0].maxFees[0].token).to.be.equal(inputs.sourceToken)
          expect(intents[0].maxFees[0].amount).to.be.equal(fp(inputs.maxFee, 6).toString())

          expect(intents[0].transfers).to.have.lengthOf(1)
          expect(intents[0].transfers[0].token).to.be.equal(inputs.destinationToken)
          expect(intents[0].transfers[0].amount).to.be.equal(fp('0.02', 6).toString())
          expect(intents[0].transfers[0].recipient).to.be.equal(inputs.recipient)
        })
      })

      describe('when source an destination chain are different', () => {
        const inputs = {
          sourceChain: chainId,
          sourceToken: optimismUsdc,
          destinationChain: Chains.Base,
          destinationToken: baseUsdc,
          thresholdAmount: '0.02',
          targetAmount: '0.03',
          recipient: randomEvmAddress(),
          maxFee: '0.1',
          slippage: 1,
        }

        const calls = [
          ...buildBalanceCalls(inputs.destinationChain, inputs.destinationToken, inputs.recipient, balance),
          ...buildTokenCalls(inputs.destinationChain, inputs.destinationToken),
          ...buildTokenCalls(inputs.sourceChain, inputs.sourceToken),
        ]

        const prices = [
          ...buildPrices(inputs.sourceChain, inputs.sourceToken, '1'),
          ...buildPrices(inputs.destinationChain, inputs.destinationToken, '1'),
        ]

        it('produces the expected intents', async () => {
          const result = await runFunction(buildDir, context, { inputs, calls, prices })

          expect(result.success).to.be.true
          expect(result.timestamp).to.be.equal(context.timestamp)

          const intents = result.intents as Swap[]
          expect(intents).to.have.lengthOf(1)

          expect(intents[0].op).to.be.equal(OpType.Swap)
          expect(intents[0].settler).to.be.equal(context.settlers?.[0].address)
          expect(intents[0].user).to.be.equal(context.user)

          expect(intents[0].destinationChain).to.be.equal(inputs.destinationChain)
          expect(intents[0].sourceChain).to.be.equal(inputs.sourceChain)

          expect(intents[0].tokensIn).to.have.lengthOf(1)
          expect(intents[0].tokensIn[0].token).to.be.equal(inputs.sourceToken)
          expect(intents[0].tokensIn[0].amount).to.be.equal(fp('0.02', 6).toString())

          expect(intents[0].tokensOut).to.have.lengthOf(1)
          expect(intents[0].tokensOut[0].token).to.be.equal(inputs.destinationToken)
          expect(intents[0].tokensOut[0].minAmount).to.be.equal(fp('0.019998', 6).toString())
          expect(intents[0].tokensOut[0].recipient).to.be.equal(inputs.recipient)
        })
      })
    })
  })
})
