import './index.scss';
import { Controller } from 'react-hook-form';
import { InputFieldProps } from '@/types/interfaces';

const Form = ({ label, nameProp, placeholder, requiredProp, controlProp, errorProp }: {
    label: string,
    nameProp: string,
    placeholder: string,
    requiredProp: string,
    controlProp: any,
    errorProp: any
}) => {


    return (
        <div className="form-item">
            <label className="form-label">
                {label}{" "}
            </label>
            <Controller
                name={nameProp}
                control={controlProp}
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
            {errorProp[nameProp] && (
                <h5>{errorProp[nameProp].message}</h5>
            )}
        </div>
    )
}

export default Form;
