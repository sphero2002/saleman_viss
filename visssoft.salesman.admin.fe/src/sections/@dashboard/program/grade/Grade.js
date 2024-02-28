import { useCallback, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@mui/material';
import { useRouter } from 'next/router';
//
import { PATH_DASHBOARD } from 'src/routes/paths';
export default function Grade() {
  // const {
  //   query: { title },
  // } = useRouter();
  // console.log(title);
  const router = useRouter();
  const { push } = useRouter();

  const handleClassDetails = useCallback((class_id) => {
    router.push(PATH_DASHBOARD.class.detail(class_id));
  }, []);

  return (
    <Box sx={{ p: 3, cursor: 'pointer' }} gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
      {[...Array(5)].map((_, index) => (
        <Card
          onClick={() => handleClassDetails(index)}
          key={index}
          sx={{
            boxShadow: 0.3,
            ':hover': {
              boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
              transition: 'transform 150ms',
              transform: 'translateY(-10px)',
            },
          }}
        >
          <CardHeader title={`Lớp 1A`} subheader="Proin viverra ligula" />

          <Typography sx={{ p: 3, color: 'text.secondary' }}>
            Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. In enim justo, rhoncus ut, imperdiet a,
            venenatis vitae, justo. Vestibulum fringilla pede sit amet augue.
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
