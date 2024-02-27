import './index.scss';
import { Controller } from 'react-hook-form';

interface SelectFieldProps {
    name: string,
    value: string
}

const FormSelect = ({ label, nameProp, requiredProp, control, options, errors }: {
    label: string,
    nameProp: string,
    requiredProp: string,
    control: any,
    options: { label: string, value: string }[],
    errors: any
}) => {
    return (
        <div className="form-item">
            <label className="form-label">
                {label}{" "}
            </label>
            <Controller
                name={nameProp}
                control={control}
                rules={{
                    required: { requiredProp },
                }}
                render={({ field }: { field: SelectFieldProps }) => (
                    <select
                        {...field}
                        className="form-select"
                    >
                        <option value="" label='Select an option' className='form-select-option' disabled></option>
                        {options.map(option => (
                            <option key={option.value} value={option.value} className='form-select-option'>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            />
            {errors[nameProp] && (
                <h5>{errors[nameProp].message}</h5>
            )}
        </div>
    )
}

export default FormSelect;
