import { useState } from 'react';


export function EtiquetasPreco({ etiquetas = [] }) {

    return (
        <>
            {etiquetas.map((etiqueta) => {
                return (
                    <div className="etiqueta" key={etiqueta.codigo}>
                        <div className="etiqueta__codigo">{etiqueta.codigo}</div>
                        <div className="etiqueta__descricao">{etiqueta.descricao}</div>
                        <div className="etiqueta__preco">{etiqueta.precoAtual}</div>
                    </div>
                )
            })
            }
        </>
    )
}
