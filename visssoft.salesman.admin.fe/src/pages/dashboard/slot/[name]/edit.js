import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
import { _slot } from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import SlotNewEditForm from '../../../../sections/@dashboard/slot/SlotNewEditForm';
import {useEffect, useState} from "react";
import {getSlotById, getProgramById} from "../../../../dataProvider/agent";

// ----------------------------------------------------------------------

SlotEditPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function SlotEditPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { name },
  } = useRouter();


    const [slotData, setSlotData] = useState([]);

    useEffect(() => {
        fetchSlot();
    }, []);

    async function fetchSlot() {
        const res = await getSlotById(name);
        if (res.status < 400) {
            setSlotData(res.data.data);
        } else {
            console.log(res.message);
        }
    }

  return (
    <>
      <Head>
        <title> Hệ thống quản lý Học liệu</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cập nhật tiết học"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Danh sách tiết học',
              href: PATH_DASHBOARD.slot.list,
            },
            { name: 'Cập nhật tiết học'},
          ]}
        />

        <SlotNewEditForm isEdit currentSlot={slotData} />
      </Container>
    </>
  );
}
