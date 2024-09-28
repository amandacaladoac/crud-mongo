// Função para carregar todos os contatos
async function carregarContatos() {
  try {
    const resposta = await fetch("http://localhost:5000/contatos");
    const contatos = await resposta.json();

    const tabelaCorpo = document.getElementById("listaContatos");
    tabelaCorpo.innerHTML = "";

    contatos.forEach((contato) => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${contato.nome}</td>
        <td>${contato.telefone}</td>
        <td><a href="mailto:${contato.email}">${contato.email}</a></td>
        <td>
          <button onclick="editarContato('${contato._id}')">Editar</button>
          <button onclick="deletarContato('${contato._id}')">Excluir</button>
        </td>
      `;

      tabelaCorpo.appendChild(linha);
    });
  } catch (erro) {
    console.error("Erro ao carregar contatos:", erro);
  }
}

// Função para cadastrar ou editar contato
async function cadastrarContato(evento) {
  evento.preventDefault();

  const idContato = document.getElementById("idContato").value;
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  const contato = {
    nome,
    telefone,
    email,
  };

  try {
    if (idContato) {
      const resposta = await fetch(
        `http://localhost:5000/contatos/${idContato}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contato),
        }
      );

      if (resposta.ok) {
        alert("Contato atualizado com sucesso!");
      } else {
        console.error("Erro ao atualizar contato:", resposta.statusText);
      }
    } else {
      const resposta = await fetch("http://localhost:5000/contatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contato),
      });

      if (resposta.ok) {
        alert("Contato cadastrado com sucesso!");
      } else {
        console.error("Erro ao cadastrar contato:", resposta.statusText);
      }
    }

    document.getElementById("formContato").reset();
    document.getElementById("idContato").value = "";
    carregarContatos();
  } catch (erro) {
    console.error("Erro ao conectar com o servidor:", erro);
  }
}

// Função para editar contato
async function editarContato(id) {
  try {
    const contato = await fetch(`http://localhost:5000/contatos/${id}`);
    const contatoData = await contato.json();

    if (contatoData) {
      document.getElementById("nome").value = contatoData.nome;
      document.getElementById("telefone").value = contatoData.telefone;
      document.getElementById("email").value = contatoData.email;
      document.getElementById("idContato").value = contatoData._id;

      document.getElementById("cadastrar").innerText = "Salvar Alterações";
    }
  } catch (erro) {
    console.error("Erro ao carregar contato para edição:", erro);
  }
}

// Função para deletar contato
async function deletarContato(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este contato?");
  if (confirmar) {
    try {
      const resposta = await fetch(`http://localhost:5000/contatos/${id}`, {
        method: "DELETE",
      });

      if (resposta.ok) {
        alert("Contato excluído com sucesso!");
        carregarContatos();
      } else {
        console.error("Erro ao excluir contato:", resposta.statusText);
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
    }
  }
}

// Carregar contatos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarContatos();

  // Associar o evento de submit ao formulário para cadastrar contato
  document
    .getElementById("formContato")
    .addEventListener("submit", cadastrarContato);
});
