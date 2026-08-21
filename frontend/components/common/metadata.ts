// @/components/common/metadata.ts
import { Metadata } from "next"

interface LocalizedString {
  en: string
  bn: string
}

interface MetadataProps {
  title: LocalizedString | string
  description: LocalizedString | string
  path?: string
  locale?: "en" | "bn"
  image?: string
}

export function constructMetadata({
  title,
  description,
  path = "",
  locale = "en",
  image = "/og-image.png",
}: MetadataProps): Metadata {
  const siteUrl = "https://mulyayon.vercel.app"
  const isBn = locale === "bn"

  const resolvedTitle =
    typeof title === "string"
      ? title
      : isBn
        ? title.bn
        : title.en

  const resolvedDescription =
    typeof description === "string"
      ? description
      : isBn
        ? description.bn
        : description.en

  const url = `${siteUrl}/${locale}${path}`

  return {
    metadataBase: new URL(siteUrl),

    title: resolvedTitle,
    description: resolvedDescription,

    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${path}`,
        bn: `${siteUrl}/bn${path}`,
      },
    },

    icons: {
  icon: [
    {
      url: "/favicon/favicon-96x96.png",
      sizes: "96x96",
      type: "image/png",
    },
    {
      url: "/favicon/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/favicon/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      url: "/favicon/favicon.ico",
      sizes: "any",
    },
  ],
  apple: [
    {
      url: "/favicon/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
},
    manifest: "/favicon/site.webmanifest",

    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: isBn ? "মূল্যায়ন" : "Mulyayon",
      locale: isBn ? "bn_BD" : "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },
  }
}