//Adiciona o item que identifica a caixa de seleção para mostrar os cabos
var checkbox1 = document.getElementById('caixaCabos');
//Adiciona a verificação sobre essa caixa, se algo ocorrer, ele percebe
checkbox1.addEventListener('change',function() {
    if(this.checked) {
        map.addLayer(layer_Cabos_2);
    } else {
        map.removeLayer(layer_Cabos_2);
    }
});
//Adiciona funcionalidade ao checkbox dos postes
var checkbox2 = document.getElementById('caixaPostes');
//Adiciona a verificação sobre essa caixa, se algo ocorrer, ele percebe
checkbox2.addEventListener('change',function() {
    if(this.checked) {
        map.addLayer(layer_Postes_3);
    } else {
        map.removeLayer(layer_Postes_3);
    }
});
//Adiciona o item que identifica a caixa de seleção para mostrar os cabos
var checkbox3 = document.getElementById('caixaCabosCompart');
//Adiciona a verificação sobre essa caixa, se algo ocorrer, ele percebe
checkbox3.addEventListener('change',function() {
    if(this.checked) {
        map.addLayer(layer_ProjetosparaCompartilhar_1);
    } else {
        map.removeLayer(layer_ProjetosparaCompartilhar_1);
    }
});
//Define os layers básicos do mapa
var baseLayers = {
    "Sat": layer_GoogleSatellite_0,
    "Osm": layer_OpenStreetMap_1
};
// Função para mudar o mapa com base no tipo selecionado
function mudarMapa(selectedLayer) {
    // Atualiza o valor selecionado em todos os elementos select
    var selectElements = document.querySelectorAll('select[name="SelecaoMapa"]');
    for (var i = 0; i < selectElements.length; i++) {
        selectElements[i].value = selectedLayer;
    }

    // Aplica a mudança de mapa conforme selecionado
    if (selectedLayer === 'layer_GoogleSatellite_0') {
        layer_GoogleSatellite_0.addTo(map);
        map.removeLayer(layer_OpenStreetMap_1);
    } else if (selectedLayer === 'layer_OpenStreetMap_1') {
        layer_OpenStreetMap_1.addTo(map);
        map.removeLayer(layer_GoogleSatellite_0);
    }
}
//Local para guardar os ids dos cabos selecionados
var idsSelecionados = {}; 
var idsSelecionadosComp = {}; 


//Guarda o  total dos comprimentos selecionados
var totalComprimento = 0;
//Guarda o total de postes selecionados
var totalPostes = 0;
var totalIds = 0;
// criada uma camada para o destaque
var highlightLayer;
// criada a base do mapa
var map = L.map('map', {
    zoomControl:true, maxZoom:28, minZoom:6
}).fitBounds([[-29.95, -56.00],[-25.55, -47.70]]);
// criada uma layer com hachura	
var hash = new L.Hash(map);
// atribui ao mapa os controles			
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a> &middot Feito por: <a href="https://br.linkedin.com/in/joaomonego" target="_blank">João Vitor Corrêa Del Monego</a> e <a href="https://br.linkedin.com/in/yan-ribeiro-de-souza-895893226" target="_blank">Yan Ribeiro de Souza</a> |  <a href="https://cmoritz.com.br/" target="_blank">CMoritz Engenharia</a>');
// cria a configuração de links, com tamnho 30 e com a localização automatica no lugar que melhor se encaixar			
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
// cria um grupo vázio, nele serão colocadas as camadas dos itens do mapa
var bounds_group = new L.featureGroup([]);
// cria um novo painel para ser utilizado com o mapa do google satellite 
map.createPane('pane_GoogleSatellite_0');
// dá um style ao painel criado 
map.getPane('pane_GoogleSatellite_0').style.zIndex = 400;
// cria uma camada com as imagens de satélite, usando o painel referenciadpo 
var layer_GoogleSatellite_0 = L.tileLayer('https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    pane: 'pane_GoogleSatellite_0',
    opacity: 1.0,
    attribution: 'Satélite',
    minZoom: 6,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 18
});
// cria um novo painel para ser utilizado com o mapa do OSM
map.createPane('pane_OpenStreetMap_1');
// dá um style ao painel criado 
map.getPane('pane_OpenStreetMap_1').style.zIndex = 401;
// cria uma camada com as imagens de OSM, usando o painel referenciadpo 
var layer_OpenStreetMap_1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    pane: 'pane_OpenStreetMap_1',
    opacity: 1.0,
    attribution: 'Mapa',
    minZoom: 6,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 19
});
// Adiciona o layer do OSM 
map.addLayer(layer_OpenStreetMap_1);
// Cria um painel para serem utilizados os cabos
map.createPane('pane_Cabos_2');
// dá um style para o painel
map.getPane('pane_Cabos_2').style.zIndex = 402;
map.getPane('pane_Cabos_2').style['mix-blend-mode'] = 'normal';
// cria uma camada com os cabos 
var layer_Cabos_2 = new L.geoJson(json_Cabos_2, {
    attribution: '',
    interactive: true,
    dataVar: 'json_Cabos_2',
    layerName: 'layer_Cabos_2',
    pane: 'pane_Cabos_2',
    onEachFeature: pop_Cabos_2,
    style: style_Cabos_2_0,
});
// coloca a camada de cabos no grupo dos itens do mapa 
bounds_group.addLayer(layer_Cabos_2);
// adiciona a camada de cabos ao mapa 
map.addLayer(layer_Cabos_2);
// Criado um painel para serem utilizados os postes 
map.createPane('pane_Postes_3');
// dá um style para o painel
map.getPane('pane_Postes_3').style.zIndex = 403;
map.getPane('pane_Postes_3').style['mix-blend-mode'] = 'normal';
// cria uma camada com os cabos 
var layer_Postes_3 = new L.geoJson(json_Postes_3, {
    attribution: '',
    interactive: false,
    dataVar: 'json_Postes_3',
    layerName: 'layer_Postes_3',
    pane: 'pane_Postes_3',
    onEachFeature: pop_Postes_3,
    pointToLayer: function (feature, latlng) {
        var context = {
            feature: feature,
            variables: {}
        };
        return L.circleMarker(latlng, style_Postes_3_0(feature));
    },
});
// coloca a camada de postes no grupo dos itens do mapa 
bounds_group.addLayer(layer_Postes_3);
//Declara o geocoder 
var osmGeocoder = new L.Control.Geocoder({
    collapsed: false,
    position: 'topright',
    text: 'Procure',
    title: 'Testing'
}).addTo(map);
//Pega a imagam da lupinha 
document.getElementsByClassName('leaflet-control-geocoder-icon')[0]
.className += ' fa fa-search';
//insere a informação que apararece no mouse ao colocar o mouse sobre 
document.getElementsByClassName('leaflet-control-geocoder-icon')[0]
.title += 'Procure por um local';
//Exibe o formulário com informações para contato
function exibirFormulario() {
    var formularioPopUp = document.getElementById('formularioPopUp');
    var overlay = document.getElementById('overlay');
    formularioPopUp.style.display = 'block';
    overlay.style.display = 'block';
}
//Ação acionada oao clicar para enviar as informaçõer
function enviarEmail() {
    // Obtenha os dados do formulário
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('telefone').value;
    // Obtenha os dados da tabela de destino
    var tabelaDestino = document.getElementById('tabelaDestino');
    var dadosTabela = tabelaDestino.innerHTML;
    // Simule o envio do e-mail (substitua isso pelo código real no backend)
    var corpoEmail = `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}`;
    alert('E-mail enviado com sucesso:\n\n' + corpoEmail);
    // Feche o popup
    fecharFormulario();
}
//fecha o formulário com informações para contato
function fecharFormulario() {
    var formularioPopUp = document.getElementById('formularioPopUp');
    var overlay = document.getElementById('overlay');
    formularioPopUp.style.display = 'none';
    overlay.style.display = 'none';
    fecharcontatos();
}
// Função que dá o contraste ao colocar o mouse sobre os itens
function highlightFeature(e) {
    highlightLayer = e.target;
        highlightLayer.setStyle({
            weight: 10,
        });
}
function deshighlightFeature(e) {
    voltaraonormal = e.target;
    voltaraonormal.setStyle({
        weight: 4,
    });
}
// Função que carrega os dados para o pop up do cabos
var featureSelecionada;
function pop_Cabos_2(feature, layer) {
    layer.on({
        click: function(e) {
            featureSelecionada = e.target;
        },
        mouseout: deshighlightFeature,
        mouseover: highlightFeature,
    });

    var popupContent = '<table id="TabelaPopUp">\ <caption> Compra de projeto </caption>\
        <tr>\
            <th scope="row">Id Cabo</th>\
            <td>'+ (feature.properties['fid'] !== null ? autolinker.link(feature.properties['fid'].toLocaleString()) : '') + '</td>\
        </tr>\
        <tr id="LinhaCabo">\
            <th scope="row">Comprimento [m]</th>\
            <td>' + (feature.properties['Comprimento [m]'] !== null ? autolinker.link(feature.properties['Comprimento [m]'].toLocaleString()) : '') + '</td>\
        </tr>\
        <tr>\
            <th scope="row">Postes</th>\
            <td>' + (feature.properties['Postes'] !== null ? autolinker.link(feature.properties['Postes'].toLocaleString()) : '') + '</td>\
        </tr>\
    </table>  <button class="BotaoAdicionar" role="button" onclick="AdicionarAoCarrinho(\'' + feature.properties['fid'] + '\', \'' + feature.properties['Comprimento [m]'] + '\', \'' + feature.properties['Postes'] + '\')">Adicionar</button>';

    layer.bindPopup(popupContent, {maxHeight: 400});
}
// Função que define o estilo dos cabos
function style_Cabos_2_0() {
    return {
        pane: 'pane_Cabos_2',
        opacity: 1,
        color: 'rgba(0,0,255,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 4.0,
        fillOpacity: 0,
        interactive: true,
    }
}
// Função que carrega os dados para o pop up do postes
function pop_Postes_3(feature, layer) {
    layer.on({
        mouseout: function(e) {
            for (i in e.target._eventParents) {
                e.target._eventParents[i].resetStyle(e.target);
            }
        },
        mouseover: highlightFeature,
    });
    var popupContent = '<table>\
            <tr>\
                <th scope="row">fid</th>\
                <td>' + (feature.properties['fid'] !== null ? autolinker.link(feature.properties['fid'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">OBJECTID</th>\
                <td>' + (feature.properties['OBJECTID'] !== null ? autolinker.link(feature.properties['OBJECTID'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">COD_ID</th>\
                <td>' + (feature.properties['COD_ID'] !== null ? autolinker.link(feature.properties['COD_ID'].toLocaleString()) : '') + '</td>\
            </tr>\
        </table>';
    layer.bindPopup(popupContent, {maxHeight: 400});
}
// Função que define o estilo dos postes
function style_Postes_3_0() {
    return {
        pane: 'pane_Postes_3',
        radius: 4.0,
        opacity: 1,
        color: 'rgba(35,35,35,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(0,175,255,1.0)',
        interactive: false,
    }
}
//realiza a busca
function RealizarBusca() {
    // Obtém os elementos de seleção
    var selecao = document.getElementById("SeletorCidade");
    // Obtém os valores selecionados
    var CidadeSelecionada = selecao.value;
    var textoExibido = document.getElementById("CidadeExibida");
    textoExibido.textContent = "Selecionados: " + CidadeSelecionada;
}
//Remove os itens do carrinho
function RemoverLinhaETotais(linha, comprimento, postes) {
    // Remover ID do registro de IDs selecionados
    var idRemover = linha.cells[0].innerHTML;
    delete idsSelecionados[idRemover];
    // Remover linha da tabela de destino
    linha.parentNode.removeChild(linha);
    // Subtrair valores da tabela de totais
    totalComprimento -= comprimento;
    totalPostes -= postes;
    totalIds--;
    // Atualizar totais na tabela de totais
    document.getElementById('totalIds').innerHTML = totalIds;
    document.getElementById('totalComprimento').innerHTML = totalComprimento.toFixed(2);
    document.getElementById('totalPostes').innerHTML = totalPostes;

    var features = map._layers;
    for (var key in features) {
        if (features[key].feature && features[key].feature.properties['fid'] === idRemover) {
            featureSelecionada = features[key];
            featureSelecionada.setStyle({ color: 'rgba(0,0,255,1.0)' }); // Volta à cor verde original
            featureSelecionada = null; // Limpa a featureSelecionada
            break; // Sai do loop após encontrar a primeira correspondência
        }
    }
}
//Adiciona os itens ao carrinho
function AdicionarAoCarrinho(idCabo, comprimento, postes) {
    // Verificar se o ID já foi selecionado
    if (idsSelecionados[idCabo]) {
        alert("Este objeto já foi selecionado!");
        return;
    }
    var tabelaDestino = document.getElementById('tabelaDestino');
    // Criar uma nova linha na tabela de destino
    var novaLinha = tabelaDestino.insertRow();
    // Adicionar células com as informações do popup
    var cell1 = novaLinha.insertCell(0);
    var cell2 = novaLinha.insertCell(1);
    var cell3 = novaLinha.insertCell(2);
    var cell4 = novaLinha.insertCell(3);
    cell1.innerHTML = idCabo;
    cell2.innerHTML = comprimento;
    cell3.innerHTML = postes;
    // Adicionar botão de exclusão
    var botaoExcluir = document.createElement("button");
    botaoExcluir.innerHTML = "X";
    botaoExcluir.className = "BotaoExcluir"; // Adicione esta linha
    botaoExcluir.onclick = function() {
        // Chamar função para remover linha e atualizar totais
        RemoverLinhaETotais(novaLinha, comprimento, postes);
    };
    cell4.appendChild(botaoExcluir);
    // Atualizar totais
    totalComprimento += parseFloat(comprimento);
    totalPostes += parseFloat(postes);
    totalIds++;
    // Adicionar ID ao registro de IDs selecionados
    idsSelecionados[idCabo] = true;
    // Atualizar totais na tabela de totais
    document.getElementById('totalIds').innerHTML = totalIds;
    document.getElementById('totalComprimento').innerHTML = totalComprimento.toFixed(2);
    document.getElementById('totalPostes').innerHTML = totalPostes;
    if (featureSelecionada) {
        featureSelecionada.setStyle({ color: 'red' });
    }
}
//Adiciona os itens ao carrinho do comparilhamento
function AdicionarAoCarrinhoComp(Id, Local, Tipo) {
    // Verificar se o ID já foi selecionado
    if (idsSelecionadosComp[Id]) {
        alert("Este objeto já foi selecionado!");
        return;
    }
    var tabelaDestino = document.getElementById('tabelaDestinoComp');

// Exibir a tabela
tabelaDestino.style.display = 'table';


    // Criar uma nova linha na tabela de destino
    var novaLinha = tabelaDestino.insertRow();
    // Adicionar células com as informações do popup
    var cell1 = novaLinha.insertCell(0);
    var cell2 = novaLinha.insertCell(1);
    var cell3 = novaLinha.insertCell(2);
    var cell4 = novaLinha.insertCell(3);
    cell1.innerHTML = Id;
    cell2.innerHTML = Local;
    cell3.innerHTML = Tipo;
    // Adicionar botão de exclusão
    var botaoExcluir = document.createElement("button");
    botaoExcluir.innerHTML = "X";
    botaoExcluir.className = "BotaoExcluir"; // Adicione esta linha
    botaoExcluir.onclick = function() {
        // Remover ID do registro de IDs selecionados
        var idRemover = novaLinha.cells[0].innerHTML;
        delete idsSelecionadosComp[idRemover];
        // Remover linha da tabela de destino
        novaLinha.parentNode.removeChild(novaLinha);

        var features = map._layers;
        for (var key in features) {
            if (features[key].feature && features[key].feature.properties['Id'] === idRemover) {
                featureSelecionada = features[key];
                featureSelecionada.setStyle({ color: 'rgba(255,127,0,1.0)' }); // Volta à cor verde original
                featureSelecionada = null; // Limpa a featureSelecionada
                break; // Sai do loop após encontrar a primeira correspondência
            }
        }





    };
    cell4.appendChild(botaoExcluir);
    // Adicionar ID ao registro de IDs selecionados
    idsSelecionadosComp[Id] = true;
    
    if (featureSelecionada) {
        featureSelecionada.setStyle({ color: 'red' });
    }







}
function RemoverLinhaPontos(linha) {
    var idRemover = linha.cells[0].innerHTML;
    console.log(linha);
    // Excluir marcador associado ao ID da linha
    excluirMarcador(idRemover);
    // Remover a linha da tabela
    linha.parentNode.removeChild(linha);
}
function excluirMarcador(id) {
    if (marcadores[id]) {
        map.removeLayer(marcadores[id]);
        delete marcadores[id];
    }
    // Também remova a linha da tabela se desejar
    var linha = document.getElementById('linha' + id);
    if (linha) {
        linha.parentNode.removeChild(linha);
    }
}
function atualizarpontos(){
    // Seleciona a tabela pelo ID
    var tabela = document.getElementById('TabelaPontos');
    if (tabela.rows.length > 1){
        console.log(tabela.rows.length)
        // Inicializa a string vazia
        var listaString = '<p>O cliente Mostrou interesse em cabos localizados nas seguintes coordenadas: </p><table style="background-color: WhiteSmoke; border: 1px solid;" ><thead style="background-color: LightGray; border: 1px solid;"><tr><th>Ponto</th><th>Latidude</th><th>Longitude</th></tr></thead><tbody style="border:1px solid black">';
        // Percorre cada linha da tabela, exceto a primeira (cabeçalho)
        for (var i = 1; i < tabela.rows.length; i++) {
            var linha = tabela.rows[i];
            // Inicializa a string para a linha atual
            var linhaString = '<tr><td>';
            // Percorre cada célula da linha
            for (var j = 0; j < (linha.cells.length-1); j++) {
                linhaString += linha.cells[j].innerHTML;
                // Adiciona vírgula se não for a última célula
                if (j < linha.cells.length - 2) {
                    linhaString += '</td><td>';
                }
            }
            linhaString += ' </td></tr> ';
            // Adiciona a linha à string principal
            listaString += linhaString;
            // Adiciona vírgula se não for a última linha
        }
        // Agora, 'listaString' contém os dados da tabela em formato de string
        listaString += '</tbody></table>'
        console.log(listaString);
    }else{
        listaString = '<p> O cliente não demonstrou interresem em outras áreas.</p>';
    }
    return listaString;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeEmptyRowsFromPopupContent(content, feature) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    var rows = tempDiv.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
        var td = rows[i].querySelector('td.visible-with-data');
        var key = td ? td.id : '';
        if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
            rows[i].parentNode.removeChild(rows[i]);
        }
    }
    return tempDiv.innerHTML;
}
function pop_ProjetosparaCompartilhar_1(feature, layer) {
    layer.on({
        click: function(e) {
            featureSelecionada = e.target;
        },
        mouseout: deshighlightFeature,
        mouseover: highlightFeature,
    });
    var popupContent = '<table id="TabelaPopUp">\ <caption> Compartilhamento</caption>\
            <tr>\
                <th scope="row">Id do projeto</th>\
                <td colspan="2">' + (feature.properties['Id'] !== null ? autolinker.link(feature.properties['Id'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
            <th scope="row">Locais do projeto</th>\
                <td colspan="2">' + (feature.properties['Local'] !== null ? autolinker.link(feature.properties['Local'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
            <th scope="row">Município</th>\
                <td colspan="2">' + (feature.properties['Município'] !== null ? autolinker.link(feature.properties['Município'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
            <th scope="row">Tipo de projeto</th>\
                <td colspan="2">' + (feature.properties['Tipo'] !== null ? autolinker.link(feature.properties['Tipo'].toLocaleString()) : '') + '</td>\
            </tr>\
        </table> <button class="BotaoAdicionar" role="button" onclick="AdicionarAoCarrinhoComp(\'' + feature.properties['Id'] + '\', \'' + feature.properties['Local'] + '\', \'' + feature.properties['Tipo'] + '\')">Adicionar</button>';
    layer.bindPopup(popupContent, {maxHeight: 400});
    var popup = layer.getPopup();
    var content = popup.getContent();
    var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
    popup.setContent(updatedContent);
}
function style_ProjetosparaCompartilhar_1_0() {
    return {
        pane: 'pane_ProjetosparaCompartilhar_1',
        opacity: 1,
        color: 'rgba(255,127,0,1.0)',
        dashArray: '16.0,8.0',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 4.0,
        fillOpacity: 0,
        interactive: true,
    }
}
map.createPane('pane_ProjetosparaCompartilhar_1');
map.getPane('pane_ProjetosparaCompartilhar_1').style.zIndex = 405;
map.getPane('pane_ProjetosparaCompartilhar_1').style['mix-blend-mode'] = 'normal';
var layer_ProjetosparaCompartilhar_1 = new L.geoJson(json_ProjetosparaCompartilhar_1, {
    attribution: '',
    interactive: true,
    dataVar: 'json_ProjetosparaCompartilhar_1',
    layerName: 'layer_ProjetosparaCompartilhar_1',
    pane: 'pane_ProjetosparaCompartilhar_1',
    onEachFeature: pop_ProjetosparaCompartilhar_1,
    style: style_ProjetosparaCompartilhar_1_0,
});
bounds_group.addLayer(layer_ProjetosparaCompartilhar_1);
map.addLayer(layer_ProjetosparaCompartilhar_1);
var baseMaps = {};
