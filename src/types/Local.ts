export interface Local {
    id: string;
    nome: string;
    descricao: string | null;
    imagemUrl: string | null;
    mapaUrl?: string | null;
    visivel: boolean;
    missaoId: string;
    createdAt: string;
    updatedAt: string;

    missao?: {
        id: string;
        nome: string;
        descricao: string | null;

        campanha?: {
            id: string;
            nome: string;
            sistema: "ORDEM_PARANORMAL" | "DND";
        };
    };
}
