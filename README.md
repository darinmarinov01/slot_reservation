This is a [Next.js](https://nextjs.org/) version (14.2.3) and include node version (^20). 
The project it is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Includes the following packages and thechnologies: 

- **React** - js framework (version ^18)
- **Tailwind CSS** - https://tailwindcss.com - style framework (version 3.4.3)
- **Firebase** - https://firebase.google.com - usede for creating our database structure and more  (version 10.11.0)
- **MUI** - https://mui.com - is a collection of advanced React UI components for complex use cases  (version 5.15.17)
- **zustand** - https://docs.pmnd.rs/zustand - a small, fast, and scalable bearbones state management solution  (version 4.5.2)

## Getting Started
To get start you need to run this command first and then

```bash
npm install
```
To run the development server:

```bash
npm run dev

```

## Folder structure
The project is organized into several key directories, each serving a distinct purpose. Below is a breakdown of each directory and its role within the project:

1. **src**: 
This is the root directory for all source code in the project. It contains subdirectories that group related functionality together.

2. **actions**:
Purpose: asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.

3. **common**: Purpose: Holds common utilities, components, or functions that are reused across various parts of the application.
 Includes: 

   - **components**: Contains React components, which are the core building blocks of the UI. The desing of this folder follows atomic design, which means is atoms, molecules, organisms, templates, and pages concurrently working together to create   effective interface design systems.
 
   - **constants**: This folder is used to store constant values that are used throughout the application. These could include configuration settings, action types, static data, or other values that don’t change.
 
   - **hooks**: This folder holds custom React hooks. Hooks are functions that let you use state and other React features without writing a class. Custom hooks can encapsulate reusable logic and can be used across different components.
 
   - **store**: This directory is typically used for state management logic.
 
   - **types**: This folder is used to store TypeScript type definitions. These definitions help in ensuring type safety and improving the development experience by providing better autocompletion and type checking.
 
   - **utils**: This folder contains utility functions and helper methods that are used across the application. These functions are generally stateless and can be reused in different parts of the codebase.


4. **firebase**:
Purpose: Contain firebase settings.

5. **pages**:
Purpose: Contains components or views that correspond to different pages or routes within the application.
Important folder here is 'API' which contains all api request to firebase
Common Files: Page components typically mapped to routes.

6. **providers/alert**:
Purpose: This subdirectory under providers likely contains logic for alert notifications or context providers for managing alerts.
Common Files: Alert provider components, context files.

7. **styles**:
Purpose: Stores all styling related files, including CSS, SCSS, or styled-components.
Common Files: Global styles, theme definitions, component-specific styles.

8. **middleware.ts**:
Purpose: Contains middleware logic for intercepting and handling actions or side-effects within the application, often used with Redux.
File Type: TypeScript (.ts) file defining middleware functions.
 
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
