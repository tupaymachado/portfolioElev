export function ordenarEtiquetas(a, b) {
    const expositorA = Number(a.localizacao?.Laranjal?.expositor);
    const expositorB = Number(b.localizacao?.Laranjal?.expositor);
    const posicaoA = Number(a.localizacao?.Laranjal?.posicao);
    const posicaoB = Number(b.localizacao?.Laranjal?.posicao);

    if (expositorA < expositorB) {
        return -1;
    }
    if (expositorA > expositorB) {
        return 1;
    }
    if (posicaoA < posicaoB) {
        return -1;
    }
    if (posicaoA > posicaoB) {
        return 1;
    }
    return 0;
}