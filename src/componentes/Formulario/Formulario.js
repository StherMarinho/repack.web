import "./Formulario.css";

const Formulario = ({ titulo, onSubmit, children }) => {
    return (
        <section className="formulario">
            <form onSubmit={onSubmit}>
                <h2>{titulo}</h2>
                {children}
            </form>
        </section>
    );
};

export default Formulario;