import React from 'react';
import { Box, Card, CardHeader, Typography } from '@mui/material';
import { useRouter } from 'next/router';
//
import { PATH_DASHBOARD } from 'src/routes/paths';
import { bgGradient } from '../../../../utils/cssStyles';
import { useTheme } from '@mui/material/styles';

export default function LevelSecond() {
  const {
    query: { title },
  } = useRouter();
  const router = useRouter();
  const { push } = useRouter();
  const theme = useTheme();
  const handlerRedirect = (id) => {
    router.push(PATH_DASHBOARD.program.gradeSub(title, id));
    console.log('clicked: ', id + 1);
  };
  return (
    <Box sx={{ p: 3, cursor: 'pointer' }} gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          sx={{
            boxShadow: 0.3,
            ':hover': {
              boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
              transition: 'transform 150ms',
              transform: 'translateY(-10px)',
            },
            ...bgGradient({
              direction: '135deg',
              startColor: theme.palette.primary.main,
              endColor: theme.palette.primary.dark,
            }),
            color: 'common.white',
          }}
        >
          <CardHeader title={`Lớp ${index + 6}`} />

          <Typography sx={{ p: 3, color: 'common.white' }}>
            Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. In enim justo, rhoncus ut, imperdiet a,
            venenatis vitae, justo. Vestibulum fringilla pede sit amet augue.
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
