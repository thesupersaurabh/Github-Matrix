import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GitHub Matrix',
    short_name: 'GitHub Matrix',
    description: 'Create and deploy custom GitHub contribution patterns with precise timestamp control.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#22c55e',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
