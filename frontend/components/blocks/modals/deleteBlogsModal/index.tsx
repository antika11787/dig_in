import { DeleteBlogApi } from '@/apiEndpoints/blog'
import { useDispatch } from 'react-redux';
import { BlogResponse } from '@/types/interfaces';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { CgCloseR } from 'react-icons/cg';
import Modal from 'react-modal';

type DeleteBlog = {
    blogID: string;
    blogs: BlogResponse[];
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBlogs: React.Dispatch<React.SetStateAction<BlogResponse[]>>;
}

const DeleteBlogsModal = (props: DeleteBlog) => {
    const dispatch = useDispatch();
    const closeDeleteModal = () => {
        props.setIsDeleteModalOpen(false);
    };

    const deleteBlog = async (blogId: string) => {
        await DeleteBlogApi(blogId);
        const updatedBlogs = props.blogs.filter(blog => blog._id !== blogId);
        props.setBlogs(updatedBlogs);
        dispatch(saveContentLength({ contentLength: updatedBlogs.length || 0 }));
    };

    return (
        <Modal
            isOpen={props.isDeleteModalOpen}
            onRequestClose={closeDeleteModal}
            ariaHideApp={false}
            contentLabel="Example Modal"
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
                content: {
                    width: "40%",
                    height: "35%",
                    margin: "auto",
                    borderRadius: "10px",
                    overflow: "auto",
                },
            }}
        >
            <div className="delete-modal-container">
                <h2 className="delete-modal-heading">Delete Blog</h2>
                <p className="delete-modal-description">
                    Are you sure you want to delete this blog?
                </p>
                <div className="delete-modal-button">
                    <button
                        className="yes-button"
                        onClick={() => {
                            deleteBlog(props.blogID);
                            closeDeleteModal();
                        }}
                    >
                        Yes
                    </button>
                    <button className="no-button" onClick={closeDeleteModal}>
                        No
                    </button>
                </div>
            </div>
            <CgCloseR
                className="close-button"
                onClick={closeDeleteModal}
            />
        </Modal>
    )
}

export default DeleteBlogsModal;
