'use client'

import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChainSelector } from '@/components/chain-selector'
import { TokenSelector } from '@/components/token-selector'
import { useToast } from '@/hooks/use-toast'
import { CHAINS, type Chain } from '@/lib/chains'
import { TOKENS, type Token } from '@/lib/tokens'
import { WagmiSigner } from '@/lib/wagmi-signer'
import { useConfig } from 'wagmi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export function Form() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const wagmiConfig = useConfig()

  // Form state
  const [sourceChain, setSourceChain] = useState<Chain>(CHAINS.ethereum)
  const [sourceToken, setSourceToken] = useState<Token>(TOKENS.ethereum.USDC)
  const [destinationChain, setDestinationChain] = useState<Chain>(CHAINS.ethereum)
  const [threshold, setThreshold] = useState('')
  const [topUpOverThreshold, setTopUpOverThreshold] = useState('')
  const [maxFee, setMaxFee] = useState('0.1')
  const [isLoading, setIsLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [currentTopUp, setCurrentTopUp] = useState(null)
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false)

  const isFormDisabled = isLoadingCurrent || !!currentTopUp

  // Update tokens when source chain changes
  useEffect(() => {
    const tokens = TOKENS[sourceChain.key]
    const firstSymbol = Object.keys(tokens ?? {})[0]
    if (firstSymbol) setSourceToken(tokens[firstSymbol])
  }, [sourceChain])

  // Load current top-up configuration
  useEffect(() => {
    const loadCurrentTopUp = async () => {
      if (!isConnected || !address) {
        setCurrentTopUp(null)
        return
      }

      try {
        setIsLoadingCurrent(true)
        // TODO: Fetch current top-up from Mimic API
        setCurrentTopUp(null)
      } catch (error) {
        console.error('Error loading top-up', error)
        setCurrentTopUp(null)
      } finally {
        setIsLoadingCurrent(false)
      }
    }

    loadCurrentTopUp()
  }, [isConnected, address])

  const handleActivate = async () => {
    if (!threshold || Number.parseFloat(threshold) <= 0) {
      toast({
        title: 'Invalid Threshold',
        description: 'Please enter a valid threshold amount',
        variant: 'destructive',
      })
      return
    }

    if (!topUpOverThreshold || Number.parseFloat(topUpOverThreshold) <= 0) {
      toast({
        title: 'Invalid Top-Up Amount',
        description: 'Please enter a valid top-up amount',
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
        description: 'Please configure your card details in settings',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const signer = new WagmiSigner(address || '', wagmiConfig)

      // TODO: Call createCardTopUp with parameters
      toast({
        title: 'Top-Up Activated',
        description: 'Your card top-up has been configured successfully',
      })

      setCurrentTopUp({} as any)
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
      const signer = new WagmiSigner(address || '', wagmiConfig)
      // TODO: Call deactivateCardTopUp
      toast({
        title: 'Top-Up Deactivated',
        description: 'Your card top-up has been deactivated',
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Card Top-Up Configuration</CardTitle>
            <CardDescription>
              Set up automatic top-ups for your card
            </CardDescription>
          </div>
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
                  <Label htmlFor="recipient">Destination Chain</Label>
                  <ChainSelector
                    value={destinationChain}
                    onChange={setDestinationChain}
                    label=""
                  />
                  <p className="text-xs text-muted-foreground mt-1">
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
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your card account address on the destination chain
                  </p>
                </div>
                <div>
                  <Label htmlFor="maxFee">Max Fee (USDC)</Label>
                  <Input
                    id="maxFee"
                    type="number"
                    placeholder="0.1"
                    value={maxFee}
                    onChange={(e) => setMaxFee(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum fee per top-up transaction
                  </p>
                </div>
                <Button onClick={() => setSettingsOpen(false)} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isConnected && isLoadingCurrent && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Loading</AlertTitle>
            <AlertDescription>Checking for existing top-up configuration...</AlertDescription>
          </Alert>
        )}

        {currentTopUp && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Active Top-Up Detected</AlertTitle>
            <AlertDescription>
              You already have an active card top-up. Deactivate it before creating a new one.
            </AlertDescription>
          </Alert>
        )}

        {!currentTopUp && (
          <>
            {/* Source Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Funding Source & Destination</h3>
              <div className="grid grid-cols-2 gap-4">
                <ChainSelector
                  value={sourceChain}
                  onChange={setSourceChain}
                  disabled={isFormDisabled}
                  label="Source Chain"
                />
                <ChainSelector
                  value={destinationChain}
                  onChange={setDestinationChain}
                  disabled={isFormDisabled}
                  label="Destination Chain"
                />
              </div>
              <div>
                <TokenSelector
                  value={sourceToken}
                  onChange={setSourceToken}
                  chain={sourceChain}
                  disabled={isFormDisabled}
                  label="Token"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Pull funds from the source chain to top-up your card on the destination chain
              </p>
            </div>

            {/* Threshold Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Top-Up Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="threshold">Minimum Balance (USD)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="100"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    step="0.01"
                    min="0"
                    disabled={isFormDisabled}
                    className="bg-input border-border text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Triggers top-up when balance falls below this amount
                  </p>
                </div>
                <div>
                  <Label htmlFor="topUpOverThreshold">Top-Up Buffer (USD)</Label>
                  <Input
                    id="topUpOverThreshold"
                    type="number"
                    placeholder="50"
                    value={topUpOverThreshold}
                    onChange={(e) => setTopUpOverThreshold(e.target.value)}
                    step="0.01"
                    min="0"
                    disabled={isFormDisabled}
                    className="bg-input border-border text-foreground"
                  />
                    min="0"
                    disabled={isFormDisabled}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Additional amount to top-up beyond minimum
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border">
          {currentTopUp ? (
            <Button
              onClick={handleDeactivate}
              disabled={isLoading}
              variant="destructive"
              className="w-full h-11"
            >
              {isLoading ? 'Deactivating...' : 'Deactivate Top-Up'}
            </Button>
          ) : (
            <Button
              onClick={handleActivate}
              disabled={isLoading || !isConnected || isFormDisabled}
              className="w-full h-11"
            >
              {isLoading
                ? 'Activating...'
                : !isConnected
                  ? 'Connect wallet'
                  : 'Activate Top-Up'}
            </Button>
          )}
        </div>

        {/* Powered by Mimic */}
        <div className="pt-4 text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a
            href="https://mimic.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Mimic
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
