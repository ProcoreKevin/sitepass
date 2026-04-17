import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex w-full min-w-0 flex-col rounded-[var(--border-radius-lg)] border-0 shadow-[var(--shadow-sm)] gap-2 py-0',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid min-w-0 auto-rows-min grid-rows-[auto_auto] items-start gap-[var(--spacing-inline-gap)] px-[var(--spacing-card-padding)] has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] [.border-b]:pb-[var(--spacing-card-padding)]',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('min-w-0 text-[length:var(--text-h3-size)] leading-[var(--text-h3-lh)] tracking-[var(--text-h3-ls)] font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('min-w-0 text-muted-foreground text-[length:var(--text-body-size)] leading-[var(--text-body-lh)]', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('min-w-0 px-[var(--spacing-card-padding)]', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex min-w-0 flex-wrap items-center gap-2 px-[var(--spacing-card-padding)] [.border-t]:pt-[var(--spacing-card-padding)]', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
