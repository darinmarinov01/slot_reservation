This is a [Next.js](https://nextjs.org/) project 
bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Includes the following packages and thechnologies: 

- **Tailwind CSS** - https://tailwindcss.com - style framework
- **Firebase** - https://firebase.google.com - usede for creating our database structure and more  (version 10.11.0)

## Getting Started
To get start you need to run this command first and then

```bash
npm install
```
To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Folder structure


## Imports structure and rules

// **React and Next import**
```bash
import { useCallback, useEffect, useState } from "react"
```

// **Firebase imporst**
```bash
import 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { collection, getDocs } from "firebase/firestore"
```

// **Internal imporst**
```bash
import { SlotProperties } from '@/common/types/slots-types'
import Card from '@mui/material/Card'
```

// **Outer imports**
```bash
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
