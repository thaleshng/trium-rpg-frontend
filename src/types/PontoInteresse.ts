export type PontoInteresse = {
    id: string;
    nome: string;
    descricao?: string | null;
    imagemUrl?: string | null;
    localId: string;

    x?: number;
    y?: number;
    size?: number;
    rotation?: number;
};
