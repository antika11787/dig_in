import { useEffect } from 'react';
import { UpdateUserApi } from '@/apiEndpoints/user';
import { useDispatch } from 'react-redux';
import { CreateUserForm } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { UserResponse } from '@/types/interfaces';
import { CgCloseR } from 'react-icons/cg';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import FormInput from '@/components/elements/formInput';
import FormSelect from '@/components/elements/formSelect';

interface EditUser {
    isEditModalOpen: boolean;
    editModalUser: UserResponse | null,
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditModalUser: React.Dispatch<React.SetStateAction<UserResponse | null>>;
}

const EditUserModal = (props: EditUser) => {
    const dispatch = useDispatch();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            username: props.editModalUser?.username,
            address: props.editModalUser?.address,
            role: props.editModalUser?.role,
        },
    });

    useEffect(() => {
        reset({
            username: props.editModalUser?.username,
            address: props.editModalUser?.address,
            role: props.editModalUser?.role,
        });
    }, [props.editModalUser, reset]);

    const onSubmit = async (data: CreateUserForm) => {
        const formData = new FormData();
        const userFormData: CreateUserForm = {
            username: data.username,
            address: data.address,
            role: data.role
        };

        Object.entries(userFormData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await UpdateUserApi(
            props.editModalUser && props.editModalUser._id ? props.editModalUser._id : "",
            userFormData
        );
        dispatch(saveContentLength({ contentLength: -1 }));
        reset();
        props.setIsEditModalOpen(false);
    };

    const closeEditModal = () => {
        props.setIsEditModalOpen(false);
        reset();
    };

    return (
        <Modal
            isOpen={props.isEditModalOpen}
            onRequestClose={closeEditModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
                content: {
                    width: "45%",
                    height: "60%",
                    margin: "auto",
                    borderRadius: "10px",
                    overflow: "auto",
                },
            }}
        >
            <div className="create-user-form-container">
                <h2 className='create-user-form-heading'>Edit User</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='create-user-form'>
                    <FormInput
                        label="UserName:"
                        nameProp="username"
                        requiredProp="This field is required"
                        placeholder="Enter username"
                        control={control}
                        errors={errors}
                    />

                    <FormInput
                        label="Address:"
                        nameProp="address"
                        requiredProp="This field is required"
                        placeholder="Enter address"
                        control={control}
                        errors={errors}
                    />
                    <FormSelect
                        label="Role:"
                        nameProp="role"
                        requiredProp="This field is required"
                        options={[
                            {
                                label: "Admin",
                                value: "admin",
                            },
                            {
                                label: "Customer",
                                value: "customer",
                            },
                            {
                                label: "Author",
                                value: "author",
                            }
                        ]}
                        control={control}
                        errors={errors}
                    />
                    <div>
                        <button className="submit-button">Submit</button>
                    </div>
                </form>
            </div>
            <CgCloseR className="close-button" onClick={closeEditModal} />
        </Modal>
    )
};

export default EditUserModal;
