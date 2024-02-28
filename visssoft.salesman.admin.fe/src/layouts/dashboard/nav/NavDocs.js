// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// hooks
import { useAuthContext } from '../../../auth/useAuthContext';
// locales
import { useLocales } from '../../../locales';
// routes

// ----------------------------------------------------------------------

export default function NavDocs() {
  const { user } = useAuthContext();

  const { translate } = useLocales();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >
      <Box component="img" src="/assets/illustrations/illustration_docs.svg" />

    </Stack>
  );
}
