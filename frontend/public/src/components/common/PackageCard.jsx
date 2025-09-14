import '../../styles/components/common/PackageCard.css';

const PackageCard = ({ packageInfo }) => {
  const { id, name, imageUrl, shortDescription } = packageInfo;

  return (
    <div className="package-card" data-id={id}>
      <div 
        className="package-card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="package-card-overlay" />
        <div className="package-card-content">
          <h3 className="package-card-title">{name}</h3>
          <p className="package-card-description">{shortDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;