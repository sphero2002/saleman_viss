import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, FormHelperText, Stack } from '@mui/material';
import { TextField } from '@mui/material';
// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
    name: PropTypes.string,
};

export default function RHFAutocomplete({ name, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const isError = !!error && !field.value;
                return (
                    <Stack>
                        <Autocomplete {...other} disableCloseOnSelect />
                        {isError && <FormHelperText error>{error?.message}</FormHelperText>}
                    </Stack>
                );
            }}
        />
    );
}
