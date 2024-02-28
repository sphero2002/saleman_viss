import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

TypeDocsTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
    filterSubject: PropTypes.string,
    selectedSubject: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
    optionsSubject: PropTypes.arrayOf(PropTypes.object),
};

export default function TypeDocsTableToolbar({ isFiltered, filterName,selectedSubject,onChangeSubjects, onFilterName, onResetFilter,optionsSubject }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
        <TextField
            fullWidth
            select
            label="Thuộc môn học"
            value={selectedSubject}
            onChange={onChangeSubjects}
            SelectProps={{
                MenuProps: {
                    PaperProps: {
                        sx: {
                            maxHeight: 260,
                        },
                    },
                },
            }}
            sx={{
                maxWidth: 240,
                textTransform: 'capitalize',
            }}
        >
            <MenuItem
                key="all"
                value="all"
                sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                    '&:first-of-type': { mt: 0 },
                    '&:last-of-type': { mb: 0 },
                }}
            >
                Tất cả
            </MenuItem>
            {optionsSubject.length
                ? optionsSubject.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
                        sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                            '&:first-of-type': { mt: 0 },
                            '&:last-of-type': { mb: 0 },
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))
                : ''}
        </TextField>
      <TextField
        fullWidth
        // value={filterName}
        onChange={onFilterName}
        placeholder="Tìm kiếm loại tài liệu..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Xóa
        </Button>
      )}
    </Stack>
  );
}
