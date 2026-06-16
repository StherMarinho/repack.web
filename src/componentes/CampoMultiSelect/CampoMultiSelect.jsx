import { useState, useRef, useEffect } from 'react';
import './CampoMultiSelect.css';

const CampoMultiSelect = ({ label, options = [], value = [], aoAlterado }) => {

    const [aberto, setAberto] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const fechar = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setAberto(false);
            }
        };

        document.addEventListener('mousedown', fechar);
        return () => document.removeEventListener('mousedown', fechar);
    }, []);

    const toggleItem = (item) => {
        const existe = value.some(v => v.id === item.id);

        if (existe) {
            aoAlterado(value.filter(v => v.id !== item.id));
        } else {
            aoAlterado([...value, item]);
        }
    };

    return (
        <div className="campo-texto" ref={ref}>

            <label>{label}</label>

            <div
                className={`dropdown-input ${aberto ? 'ativo' : ''}`}
                onClick={() => setAberto(!aberto)}
            >
                <span>
                    {value.length > 0
                        ? `${value.length} selecionado(s)`
                        : 'Selecione...'}
                </span>

                <span className="arrow">
                    {aberto ? '▲' : '▼'}
                </span>
            </div>

            {aberto && (
                <div className="dropdown-box">

                    {options.map((opt) => {
                        const checked = value.some(v => v.id === opt.id);

                        return (
                            <div
                                key={opt.id}
                                className="dropdown-item"
                                onClick={() => toggleItem(opt)}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    readOnly
                                />
                                <span>{opt.descricao}</span>
                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
};

export default CampoMultiSelect;