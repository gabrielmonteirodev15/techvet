document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('dataSelect');
  const tabela = document.getElementById('tabelaAgendamentos').querySelector('tbody');
  const divDetalhes = document.getElementById('detalhesAgendamento');
  const divConfirmacao = document.getElementById('confirmacao');

  // Função para popular select com datas disponíveis
  function carregarDatas() {
    fetch('http://localhost:8080/agendamentos/datas-disponiveis')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar datas disponíveis');
        return res.json();
      })
      .then(datas => {
        // Limpa opções antigas (exceto a primeira)
        select.querySelectorAll('option:not(:first-child)').forEach(o => o.remove());

        datas.forEach(data => {
          const option = document.createElement('option');
          option.value = data;
          const [ano, mes, dia] = data.split("-");
          option.textContent = `${dia}/${mes}/${ano}`;
          select.appendChild(option);
        });
      })
      .catch(err => {
        console.error(err);
        divConfirmacao.textContent = 'Erro ao carregar datas disponíveis.';
      });
  }

  // Função para carregar agendamentos da data selecionada
  function carregarAgendamentos(dataSelecionada) {
    if (!dataSelecionada) {
      tabela.innerHTML = '';
      divDetalhes.innerHTML = '';
      divConfirmacao.innerHTML = '';
      return;
    }

    fetch(`http://localhost:8080/agendamentos/dia?data=${dataSelecionada}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar agendamentos');
        return res.json();
      })
      .then(data => {
        tabela.innerHTML = '';
        divDetalhes.innerHTML = '';
        divConfirmacao.innerHTML = '';

        if (data.length === 0) {
          tabela.innerHTML = `<tr><td colspan="4">Nenhum agendamento para esta data.</td></tr>`;
          return;
        }

        data.forEach(agendamento => {
          const linha = document.createElement('tr');

          linha.innerHTML = `
            <td>${agendamento.nomePet}</td>
            <td>${agendamento.nomeDono}</td>
            <td>${agendamento.dataHoraConsulta.replace("T", " ").slice(0, 16)}</td>
            <td><button class="detalhesBtn" data-id="${agendamento.idCliente}">Ver detalhes</button></td>
          `;

          linha.querySelector('.detalhesBtn').addEventListener('click', () => {
            mostrarDetalhes(agendamento);
          });

          tabela.appendChild(linha);
        });
      })
      .catch(err => {
        console.error(err);
        tabela.innerHTML = `<tr><td colspan="4">Erro ao carregar os dados.</td></tr>`;
        divDetalhes.innerHTML = '';
      });
  }

  // Função para mostrar detalhes de um agendamento com edição
  function mostrarDetalhes(agendamento) {
    divDetalhes.innerHTML = `
      <h3>Detalhes do Agendamento</h3>
      <table border="1">
        <tr><th>Nome do Pet</th><td><input type="text" id="editNomePet" value="${agendamento.nomePet}" /></td></tr>
        <tr><th>Dono</th><td><input type="text" id="editNomeDono" value="${agendamento.nomeDono}" /></td></tr>
        <tr><th>Data/Hora</th><td><input type="datetime-local" id="editDataHora" value="${agendamento.dataHoraConsulta.slice(0,16)}" /></td></tr>
        <tr><th>Problema</th><td><textarea id="editDescricao">${agendamento.descricaoProblema || ''}</textarea></td></tr>
        <tr>
          <td colspan="2">
            <button class="btnExcluir" data-id="${agendamento.idCliente}">Excluir</button>
            <button class="btnSalvar" data-id="${agendamento.idCliente}">Salvar</button>
            <button class="btnSair">Sair</button>
          </td>
        </tr>
      </table>
    `;

    // Botão Sair
    divDetalhes.querySelector('.btnSair').addEventListener('click', () => {
      divDetalhes.innerHTML = '';
    });

    // Botão Excluir
    divDetalhes.querySelector('.btnExcluir').addEventListener('click', (e) => {
      const idExcluir = e.target.dataset.id;
      divConfirmacao.innerHTML = `
        <h5>Deseja realmente excluir o agendamento?</h5>
        <button id="confirmarExclusao">Sim</button>
        <button id="cancelarExclusao">Cancelar</button>
      `;

      document.getElementById('confirmarExclusao').addEventListener('click', () => {
        fetch(`http://localhost:8080/agendamentos/${idExcluir}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Erro ao excluir');
            divConfirmacao.innerHTML = `<p style="color: green;">Agendamento excluído com sucesso!</p>`;
            divDetalhes.innerHTML = '';
            carregarAgendamentos(select.value);
            carregarDatas();
          })
          .catch(err => {
            console.error(err);
            divConfirmacao.innerHTML = `<p style="color: red;">Erro ao excluir agendamento.</p>`;
          });
      });

      document.getElementById('cancelarExclusao').addEventListener('click', () => {
        divConfirmacao.innerHTML = '';
      });
    });

    // Botão Salvar
    divDetalhes.querySelector('.btnSalvar').addEventListener('click', (e) => {
      const idSalvar = e.target.dataset.id;
      const nomePet = document.getElementById('editNomePet').value.trim();
      const nomeDono = document.getElementById('editNomeDono').value.trim();
      const dataHora = document.getElementById('editDataHora').value;
      const descricao = document.getElementById('editDescricao').value.trim();

      if (!nomePet || !nomeDono || !dataHora) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
      }

      const data = dataHora.substring(0, 10);
      const hora = dataHora.substring(11, 16);

      fetch(`http://localhost:8080/agendamentos/${idSalvar}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomePet,
          nomeDono,
          data,
          hora,
          descricaoProblema: descricao
        })
      })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao salvar alterações');
          divConfirmacao.innerHTML = `<p style="color: green;">Alterações salvas com sucesso!</p>`;
          carregarAgendamentos(select.value);
          carregarDatas();
        })
        .catch(err => {
          console.error(err);
          divConfirmacao.innerHTML = `<p style="color: red;">Erro ao salvar alterações.</p>`;
        });
    });
  }

  // Quando mudar o select, carregar agendamentos da data selecionada
  select.addEventListener('change', () => {
    carregarAgendamentos(select.value);
  });

  // Carrega as datas ao abrir a página
  carregarDatas();
});
