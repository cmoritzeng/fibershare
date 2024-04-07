		function envioDeEmail() {


			//esses sao os elementos que eu gostaria que fizessem parte do email
			nome = document.getElementById('nome').value;
    		email = document.getElementById('email').value;
    		phone = document.getElementById('telefone').value;
			list = atualizarpontos();

			// idsSelecionados também fará parte, essa parte separará os ID selecionados
			const idsArray = Object.keys(idsSelecionados);
			const idsString = idsArray.join(', ');
			console.log(idsSelecionados)


			const idsComp = Object.keys(idsSelecionadosComp);
			const idsCompString = idsComp.join(', ')


			conteudoemail = `<p>Nome: ${nome}</p><p>Email: ${email}</p><p>Telefone: ${phone}</p><p>Ids Selecionados: ${idsString}</p><p>Ids de compartilhamento Selecionados: ${idsCompString}</p><p>${list}</p>`;
			var font_familySet = "font-family: Montserrat,Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif;";
			
			// Montar o conteúdo HTML no formato abaixo ou apenas colocar o conteúdo dentro da variável htmlEmailSet
			var htmlEmailSet = "";
				htmlEmailSet += "<table width=\"100%\">";
			
				htmlEmailSet += "<tr>";
				htmlEmailSet += "    <td colspan=\"2\" style=\""+font_familySet+"\"></td>";
				htmlEmailSet += "</tr>";
			
				htmlEmailSet += "</table>";

			var rotaSet = "send-email";

			var corpo = {
				"Rota": ""+rotaSet+"",
				"Empresa": "NRPTBCJAWS",
				"Objeto": {
					"from_nome": "CMoritz Assessoria, Consultoria e Engenharia",
					"from_email": "contato@cmoritz.com.br",
					"to_nome": nome,
					"to_email": "joao.monego@cmoritz.com.br",
					"subject_email": `Solicitação de ${nome}`,
					"body_title_email": `Novas solicitação de ${nome}`,
					"body_email": conteudoemail, // Substitua html EmailSet pela variável ou valor correspondente em JavaScript
					//O antigo HTML era esse: `<p>Nome: ${nome}</p><p>Email: ${email}</p><p>Telefone: ${phone}</p><p>Ids Selecionados: ${idsString}</p><p>${list}</p>`,
				}
			};
			
			fetch("https://api.saguarocomunicacao.com/", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(corpo)
			})
			.then(response => response.json())
			.then(data => console.log(data))
			.catch(error => console.error('Erro ao fazer a requisição:', error));


			fecharFormulario()
			alert("Solicitação enviada! Entraremos em contato assim que possível.");
		}
		function envioDeContato() {
			// Extrair dados do formulário
			var nome = document.getElementById('NomeDoContato').value;
			var email = document.getElementById('EmailDoContato').value;
			var phone = document.getElementById('TelefoneDoContato').value;
			var mensagem = document.getElementById('MensagemDoContato').value;		
			// Construir conteúdo do email
			var conteudoemail = "<p>Nome: " + nome + "</p>";
			conteudoemail += "<p>Email: " + email + "</p>";
			conteudoemail += "<p>Telefone: " + phone + "</p>";
			conteudoemail += "<p>Mensagem: " + mensagem + "</p>";
		
			// Configurações do email
			var font_familySet = "font-family: Montserrat,Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif;";
			var htmlEmailSet = "<table width=\"100%\"><tr><td colspan=\"2\" style=\"" + font_familySet + "\"></td></tr></table>";
		
			var rotaSet = "send-email";
		
			var corpo = {
				"Rota": "" + rotaSet + "",
				"Empresa": "NRPTBCJAWS",
				"Objeto": {
					"from_nome": "CMoritz Assessoria, Consultoria e Engenharia",
					"from_email": "contato@cmoritz.com.br",
					"to_nome": nome,
					"to_email": "marcus.malavazi@cmoritz.com.br",
					"subject_email": "Contato de cliente querendo vender - " + nome,
					"body_title_email": "Cliente querendo vender cabos - " + nome,
					"body_email": conteudoemail,
				}
			};
		
			// Enviar requisição POST
			fetch("https://api.saguarocomunicacao.com/", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(corpo)
			})
			.then(response => response.json())
			.then(data => console.log(data))
			.catch(error => console.error('Erro ao fazer a requisição:', error));
		
			// Fechar o formulário após o envio
			fecharFormulario();
			alert("O seu contato foi enviado, entraremos em contato assim que possível.");
		}
