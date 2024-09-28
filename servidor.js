// Importar módulos e configurar variáveis de ambiente
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const porta = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB usando o URI do arquivo .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definição do esquema de contatos sem o campo de interesses
const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
});

const Contato = mongoose.model("Contato", contatoSchema);

// Rotas CRUD

// Rota para buscar todos os contatos
app.get("/contatos", async (req, res) => {
  try {
    const contatos = await Contato.find();
    res.json(contatos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar contatos: " + err.message });
  }
});

// Rota para adicionar um novo contato
app.post("/contatos", async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;

    if (!nome || !telefone || !email) {
      return res
        .status(400)
        .json({ erro: "Nome, telefone e email são obrigatórios." });
    }

    const novoContato = new Contato({
      nome,
      telefone,
      email,
    });

    const contatoSalvo = await novoContato.save();
    res.status(201).json(contatoSalvo);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar contato: " + err.message });
  }
});

// Rota para atualizar um contato existente pelo ID
app.put("/contatos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, email } = req.body;

    if (!nome || !telefone || !email) {
      return res
        .status(400)
        .json({ erro: "Nome, telefone e email são obrigatórios." });
    }

    const contatoAtualizado = await Contato.findByIdAndUpdate(
      id,
      { nome, telefone, email },
      { new: true }
    );

    if (!contatoAtualizado) {
      return res.status(404).json({ erro: "Contato não encontrado." });
    }

    res.json(contatoAtualizado);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar contato: " + err.message });
  }
});

// Rota para deletar um contato existente pelo ID
app.delete("/contatos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contatoDeletado = await Contato.findByIdAndDelete(id);

    if (!contatoDeletado) {
      return res.status(404).json({ erro: "Contato não encontrado." });
    }

    res.json({ mensagem: "Contato deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar contato: " + err.message });
  }
});

// Inicia o servidor na porta 500
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
