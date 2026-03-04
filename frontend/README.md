This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🔐 Configuración de Variables de Entorno

Este proyecto utiliza **SSO (Single Sign-On)** con el servidor **Cerberos** para la autenticación.

### Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto `frontend/` con las siguientes variables:

```env
# URL del backend GraphQL de Aquiles
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# URL del servidor SSO Cerberos (autenticación)
NEXT_PUBLIC_CERBEROS_URL=https://cerberos.datasena.com/

# URL de este proyecto Aquiles (para callbacks)
NEXT_PUBLIC_AQUILES_URL=http://localhost:3000
```

**Nota:** Puedes copiar el archivo `.env.example` como punto de partida:
```bash
cp .env.example .env
```

### Flujo de Autenticación

1. El usuario accede a Aquiles (`localhost:3000`)
2. Si no está autenticado, se redirige a Cerberos (`https://cerberos.datasena.com`)
3. Después del login exitoso, Cerberos redirige de vuelta con un token
4. Aquiles valida el token y crea la sesión del usuario

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
