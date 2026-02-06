'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Loader2 } from 'lucide-react'
import { findExecutions, Execution } from '@/lib/functions'
import { capitalize } from '@/lib/utils'
import { useAccount } from 'wagmi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function getResultColor(result: string): string {
  if (result === 'succeeded') return 'text-green-500'
  if (['failed', 'discarded', 'expired'].includes(result)) return 'text-red-500'
  return 'text-yellow-500'
}

function getResultIcon(result: string): string {
  if (result === 'succeeded') return '✓'
  if (['failed', 'discarded', 'expired'].includes(result)) return '✗'
  return '◌'
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

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top-Up History</CardTitle>
          <CardDescription>Your recent top-ups will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Not Connected</AlertTitle>
            <AlertDescription>Please connect your wallet to view history</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top-Up History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading history...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top-Up History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load history'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (executions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top-Up History</CardTitle>
          <CardDescription>No top-ups yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your top-up history will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top-Up History</CardTitle>
        <CardDescription>{executions.length} execution(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {executions.map((execution) => (
            <div
              key={execution.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{execution.id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(execution.timestamp).toLocaleString()}
                </p>
                {execution.amount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount: {execution.amount}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getResultColor(execution.status)}`}>
                  {getResultIcon(execution.status)} {capitalize(execution.status)}
                </span>
                {execution.txHash && (
                  <a
                    href={`https://etherscan.io/tx/${execution.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
