require("ts-node/register");
const path = require("path");
process.env.NODE_ENV = "development"; // Simular ambiente de desenvolvimento

// A importação de @cloudflare/next-on-pages é condicional dentro de db.ts ou tratada por try-catch,
// então não precisamos mocká-la aqui para um teste Node.js puro, desde que NODE_ENV não seja production
// ou CF_PAGES não esteja definido, o que já garantimos com process.env.NODE_ENV = "development";

const { getDb, executeQuery, getFirst, getAll, closeDb } = require("./src/lib/db");

async function testDbAdapter() {
  console.log("Iniciando testes de unidade para o adaptador de banco de dados (db.ts) com sqlite3...");
  let db;
  let allTestsPassed = true;

  try {
    console.log("Teste 1: Obter instância do banco de dados (getDb)");
    db = await getDb(); // Modificado para await
    if (!db) {
      console.error("ERRO: getDb() retornou nulo ou indefinido.");
      throw new Error("Falha ao obter instância do DB.");
    }
    console.log("SUCESSO: Instância do banco de dados obtida.");

    const tableName = "test_table_db_adapter";

    console.log(`Teste 2: Criar tabela temporária (${tableName}) via executeQuery`);
    await executeQuery(db, `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value REAL)`);
    console.log("SUCESSO: Tabela temporária criada (ou já existia).");

    console.log("Teste 3: Inserir dados na tabela temporária via executeQuery");
    const insertResult1 = await executeQuery(db, `INSERT INTO ${tableName} (name, value) VALUES (?, ?)`, ["Teste1", 10.5]);
    const insertResult2 = await executeQuery(db, `INSERT INTO ${tableName} (name, value) VALUES (?, ?)`, ["Teste2", 20.0]);
    
    // Com sqlite3, cada insert é uma operação separada, changes será 1 para cada.
    // lastID será o ID da linha inserida.
    if (!insertResult1 || insertResult1.changes !== 1 || !insertResult2 || insertResult2.changes !== 1) {
        console.error("ERRO: Inserção de dados falhou. Resultado1:", insertResult1, "Resultado2:", insertResult2);
        allTestsPassed = false;
    } else {
        console.log("SUCESSO: Dados inseridos na tabela temporária. ID1:", insertResult1.lastID, "ID2:", insertResult2.lastID);
    }

    console.log("Teste 4: Ler um único registro (getFirst)");
    const firstRow = await getFirst(db, `SELECT * FROM ${tableName} WHERE name = ?`, ["Teste1"]);
    if (!firstRow || firstRow.name !== "Teste1" || firstRow.value !== 10.5) {
      console.error("ERRO: getFirst falhou ao retornar o registro esperado. Recebido:", firstRow);
      allTestsPassed = false;
    } else {
      console.log("SUCESSO: getFirst retornou o registro esperado:", firstRow);
    }

    console.log("Teste 5: Ler todos os registros (getAll)");
    const allRows = await getAll(db, `SELECT * FROM ${tableName} ORDER BY id ASC`);
    if (!allRows || allRows.length !== 2 || allRows[0].name !== "Teste1" || allRows[1].name !== "Teste2") {
      console.error("ERRO: getAll falhou ao retornar os registros esperados ou na ordem correta. Recebido:", allRows);
      allTestsPassed = false;
    } else {
      console.log("SUCESSO: getAll retornou os registros esperados:", allRows);
    }
    
    console.log("Teste 6: Atualizar um registro (executeQuery)");
    const updateResult = await executeQuery(db, `UPDATE ${tableName} SET value = ? WHERE name = ?`, [15.75, "Teste1"]);
    if (!updateResult || updateResult.changes !== 1) {
        console.error("ERRO: Atualização de dados falhou ou não atualizou 1 linha. Resultado:", updateResult);
        allTestsPassed = false;
    } else {
        const updatedRow = await getFirst(db, `SELECT value FROM ${tableName} WHERE name = ?`, ["Teste1"]);
        if(!updatedRow || updatedRow.value !== 15.75){
            console.error("ERRO: Valor não foi atualizado corretamente no banco. Esperado 15.75, recebido:", updatedRow ? updatedRow.value : 'undefined');
            allTestsPassed = false;
        } else {
            console.log("SUCESSO: Registro atualizado e verificado.");
        }
    }

    console.log("Teste 7: Deletar um registro (executeQuery)");
    const deleteResult = await executeQuery(db, `DELETE FROM ${tableName} WHERE name = ?`, ["Teste2"]);
     if (!deleteResult || deleteResult.changes !== 1) {
        console.error("ERRO: Deleção de dados falhou ou não deletou 1 linha. Resultado:", deleteResult);
        allTestsPassed = false;
    } else {
        const remainingRows = await getAll(db, `SELECT * FROM ${tableName}`);
        if(remainingRows.length !== 1 || (remainingRows[0] && remainingRows[0].name === "Teste2")){
            console.error("ERRO: Registro não foi deletado corretamente ou outros registros foram afetados. Restantes:", remainingRows);
            allTestsPassed = false;
        } else {
            console.log("SUCESSO: Registro deletado e verificado.");
        }
    }

  } catch (error) {
    console.error("ERRO CATASTRÓFICO DURANTE OS TESTES DO ADAPTADOR DE BANCO:", error);
    allTestsPassed = false;
  } finally {
    if (db) {
      try {
        console.log("Limpeza: Removendo tabela temporária test_table_db_adapter...");
        await executeQuery(db, `DROP TABLE IF EXISTS ${tableName}`);
        console.log("SUCESSO: Tabela temporária removida.");
        await closeDb(db); // Modificado para fechar o DB
      } catch (cleanupError) {
        console.error("ERRO na limpeza da tabela temporária ou ao fechar o DB:", cleanupError);
      }
    }
  }

  if (allTestsPassed) {
    console.log("\nSUCESSO GERAL: Todos os testes de unidade para o adaptador de banco de dados passaram.");
  } else {
    console.error("\nFALHA GERAL: Um ou mais testes de unidade para o adaptador de banco de dados falharam.");
    process.exit(1); // Sair com código de erro se algum teste falhar
  }
}

const fs = require("fs");
const dbDirForTest = path.join(__dirname, "db_data"); // Usar o mesmo diretório que db.ts

// A criação do diretório db_data é feita dentro de initializeLocalDb em db.ts
// Não é mais necessário criar .wrangler/state/v3/d1/miniflare-D1DatabaseObject
// if (!fs.existsSync(dbDirForTest)) {
//   console.log(`Criando diretório para o banco de dados local: ${dbDirForTest}`);
//   fs.mkdirSync(dbDirForTest, { recursive: true });
// }

testDbAdapter();

