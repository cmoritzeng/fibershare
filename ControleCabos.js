// Variáveis Globais
var map;
var baseMaps = {};
var bounds_group = new L.featureGroup();
var highlightLayer;
var idsSelecionados = {}, idsSelecionadosComp = {};
var totalComprimento = 0, totalPostes = 0, totalIds = 0;

var layer_Cabos_2, layer_Postes_3, layer_ProjetosparaCompartilhar_1;

// Instância global de Autolinker
var autolinker = new Autolinker({
    truncate: { length: 30, location: 'smart' },
    newWindow: true,
    className: "my-autolinker"
});

// Função principal para inicializar o mapa e suas camadas
function inicializarMapa() {
    // Inicializa o mapa
    map = L.map('map', {
        zoomControl: true,
        maxZoom: 28,
        minZoom: 6
    }).fitBounds([[-29.95, -56.00], [-25.55, -47.70]]);

    map.attributionControl.setPrefix('Informações de atribuição...'); // Exemplo de atribuição

    // Criação e adição das camadas base
    baseMaps["Sat"] = criarLayerSatelite();
    baseMaps["Osm"] = criarLayerOSM();
    map.addLayer(baseMaps["Osm"]); // Adiciona inicialmente a camada OSM

    // Criação e adição das camadas específicas
    criarECarregarCamadasEspecificas();

    // Configura eventos para checkboxes após a criação das camadas
    // configurarCheckboxEventos();

    // Configurações adicionais como Geocoder, etc.
    configurarGeocoder();
}

function criarECarregarCamadasEspecificas() {
    if (!map || !bounds_group) {
        console.error("Mapa ou Grupo de Limites não inicializado.");
        return;
    }

    // Inicializa o grupo de clustering para cabos
    var camadaCabosCluster = L.markerClusterGroup();
    // Chama adicionarCamadaCluster para cabos com isCabo=true
    layer_Cabos_2 = adicionarCamadaCluster('Cabos', 'pane_Cabos_2', 402, 'normal', json_Cabos_2, pop_Cabos_2, style_Cabos_2_0, camadaCabosCluster, true);

    // Inicializa e adiciona outras camadas com seus respectivos grupos de clustering
    var camadaPostesCluster = L.markerClusterGroup(); // Cria um grupo de clustering para postes
    layer_Postes_3 = adicionarCamadaCluster('Postes', 'pane_Postes_3', 403, 'normal', json_Postes_3, pop_Postes_3, style_Postes_3_0, camadaPostesCluster);

    var camadaPComxpCluster = L.markerClusterGroup(); // Cria um grupo de clustering para projetos para compartilhar
    layer_ProjetosparaCompartilhar_1 = adicionarCamadaCluster('Projetos para Compartilhar', 'pane_ProjetosparaCompartilhar_1', 405, 'normal', json_ProjetosparaCompartilhar_1, pop_ProjetosparaCompartilhar_1, style_ProjetosparaCompartilhar_1_0, camadaPComxpCluster);
}

function adicionarCamadaCluster(nome, paneNome, zIndex, mixBlendMode, dadosJson, popupFunc, estiloFunc, clusterGroup, isCabo = false) {
    var layerIndividual;

    if (isCabo) {
        // Conversão de LineString para Point especificamente para a camada de cabos
        var pontosConvertidos = {
            type: 'FeatureCollection',
            features: dadosJson.features.map(function(feature) {
                var centroid = feature.geometry.coordinates.reduce(function(prev, cur, index, arr) {
                    return [prev[0] + cur[0] / arr.length, prev[1] + cur[1] / arr.length];
                }, [0, 0]);
                return {
                    type: 'Feature',
                    properties: feature.properties,
                    geometry: {
                        type: 'Point',
                        coordinates: centroid
                    }
                };
            })
        };
        layerIndividual = L.geoJson(pontosConvertidos, {
            pane: criarPainel(paneNome, zIndex, mixBlendMode),
            onEachFeature: popupFunc,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, estiloFunc(feature));
            }
        });
    } else {
        // Para as demais camadas, usa a lógica padrão
        layerIndividual = L.geoJson(dadosJson, {
            pane: criarPainel(paneNome, zIndex, mixBlendMode),
            onEachFeature: popupFunc,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, estiloFunc(feature));
            }
        });
    }

    layerIndividual.eachLayer(function(layer) {
        clusterGroup.addLayer(layer);
    });

    verificarZoomEAtualizarCamada(map.getZoom(), clusterGroup, layerIndividual, dadosJson, isCabo);
    map.on('zoomend', function() {
        verificarZoomEAtualizarCamada(map.getZoom(), clusterGroup, layerIndividual, dadosJson, isCabo);
    });

    return clusterGroup;
}

var zoomParaDetalhamento = 12;

function verificarZoomEAtualizarCamada(zoomAtual, clusterGroup, layerIndividual, dadosJsonOriginal, isCabo) {
    if (zoomAtual >= zoomParaDetalhamento) {
        if (map.hasLayer(clusterGroup)) {
            map.removeLayer(clusterGroup);
        }
        if (isCabo && !map.hasLayer(layerIndividual)) {
            // Reverte para LineString para a camada de cabos
            map.removeLayer(layerIndividual);
            layerIndividual = L.geoJson(dadosJsonOriginal, {
                // Configurações para LineString
                pane: criarPainel(paneNome, zIndex, mixBlendMode),
                onEachFeature: popupFunc,
                style: estiloFunc
            });
            map.addLayer(layerIndividual);
        }
    } else {
        if (map.hasLayer(layerIndividual)) {
            map.removeLayer(layerIndividual);
        }
        if (!map.hasLayer(clusterGroup)) {
            map.addLayer(clusterGroup);
        }
    }
}

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


function adicionarCamada(nome, paneNome, zIndex, mixBlendMode, dadosJson, popupFunc, estiloFunc, isCircleMarker = false) {
    var layer = new L.geoJson(dadosJson, {
        attribution: '',
        interactive: true,
        dataVar: dadosJson,
        layerName: nome,
        pane: criarPainel(paneNome, zIndex, mixBlendMode),
        onEachFeature: popupFunc,
        style: estiloFunc,
        ...(isCircleMarker && { pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, estiloFunc(feature)); } })
    });

    bounds_group.addLayer(layer);
    map.addLayer(layer);
}

// Função para verificar o nível de zoom e atualizar a camada visível
function verificarZoomEAtualizarCamada(zoomAtual, clusterGroup, layerIndividual) {
    if (zoomAtual >= zoomParaDetalhamento) {
        if (map.hasLayer(clusterGroup)) {
            map.removeLayer(clusterGroup);
        }
        if (!map.hasLayer(layerIndividual)) {
            map.addLayer(layerIndividual);
        }
    } else {
        if (map.hasLayer(layerIndividual)) {
            map.removeLayer(layerIndividual);
        }
        if (!map.hasLayer(clusterGroup)) {
            map.addLayer(clusterGroup);
        }
    }
}

// Função para criar e retornar a camada de satélite
function criarLayerSatelite() {
    return L.tileLayer('https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        pane: criarPainel('pane_GoogleSatellite_0', 400, 'normal'),
        opacity: 1.0,
        attribution: 'Satélite',
        minZoom: 6, maxZoom: 28,
        minNativeZoom: 0, maxNativeZoom: 18
    });
}

// Função para criar e retornar a camada OSM
function criarLayerOSM() {
    return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        pane: criarPainel('pane_OpenStreetMap_1', 401, 'normal'),
        opacity: 1.0,
        attribution: 'Mapa',
        minZoom: 6, maxZoom: 28,
        minNativeZoom: 0, maxNativeZoom: 19
    });
}

// Função para configurar o Geocoder
function configurarGeocoder() {
    var osmGeocoder = new L.Control.Geocoder({
        collapsed: false,
        position: 'topright',
        text: 'Procure',
        title: 'Buscar localização'
    }).addTo(map);

    // Personalização adicional do ícone do geocoder, se necessário
}

// Função para criar painéis no mapa, usada para estilizar e organizar as camadas
function criarPainel(nome, zIndex, mixBlendMode) {
    var pane = map.createPane(nome);
    pane.style.zIndex = zIndex;
    pane.style['mix-blend-mode'] = mixBlendMode;
    return nome; // Retorna o nome do painel para referência
}

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

// Função para configurar eventos para checkboxes
function configurarCheckboxEventos() {
    var checkboxCabos = document.getElementById("caixaCabos");
    checkboxCabos.addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(camada);
        } else {
            map.removeLayer(camada);
        }
    });
    var checkboxCabos = document.getElementById("caixaPostes");
    checkboxCabos.addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(camada);
        } else {
            map.removeLayer(camada);
        }
    });
    var checkboxCabos = document.getElementById("caixaCabosCompart");
    checkboxCabos.addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(camada);
        } else {
            map.removeLayer(camada);
        }
    });

}


// Assegura que o mapa e as camadas são inicializados depois que o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarMapa();
});

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
    debugger
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