// app/steps/layout.tsx
import { Protected } from "@/components/protected"

export default function StepsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Protected>{children}</Protected>
}
