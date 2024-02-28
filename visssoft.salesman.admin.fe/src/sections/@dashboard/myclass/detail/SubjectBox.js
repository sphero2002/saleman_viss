import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Paper, Avatar, Typography, CardHeader, Grid, Item } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components

// import { SubjectImage } from '../../../../utils';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Image from '../../../../components/image';
import Carousel, { CarouselArrows } from '../../../../components/carousel';
import Iconify from '../../../../components/iconify';
// ----------------------------------------------------------------------

ClassNewestBooking.propTypes = {
  sx: PropTypes.object,
  list: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.number,
};

export default function ClassNewestBooking({ myClass, title, subheader, sx, ...other }) {
  const theme = useTheme();
  const carouselRef = useRef(null);
  const carouselSettings = {
    dots: false,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box sx={{ py: 2, ...sx }} {...other}>
      <CardHeader
        title={title}
        subheader={`${subheader} môn học`}
        action={<CarouselArrows onNext={handleNext} onPrevious={handlePrev} />}
        sx={{
          p: 0,
          mb: 3,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
      />
      <Carousel ref={carouselRef} {...carouselSettings}>
        {myClass?.subjects?.map((item) => (
          <BookingItem key={item.subjectId} item={item} />
        ))}
      </Carousel>
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
    <Paper sx={{ mx: 1.5, borderRadius: 2, bgcolor: 'background.neutral' }}>
      <Stack alignItems="center" spacing={2.5} sx={{ p: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2">{name}</Typography>
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3} sx={{ color: 'text.secondary' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:layers-outline" width={16} />
            <Typography variant="caption"> {50} Tiết học</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:file-outline" width={16} />
            <Typography variant="caption">{50} Tài liệu</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box onClick={handleOnClickSubject} sx={{ p: 1, position: 'relative', cursor: 'pointer' }}>
        <Image
          alt="cover"
                  src={window.location.origin + '/assets/images/subjects/history.png'}
          sx={{ borderRadius: 1.5 }}
        />
      </Box>
    </Paper>
  );
}
