// app/[lang]/[...not-found]/page.tsx
import { notFound } from "next/navigation"

export default function NotFoundCatchAll() {
  notFound()
}