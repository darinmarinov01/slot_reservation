import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="container bg-gray-50 dark:bg-gray-900 flex flex-col h-screen">
        <Main/>
        <NextScript />
      </body>
    </Html>
  )
}
