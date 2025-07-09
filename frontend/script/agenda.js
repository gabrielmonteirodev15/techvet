document.addEventListener('DOMContentLoaded', () => {
      const select        = document.getElementById('dataSelect');
      const tabelaTbody   = document.querySelector('#tabela tbody');
      const diaHeader     = document.getElementById('dia');
      const modalOverlay  = document.getElementById('modalOverlay');
      const modalNomePet  = document.getElementById('modalNomePet');
      const modalNomeDono = document.getElementById('modalNomeDono');
      const modalDataHora = document.getElementById('modalDataHora');
      const modalDescricao= document.getElementById('modalDescricao');
      const modalSave     = document.getElementById('modalSave');
      const modalClose    = document.getElementById('modalClose');
      let atualID;

      fetch('/api/agendamentos/datas-disponiveis')
        .then(res => res.json())
        .then(datas => {
          select.querySelectorAll('option:not(:first-child)').forEach(o=>o.remove());
          datas.forEach(str=>{
            const [y,m,d]=str.split('-');
            const opt=document.createElement('option');
            opt.value=str;
            opt.textContent=`${d}/${m}/${y}`;
            select.appendChild(opt);
          });
        }).catch(console.error);

      select.addEventListener('change', () => carregarAgendamentos(select.value));

      function carregarAgendamentos(dataSelecionada) {
        tabelaTbody.innerHTML='';
        if (!dataSelecionada) return;
        const [y,m,d]=dataSelecionada.split('-');
        fetch(`/api/agendamentos/dia?data=${dataSelecionada}`)
          .then(res=>res.json())
          .then(lista=>{
            if(lista.length===0) {
              tabelaTbody.innerHTML=`<tr><td colspan=5 style='text-align:center'>Nenhum agendamento.</td></tr>`;
              return;
            }
            lista.forEach(ag=>{
              const tr=document.createElement('tr');
              tr.innerHTML=`
                <td>${d}/${m}/${y}</td>
                <td>${ag.dataHoraConsulta.slice(11,16)}</td>
                <td>${ag.nomePet}</td>
                <td>${ag.nomeDono}</td>
                <td><a href='#' class='detalhesBtn' data-id='${ag.idCliente}'>Ver</a></td>
              `;
              tr.querySelector('.detalhesBtn').addEventListener('click', e=>{ 
                e.preventDefault(); openModal(ag); 
              });
              tabelaTbody.appendChild(tr);
            });
          }).catch(err=>{ 
            console.error(err); 
          });
      }

      function openModal(ag) {
        atualID=ag.idCliente;
        modalNomePet.value=ag.nomePet;
        modalNomeDono.value=ag.nomeDono;
        modalDataHora.value=ag.dataHoraConsulta.slice(0,16);
        modalDescricao.value=ag.descricaoProblema||'';
        modalOverlay.style.display='flex';
      }
      modalClose.addEventListener('click',()=>modalOverlay.style.display='none');

      modalSave.addEventListener('click',()=>{
        const [date,time]=modalDataHora.value.split('T');
        fetch(`/api/agendamentos/${atualID}`,{method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            nomePet:modalNomePet.value.trim(),
            nomeDono:modalNomeDono.value.trim(),
            descricaoProblema:modalDescricao.value.trim(),
            data:date,
            hora:time
          })
        })
          .then(res=>{
            if(!res.ok)
              throw new Error('Erro ao salvar');
            modalOverlay.style.display='none';
            carregarAgendamentos(select.value);
          })
          .catch(err=>
            alert(err.message));
      });

      modalDelete.addEventListener('click',()=>{
        if(!confirm('Confirma exclusão?'))
          return;
        fetch(`/api/agendamentos/${atualID}`, {method:'DELETE'})
          .then(res=>{
            if(!res.ok)
              throw new Error('Erro ao excluir');
            modalOverlay.style.display='none';carregarAgendamentos(select.value);})
          .catch(err=>
            alert(err.message));});
    });