import './Card.css';

const Card = ({ titulo, subtitulo, descricao }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{subtitulo}</h6>
                <p className="card-text">{descricao}</p>
            </div>
        </div>
    );
};

export default Card;