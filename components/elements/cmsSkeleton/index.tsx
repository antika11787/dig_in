import "./index.scss";

const CmsSkeleton = () => {
    return (
        <div className="manage-container">
            <div className="manage-card">
                <div className="manage-card-table">
                    <div className="manage-image-title">
                        <div className="manage-image"></div>
                        <div className="manage-name"></div>
                    </div>
                    <div className="manage-category"></div>
                    <div className="manage-price"></div>
                </div>
                <div className="manage-button">
                    <div className="cms-edit-button"></div>
                    <div className="cms-delete-button"></div>
                </div>
            </div>
        </div>
    );
};

export default CmsSkeleton;
