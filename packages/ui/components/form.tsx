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

import { Frequency, CRON_SCHEDULES, invest, deactivate, getFrequencyFromSchedule } from '@/lib/invest'
import { findCurrentTrigger } from '@/lib/functions'
import { capitalize } from '@/lib/utils'

export function Form() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const wagmiConfig = useConfig()
  const signer = new WagmiSigner(address || '', wagmiConfig)

  const [chain, setChain] = useState<Chain>(CHAINS.base)
  const [token, setToken] = useState<Token>(TOKENS.base.USDC)
  const [amount, setAmount] = useState('')
  const [maxFee, setMaxFee] = useState('0.1')
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const [isLoading, setIsLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentSavingsPlan, setCurrentSavingsPlan] = useState<Trigger | null>(null)
  const [isLoadingCurrentSavingsPlan, setIsLoadingCurrentSavingsPlan] = useState(false)
  const { isSmartAccount, isSmartAccountLoading } = useSmartAccountCheck(chain)
  const isFormDisabled = isLoadingCurrentSavingsPlan || !!currentSavingsPlan

  useEffect(() => {
    const tokens = TOKENS[chain.key]
    const firstSymbol = Object.keys(tokens ?? {})[0]
    if (firstSymbol) setToken(tokens[firstSymbol])
  }, [chain])

  useEffect(() => {
    const fetchCurrentSavingsPlan = async () => {
      try {
        if (!isConnected || !address) {
          setCurrentSavingsPlan(null)
          return
        }

        setIsLoadingCurrentSavingsPlan(true)
        const trigger = await findCurrentTrigger(address)
        setCurrentSavingsPlan(trigger)
      } catch (error) {
        console.error('Error fetching savings plan trigger', error)
        setCurrentSavingsPlan(null)
      } finally {
        setIsLoadingCurrentSavingsPlan(false)
      }
    }

    fetchCurrentSavingsPlan()
  }, [isConnected, address])

  useEffect(() => {
    if (!currentSavingsPlan) return

    const config = currentSavingsPlan.config as unknown as { schedule: string }
    const frequencyFound = getFrequencyFromSchedule(config.schedule)
    if (frequencyFound) setFrequency(frequencyFound)

    const inputs = currentSavingsPlan.input
    setAmount(String(inputs.amount))
    setMaxFee(String(inputs.maxFee))

    const chain = Object.values(CHAINS).find((chain: Chain) => chain.id == inputs.chainId)
    if (chain) {
      setChain(chain)
      const token = Object.values(TOKENS[chain.key]).find((token: Token) => token.address == inputs.token)
      if (token) setToken(token)
    }
  }, [currentSavingsPlan])

  const handleActivate = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to invest',
        variant: 'destructive',
      })
      return
    }

    if (!maxFee || Number.parseFloat(maxFee) <= 0) {
      toast({
        title: 'Invalid Max Fee',
        description: 'Please enter a valid max fee to invest',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const params = { chain, token, amount, maxFee, frequency, signer }
      const trigger = await invest(params)

      toast({
        title: 'Savings Plan Activated',
        description: 'Your savings plan has been created successfully',
        action: (
          <ToastAction
            altText="View"
            onClick={() => window.open(`https://protocol.mimic.fi/triggers/${trigger.sig}`, '_blank')}
          >
            View
          </ToastAction>
        ),
      })

      setCurrentSavingsPlan(trigger)
    } catch (error) {
      toast({
        title: 'Activation Failed',
        description: error instanceof Error ? error.message : 'Failed to activate savings plan',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeactivate = async () => {
    if (!currentSavingsPlan) return
    setIsLoading(true)

    try {
      const params = { trigger: currentSavingsPlan, signer }
      await deactivate(params)

      toast({
        title: 'Savings Plan Deactivated',
        description: 'Your savings plan has been deactivated successfully',
      })

      setCurrentSavingsPlan(null)
      setAmount('')
      setMaxFee('')
    } catch (error) {
      toast({
        title: 'Deactivation Failed',
        description: error instanceof Error ? error.message : 'Failed to deactivate savings plan',
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

        {currentSavingsPlan && (
          <div className="mb-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <p className="text-sm text-violet-700">
              Current Aave savings plan detected{' '}
              <a
                href={`https://protocol.mimic.fi/triggers/${currentSavingsPlan.sig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                view
              </a>
            </p>
          </div>
        )}

        {!currentSavingsPlan && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Set up your savings plan on Aave</h2>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
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
                        <span className="flex items-center text-sm text-muted-foreground">{token.symbol}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum fee you're willing to pay per execution.
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
            <ChainSelector value={chain} onChange={setChain} />
          </div>
          <div>
            <Label>Token</Label>
            <TokenSelector chain={chain} value={token} onChange={setToken} />
          </div>
        </div>

        <div className="mb-6">
          <Label>Amount</Label>

          <div className="flex gap-2 mt-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 bg-secondary/50 border-border text-lg text-right"
              disabled={isFormDisabled}
            />
            <span className="flex items-center px-3 font-semibold bg-secondary/50 rounded-md border border-border">
              {token.symbol}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <Label>Frequency</Label>
          <div className="flex gap-2 mt-2">
            {(Object.keys(CRON_SCHEDULES) as Frequency[]).map((f) => (
              <Button
                key={f}
                variant={frequency === f ? 'default' : 'outline'}
                onClick={() => setFrequency(f)}
                disabled={isFormDisabled}
              >
                {capitalize(f)}
              </Button>
            ))}
          </div>
        </div>

        {currentSavingsPlan ? (
          <Button className="w-full h-11" onClick={handleDeactivate} disabled={isLoading}>
            {isLoading ? 'Deactivating...' : 'Deactivate plan'}
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
              !amount ||
              Number.parseFloat(amount) <= 0
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
                    : 'Activate plan'}
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
