interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="w-full py-16">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  )
}
