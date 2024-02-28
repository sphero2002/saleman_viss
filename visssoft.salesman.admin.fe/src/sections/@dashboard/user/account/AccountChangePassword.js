import * as Yup from 'yup';
// form

// @mui
import {
    Box,
    Card,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import {useSnackbar} from '../../../../components/snackbar';
import {useState} from "react";
import {Formik} from "formik";
import {changePasswordUserAuth} from "../../../../dataProvider/agent";
import {
    isLowercaseChar,
    isNumber,
    isSpecialChar,
    isUppercaseChar,
    minLength
} from "../../../../utils/password-validation";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
    const {enqueueSnackbar} = useSnackbar();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleClickShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };
    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    return (
        <Formik
            initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                currentPassword: Yup.string()
                    .required("Mật khẩu cũ là bắt buộc"),
                newPassword: Yup.string()
                    .required("Mật khẩu mới là bắt buộc")
                    .matches(
                        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                        "Mật khẩu phải có ít nhất 8 ký tự, một chữ hoa, một số và một ký tự chữ hoa đặc biệt"
                    ),
                confirmNewPassword: Yup.string()
                    .required("Xác nhận mật khẩu là bắt buộc")
                    .oneOf([Yup.ref("newPassword"), null], "Mật khẩu không khớp"),
            })}
            onSubmit={async (
                values,
                {resetForm, setErrors, setStatus, setSubmitting}
            ) => {
                try {
                        const res = await changePasswordUserAuth({currentPassword: values.currentPassword,newPassword: values.newPassword});
                        if (res.data.errorCode === 200) {
                            enqueueSnackbar('Thay đổi mật khẩu thành công!');
                            resetForm();
                        }
                        if(res.data.errorCode === 400) {
                            enqueueSnackbar('Mật khẩu cũ không đúng', { variant: 'error' });
                        }
                    setSubmitting(false);
                } catch (err) {
                    console.error(error);
                    setSubmitting(false);
                }
            }}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Card sx={{p: 3}}>
                        <Grid container spacing={3}>
                            <Grid item container spacing={3} xs={12} sm={6}>
                                <Grid item xs={12}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="currentPassword">Mật khẩu cũ</InputLabel>
                                        <OutlinedInput
                                            id="currentPassword"
                                            placeholder="Nhập mật khẩu cũ"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={values.currentPassword}
                                            name="currentPassword"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowCurrentPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                        color="secondary"
                                                    >
                                                        <Iconify
                                                            icon={showCurrentPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                        />
                                        {touched.currentPassword && errors.currentPassword && (
                                            <FormHelperText error id="password-current-helper">
                                                {errors.currentPassword}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="newPassword">
                                            Mật khẩu mới
                                        </InputLabel>
                                        <OutlinedInput
                                            id="newPassword"
                                            placeholder="Nhập mật khẩu mới"
                                            type={showNewPassword ? "text" : "password"}
                                            value={values.newPassword}
                                            name="newPassword"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowNewPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                        color="secondary"
                                                    >
                                                        <Iconify
                                                            icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                        />
                                        {touched.newPassword && errors.newPassword && (
                                            <FormHelperText error id="password-password-helper">
                                                {errors.newPassword}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1.25}>
                                        <InputLabel htmlFor="confirmNewPassword">
                                            Xác nhận mật khẩu
                                        </InputLabel>
                                        <OutlinedInput
                                            id="confirmNewPassword"
                                            placeholder="Xác nhận mật khẩu"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={values.confirmNewPassword}
                                            name="confirmNewPassword"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                        color="secondary"
                                                    >
                                                        <Iconify
                                                            icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            inputProps={{}}
                                        />
                                        {touched.confirmNewPassword && errors.confirmNewPassword && (
                                            <FormHelperText error id="password-confirm-helper">
                                                {errors.confirmNewPassword}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{p: {xs: 0, sm: 2, md: 4, lg: 5}}}>
                                    <Typography variant="h5">Mật khẩu mới phải chứa:</Typography>
                                    <List sx={{p: 0, mt: 1}}>
                                        <ListItem divider>
                                            <ListItemIcon
                                                sx={{
                                                    color: minLength(values.newPassword)
                                                        ? "success.main"
                                                        : "inherit",
                                                }}
                                            >
                                                {minLength(values.newPassword) ? (
                                                    <Iconify icon="eva:checkmark-outline" />
                                                ) : (
                                                    <Iconify icon="eva:minus-outline" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary="Ít nhất 8 ký tự"/>
                                        </ListItem>
                                        <ListItem divider>
                                            <ListItemIcon
                                                sx={{
                                                    color: isLowercaseChar(values.newPassword)
                                                        ? "success.main"
                                                        : "inherit",
                                                }}
                                            >
                                                {isLowercaseChar(values.newPassword) ? (
                                                    <Iconify icon="eva:checkmark-outline" />
                                                ) : (
                                                    <Iconify icon="eva:minus-outline" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary="Ít nhất 1 chữ cái thường (a-z)"/>
                                        </ListItem>
                                        <ListItem divider>
                                            <ListItemIcon
                                                sx={{
                                                    color: isUppercaseChar(values.newPassword)
                                                        ? "success.main"
                                                        : "inherit",
                                                }}
                                            >
                                                {isUppercaseChar(values.newPassword) ? (
                                                    <Iconify icon="eva:checkmark-outline" />
                                                ) : (
                                                    <Iconify icon="eva:minus-outline" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary="Ít nhất 1 chữ cái viết hoa (A-Z)"/>
                                        </ListItem>
                                        <ListItem divider>
                                            <ListItemIcon
                                                sx={{
                                                    color: isNumber(values.newPassword)
                                                        ? "success.main"
                                                        : "inherit",
                                                }}
                                            >
                                                {isNumber(values.newPassword) ? (
                                                    <Iconify icon="eva:checkmark-outline" />
                                                ) : (
                                                    <Iconify icon="eva:minus-outline" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary="Ít nhất 1 số (0-9)"/>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon
                                                sx={{
                                                    color: isSpecialChar(values.newPassword)
                                                        ? "success.main"
                                                        : "inherit",
                                                }}
                                            >
                                                {isSpecialChar(values.newPassword) ? (
                                                    <Iconify icon="eva:checkmark-outline" />
                                                ) : (
                                                    <Iconify icon="eva:minus-outline" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary="Ít nhất 1 ký tự đặc biệt"/>
                                        </ListItem>
                                    </List>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Stack alignItems="flex-end" sx={{mt: 3}}>
                                        <LoadingButton
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting || Object.keys(errors).length !== 0}
                                            sx={{
                                                textTransform: "none",
                                            }}>
                                            Đặt lại mật khẩu
                                        </LoadingButton>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Card>
                </form>
            )}
        </Formik>
    );
}
