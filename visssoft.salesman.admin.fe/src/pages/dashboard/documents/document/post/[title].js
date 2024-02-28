import { useEffect, useState, useCallback } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Box, Divider, Stack, Container, Typography, Pagination } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// utils
import axios from '../../../../../utils/axios';
// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import Markdown from '../../../../../components/markdown';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../../components/settings';
import { SkeletonPostDetails } from '../../../../../components/skeleton';
// sections
import {
  DocumentPostHero,
  DocumentPostTags,
  DocumentPostCard,
  DocumentPostCommentList,
  DocumentPostCommentForm,
} from '../../../../../sections/@dashboard/documents';

// ----------------------------------------------------------------------

DocumentPostPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function DocumentPostPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { title },
  } = useRouter();

  const [recentPosts, setRecentPosts] = useState([]);

  const [post, setPost] = useState(null);

  const [loadingPost, setLoadingPost] = useState(true);

  const [error, setError] = useState(null);



  return (
    <>
      <Head>
          <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Post Details"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách tài liệu',
              href: PATH_DASHBOARD.documents.root,
            },
            {
              name: post?.title,
            },
          ]}
        />

        {post && (
          <Stack
            sx={{
              borderRadius: 2,
              boxShadow: (theme) => ({
                md: theme.customShadows.card,
              }),
            }}
          >
            <DocumentPostHero post={post} />

            <Typography
              variant="h6"
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              {post.description}
            </Typography>

            <Markdown
              children={post.body}
              sx={{
                px: { md: 5 },
              }}
            />

            <Stack
              spacing={3}
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              <Divider />
              <DocumentPostTags post={post} />
              <Divider />
            </Stack>

            <Stack
              sx={{
                px: { md: 5 },
              }}
            >
              <Stack direction="row" sx={{ mb: 3 }}>
                <Typography variant="h4">Comments</Typography>

                <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({post.comments.length})
                </Typography>
              </Stack>

              <DocumentPostCommentForm />

              <Divider sx={{ mt: 5, mb: 2 }} />
            </Stack>

            <Stack
              sx={{
                px: { md: 5 },
              }}
            >
              <DocumentPostCommentList comments={post.comments} />

              <Pagination
                count={8}
                sx={{
                  my: 5,
                  ml: 'auto',
                  mr: { xs: 'auto', md: 0 },
                }}
              />
            </Stack>
          </Stack>
        )}

        {error && !loadingPost && <Typography variant="h6">404 {error}</Typography>}

        {loadingPost && <SkeletonPostDetails />}

        {!!recentPosts.length && (
          <>
            <Typography variant="h4" sx={{ my: 5 }}>
              Recent posts
            </Typography>

            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              {recentPosts.slice(recentPosts.length - 4).map((post) => (
                <DocumentPostCard key={post.id} post={post} />
              ))}
            </Box>
          </>
        )}
      </Container>
    </>
  );
}
