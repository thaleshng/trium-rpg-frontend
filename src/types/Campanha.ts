export interface Missao {
    id: string;
    nome: string;
    descricao?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CampanhaParticipante {
    usuarioId: string;
    usuario: {
        id: string;
        nome: string;
    };
}

export interface Campanha {
    id: string;
    nome: string;
    descricao?: string | null;
    sistema: SistemaRPG;
    mestreId: string;
    createdAt: string;
    updatedAt: string;
    missoes: Missao[];
    participantes: {
        usuarioId: string;
        usuario?: {
            id: string;
            nome: string;
        };
    }[];
    mestre?: {
        id: string;
        nome: string;
    };
}

export type SistemaRPG = "ORDEM_PARANORMAL" | "DND";
