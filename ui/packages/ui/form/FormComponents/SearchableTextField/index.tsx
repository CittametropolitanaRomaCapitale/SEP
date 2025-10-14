import { Fragment, ReactNode } from 'react';
import { FCC } from '@cmrc/types/FCC';
import {
	FieldValues,
	UseFormGetValues,
	UseFormSetValue
} from 'react-hook-form';
import { AutocompleteProps as MUIAutocompleteProps, Chip, IconButton, Stack, Box, SxProps } from '@mui/material';
import MUIFormControl from '@mui/material/FormControl';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUITextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FullScreenDialog from '../../../components/FullScreenDialog';

export type FGSearchableTextFieldProps = {
	variant?: any;
	readonly?: boolean;
	options?: any[];
	label?: string;
	title?: string;
	required?: boolean;
	searchBody?: ReactNode;
	searchOpen?: boolean;
	fullScreen?: boolean;
	dialogSx?: SxProps
	onReset?: () => void;
	onSearchOpen?: () => void;
	onSearchClose?: () => void;
	query?: (val: string, getValues?: UseFormGetValues<FieldValues>) => any;
	optionMapping?: (
		data: any
	) =>
		| { value: string | number; label: string }[]
		| { label: string; options: { value: string | number; label: string }[] }[];
	onSelect?: (value?: any, setValue?: UseFormSetValue<FieldValues>) => void;
	renderOption?: (props: any, option: any) => JSX.Element;
	renderTags?: (value: any[], getTagProps: (arg: { index: number }) => {}) => ReactNode;
} & Omit<MUIAutocompleteProps<any, any, any, any, any>, 'renderInput'>;

const SearchableTextField: FCC<FGSearchableTextFieldProps> = ({
	variant,
	size,
	label,
	value,
	required,
	disabled,
	readonly,
	open,
	loading,
	options,
	title,
	sx,
	dialogSx,
	fullScreen,
	searchBody,
	searchOpen,
	onReset,
	onChange,
	onInputChange,
	renderOption,
	renderTags,
	onSearchOpen,
	onSearchClose,
	...props
}) => {
	return (
		<>
			<MUIFormControl
				required={required}
				size={size}
				variant={variant}
				disabled={disabled}
				sx={sx ? sx : { width: '100%' }}
			>
				<MUIAutocomplete
					size={size}
					value={value}
					disabled={disabled}
					fullWidth={true}
					readOnly={readonly}
					onChange={onChange}
					clearOnEscape
					freeSolo
					onReset={onReset}
					onInputChange={onInputChange}
					options={!options || options?.length == 0 ? [] : options}
					loading={loading}
					renderInput={(params) => (
						<MUITextField
							required={required}
							label={label}
							variant={variant}
							{...params}
							InputProps={{
								...params.InputProps,
								inputProps: {
									...params.inputProps,
									readOnly: true,
								},
								endAdornment: (
									<>
										{value.length > 0 && (
											<Box>
												<IconButton
													disabled={disabled}
													size="small"
													component="label"
													onClick={onReset}
												>
													<ClearIcon />
												</IconButton>
											</Box>
										)}
										<Box>
											<IconButton
												disabled={disabled}
												size="small"
												component="label"
												onClick={onSearchOpen}
											>
												<SearchIcon />
											</IconButton>
										</Box>
									</>
								)
							}}
						/>
					)}
					renderOption={renderOption}
					renderTags={renderTags}
					{...props}
				/>
			</MUIFormControl>
			<FullScreenDialog
				open={searchOpen}
				title={title}
				onClose={onSearchClose}
				fullScreen={fullScreen}
				contrastBackground
				sx={dialogSx}
				>
				{searchBody}
			</FullScreenDialog>
		</>
	);
};

export default SearchableTextField;
