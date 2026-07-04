'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface SaveButtonProps {
  destinationId: string;
  initialSaved: boolean;
}

/** Toggles whether the current destination is bookmarked for the user. */
export default function SaveButton({
  destinationId,
  initialSaved,
}: SaveButtonProps) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggle = async () => {
    setPending(true);
    setError(null);
    // Optimistic update, rolled back on failure.
    const previous = saved;
    setSaved(!previous);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationId }),
      });
      if (!res.ok) throw new Error('request failed');
      const data = (await res.json()) as { saved: boolean };
      setSaved(data.saved);
    } catch {
      setSaved(previous);
      setError('Could not update your saved places. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button
        variant={saved ? 'contained' : 'outlined'}
        color={saved ? 'primary' : 'inherit'}
        startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        onClick={toggle}
        disabled={pending}
      >
        {saved ? 'Saved' : 'Save'}
      </Button>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        message={error ?? ''}
      />
    </>
  );
}
