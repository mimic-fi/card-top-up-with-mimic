'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { ExternalLink, Loader2 } from 'lucide-react'
import { findExecutions, Execution } from '@/lib/functions'
import { capitalize } from '@/lib/utils'
import { useAccount } from 'wagmi'

function getResultColor(result: string): string {
  if (result === 'succeeded') return 'text-green-500'
  if (['failed', 'discarded', 'expired'].includes(result)) return 'text-red-500'
  return 'text-violet-500'
}

function getResultIcon(result: string): string {
  if (result === 'succeeded') return '✓'
  if (['failed', 'discarded', 'expired'].includes(result)) return '✗'
  return '-'
}

export function History() {
  const { address, isConnected } = useAccount()

  const {
    data: executions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['executions', address],
    queryFn: () => findExecutions(address!),
    enabled: isConnected && !!address,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading savings history...
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="py-8 px-4 text-center text-red-500">
          {error.message ?? 'Failed to load savings history'}
        </div>
      </Card>
    )
  }

  if (executions.length === 0) {
    return (
      <Card>
        <div className="py-8 px-4 text-center text-muted-foreground">
          {isConnected ? 'No savings registered yet' : 'Please connect your wallet'}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold">Past Savings</h2>
      </div>
      {executions.map((execution, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-6 py-4 border-b border-border last:border-b-0"
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{execution.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(execution.createdAt).toLocaleString()}
            </p>
          </div>
          <a
            href={`https://protocol.mimic.fi/executions/${execution.sig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <span className={`font-medium ${getResultColor(execution.result)}`}>
              {getResultIcon(execution.result)} {capitalize(execution.result)}
            </span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ))}
    </Card>
  )
}
