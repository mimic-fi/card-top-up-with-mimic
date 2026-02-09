import { fp, Trigger, TriggerType } from '@mimicprotocol/sdk'
import type { Chain } from '@/lib/chains'
import type { Token } from '@/lib/tokens'
import sdk from '@/lib/sdk'
import { WagmiSigner } from '@/lib/wagmi-signer'
import { FUNCTION_CID } from '@/lib/constants'
import { findCurrentTrigger } from '@/lib/functions'

interface TopUpParams {
  sourceChain: Chain
  destinationChain: Chain
  token: Token
  amount: string
  recipient: string
  maxFee: string
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
  const { sourceChain, destinationChain, token, amount, recipient, maxFee, signer } = params
  const description = `Top up $${amount} in ${token.symbol} from ${sourceChain.name} to ${destinationChain.name}`
  const manifest = await sdk().functions.getManifest(FUNCTION_CID)
  const config = (await findCurrentTrigger(signer.address)) || (await findCurrentTrigger(signer.address, false))
  const version = config ? bumpPatch(config.version) : '0.0.1'
  return sdk().triggers.signAndCreate(
    {
      functionCid: FUNCTION_CID,
      version,
      manifest,
      description,
      config: {
        type: TriggerType.Cron,
        schedule: '* * * * *',
        delta: '10m',
        endDate: 0,
      },
      input: {
        sourceChain: sourceChain.id,
        destinationChain: destinationChain.id,
        token: token.symbol,
        amountInUsd: amount,
        recipient,
        maxFee,
      },
      executionFeeLimit: fp(1).toString(),
      minValidations: 1,
    },
    signer
  )
}
