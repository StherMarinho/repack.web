import './CampoSelect.css';

const CampoSelect = ({ label, options, value, aoAlterado }) => {

    const aoSelecionado = (e) => {
        aoAlterado(e.target.value);
    }

    return (
        <div className="campo-texto">
            <label>{label}</label>
            <select value={value} onChange={aoSelecionado}>
                <option value="">Selecione...</option>
                {
                    options.map((element) => (
                        <option key={element.id} value={element.id}>{element.descricao}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default CampoSelect;