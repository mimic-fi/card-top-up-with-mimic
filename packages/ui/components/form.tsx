'use client'

import { useAccount, useConfig } from 'wagmi'
import { useEffect, useState } from 'react'
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
import { ToastAction } from '@/components/ui/toast'
import { CHAINS, type Chain } from '@/lib/chains'
import { TOKENS, type Token } from '@/lib/tokens'
import { WagmiSigner } from '@/lib/wagmi-signer'
import { useSmartAccountCheck } from '@/hooks/use-smart-account-check'

import { topUp, cancel } from '@/lib/top-up'
import { findCurrentTrigger } from '@/lib/functions'

export function Form() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const wagmiConfig = useConfig()
  const signer = new WagmiSigner(address || '', wagmiConfig)

  const [sourceChain, setSourceChain] = useState<Chain>(CHAINS.base)
  const [destinationChain, setDestinationChain] = useState<Chain>(CHAINS.base)
  const [token, setToken] = useState<Token>(TOKENS.usdc)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('0xbcE3248eDE29116e4bD18416dcC2DFca668Eeb84')
  const [maxFee, setMaxFee] = useState('0.1')
  const [isLoading, setIsLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentTopUp, setCurrentTopUp] = useState<Trigger | null>(null)
  const [isLoadingCurrentTopUp, setIsLoadingCurrentTopUp] = useState(false)
  const { isSmartAccount, isSmartAccountLoading } = useSmartAccountCheck(sourceChain)
  const isFormDisabled = isLoadingCurrentTopUp || !!currentTopUp

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
        console.error('Error fetching top-up trigger', error)
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
    setAmount(String(inputs.amountInUsd))
    setMaxFee(String(inputs.maxFee))
    setRecipient(String(inputs.recipient))

    const tokenFound = Object.values(TOKENS).find((t: Token) => t.symbol == inputs.token)
    if (tokenFound) setToken(tokenFound)

    const sourceChainFound = Object.values(CHAINS).find((chain: Chain) => chain.id == inputs.sourceChain)
    if (sourceChainFound) setSourceChain(sourceChainFound)

    const destinationChainFound = Object.values(CHAINS).find((chain: Chain) => chain.id == inputs.destinationChain)
    if (destinationChainFound) setDestinationChain(destinationChainFound)
  }, [currentTopUp])

  const handleTopUp = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid top-up amount in USD',
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

    setIsLoading(true)
    try {
      const params = { sourceChain, destinationChain, token, amount, recipient, maxFee, signer }
      const trigger = await topUp(params)

      toast({
        title: 'Top-up Initiated',
        description: 'Your card top-up has been created successfully',
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
        title: 'Top-up Failed',
        description: error instanceof Error ? error.message : 'Failed to initiate top-up',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!currentTopUp) return
    setIsLoading(true)

    try {
      const params = { trigger: currentTopUp, signer }
      await cancel(params)

      toast({
        title: 'Top-up Cancelled',
        description: 'Your card top-up has been cancelled successfully',
      })

      setCurrentTopUp(null)
      setAmount('')
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: error instanceof Error ? error.message : 'Failed to cancel top-up',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl p-6 bg-card border-border">
      <div className="space-y-6">
        {isConnected && !isSmartAccountLoading && !isSmartAccount && (
          <div className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span className="font-semibold">This app is only meant to be used with Mimic EIP-7702 smart accounts.</span>{' '}
            <br />
            <span className="text-destructive/90">
              You can upgrade your existing wallet by following{' '}
              <a
                href="https://docs.mimic.fi/examples/upgrade-your-eoa-to-a-mimic-7702"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                this guide
              </a>
              .
            </span>
          </div>
        )}

        {isConnected && !isSmartAccountLoading && isSmartAccount && (
          <div className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
            <span className="font-semibold">Your wallet is a Mimic EIP-7702 smart account.</span>
          </div>
        )}

        {isConnected && isSmartAccountLoading && (
          <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
            Checking EIP-7702 delegation ...
          </div>
        )}

        <div className="space-y-1 flex items-end justify-between">
          {currentTopUp ? (
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Top-up detected</div>
              <a
                href={`https://protocol.mimic.fi/triggers/${currentTopUp.sig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-violet-500 hover:text-violet-400 transition-colors"
              >
                view
              </a>
            </div>
          ) : (
            <Label className="text-sm font-medium">Top up your card</Label>
          )}
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="destination-chain-setting" className="text-sm text-muted-foreground">
                    Destination chain
                  </Label>
                  <div className={isFormDisabled ? 'pointer-events-none opacity-70' : ''}>
                    <ChainSelector value={destinationChain} onChange={setDestinationChain} />
                  </div>
                  <p className="text-xs text-muted-foreground">Chain where the card top-up will be received.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-fee-setting" className="text-sm text-muted-foreground">
                    Max fee
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="max-fee-setting"
                      type="number"
                      placeholder="0.1"
                      value={maxFee}
                      onChange={(e) => setMaxFee(e.target.value)}
                      className="h-11 bg-secondary/50 border-border"
                      min="0"
                      step="0.01"
                      disabled={isFormDisabled}
                    />
                    <span className="text-muted-foreground">USDC</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Maximum fee you{"'"}re willing to pay per execution.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-setting" className="text-sm text-muted-foreground">
                    Recipient
                  </Label>
                  <Input
                    id="recipient-setting"
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-11 bg-secondary/50 border-border"
                    disabled={isFormDisabled}
                  />
                  <p className="text-xs text-muted-foreground">Address that will receive the card top-up.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="w-36 shrink-0">
              <Label className="text-muted-foreground">Chain</Label>
            </div>
            <div className="w-36 shrink-0">
              <Label className="text-muted-foreground">Token</Label>
            </div>
            <div className="flex-1 min-w-0">
              <Label className="text-muted-foreground">Amount (USD)</Label>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className={`w-36 shrink-0 ${isFormDisabled ? 'pointer-events-none opacity-70' : ''}`}>
              <ChainSelector value={sourceChain} onChange={setSourceChain} />
            </div>
            <div className={`w-36 shrink-0 ${isFormDisabled ? 'pointer-events-none opacity-70' : ''}`}>
              <TokenSelector value={token} onChange={setToken} />
            </div>
            <div className="flex-1 min-w-0">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 bg-secondary/50 border-border text-lg text-right"
                disabled={isFormDisabled}
              />
            </div>
          </div>
        </div>

        {currentTopUp ? (
          <Button
            size="lg"
            variant="destructive"
            className="w-full text-lg h-14"
            onClick={handleCancel}
            disabled={isLoading || !isConnected || !isSmartAccount}
          >
            {isLoading ? 'Cancelling...' : 'Cancel top-up'}
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full text-lg h-14 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            onClick={handleTopUp}
            disabled={isLoading || !isConnected || !isSmartAccount}
          >
            {isLoading
              ? 'Initiating Top-up...'
              : !isConnected
                ? 'Connect wallet'
                : isSmartAccountLoading
                  ? 'Checking account...'
                  : !isSmartAccount
                    ? 'EIP-7702 required'
                    : 'Top up card'}
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Powered by{' '}
          <a
            href="https://www.mimic.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-500 hover:text-violet-400 transition-colors"
          >
            Mimic
          </a>
        </div>
      </div>
    </Card>
  )
}
