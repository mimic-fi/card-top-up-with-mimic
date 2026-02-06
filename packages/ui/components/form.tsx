'use client'

import { useAccount, useConfig } from 'wagmi'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings } from 'lucide-react'

import { Trigger } from '@mimicprotocol/sdk'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChainSelector } from '@/components/chain-selector'
import { TokenSelector } from '@/components/token-selector'
import { useToast } from '@/hooks/use-toast'
import { CHAINS, type Chain } from '@/lib/chains'
import { TOKENS, type Token } from '@/lib/tokens'
import { WagmiSigner } from '@/lib/wagmi-signer'
import { ToastAction } from '@/components/ui/toast'
import { useSmartAccountCheck } from '@/hooks/use-smart-account-check'

import { findCurrentTrigger } from '@/lib/functions'
import { capitalize } from '@/lib/utils'

export function Form() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const wagmiConfig = useConfig()
  const signer = new WagmiSigner(address || '', wagmiConfig)

  // Source chain/token selection
  const [sourceChain, setSourceChain] = useState<Chain>(CHAINS.base)
  const [sourceToken, setSourceToken] = useState<Token>(TOKENS.base.USDC)
  
  // Card top-up thresholds
  const [threshold, setThreshold] = useState('')
  const [topUpOverThreshold, setTopUpOverThreshold] = useState('')
  
  // Settings dialog fields
  const [destinationChain, setDestinationChain] = useState<Chain>(CHAINS.base)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [maxFee, setMaxFee] = useState('0.1')
  
  const [isLoading, setIsLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentTopUp, setCurrentTopUp] = useState<Trigger | null>(null)
  const [isLoadingCurrentTopUp, setIsLoadingCurrentTopUp] = useState(false)
  const { isSmartAccount, isSmartAccountLoading } = useSmartAccountCheck(sourceChain)
  const isFormDisabled = isLoadingCurrentTopUp || !!currentTopUp

  useEffect(() => {
    const tokens = TOKENS[sourceChain.key]
    const firstSymbol = Object.keys(tokens ?? {})[0]
    if (firstSymbol) setSourceToken(tokens[firstSymbol])
  }, [sourceChain])

  useEffect(() => {
    const fetchCurrentTopUp = async () => {
      try {
        if (!isConnected || !address) {
          setCurrentTopUp(null)
          return
        }

        setIsLoadingCurrentTopUp(true)
        const trigger = await findCurrentTrigger(address)
        setCurrentTopUp(trigger)
      } catch (error) {
        console.error('Error fetching card top-up trigger', error)
        setCurrentTopUp(null)
      } finally {
        setIsLoadingCurrentTopUp(false)
      }
    }

    fetchCurrentTopUp()
  }, [isConnected, address])

  useEffect(() => {
    if (!currentTopUp) return

    const inputs = currentTopUp.input
    setThreshold(String(inputs.threshold))
    setTopUpOverThreshold(String(inputs.topUpOverThreshold))
    setMaxFee(String(inputs.maxFee))
    setRecipientAddress(String(inputs.recipient))

    const sourceChain = Object.values(CHAINS).find((chain: Chain) => chain.id == inputs.sourceChainId)
    if (sourceChain) {
      setSourceChain(sourceChain)
      const token = Object.values(TOKENS[sourceChain.key]).find((token: Token) => token.address == inputs.sourceToken)
      if (token) setSourceToken(token)
    }

    const destChain = Object.values(CHAINS).find((chain: Chain) => chain.id == inputs.destinationChainId)
    if (destChain) setDestinationChain(destChain)
  }, [currentTopUp])

  const handleActivate = async () => {
    if (!threshold || Number.parseFloat(threshold) <= 0) {
      toast({
        title: 'Invalid Target Limit',
        description: 'Please enter a valid target limit',
        variant: 'destructive',
      })
      return
    }

    if (!topUpOverThreshold || Number.parseFloat(topUpOverThreshold) <= 0) {
      toast({
        title: 'Invalid Top-up Buffer',
        description: 'Please enter a valid top-up buffer amount',
        variant: 'destructive',
      })
      return
    }

    if (!maxFee || Number.parseFloat(maxFee) <= 0) {
      toast({
        title: 'Invalid Max Fee',
        description: 'Please enter a valid max fee',
        variant: 'destructive',
      })
      return
    }

    if (!recipientAddress) {
      toast({
        title: 'Missing Recipient Address',
        description: 'Please configure your card account in settings',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const params = {
        sourceChain,
        sourceToken,
        destinationChain,
        recipient: recipientAddress,
        threshold,
        topUpOverThreshold,
        maxFee,
        signer,
      }
      // TODO: Call createCardTopUp with params
      const trigger = { sig: 'test' } as Trigger

      toast({
        title: 'Top-Up Activated',
        description: 'Your card top-up has been configured successfully',
        action: (
          <ToastAction
            altText="View"
            onClick={() => window.open(`https://protocol.mimic.fi/triggers/${trigger.sig}`, '_blank')}
          >
            View
          </ToastAction>
        ),
      })

      setCurrentTopUp(trigger)
    } catch (error) {
      toast({
        title: 'Activation Failed',
        description: error instanceof Error ? error.message : 'Failed to activate top-up',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeactivate = async () => {
    if (!currentTopUp) return
    setIsLoading(true)

    try {
      const params = { trigger: currentTopUp, signer }
      // TODO: Call deactivateCardTopUp with params
      
      toast({
        title: 'Top-Up Deactivated',
        description: 'Your card top-up has been deactivated successfully',
      })

      setCurrentTopUp(null)
      setThreshold('')
      setTopUpOverThreshold('')
      setRecipientAddress('')
    } catch (error) {
      toast({
        title: 'Deactivation Failed',
        description: error instanceof Error ? error.message : 'Failed to deactivate top-up',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <div className="p-6">
        {isConnected && !isSmartAccountLoading && !isSmartAccount && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-700">
              This app is only meant to be used with Mimic EIP-7702 smart accounts.{' '}
              <a href="https://docs.mimic.fi/eip-7702" target="_blank" rel="noopener noreferrer" className="underline">
                You can upgrade your existing wallet by following{' '}
                <span className="font-semibold">this guide</span>.
              </a>
            </p>
          </div>
        )}

        {isConnected && !isSmartAccountLoading && isSmartAccount && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-700">Your wallet is a Mimic EIP-7702 smart account.</p>
          </div>
        )}

        {isConnected && isSmartAccountLoading && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-700">Checking EIP-7702 delegation ...</p>
          </div>
        )}

        {currentTopUp && (
          <div className="mb-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <p className="text-sm text-violet-700">
              Current card top-up detected{' '}
              <a
                href={`https://protocol.mimic.fi/triggers/${currentTopUp.sig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                view
              </a>
            </p>
          </div>
        )}

        {!currentTopUp && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Set up your card top-up</h2>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Card Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Destination Chain</Label>
                      <div className="mt-2">
                        <ChainSelector value={destinationChain} onChange={setDestinationChain} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        The blockchain where your card account is located
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="h-11 bg-secondary/50 border-border font-mono text-sm mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Your card account address on the destination chain
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="maxFee">Max fee</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="maxFee"
                          type="number"
                          placeholder="0.1"
                          value={maxFee}
                          onChange={(e) => setMaxFee(e.target.value)}
                          className="h-11 bg-secondary/50 border-border"
                          min="0"
                        />
                        <span className="flex items-center text-sm text-muted-foreground">{sourceToken.symbol}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum fee you're willing to pay per top-up execution
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Chain</Label>
            <ChainSelector value={sourceChain} onChange={setSourceChain} />
          </div>
          <div>
            <Label>Token</Label>
            <TokenSelector chain={sourceChain} value={sourceToken} onChange={setSourceToken} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Target Limit (USD)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="h-12 bg-secondary/50 border-border text-lg text-right"
                disabled={isFormDisabled}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Triggers top-up when balance falls below this amount
            </p>
          </div>

          <div>
            <Label>Top-up Buffer (USD)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder="50"
                value={topUpOverThreshold}
                onChange={(e) => setTopUpOverThreshold(e.target.value)}
                className="h-12 bg-secondary/50 border-border text-lg text-right"
                disabled={isFormDisabled}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Additional amount to top-up beyond the target limit
            </p>
          </div>
        </div>

        {currentTopUp ? (
          <Button className="w-full h-11" onClick={handleDeactivate} disabled={isLoading}>
            {isLoading ? 'Deactivating...' : 'Deactivate top-up'}
          </Button>
        ) : (
          <Button
            className="w-full h-11"
            onClick={handleActivate}
            disabled={
              isLoading ||
              !isConnected ||
              isSmartAccountLoading ||
              !isSmartAccount ||
              !threshold ||
              Number.parseFloat(threshold) <= 0 ||
              !topUpOverThreshold ||
              Number.parseFloat(topUpOverThreshold) <= 0 ||
              !recipientAddress
            }
          >
            {isLoading
              ? 'Activating...'
              : !isConnected
                ? 'Connect wallet'
                : isSmartAccountLoading
                  ? 'Checking account...'
                  : !isSmartAccount
                    ? 'EIP-7702 required'
                    : 'Activate top-up'}
          </Button>
        )}

        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground text-center">
          Powered by{' '}
          <a href="https://mimic.fi" target="_blank" rel="noopener noreferrer" className="underline">
            Mimic
          </a>
        </div>
      </div>
    </Card>
  )
}
