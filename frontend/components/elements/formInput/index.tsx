import './index.scss';
import { Controller } from 'react-hook-form';
import { InputFieldProps } from '@/types/interfaces';

const FormInput = ({ label, nameProp, placeholder, requiredProp, control, errors }: {
    label: string,
    nameProp: string,
    placeholder: string,
    requiredProp: string,
    control: any,
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
                render={({ field }: { field: InputFieldProps }) => (
                    <input
                        placeholder={placeholder}
                        {...field}
                        className="form-input"
                    />
                )}
            />
            {errors[nameProp] && (
                <h5>{errors[nameProp].message}</h5>
            )}
        </div>
    )
}

export default FormInput;
