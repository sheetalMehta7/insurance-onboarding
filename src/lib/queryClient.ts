import { QueryClient } from '@tanstack/react-query'

/** Shared query client. Conservative defaults for a mock-data catalog. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
