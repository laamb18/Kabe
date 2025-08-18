import './ItemCard.css';

    function ItemCard({ nombre, descripcion, imagen }) {
    return (
        <div className="item-card">
        <img src={imagen} alt={nombre} className="item-image" />
        <h2>{nombre}</h2>
        <p>{descripcion}</p>
        </div>
    );
    }

export default ItemCard;
