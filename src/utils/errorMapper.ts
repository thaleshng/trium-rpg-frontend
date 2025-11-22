interface ErrorDictionary {
    [key: string]: string;
}

const errorMessages: ErrorDictionary = {
    // Genéricos
    "Erro ao salvar alterações da campanha.": "Não foi possível salvar as alterações da campanha.",
    "Erro ao salvar.": "Não foi possível salvar as alterações.",
    "Erro ao carregar campanha.": "Não foi possível carregar os dados da campanha.",

    // Validações específicas
    "Nome é obrigatório": "O nome da campanha deve ser preenchido.",
    "Nome da campanha é obrigatório": "Digite um nome antes de salvar.",
    "nome: campo obrigatório": "O nome da campanha é obrigatório.",

    // Players
    "Player já está na campanha": "Este player já participa da campanha.",
    "Player não encontrado": "Player não encontrado. Tente atualizar a página.",
    "Player não pertence a esta campanha": "Este player não está vinculado à campanha.",

    // Missões
    "Missão não encontrada": "A missão não existe ou foi removida.",
    "Campo nome é obrigatório": "A missão precisa ter um nome válido.",

    // Autorização
    "Acesso negado": "Você não tem permissão para realizar esta ação.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapErrorMessage(raw: any): string {
    if (!raw) return "Ocorreu um erro inesperado.";

    const data = raw?.response?.data;

    // Caso seja erro de validação Zod
    if (data?.details?.length) {
        const detail = data.details[0];

        // mensagens específicas do Zod
        if (detail.code === "too_small" && detail.path[0] === "nome") {
            return "O nome da campanha deve ter pelo menos 2 caracteres.";
        }

        return detail.message || "Erro de validação.";
    }

    const backendMessage =
        data?.message ||
        raw?.message ||
        String(raw) ||
        null;

    if (!backendMessage) return "Erro inesperado.";

    // Busca match exato
    if (errorMessages[backendMessage]) {
        return errorMessages[backendMessage];
    }

    // Busca parcial
    const found = Object.entries(errorMessages).find(([key]) =>
        backendMessage.includes(key)
    );

    if (found) return found[1];

    // fallback
    return backendMessage;
}
