// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Link, Typography } from '@mui/material';
// layouts
import CompactLayout from '../../layouts/compact';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
// sections
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm';
// assets
import { SentIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

NewPasswordPage.getLayout = (page) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Gửi yêu cầu thành công{' '}
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Chúng tôi đã gửi Email xác nhận gồm 6 chữ số đến Email của bạn.
        <br />
        Vui lòng nhập mã vào ô bên dưới để xác minh Email của bạn.{' '}
      </Typography>

      <AuthNewPasswordForm />

      <Typography variant="body2" sx={{ my: 3 }}>
        Bạn ko nhận được mã? &nbsp;
        <Link variant="subtitle2">Gửi mã</Link>
      </Typography>

      <NextLink href={PATH_AUTH.login} passHref>
        <Link
          color="inherit"
          variant="subtitle2"
          sx={{
            mx: 'auto',
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Iconify icon="eva:chevron-left-fill" width={16} />
          Quay lại đăng nhập{' '}
        </Link>
      </NextLink>
    </>
  );
}
