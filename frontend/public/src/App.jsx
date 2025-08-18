import './styles/App.css';
import ItemCard from './components/ItemCard/ItemCard';

function App() {

  const articulos = [
    {
      nombre: 'Silla plegable',
      descripcion: 'Silla cómoda y resistente para eventos.',
      imagen: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    },
    {
      nombre: 'Mesa redonda',
      descripcion: 'Mesa ideal para banquetes y reuniones.',
      imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    },
    {
      nombre: 'Carpa grande',
      descripcion: 'Carpa para proteger del sol y la lluvia.',
      imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="app-container">
      <h1>Artículos para renta de eventos</h1>
      <div className="items-list">
        {articulos.map((item, idx) => (
          <ItemCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

export default App;