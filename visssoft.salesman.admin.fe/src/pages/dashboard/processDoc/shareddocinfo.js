import PropTypes from 'prop-types'; 
// @mui
import {
    Typography, List, Stack, Dialog, TextField, DialogTitle, DialogActions,
    IconButton, DialogContent, Container, Box, Button
} from '@mui/material';
import { FileGeneralRecentCard } from '../../../sections/@dashboard/general/file';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import DashboardLayout from '../../../layouts/dashboard';
// 
import React, { useCallback, useEffect, useContext, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dispatch } from 'src/redux/store';
import { getOneDocumentRedux, handleSendInviteRedux } from 'src/redux/slices/document';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { JsonObjectContext } from '../../../context/JsonObjectContext';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { getALlRoles, getAllUsers, addShareDoc } from '../../../dataProvider/agent';

// ----------------------------------------------------------------------

shareddocinfo.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function shareddocinfo() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { jsonObject } = useContext(JsonObjectContext);
    const datax = useSelector(state => state.data);
    //console.log('datas', datax);
    const [docs, setDocs] = useState(JSON.parse(window.localStorage.getItem('shareddocsinfo')));
    console.log('docs', docs);
    var processdocs = new Array();
    if (docs == null) {
        router.push(PATH_DASHBOARD.processDoc.list);
        return;
    }
    docs.forEach(async function (doc) {
        var users = doc.users
        var docname = doc.docname;
        var docid = doc.docid;
        var permissaction = doc.permissaction;
        users.forEach(async function (row) {
            var email = row.email;
            var name = row.user.firstName.concat(" ", row.user.lastName);
            var email = row.user.email;
            var u = {};
            u.id = row.user.id;
            u.email = row.user.email;
            u.firstName = row.user.firstName;
            u.lastName = row.user.lastName;
            u.gender = row.user.gender;
            u.birthDate = row.user.birthDate;
            u.address = row.user.address;
            u.phone = row.user.phone;
            u.isTeacher = row.user.isTeacher;
            u.enable = row.user.enable;
            u.createBy = row.user.createBy;
            u.updateBy = row.user.updateBy;
            u.createDate = row.user.createDate;
            u.updateDate = row.user.updateDate;
            u.isDeleted = 0;
            processdocs.push({
                "status": '',
                "permission": 0,
                "permissaction": permissaction,
                "docid": docid,
                "docname": docname,
                "email": email,
                "name": name,
                "user": u
            });
        });
    });
    const [datas, setDatas] = useState(processdocs);
    console.log('processdocs', processdocs);

    useEffect(() => {
        async function processData() {
            for (let i = 0; i <= datas.length; i++) {
                const updatedData = [...datas];
                if (i == datas.length) {
                    updatedData[i - 1].status = 'Đã hoàn thành xử lý';
                } else {
                    updatedData[i].status = 'Đang xử lý';
                    setDatas(updatedData);
                    console.log("updatedData", updatedData[i]);
                    var docid = updatedData[i].docid;
                    var permissaction = updatedData[i].permissaction;
                    var sharedocs = [];
                    var myObject = new Array();
                    myObject.push({
                        "permission": 0,
                        "user": updatedData[i].user
                    });
                    sharedocs = myObject;
                    //process share data
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    const response = await addShareDoc(docid, permissaction, JSON.stringify(sharedocs));
                    console.log("response " + i, response);
                    try {
                        if (response.data.errorCode == 200) {
                            updatedData[i].status = 'Đã xử lý thành công';
                        } else {
                            updatedData[i].status = response.data.message;
                        }
                    } catch (error) {
                        //const { request, ...errorObject } = response; // take everything but 'request' 
                        console.log('response', error);
                        updatedData[i].status = response.response.data;
                    }
                }
                setDatas(updatedData);
            }
            //window.localStorage.removeItem('shareddocsinfo');
            //window.localStorage.removeItem('sharedocs');

            //router.push({
            //    pathname: PATH_DASHBOARD.processDoc.list
            //});
        }
        setDatas([]);
        processData();
    }, []);

    const handlerRedirect =  () => {
        window.localStorage.removeItem('shareddocsinfo');
        window.localStorage.removeItem('sharedocs');
        router.push(PATH_DASHBOARD.processDoc.list);
    };

    const handleDocDetails = useCallback(async  (docid) => { 
        const message = await dispatch(getOneDocumentRedux(docid));
        router.push(PATH_DASHBOARD.processDoc.docdetail(docid));
    }, []);

    return (
        <>
            <Head>
                <title> Hệ thống quản lý Học liệu</title>
            </Head>
            <Container maxWidth={'xl'}>
                <CustomBreadcrumbs
                    heading="Xử lý Tài liệu học liệu"
                    links={[
                        { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                        { name: 'Xử lý Tài liệu học liệu', href: PATH_DASHBOARD.processDoc.list },
                        { name: 'Chia sẻ tài liệu', href: PATH_DASHBOARD.processDoc.sharedocs },
                        { name: 'Xử lý dữ liệu' },
                    ]}
                />
                Xử lý dữ liệu để chia sẻ tài liệu
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID tài liệu</th>
                                <th>Tên tài liệu</th>
                                <th>Email</th>
                                <th>Tên</th>
                                <th>Trạng thái</th>
                                <th>Chi tiết tài liệu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.docid}</td>
                                    <td>{item.docname}</td>
                                    <td>{item.email}</td>
                                    <td>{item.name}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <IconButton color={'inherit'} onClick={() => handleDocDetails(item.docid)}>
                                            <Iconify icon="eva:info-fill" />
                                        </IconButton> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Button
                            fullWidth
                            variant="soft"
                            color="error"
                            size="large"
                            startIcon={<Iconify icon="eva:arrow-back-fill" />}
                            onClick={() => handlerRedirect()}
                        >
                            Trở lại trang danh sách tài liệu
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}
