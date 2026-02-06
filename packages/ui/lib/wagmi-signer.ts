import { Config, getAccount, signMessage } from 'wagmi'
import { Signer } from '@mimicprotocol/sdk'

export class WagmiSigner implements Signer {
  constructor(
    private address: string,
    private config: Config
  ) {}

  async sign(message: string): Promise<string> {
    try {
      const signature = await signMessage(this.config, {
        account: this.address as `0x${string}`,
        message,
      })
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      throw error
    }
  }
}
