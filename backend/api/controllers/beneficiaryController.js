const multer = require('multer');
const nodemailer = require('nodemailer');
const Beneficiary = require('../models/Beneficiary');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads'); // Destination des fichiers téléchargés
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); // Nom du fichier téléchargé
    },
});

const upload = multer({ storage: storage }).fields([
    { name: 'avis_impot', maxCount: 1 }, // Un seul fichier pour le casier judiciaire
]);

// Fonction pour envoyer un e-mail de bienvenue
const sendWelcomeEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,

        subject: 'Bienvenue dans notre communauté de bénéficiaires !',
        text: `Bonjour ${name},\n\nNous sommes heureux de vous accueillir comme bénéficiaire. Votre engagement est précieux pour nous et nous avons hâte de collaborer ensemble pour faire une différence. Bienvenue dans la communauté !`,
        html: `<p>Bonjour <strong>${name}</strong>,</p><p>Nous sommes heureux de vous accueillir comme bénéficiaire. Votre engagement est précieux pour nous et nous avons hâte de collaborer ensemble pour faire une différence. Bienvenue dans la communauté !</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de bienvenue envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue', error);
    }
};

const registerBeneficiary = async (req, res, next) => {
    try {
        const { nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, genre,besoin } = req.body;
        
        let avis_impotURL = null;

        if (req.files && req.files['avis_impot'] && req.files['avis_impot'][0]) {
            const avis_impotFile = req.files['avis_impot'][0];
            avis_impotURL = avis_impotFile.path; 
        }

      
        const date_inscription = new Date();

        const newBeneficiary = await Beneficiary.create({
            nom,
            prenom,
            date_de_naissance,
            email,
            mot_de_passe,
            telephone,
            adresse,
            ville,
            code_postal,
            date_adhesion,
            statut_validation: "en attente",
            genre,
            avis_impot: avis_impotURL,
            besoin,
            date_inscription

        });

        // Envoyer un email de bienvenue
        await sendWelcomeEmail(email, `${prenom} ${nom}`);

        res.status(201).json({ message: 'Inscription réussie', volunteer: newBeneficiary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getBeneficiaireInfo = async (req, res) => {
  try {
    const email = req.params.email; // Assurez-vous que le `email` est passé comme paramètre dans l'URL
    const beneficiaire = await Beneficiary.findOne({ where: { email } });

    if (!beneficiaire) {
      return res.status(404).send('Bénévole non trouvé');
    }

    res.json({
      nom: beneficiaire.nom,
      prenom: beneficiaire.prenom,
      email: beneficiaire.email,
      avis_impot: beneficiaire.avis_impot, // Renvoie l'URL du dossier
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du bénévole:', error);
    res.status(500).send('Erreur serveur');
  }
};
module.exports = { upload, registerBeneficiary, getBeneficiaireInfo };
