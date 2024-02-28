import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
// next
import NextLink from 'next/link';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Typography, CardContent, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Image from '../../../components/image';
import Iconify from '../../../components/iconify';
import TextMaxLine from '../../../components/text-max-line';
import SvgColor from '../../../components/svg-color';
// import second from '../../../../public/assets/cover_8.jpg'
// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  index: PropTypes.number,
  document: PropTypes.object,
};

export default function BlogPostCard({ document }) {
  // const isDesktop = useResponsive('up', 'md');

  const { code, name, typeFile, id } = document;

  // const latestPost = index === 0 || index === 1 || index === 2;

  // if (isDesktop && latestPost) {
  //   return (
  //     <Card>
  //       <Avatar
  //         alt={author.name}
  //         src={author.avatarUrl}
  //         sx={{
  //           top: 24,
  //           left: 24,
  //           zIndex: 9,
  //           position: 'absolute',
  //         }}
  //       />

  //       <PostContent title={title} view={view} comment={comment} share={share} createdAt={createdAt} index={index} />

  //       <StyledOverlay />

  //       <Image alt="cover" src={cover} sx={{ height: 360 }} />
  //     </Card>
  //   );
  // }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <SvgColor
          src="/assets/shape_avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        {/* <Avatar
          alt={author.name}
          src={author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        /> */}

        <Image alt="cover" src="https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_8.jpg" ratio="4/3" />
      </Box>

      <PostContent code={code} name={name} typeFile={typeFile} id={id} />
    </Card>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  code: PropTypes.string,
  name: PropTypes.string,
  typeFile: PropTypes.string,
  id: PropTypes.number,
};

export function PostContent({ code, name, typeFile, id }) {
  // const isDesktop = useResponsive('up', 'md');

  const linkTo = PATH_DASHBOARD.blog.view(id);

  // const latestPostLarge = index === 0;

  // const latestPostSmall = index === 1 || index === 2;

  // const POST_INFO = [
  //   { number: comment, icon: 'eva:message-circle-fill' },
  //   { number: view, icon: 'eva:eye-fill' },
  //   { number: share, icon: 'eva:share-fill' },
  // ];

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        zIndex: 9,
        bottom: 0,
        position: 'absolute',
        color: 'common.white',
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',

          opacity: 1.2,
        }}
      >
        t.manh - {code}
      </Typography>

      <NextLink href={linkTo} passHref>
        <TextMaxLine asLink variant="h5" line={2} persistent>
          {name}
        </TextMaxLine>
      </NextLink>
      {/* <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'common.white',
        }}
      >
        TypeFile: {typeFile}
      </Typography> */}

      {/* <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          color: 'text.disabled',

          opacity: 0.64,
          color: 'common.white',
        }}
      >
        {POST_INFO.map((info, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
          >
            <Iconify icon={info.icon} width={16} sx={{ mr: 0.5 }} />
            {fShortenNumber(info.number)}
          </Stack>
        ))}
      </Stack> */}
    </CardContent>
  );
}
