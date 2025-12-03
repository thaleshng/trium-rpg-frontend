/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MissaoDetalhada {
    id: string;
    nome: string;
    descricao: string | null;
    campanhaId: string;
    createdAt: string;
    updatedAt: string;

    visibilidadePersonagens: boolean;

    campanha: {
        id: string;
        nome: string;
        descricao: string | null;
        sistema: "ORDEM_PARANORMAL" | "DND";
        mestreId: string;
        createdAt: string;
        updatedAt: string;
        participantes: {
            id: string;
            usuarioId: string;
            campanhaId: string;
            createdAt: string;
            updatedAt: string;
            usuario: {
                id: string;
                nome: string;
                tipo: "PLAYER" | "MESTRE";
            }
        }[];
    };

    personagens: {
        id: string;
        nome: string;
        imagemUrl: string | null;
        atributosJson: any | null;
        usuarioId: string;
        missaoId: string;
        createdAt: string;
        updatedAt: string;
    }[];

    locais: {
        id: string;
        nome: string;
        descricao: string | null;
        imagemUrl: string | null;
        visivel: boolean;
        missaoId: string;
        createdAt: string;
        updatedAt: string;
    }[];

    monstros: {
        id: string;
        nome: string;
        descricao: string | null;
        imagemUrl: string | null;
        atributosJson: any | null;
        visivel: boolean;
        missaoId: string;
        createdAt: string;
        updatedAt: string;
    }[];
}
