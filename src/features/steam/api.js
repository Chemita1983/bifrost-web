import { apiRequest } from '@/api/client'

// dryRun=true only returns the summary; without it the sync is saved.
export const syncSteam = ({ dryRun }) =>
  apiRequest('/steam/sync', { method: 'POST', params: dryRun ? { dryRun: true } : undefined })
