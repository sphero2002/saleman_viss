import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, DatePicker } from '@mui/material';

// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
    name: PropTypes.string,
    children: PropTypes.node,
};

export default function RHFDatePicker({ name, children, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name="date"
            rules={{
                validate: {
                    min: (date) => isFuture(date) || "Please, enter a future date"
                }
            }}
            render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                <DatePicker
                    {...field}
                    inputRef={ref}
                    label="Date"
                    renderInput={(inputProps) => (
                        <TextField
                            {...inputProps}
                            onBlur={onBlur}
                            name={name}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
            )}
        />
    );
}
