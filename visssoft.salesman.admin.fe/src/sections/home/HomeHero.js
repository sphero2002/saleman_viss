import {m} from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import {alpha, styled, useTheme} from '@mui/material/styles';
import {Box, Button, Container, Grid, Stack, Typography} from '@mui/material';
// routes
import {PATH_AUTH} from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import {bgGradient, textGradient} from '../../utils/cssStyles';
// config
import {HEADER} from '../../config';
// components
import Iconify from '../../components/iconify';
import {MotionContainer, varFade} from '../../components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_2.jpg',
  }),
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    position: 'fixed',
  },
}));

const StyledDescription = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(15, 0),
  height: '100%',
}));

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
      `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: "'Barlow', sans-serif",
  fontSize: `${64 / 16}rem`,
  textAlign: 'center',
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 480,
  height: 480,
  top: -80,
  right: -80,
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.08),
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const isDesktop = useResponsive('up', 'md');

  return (
      <>
        <StyledRoot>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid container spacing={10} sx={{ height: 1 }}>
              <Grid item xs={12} md={6} sx={{ height: 1 }}>
                <Description />
              </Grid>

              {isDesktop && (
                  <Grid item xs={12} md={6}>
                    <Content />
                  </Grid>
              )}
            </Grid>
          </Container>

          <StyledEllipseTop />

          <StyledEllipseBottom />
        </StyledRoot>
      </>
  );
}

// ----------------------------------------------------------------------

function Description() {
  return (
      <StyledDescription>
        <m.div variants={varFade().in}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>
                Hệ thống quản lý
            </Typography>
        </m.div>

        <m.div variants={varFade().in}>
          <StyledGradientText
              sx={{ pb: 1.8, ml: 2.5 }}
              animate={{ backgroundPosition: '200% center' }}
              transition={{
                repeatType: 'reverse',
                ease: 'linear',
                duration: 20,
                repeat: Infinity,
              }}
          >
              Học Liệu
          </StyledGradientText>
        </m.div>

        <m.div variants={varFade().in}>
          <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ my: 5 }}>
            <Stack alignItems="center" spacing={2}>
              <NextLink href={PATH_AUTH.login} passHref>
                <Button
                    color="inherit"
                    size="large"
                    variant="contained"
                    startIcon={<Iconify icon="eva:flash-fill" width={24} />}
                    sx={{
                      bgcolor: 'text.primary',
                      color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                      '&:hover': {
                        bgcolor: 'text.primary',
                      },
                    }}
                >
                    Đăng nhập ngay
                </Button>
              </NextLink>
            </Stack>
          </Stack>
        </m.div>
      </StyledDescription>
  );
}

// ----------------------------------------------------------------------

function Content() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60 * 4,
    repeat: Infinity,
  };

  return (
      <Stack
          direction="row"
          alignItems="flex-start"
          sx={{
            height: 1,
            overflow: 'hidden',
            position: 'absolute',
            mt: `${HEADER.H_MAIN_DESKTOP}px`,
          }}
      >
          <Stack component={m.div} variants={varFade().in} sx={{ width: 344, position: 'relative' }}>
              <Box
                  component={m.img}
                  animate={{ y: ['0%', '100%'] }}
                  transition={transition}
                  src={`/assets/images/home/hero_dark_1.png`}
                  sx={{ position: 'absolute' }}
              />
              <Box
                  component={m.img}
                  animate={{ y: ['-100%', '0%'] }}
                  transition={transition}
                  src={`/assets/images/home/hero_dark_2.png`}
                  sx={{ position: 'absolute' }}
              />
          </Stack>

          <Stack component={m.div} variants={varFade().in} sx={{ width: 530, position: 'relative', ml: -2 }}>
              <Box
                  component={m.img}
                  animate={{ y: ['100%', '0%'] }}
                  transition={transition}
                  src={`/assets/images/home/hero_dark_1.png`}
                  sx={{ position: 'absolute' }}
              />
              <Box
                  component={m.img}
                  animate={{ y: ['0%', '-100%'] }}
                  transition={transition}
                  src={`/assets/images/home/hero_dark_2.png`}
                  sx={{ position: 'absolute' }}
              />
          </Stack>
      </Stack>
  );
}