import { SDK, Trigger } from '@mimicprotocol/sdk'
import { WagmiSigner } from './wagmi-signer'
import { Chain } from './chains'
import { Token } from './tokens'

interface CardTopUpParams {
  sourceChain: Chain
  sourceToken: Token
  destinationChain: Chain
  recipientAddress: string
  threshold: string
  topUpOverThreshold: string
  maxFee: string
  signer: WagmiSigner
  userAddress: string
}

export async function createCardTopUp(params: CardTopUpParams): Promise<Trigger> {
  const sdk = new SDK(params.signer)

  const topUpFunction = sdk.function({
    address: '0x0000000000000000000000000000000000000000', // Replace with actual function address
  })

  const trigger = await topUpFunction.createTrigger({
    inputs: {
      sourceChain: params.sourceChain.id,
      destinationChain: params.destinationChain.id,
      recipient: params.recipientAddress,
      threshold: params.threshold,
      topUpOverThreshold: params.topUpOverThreshold,
      maxFee: params.maxFee,
    },
  })

  return trigger
}

export async function deactivateCardTopUp(
  trigger: Trigger,
  signer: WagmiSigner
): Promise<void> {
  const sdk = new SDK(signer)
  await sdk.trigger(trigger.sig).disable()
}

export async function getCardTopUpStatus(triggerSig: string): Promise<Trigger | null> {
  // This would fetch the trigger status from the Mimic API
  return null
}
