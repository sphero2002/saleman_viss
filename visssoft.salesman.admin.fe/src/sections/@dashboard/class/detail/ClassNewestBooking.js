import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Paper, Avatar, Typography, CardHeader } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Iconify from '../../../../components/iconify';
import Carousel, { CarouselArrows } from '../../../../components/carousel';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------

ClassNewestBooking.propTypes = {
  sx: PropTypes.object,
  list: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function ClassNewestBooking({ myClass, title, subheader, sx, ...other }) {
  const theme = useTheme();

  return (
    <Box sx={{ py: 2, ...sx }} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        // action={<CarouselArrows onNext={handleNext} onPrevious={handlePrev} />}
        sx={{
          p: 0,
          mb: 3,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
      />

      {/* {list.map((item) => (
          <BookingItem key={item.id} item={item} />
        ))} */}

      {myClass?.subjects?.map((item) => (
        <BookingItem key={item.subjectId} item={item} />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

function BookingItem({ item }) {
  const { code, name, subjectId, teacherFirstName, teacherLastName, totalDocs, avatar } = item;

  const {
    query: { myclass_id },
  } = useRouter();

  const { push } = useRouter();
  const handleOnClickSubject = () => {
    push(PATH_DASHBOARD.myclass.classsubject(myclass_id, subjectId));
  };

  return (
    <Paper
      onClick={handleOnClickSubject}
      sx={{ mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral', cursor: 'pointer' }}
    >
      <Stack spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={avatar} />

          <div>
            <Typography variant="subtitle2">{name}</Typography>

            {/* <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
              {fDateTime(bookdAt)}
            </Typography> */}
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3} sx={{ color: 'text.secondary' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* <Iconify icon="fluent:text-number-list-ltr-24-filled" width={16} /> */}
            <Typography variant="caption">Slot {30}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            {/* <Iconify icon="carbon:document-attachment" width={16} /> */}
            <Typography variant="caption">{50} Document</Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* <Box sx={{ p: 1, cursor: 'pointer' }}>
        <Image alt="cover" src={cover} sx={{ borderRadius: 1 }} />
      </Box> */}
    </Paper>
  );
}
