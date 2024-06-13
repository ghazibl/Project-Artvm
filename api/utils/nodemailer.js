import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ghazibelhadj506@gmail.com",
        pass: "ceqygfkquvliievy", // Mot de passe d'application généré par Google
    }
});

export const sendConfirmEmail = (email, activationCode) => {
    const mailOptions = {
        from: "ghazibelhadj506@gmail.com",
        to: email,
        subject: "Activation de votre compte",
        html: `
            <h1>Bienvenue sur notre site</h1>
            <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous</p>
            <a href="http://localhost:5173/confirm/${activationCode}">cliquer ici</a>
        `
    };

    transporter.sendMail(mailOptions)
        .then(info => console.log(`Email envoyé : ${info.response}`))
        .catch(err => console.error(`Erreur lors de l'envoi de l'email : ${err}`));
};
