'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { searchRequestSchema, type SearchRequest } from '@/features/search/schemas';
import type { FullDestination } from '@/features/destinations/service';

interface GenerateResponse {
  destination: FullDestination;
  cached: boolean;
}

export default function SearchBox() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchRequest>({
    resolver: zodResolver(searchRequestSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? 'Something went wrong. Please try again.');
        return;
      }

      const data = (await res.json()) as GenerateResponse;
      router.push(`/destination/${data.destination.slug}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            placeholder="Search a destination — e.g. Ayodhya, Hampi, Varanasi"
            error={Boolean(errors.query)}
            helperText={errors.query?.message}
            disabled={isSubmitting}
            {...register('query')}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            sx={{ minWidth: { sm: 160 }, whiteSpace: 'nowrap' }}
          >
            {isSubmitting ? 'Crafting…' : 'Explore'}
          </Button>
        </Stack>
        {isSubmitting && (
          <Alert severity="info">
            Building your guide. New destinations are crafted by AI and may take a
            few seconds — cached ones load instantly.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
}
