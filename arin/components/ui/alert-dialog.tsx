"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogFooterProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  )
}

const AlertDialogContent = ({ children, className }: AlertDialogContentProps) => (
  <div
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
      className
    )}
  >
    {children}
  </div>
)

const AlertDialogHeader = ({ children, className }: AlertDialogHeaderProps) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
  >
    {children}
  </div>
)

const AlertDialogFooter = ({ children, className }: AlertDialogFooterProps) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
  >
    {children}
  </div>
)

const AlertDialogTitle = ({ children, className }: AlertDialogTitleProps) => (
  <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>
)

const AlertDialogDescription = ({
  children,
  className,
}: AlertDialogDescriptionProps) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
)

const AlertDialogAction = ({
  children,
  className,
  ...props
}: AlertDialogActionProps) => (
  <button
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </button>
)

const AlertDialogCancel = ({
  children,
  className,
  ...props
}: AlertDialogCancelProps) => (
  <button
    className={cn(
      "mt-2 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0",
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
