import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Avatar } from '@mui/material';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import Chart from '../../../../components/chart';
// import Avatar from 'src/theme/overrides/Avatar';

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  sx: PropTypes.object,
  chart: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  percent: PropTypes.number,
};

export default function AppWidgetSummary({ title, percent, src, total, chart, sx, ...other }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ mb: 1 }} variant="subtitle2">
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
          <Avatar
            variant="rounded"
            sx={{ bgcolor: 'background.neutral', width: 48, height: 48, borderRadius: 1.5, mr: 2 }}
          >
            {title === 'Tài liệu khác' ? <>{src}</> : <Box sx={{ width: 36, height: 36 }} component="img" src={src} />}
          </Avatar>

          {/* <TrendingInfo percent={percent} /> */}

          <Typography variant="h4">{fNumber(total)}</Typography>
        </Box>
      </Box>

      {/* <Chart type="bar" series={[{ data: series }]} options={chartOptions} width={60} height={36} /> */}
    </Card>
  );
}

