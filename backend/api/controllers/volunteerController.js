const multer = require('multer');
const Volunteer = require('../models/Volunteer');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads'); // Destination des fichiers téléchargés
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); // Nom du fichier téléchargé
    },
});

const upload = multer({ storage: storage }).fields([
    { name: 'casier_judiciaire', maxCount: 1 }, // Un seul fichier pour le casier judiciaire
    { name: 'justificatif_permis', maxCount: 1 } // Un seul fichier pour le justificatif de permis
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
        subject: 'Bienvenue chez les bénévoles !',
        text: `Bonjour ${name},\n\nNous sommes ravis de vous compter parmi nos bénévoles. Bienvenue !`,
        html: `<p>Bonjour <strong>${name}</strong>,</p><p>Nous sommes ravis de vous compter parmi nos bénévoles. Bienvenue !</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de bienvenue envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue', error);
    }
};

const registerVolunteer = async (req, res, next) => {
    try {
        const { nom, prenom, date_de_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, genre, permis_conduire, langues,qualites, competences, message_candidature } = req.body;
        
        let casier_judiciaireURL = null;
        let justificatif_permisURL = null;

        if (req.files && req.files['casier_judiciaire'] && req.files['casier_judiciaire'][0]) {
            const casierFile = req.files['casier_judiciaire'][0];
            casier_judiciaireURL = casierFile.path; 
        }

        if (req.files && req.files['justificatif_permis'] && req.files['justificatif_permis'][0]) {
            const justificatifFile = req.files['justificatif_permis'][0];
            justificatif_permisURL = justificatifFile.path; // Chemin du fichier du justificatif de permis
        }
        const date_inscription = new Date();

        const newVolunteer = await Volunteer.create({
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
            permis_conduire,
            justificatif_permis: justificatif_permisURL,
            casier_judiciaire:  casier_judiciaireURL,
            langues,
            qualites,
            competences,
            message_candidature,
            date_inscription

        });

        // Envoyer un email de bienvenue
        await sendWelcomeEmail(email, `${prenom} ${nom}`);

        res.status(201).json({ message: 'Inscription réussie', volunteer: newVolunteer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { upload, registerVolunteer };



const loginVolunteer = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;
    const volunteer = await Volunteer.findOne({ where: { email, mot_de_passe } });
    
    if (volunteer) {
      res.status(200).json({message : ' Connexion reussie'});
    } else {
      res.status(401).json({ error: ' Identifiants invalides' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateVolunteerInfo = async (req, res, next) => {
  try {
    const volunteerId = req.user.id;
    const { nom, prenom, date_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, statut } = req.body;

    await Volunteer.update({ nom, prenom, date_naissance, email, mot_de_passe, telephone, adresse, ville, code_postal, date_adhesion, statut }, { where: { id: volunteerId } });

    res.status(200).json({ message: 'Volunteer information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateVolunteerPassword = async (req, res, next) => {
  try {
    const volunteerId = req.user.id;
    const { new_password } = req.body;
    await Volunteer.update({ mot_de_passe: new_password }, { where: { id: volunteerId } });
    res.status(200).json({ message: 'Volunteer password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerVolunteer,
  loginVolunteer,
  updateVolunteerInfo,
  updateVolunteerPassword,
};
