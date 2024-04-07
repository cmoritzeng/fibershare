//muda o ícone (?) ao colocar o mouse em cima, vice versa.
function changeIcon() {
    var icon = document.getElementById('interrogacao');
    icon.src = 'images/interrogation_b.svg'; // Altera a imagem para interrogation_b.svg
}
function resetIcon() {
    var icon = document.getElementById('interrogacao');
    icon.src = 'images/interrogation.svg'; // Restaura a imagem original
}
//Abre o tutorial ao clicar no ícone (?)
function openModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'flex';

    // Regula o tamanho dos pop up do tutorial

    //mapa
    var mapaWidth = document.getElementById("mapa").offsetWidth;
    document.getElementById("areamapatutorial").style.width = mapaWidth + "px";

    
    var mapaheight = document.getElementById("mapa").offsetHeight;
    document.getElementById("areamapatutorial").style.height = mapaheight + "px";


    //Estilo
    var stylewidth = document.getElementById("io9id").offsetWidth;
    document.getElementById("areaestilotutorial").style.width = stylewidth + "px";

    var styleheight = document.getElementById("io9id").offsetHeight;
    document.getElementById("areaestilotutorial").style.height = styleheight + "px";


    //carrinho
    var carrinhowidth = document.getElementById("CaixaCarrinho").offsetWidth;
    document.getElementById("areacarrinhotutorial").style.width = carrinhowidth + "px";

    var carrinhoheight = document.getElementById("CaixaCarrinho").offsetHeight;
    document.getElementById("areacarrinhotutorial").style.height = carrinhoheight + "px";

    //marcadores
    document.getElementById("areamarcadortutorial").style.width = carrinhowidth + "px";

    if (document.getElementById("Pontos").offsetHeight < 1){
        var marcadoresheight = document.getElementById("Pontos").offsetHeight + 33;
    }else{
        var marcadoresheight = document.getElementById("Pontos").offsetHeight + 45;
    }

    document.getElementById("areamarcadortutorial").style.height = marcadoresheight + "px";


    //Ajusta a posição das caixas de tutoral da caixinha de estilo e do carrinho

    // Obtém a posição do topo do elemento io9id em relação ao div barradir com rolagem
    var io9idTop = document.getElementById("io9id").offsetTop - document.getElementById("barradir").scrollTop + 11;
    document.getElementById("areaestilotutorial").style.top = io9idTop + "px";

    // Obtém a posição do topo do elemento CaixaCarrinho em relação ao div barradir com rolagem
    var carrinhoTop = document.getElementById("CaixaCarrinho").offsetTop - document.getElementById("barradir").scrollTop+ 11;
    document.getElementById("areacarrinhotutorial").style.top = carrinhoTop + "px";

    //Obtém a posição da base do elemento CaixaCarrinho em relação ao div barradir com rolagem
    var marcadortopo = document.getElementById("CaixaCarrinho").offsetTop + document.getElementById("CaixaCarrinho").offsetHeight - document.getElementById("barradir").scrollTop+ 21;
    document.getElementById("areamarcadortutorial").style.top = marcadortopo + "px";

    //dá uma arrastadinha para o lado se a brra lateral tiver sido ativada
    if (document.getElementById("barradir").scrollTop > 0) {
        document.getElementById("areacarrinhotutorial").style.right=38+"px";
        document.getElementById("areaestilotutorial").style.right=38+"px";
        document.getElementById("areamarcadortutorial").style.right=38+"px";
    } else{
        document.getElementById("areacarrinhotutorial").style.right=21+"px";
        document.getElementById("areaestilotutorial").style.right=21+"px";
        document.getElementById("areamarcadortutorial").style.right=21+"px";
    }
  }
function closeModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
}
function closeboasvindas() {
    var boasvindas = document.getElementById('boasvindas');
    boasvindas.style.display = 'none';
}

//quando clicado no overlay, aciona o código de fechar formulário
document.getElementById('overlay').addEventListener('click', fecharFormulario);

let marcadorAdicionado = false;


var dentroDoBotao = "adicionar Marcador"


var nPontos = 1;

var TabelaPontos = document.getElementById('TabelaPontos');

function AbrirTabelaPontos(){
    var cxpontos = document.getElementById('CaixaPontos');
    var botao = document.getElementById("BotaoMarcador");
    var addmarcador = document.getElementById("AdicionarMarcador");

    
    if (botao.innerHTML === "Adicionar marcador") {
        botao.innerHTML = "Fechar aba";
        cxpontos.style.display = 'flex';
        addmarcador.style.display='block';
      } else {
        botao.innerHTML = "Adicionar marcador";
        cxpontos.style.display = 'none';
        addmarcador.style.display='none';
        
      }

      


}
var marcadores = [];
var nPontos = 0;
function adicionarMarcador() {
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        var novaLinhapontos = TabelaPontos.insertRow();
        novaLinhapontos.id = 'linha' + nPontos;

        var cell1 = novaLinhapontos.insertCell(0);
        var cell2 = novaLinhapontos.insertCell(1);
        var cell3 = novaLinhapontos.insertCell(2);
        var cell4 = novaLinhapontos.insertCell(3);

        cell1.innerHTML = nPontos;
        cell2.innerHTML = lat.toFixed(5);
        cell3.innerHTML = lng.toFixed(5);

        var botaoExcluirPontos = document.createElement("button");
        botaoExcluirPontos.innerHTML = "X";
        botaoExcluirPontos.className = "BotaoExcluir";
        botaoExcluirPontos.onclick = function() {
            RemoverLinhaPontos(novaLinhapontos);
        };

        cell4.appendChild(botaoExcluirPontos);

        var conteudomarcador= '<table id="TabelaPopUp">\
        <tr>\
            <th scope="row">Latitude: </th>\
            <td>'+ lat.toFixed(5) + '</td>\
        </tr>\
        <tr id="LinhaCabo">\
            <th scope="row">Longitude: </th>\
            <td>' + lng.toFixed(5) + '</td>\
        </tr>\
        </table>  <button style="padding:2px" class="BotaoExcluir" onclick="excluirMarcador(' + nPontos + ')">Excluir Marcador</button>';


        const marcador = L.marker([lat, lng]).addTo(map)
            .bindPopup(conteudomarcador)
            .openPopup();

        marcadores[nPontos] = marcador;
        nPontos++;

        map.off('click');
    });
}



function contatovendas(){
    var contatopopup = document.getElementById('contatos');
    contatopopup.style.display = 'flex';
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'block';

}
function fecharcontatos(){
    var contatopopup = document.getElementById('contatos');
    contatopopup.style.display = 'none';
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

function trocaraba(event, abaSelecionada) {
    var aba1 = document.getElementById('CaixaVendas');
    var aba2 = document.getElementById('CaixaSwap');
    var aba3 = document.getElementById('CaixaRedeNeutra');
    var aba4 = document.getElementById('CaixaCompart');
    

    switch (abaSelecionada){
        case 'venda':
            aba1.style.display = 'block';
            aba2.style.display = 'none';
            aba3.style.display = 'none';
            aba4.style.display = 'none';
        break;
        case 'Swap':
            aba1.style.display = 'none';
            aba2.style.display = 'block';
            aba3.style.display = 'none';
            aba4.style.display = 'none';
        break;
        case 'Neutra':
            aba1.style.display = 'none';
            aba2.style.display = 'none';
            aba3.style.display = 'block';
            aba4.style.display = 'none';
        break;
        case 'Compart':
            aba1.style.display = 'none';
            aba2.style.display = 'none';
            aba3.style.display = 'none';
            aba4.style.display = 'block';
        break;
    }
    // Obtendo todos os botões da classe 'tablinks'
    var botoes = document.getElementsByClassName('tablinks');
    
    // Removendo a classe 'ativo' de todos os botões
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove('ativo');
    }
    
    // Adicionando a classe 'ativo' ao botão clicado
    event.currentTarget.classList.add('ativo');


}

