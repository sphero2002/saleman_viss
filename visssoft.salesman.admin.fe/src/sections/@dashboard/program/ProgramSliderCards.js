import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Button, Card, Grid, InputBase, Stack, Typography } from '@mui/material';
// components
import { fShortenNumber } from '../../../utils/formatNumber'; // utils
import { bgGradient } from '../../../utils/cssStyles';
//
import { useRouter } from 'next/router';
//
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

ProgramSliderCards.propTypes = {
  icon: PropTypes.node,
  sx: PropTypes.object,
};

export default function ProgramSliderCards({ item, icon, sx, ...other }) {
  const theme = useTheme();
  const router = useRouter();
  const { push } = useRouter();

  const handlerRedirect = (id) => {
    router.push(PATH_DASHBOARD.program.level(id));
    // console.log('clicked: ');
  };
  return (
    <Card
      key={item.id}
      onClick={() => handlerRedirect(item.id)}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        pl: 3,
        boxShadow: 0.5,
        border: '1px solid #f0e6d8',
        ':hover': {
          boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
          transition: 'transform 150ms',
          transform: 'translateY(-10px)',
        },
        ...sx,
      }}
      {...other}
    >
      <div>
        <Typography variant="h4"> {item.name}</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {item.description}
        </Typography>
      </div>

      <Box
        sx={{
          width: 120,
          height: 120,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}
