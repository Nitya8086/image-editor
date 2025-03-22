const ImageCard = ({ image, onEdit }) => (
    <div className="image-card">
        <img src={image.src.medium} alt={image.photographer} />
        <button onClick={onEdit}>Add Caption</button>
    </div>
);

export default ImageCard;
