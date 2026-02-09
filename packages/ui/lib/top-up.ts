import { fp, Trigger, createExecuteOnceTriggerConfig } from '@mimicprotocol/sdk'
import type { Chain } from '@/lib/chains'
import type { Token } from '@/lib/tokens'
import sdk from '@/lib/sdk'
import { WagmiSigner } from '@/lib/wagmi-signer'
import { FUNCTION_CID } from '@/lib/constants'
import { findCurrentTrigger } from '@/lib/functions'

interface TopUpParams {
  sourceChain: Chain
  sourceToken: Token
  destinationChain: Chain
  destinationToken: Token
  targetAmount: string
  thresholdAmount: string
  recipient: string
  maxFee: string
  slippage: string
  signer: WagmiSigner
}

interface CancelParams {
  trigger: Trigger
  signer: WagmiSigner
}

function bumpPatch(version: string): string {
  const [major = '0', minor = '0', patch = '0'] = version.split('.')
  return `${major}.${minor}.${Number(patch) + 1}`
}

export async function cancel(params: CancelParams): Promise<Trigger> {
  const { trigger, signer } = params
  return sdk().triggers.signAndDeactivate(trigger.sig, signer)
}

export async function topUp(params: TopUpParams): Promise<Trigger> {
  const {
    sourceChain,
    sourceToken,
    destinationChain,
    destinationToken,
    thresholdAmount,
    targetAmount,
    recipient,
    maxFee,
    slippage,
    signer,
  } = params

  let description = `Top up to ${targetAmount} ${destinationToken.symbol} on ${destinationChain.name} when balance drops below ${thresholdAmount} ${destinationToken.symbol}`
  if (sourceChain.id !== destinationChain.id) description += `. Pay with ${sourceToken.symbol} on ${sourceChain.name}.`

  const manifest = await sdk().functions.getManifest(FUNCTION_CID)
  const config = (await findCurrentTrigger(signer.address)) || (await findCurrentTrigger(signer.address, false))
  const version = config ? bumpPatch(config.version) : '0.0.1'
  return sdk().triggers.signAndCreate(
    {
      functionCid: FUNCTION_CID,
      version,
      manifest,
      description,
      config: createExecuteOnceTriggerConfig(),
      input: {
        sourceChain: sourceChain.id,
        sourceToken: sourceToken.address,
        destinationChain: destinationChain.id,
        destinationToken: destinationToken.address,
        thresholdAmount,
        targetAmount,
        recipient,
        maxFee,
        slippage,
      },
      executionFeeLimit: fp(1).toString(),
      minValidations: 1,
    },
    signer
  )
}
