import './CampoTexto.css';

const CampoTexto = (props) => {

    const aoDigitado = (e) => {
        props.aoAlterado(e.target.value);
    }

    return (
        <div className="campo-texto">
            <label>{props.label}</label>
            <input
                type={props.type || "text"}
                value={props.valor}
                onChange={aoDigitado}
                required={props.obrigatorio}
                placeholder={props.placeholder}
            />
        </div>
    );
}

export default CampoTexto;