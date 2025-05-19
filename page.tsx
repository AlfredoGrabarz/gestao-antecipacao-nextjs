// src/app/cheques/page.tsx
import ChequeForm from "@/components/forms/ChequeForm";
import ChequesTable from "@/components/tables/ChequesTable";
import { getCheques } from "@/app/cheques/actions"; // Importar a função para buscar cheques

// Tipagem para os dados retornados pela action
interface ChequeData {
  id: number;
  cliente_id: number;
  cliente_nome: string; // Adicionado pelo JOIN na action
  emitente: string;
  numero: string;
  valor: number;
  data_vencimento: string;
  banco: string;
  agencia: string;
  conta_corrente: string;
  status: string;
  data_criacao: string;
  data_atualizacao: string;
}

export default async function ChequesPage() {
  // Buscar os cheques do banco de dados usando a Server Action
  const { success, data, message } = await getCheques();
  const cheques: ChequeData[] = success ? (data as ChequeData[]) : [];

  if (!success) {
    console.error("Erro ao buscar cheques:", message);
    // Poderia mostrar uma mensagem de erro na UI
  }

  // Mapear os dados para o formato esperado pelo ChequesTable
  const chequesParaTabela = cheques.map(cheque => ({
    id: cheque.id,
    cliente: cheque.cliente_nome, // Usar o nome do cliente obtido pelo JOIN
    emitente: cheque.emitente,
    numero: cheque.numero,
    valor: cheque.valor,
    dataVencimento: cheque.data_vencimento,
    banco: cheque.banco,
    agencia: cheque.agencia,
    contaCorrente: cheque.conta_corrente,
    status: cheque.status,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestão de Cheques</h1>
      
      {/* Formulário para adicionar novo cheque */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Cheque</h2>
        <ChequeForm />
      </div>

      {/* Tabela para listar cheques existentes */}
      <div className="p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cheques Cadastrados</h2>
        {!success && <p className="text-red-400 mb-4">Erro ao carregar cheques: {message}</p>}
        <ChequesTable cheques={chequesParaTabela} /> {/* Passar os dados reais */}
      </div>
    </div>
  );
}
