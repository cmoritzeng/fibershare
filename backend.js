const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Adicionado para enviar e-mails

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// Configurar o transporte do Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
	port: 587,
	secure: false,
    auth: {
        user: "envioemailcmoritz@gmail.com",
        pass: "orfs onkm uwnx cnwe",
    },
});

app.post('/backend-url', (req, res) => {
    const { name, email, phone, idsSelecionados, list} = req.body;
	
	
	const idsArray = Object.keys(idsSelecionados);
	const idsString = idsArray.join(', ');

    console.log(`Recebido: Nome - ${name}, Email - ${email}, Telefone - ${phone}`);
    console.log('Ids Selecionados:', idsSelecionados);

    console.log('Tabela:', list);
    // Configurar o e-mail a ser enviado
    const mailOptions = {
        from: "envioemailcmoritz@gmail.com",
        to: "joao.monego@cmoritz.com.br",
        subject: `Novo Formulário de ${name}`,
        html: `<p>Nome: ${name}</p><p>Email: ${email}</p><p>Telefone: ${phone}</p><p>Ids Selecionados: ${idsString}</p><p>${list}</p>`,
    };

    // Enviar o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            res.status(500).send('Erro ao enviar e-mail');
        } else {
            console.log('E-mail enviado:', info.response);
            res.sendStatus(200);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});