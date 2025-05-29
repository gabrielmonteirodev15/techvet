const dados = [
    { data: 'Abril 30, 2025', hora: '09:00', pet: 'Bella', doutor: 'José Santos' },
    { data: 'Abril 30, 2025', hora: '15:30', pet: 'Toby', doutor: 'Filomena Barreto' },
    { data: 'Abril 30, 2025', hora: '10:45', pet: 'Max', doutor: 'José Santos' },
    { data: 'Abril 30, 2025', hora: '11:00', pet: 'Charlie', doutor: 'André Souza' }
  ];

  const tabela = document.querySelector('#tabela tbody');

  for (let i = 0; i < dados.length; i++) {
    const linha = document.createElement('tr');

    const tdData = document.createElement('td');
    tdData.textContent = dados[i].data;
    linha.appendChild(tdData);

    const tdHora = document.createElement('td');
    tdHora.textContent = dados[i].hora;
    linha.appendChild(tdHora);

    const tdPet = document.createElement('td');
    tdPet.textContent = dados[i].pet;
    linha.appendChild(tdPet);

    const tdDoutor = document.createElement('td');
    tdDoutor.textContent = dados[i].doutor;
    linha.appendChild(tdDoutor);

    const tdLink = document.createElement('td');
    const link = document.createElement('a');
    link.textContent = 'View';
    link.href = '#';
    tdLink.appendChild(link);
    linha.appendChild(tdLink);

    tabela.appendChild(linha);
  }