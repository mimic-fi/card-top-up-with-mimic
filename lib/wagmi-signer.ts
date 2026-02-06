import { Signer } from 'viem'
import { useConnectorClient } from 'wagmi'

export async function WagmiSigner(): Promise<Signer> {
  const { data: client } = useConnectorClient()
  if (!client) throw new Error('No connector client')
  return client as unknown as Signer
}
