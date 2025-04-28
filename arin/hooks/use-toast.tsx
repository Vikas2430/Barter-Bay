import * as React from "react"

type ToastType = {
  title: string
  description?: string
}

type ToastContextType = {
  toast: (toast: ToastType) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const toast = React.useCallback((toast: ToastType) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t, i) => (
          <div
            key={i}
            className="bg-background border rounded-lg p-4 shadow-lg"
          >
            <h4 className="font-medium">{t.title}</h4>
            {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 