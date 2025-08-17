//Mask
$('#inputCep').mask('00000-000');

let clientes = [];

//Carregar clientes já cadastrados
carregarClientes(clientes);

function carregarClientes(){
    $.getJSON('http://localhost:8080/clientes', (response) => {
        let clientes = response;
        for(let cliente of clientes) {
        addNovaLinha(cliente);
        }
    });
}

//Pesqusar endereco com base no CEP
function pesquisarCEP() {
    let infosCep = pegarUrlCEP();
    let numeroCep = pegarNumeroCep();

    verificarValidadeCEP(numeroCep) ? '' : bloquearInputs();
    inserirDadosCep(infosCep);
}

function inserirDadosCep(url) {
    $.getJSON(url, (dados) => {
        if(verificarExistenciaCEP(dados)) {
            preencherEndereco(dados);
            liberarInputs();
        }
        else {
            bloquearInputs();
            return;
        }
    })  
}

function pegarUrlCEP() {
    numeroCep = pegarNumeroCep();
    let url = `https://viacep.com.br/ws/${numeroCep}/json`;
    return url;
}

function pegarNumeroCep() {
    let cepInput = $('#inputCep').val();
    let numCep = (textCep) => textCep.replace(/-/g, '');
    return numCep(cepInput);
}

function liberarInputs() {
    $("#inputNumero").prop("disabled", false);
}

function bloquearInputs() {
    $("#inputNumero").prop("disabled", true);
}

function preencherEndereco(dados) {
    document.getElementById('inputEndereco').value = dados.logradouro;
    document.getElementById('inputBairro').value = dados.bairro;
    document.getElementById('inputCidade').value = dados.localidade;
    document.getElementById('inputEstado').value = dados.estado;
    document.getElementById('erroCep').innerHTML = '';
}

function verificarValidadeCEP(cep) {
    if(cep && cep.length != 8){
        document.getElementById('erroCep').innerHTML = 'CEP inválido';
        $('#localizacao input').val('');
        return false;
    }
    else if(!cep){
        document.getElementById('erroCep').innerHTML = '';
        $('#localizacao input').val('');
        return false;
    }
    else
        return true;
}

function verificarExistenciaCEP(dadosCEP) {
    if(('erro' in dadosCEP)){
        document.getElementById('erroCep').innerHTML = 'CEP não encontrado';
        $('#localizacao input').val('');
        return false;
    }
    else
        return true;
}

//Salvar cliente
function salvar() {
    if
    (   document.getElementById('inputEndereco').value.trim() != '' &&
        document.getElementById('inputNumero').value.trim() != '' &&
        document.getElementById('inputBairro').value.trim() != '' &&
        document.getElementById('inputCidade').value.trim() != '' &&
        document.getElementById('inputEstado').value.trim() != ''
    )
    {
        novoCliente = pegarInfosCliente();
        
        $.ajax({
        url: 'http://localhost:8080/clientes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(novoCliente),
        success: (cliente) => {
            addNovaLinha(cliente);
            clientes.push(cliente);
            document.getElementById('formClientes').reset();
            }
        });
    } 
    bloquearInputs();
}

function pegarInfosCliente() {
    return {   
        nome: $('#inputNome').val(),
        sobrenome: $('#inputSobrenome').val(),
        endereco: {
            cep: $('#inputCep').val(),
            logradouro: $('#inputEndereco').val(),
            numero: $('#inputNumero').val(),
            bairro: $('#inputBairro').val(),
            cidade: $('#inputCidade').val(),
            estado: $('#inputEstado').val()
        }
    };
}

function addNovaLinha(cliente) {
    let table = document.getElementById('tabelaClientes');
    let newRow = table.insertRow();

    //inserir id
    idNode = document.createTextNode(cliente.id);
    newRow.insertCell().appendChild(idNode);

    //inserir nome
    nomeNode = document.createTextNode(cliente.nome + ' ' + cliente.sobrenome);
    newRow.insertCell().appendChild(nomeNode);

    //inserir endereco
    logradouro = cliente.endereco.logradouro;
    numero = cliente.endereco.numero;
    enderecoNode = document.createTextNode(logradouro + ', ' + numero);
    var cellEndereco = newRow.insertCell();
    cellEndereco.className = 'd-none d-sm-table-cell';
    cellEndereco.appendChild(enderecoNode);
    
    //inserir cep
    var cepNode = document.createTextNode(cliente.endereco.cep);
    var cellCep = newRow.insertCell();
    cellCep.className ='d-none d-sm-table-cell text-nowrap';
    cellCep.appendChild(cepNode);

    //inserir bairro
    var bairroNode = document.createTextNode(cliente.endereco.bairro);
    var cellBairro = newRow.insertCell();
    cellBairro.className ='d-none d-xl-table-cell';
    cellBairro.appendChild(bairroNode);

    //inserir cidade
    var cidadeNode = document.createTextNode(cliente.endereco.cidade);
    var cellCidade = newRow.insertCell();
    cellCidade.className ='d-none d-lg-table-cell';
    cellCidade.appendChild(cidadeNode);

    //inserir estado
    var estadoNode = document.createTextNode(cliente.endereco.estado);
    var cellEstado = newRow.insertCell();
    cellEstado.className ='d-none d-md-table-cell';
    cellEstado.appendChild(estadoNode);
}