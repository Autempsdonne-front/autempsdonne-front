const express = require('express');
const app = express();

app.use(express.json());
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');
const Formation = require('../models/Formation');
const Beneficiary = require('../models/Beneficiary');
const Partenaire = require('../models/Partenaire');

const Lieu= require('../models/Lieu');
const Activity = require('../models/Activity');
const ActivityPrive = require('../models/ActivityPrivate');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const EvenementBenevole = require('../models/EvenementBenevole');
const Notification = require( '../models/notifications' );

const sequelize = require('../config/db'); 
const { Op } = require('sequelize'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ message: "Admin créé avec succès", admin });
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de l'administrateur", error: error.message });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ where: { email: req.query.email } });
    if (existingAdmin) {
      res.json({ message: "Admin trouvé", admin: existingAdmin });
    } else {
      res.status(404).json({ message: "Aucun administrateur trouvé avec cet email" });
    }
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la recherche de l'administrateur", error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des administrateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable" });
    }
    await Admin.destroy({ where: { email } });
    res.status(200).json({ message: "Admin supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'admin :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'admin" });
  }
};


const SECRET_KEY = process.env.SECRET_KEY;

exports.loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await Admin.findOne({ where: { email, mot_de_passe } });
    if (admin) {
      const payload = { email: admin.email, id: admin.id };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

      res.json({ message: "Login réussi !", token });
    } else {
      res.status(401).json({ message: "Identifiant ou mot de passe incorrect." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

exports.deleteVolunteer = async (req, res) => {
  const { email } = req.body; 
  const t = await sequelize.transaction();

  try {
      const benevole = await Volunteer.findOne({
          where: { email },
          transaction: t
      });
      
      if (!benevole) {
          await t.rollback();
          return res.status(404).json({ message: 'Benevole non trouvé.' });
      }

      await ActivityPrive.destroy({
          where: { id_benevole: benevole.id },
          transaction: t
      });

      await Volunteer.destroy({
          where: { id: benevole.id },
          transaction: t
      });

      await t.commit();
      res.status(200).json({ message: 'Benevole et ses activités privées supprimés avec succès.' });
  } catch (error) {
      await t.rollback();
      console.error('Erreur lors de la suppression du benevole et de ses activités privées:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du benevole et de ses activités privées', error: error.message });
  }
};

exports.deleteBeneficiary = async (req, res) => {
  const { email } = req.body; 
  const t = await sequelize.transaction();

  try {
      const beneficiaire = await Beneficiary.findOne({
          where: { email },
          transaction: t
      });
      
      if (!beneficiaire) {
          await t.rollback();
          return res.status(404).json({ message: 'Bénéficiaire non trouvé.' });
      }

      await ActivityPrive.destroy({
          where: { id_beneficiaire: beneficiaire.id },
          transaction: t
      });

      await Beneficiary.destroy({
          where: { id: beneficiaire.id },
          transaction: t
      });

      await t.commit();
      res.status(200).json({ message: 'Bénéficiaire et ses activités privées supprimés avec succès.' });
  } catch (error) {
      await t.rollback();
      console.error('Erreur lors de la suppression du bénéficiaire et de ses activités privées:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du bénéficiaire et de ses activités privées', error: error.message });
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll();
    res.json(volunteers);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des bénévoles :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.getAllBeneficiaires = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findAll();
    res.json(beneficiary);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des beneficiaire :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.getVolunteer = async (req, res) => {
  try {
    const { email } = req.query;
    const volunteer = await Volunteer.findOne({ where: { email } });

    if (volunteer) {
      return res.json(volunteer);
    } else {
      return res.status(404).json({ message: "Aucun bénévole trouvé avec ce nom et ce prénom." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du bénévole :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.getLatestVolunteers = async (req, res) => {
  try {
    const latestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
      limit: 6
    });
    res.json(latestVolunteers);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.getAllLatestVolunteersAndBeneficiaries = async (req, res) => {
  try {
    const allLatestVolunteers = await Volunteer.findAll({
      order: [['date_adhesion', 'DESC']],
      limit: 6
    }).then(volunteers => volunteers.map(v => ({ ...v.toJSON(), type: 'Bénévole' }))); 

    const allLatestBeneficiaries = await Beneficiary.findAll({
      order: [['date_inscription', 'DESC']],
    }).then(beneficiaries => beneficiaries.map(b => ({ ...b.toJSON(), type: 'Bénéficiaire' }))); 

    const combinedList = [...allLatestVolunteers, ...allLatestBeneficiaries];

    combinedList.sort((a, b) => {
      let dateA = new Date(a.date_adhesion || a.date_inscription); 
      let dateB = new Date(b.date_adhesion || b.date_inscription);
      return dateB - dateA; 
    });

    res.json(combinedList);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles et bénéficiaires :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getAllVolunteersAndBeneficiaries = async (req, res) => {
  try {
    const allLatestVolunteers = await Volunteer.findAll({
      order: [['date_inscription', 'DESC']],
    }).then(volunteers => volunteers.map(v => ({ ...v.toJSON(), type: 'Bénévole' }))); // Convertir en JSON et ajouter le type

    const allLatestBeneficiaries = await Beneficiary.findAll({
      order: [['date_inscription', 'DESC']],
    }).then(beneficiaries => beneficiaries.map(b => ({ ...b.toJSON(), type: 'Bénéficiaire' }))); 

    const combinedList = [...allLatestVolunteers, ...allLatestBeneficiaries];

    combinedList.sort((a, b) => {
      let dateA = new Date(a.date_adhesion || a.date_inscription); 
      let dateB = new Date(b.date_adhesion || b.date_inscription);
      return dateB - dateA; 
    });

    res.json(combinedList);
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers bénévoles et bénéficiaires :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.addVolunteerToAdmins = async (req, res) => {
  try {
    const { email } = req.body; 
    
    const volunteer = await Volunteer.findOne({ where: { email } });
    if (!volunteer) {
      return res.status(404).json({ message: "Bénévole introuvable" });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Le bénévole est déjà un administrateur" });
    }
    const mot_de_passe = volunteer.mot_de_passe;

    await Admin.create({
      email: volunteer.email,
      nom: volunteer.nom,
      prenom: volunteer.prenom,
      mot_de_passe 
    });

    const removeFromVolunteers = req.body.removeFromVolunteers === true;

    if (removeFromVolunteers) {
      await Volunteer.destroy({ where: { email } });
    }

    res.status(200).json({ message: "Le bénévole a été ajouté à la liste des administrateurs avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du bénévole à la liste des administrateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { email, newStatus } = req.body; 
    const volunteer = await Volunteer.findOne({ where: { email } });

    if (!volunteer) {
      return res.status(404).json({ message: "Bénévole introuvable" });
    }

    volunteer.statut_validation = newStatus;
    volunteer.date_adhesion = new Date();

    await volunteer.save();

    res.status(200).json({ message: "Statut du bénévole mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du bénévole :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.updateBeneficiaryStatus = async (req, res) => {
  try {
    const { email, newStatus } = req.body; 
    const beneficiary = await Beneficiary.findOne({ where: { email } });

    if (!beneficiary) {
      return res.status(404).json({ message: "Bénéficiaire introuvable" });
    }

    beneficiary.statut_validation = newStatus;

    beneficiary.date_adhesion = new Date();

    await beneficiary.save();

    res.status(200).json({ message: "Statut du Bénéficiaire mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du Bénéficiaire :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erreur lors de la récupération des services :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
exports.createActivityPrive = async (req, res) => {

  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nomBeneficiaire, prenomBeneficiaire, nomBenevole, prenomBenevole, nom_service } = req.body;
  const t = await sequelize.transaction();

  try {
    const benevoleId = await getBenevoleId(nomBenevole, prenomBenevole);
    const beneficiaireId = await getBeneficiaireId(nomBeneficiaire, prenomBeneficiaire);

   
    const existingEvent = await ActivityPrive.findOne({
      attributes: ['id_benevole', 'id_beneficiaire', 'heure_debut', 'date_activite'],
      where: {
        date_activite,
        heure_debut,
        [Op.or]: [
          { id_benevole: benevoleId },
          { id_beneficiaire: beneficiaireId }
        ]
      },
      transaction: t
    });
  

    if (existingEvent) {
      throw new Error('Un événement avec le même nom et prénom de bénévole/bénéficiaire, la même date et heure existe déjà.');
    }
    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    const [benevole, benevoleCreated] = await Volunteer.findOrCreate({
      where: { nom: nomBenevole, prenom: prenomBenevole },
      defaults: { nom: nomBenevole, prenom: prenomBenevole },
      transaction: t
    });

    if (!benevoleCreated && !benevole) {
      throw new Error('Bénévole non trouvé et impossible à créer.');
    }

    const [beneficiaire, beneficiaireCreated] = await Beneficiary.findOrCreate({
      where: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
      defaults: { nom: nomBeneficiaire, prenom: prenomBeneficiaire },
      transaction: t
    });

    if (!beneficiaireCreated && !beneficiaire) {
      throw new Error('Bénéficiaire non trouvé et impossible à créer.');
    }

    await ActivityPrive.create({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      id_beneficiaire: beneficiaire.id,
      id_benevole: benevole.id,
      nom_service
    }, { transaction: t });

    await t.commit();

    res.status(201).send('Activité privée ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de l\'activité privée : ', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'activité privée : ' + error.message);
  }
};

async function getBenevoleId(nom, prenom) {
  const benevole = await Volunteer.findOne({ where: { nom, prenom } });
  if (!benevole) {
    throw new Error(`Bénévole non trouvé avec le nom ${nom} et le prénom ${prenom}`);
  }
  return benevole.id;
}

async function getBeneficiaireId(nom, prenom) {
  const beneficiaire = await Beneficiary.findOne({ where: { nom, prenom } });
  if (!beneficiaire) {
    throw new Error(`Bénéficiaire non trouvé avec le nom ${nom} et le prénom ${prenom}`);
  }
  return beneficiaire.id;
}

exports.getVolunteerById = async (req, res) => {
  try {
    const id = req.params.id;
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) {
      return res.status(404).send({ message: 'Bénévole non trouvé.' });
    }
    res.send({ nom: volunteer.nom, prenom: volunteer.prenom });
  } catch (error) {
    console.error('Erreur lors de la récupération du bénévole:', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations du bénévole.' });
  }
};
exports.getBeneficiaryById = async (req, res) => {
  try {
    const id = req.params.id;
    const beneficiary = await Beneficiary.findByPk(id);
    if (!beneficiary) {
      return res.status(404).send({ message: 'Bénéficiaire non trouvé.' });
    }
    res.send({ nom: beneficiary.nom, prenom: beneficiary.prenom });
  } catch (error) {
    console.error('Erreur lors de la récupération du bénéficiaire:', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations du bénéficiaire.' });
  }
};
exports.createActivity = async (req, res) => {
  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);
  
    if (startDate < currentDate) {
      return res.status(400).send('La date de début est déjà passée.');
    }

    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    const existingActivity = await Activity.findOne({
      where: {
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_debut } },
              { heure_fin: { [Op.gte]: heure_debut } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_fin } },
              { heure_fin: { [Op.gte]: heure_fin } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.gte]: heure_debut } },
              { heure_fin: { [Op.lte]: heure_fin } }
            ]
          }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).json({ error: 'Une Activite avec les mêmes dates de début et de fin existe déjà.' });
    }

    await Activity.create({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nom_service,
      nb_benevoles
    }, { transaction: t });

    await t.commit();

    res.status(201).send('Activité ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de l\'activité : ', error);
    res.status(500).send('Erreur lors de l\'ajout de l\'activité : ' + error.message);
  }
};
exports.updateActivity = async (req, res) => {
  const { id } = req.params;
  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);

    if (startDate < currentDate) {
      return res.status(400).send('La date de l\'activité ne peut pas être dans le passé.');
    }

    const lieu = await Lieu.findOne({
      where: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    if (!lieu) {
      await t.rollback();
      return res.status(404).send('Lieu introuvable.');
    }

    const existingActivity = await Activity.findOne({
      where: {
        id: {
          [Op.ne]: id // Exclude the current activity from the check
        },
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_debut } },
              { heure_fin: { [Op.gte]: heure_debut } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_fin } },
              { heure_fin: { [Op.gte]: heure_fin } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.gte]: heure_debut } },
              { heure_fin: { [Op.lte]: heure_fin } }
            ]
          }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).send('Conflit d\'horaire avec une autre activité.');
    }

    await Activity.update({
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nom_service,
      nb_benevoles
    }, {
      where: { id },
      transaction: t
    });

    await t.commit();
    res.status(200).send('Activité mise à jour avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la mise à jour de l\'activité : ', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'activité : ' + error.message);
  }
};
exports.updateActivity = async (req, res) => {
  const { ID_Activite } = req.params;
  const { description, date_activite, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal, nom_service, nb_benevoles } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_activite);

    if (startDate < currentDate) {
      await t.rollback();
      return res.status(400).send('La date de l\'activité ne peut pas être dans le passé.');
    }

    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    if (!lieu) {
      await t.rollback();
      return res.status(404).send('Lieu introuvable.');
    }

    const existingActivity = await Activity.findOne({
      where: {
        ID_Activite: {
          [Op.ne]: ID_Activite
        },
        date_activite: startDate,
        id_lieu: lieu.id_lieu,
        [Op.or]: [
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_debut } },
              { heure_fin: { [Op.gte]: heure_debut } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.lte]: heure_fin } },
              { heure_fin: { [Op.gte]: heure_fin } }
            ]
          },
          {
            [Op.and]: [
              { heure_debut: { [Op.gte]: heure_debut } },
              { heure_fin: { [Op.lte]: heure_fin } }
            ]
          }
        ]
      },
      transaction: t
    });

    if (existingActivity) {
      await t.rollback();
      return res.status(400).send('Conflit d\'horaire avec une autre activité.');
    }

    await Activity.update({
      titre,
      description,
      date_activite,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
      nom_service,
      nb_benevoles
    }, {
      where: { ID_Activite },
      transaction: t
    });

    await t.commit();
    res.status(200).send('Activité mise à jour avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la mise à jour de l\'activité : ', error);
    res.status(500).send('Erreur lors de la mise à jour de l\'activité : ' + error.message);
  }
};

exports.createBlog = async (req, res) => {
  const { titre, contenu, emailAdmin } = req.body;

  try {
      const admin = await Admin.findOne({ where: { email: emailAdmin } });
      if (!admin) {
          return res.status(404).json({ message: "Administrateur non trouvé." });
      }

      const newBlog = await Blog.create({
          titre,
          contenu,
          auteur: admin.id,
          date_creation: new Date()
      });

      res.status(201).json(newBlog);
  } catch (error) {
      console.error("Erreur lors de la création du blog :", error);
      res.status(500).json({ message: "Erreur serveur lors de la création du blog." });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
      const blogs = await Blog.findAll({
          attributes: ['id', 'titre', 'contenu', 'auteur', 'date_creation'],
          order: [
              ['date_creation', 'DESC'] 
          ]
      });

      if (blogs.length === 0) {
          return res.status(404).json({ message: "Aucun blog trouvé." });
      }

      res.status(200).json(blogs);
  } catch (error) {
      console.error("Erreur lors de la récupération des blogs :", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des blogs." });
  }
};

exports.createFormation = async (req, res) => {
  const { description, date_debut, date_fin, heure_debut, heure_fin, titre, adresseComplete, ville, code_postal } = req.body;
  const t = await sequelize.transaction();

  try {
    const currentDate = new Date();
    const startDate = new Date(date_debut);
    const EndDate = new Date(date_fin);
  
    if (startDate < currentDate) {
      return res.status(400).send('La date de début est déjà passée.');
    }
    if (EndDate < currentDate) {
      return res.status(400).send('La date de fin est déjà passée.');
    }

    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });

    const endDate = new Date(date_fin);

    const existingFormation = await Formation.findOne({
      where: {
        date_debut: startDate,
        date_fin: endDate,
        id_lieu: lieu.id_lieu
      },
      transaction: t
    });

    if (existingFormation) {
      await t.rollback();
      return res.status(400).send('Une formation avec les mêmes dates de début et de fin existe déjà.');
    }

    await Formation.create({
      description,
      date_debut: startDate,
      date_fin: endDate,
      heure_debut,
      heure_fin,
      titre,
      id_lieu: lieu.id_lieu,
    }, { transaction: t });

    await t.commit();

    res.status(201).send('Formation ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de formation : ', error);
    res.status(500).send('Erreur lors de l\'ajout de formation : ' + error.message);
  }
};
const models = require('../models');
models.Activity.belongsTo(models.Lieu, { foreignKey: 'id_lieu', as: 'activityLieu' });

exports.getLatestActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{
        model: Lieu, 
        as: 'lieu' 
      }],
      order: [['date_create', 'DESC']],
      limit: 4
    });
    
    res.status(200).json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières activités :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
  }
};
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{
        model: Lieu, 
        as: 'lieu' 
      }],
    });
    
    res.status(200).json(activities);
  } catch (error) {
    console.error("Erreur lors de la récupération des dernières activités :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des dernières activités." });
  }
};
exports.showEvent = async (req, res) => {
  try {
    const { ID_Activite } = req.params;
    const activity = await Activity.findByPk(ID_Activite, {
      include: [{
        model: Lieu, 
        as: 'lieu' 
      }],
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activité non trouvée.' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité :', error);
    res.status(500).send({ message: 'Erreur lors de la récupération des informations de l\'activité.' });
  }
};

exports.addPartenaire = async (req, res) => {
  const { nom,email, telephone, adresseComplete, ville, code_postal } = req.body;
  const t = await sequelize.transaction();

  try {
    let [lieu, created] = await Lieu.findOrCreate({
      where: { adresse: adresseComplete, ville, code_postal },
      defaults: { adresse: adresseComplete, ville, code_postal },
      transaction: t
    });
    await Partenaire.create({
      nom,
      email,
      telephone,
      id_Adresse: lieu.id_lieu,
    }, { transaction: t });

    await t.commit();

    res.status(201).send('Partenaire ajoutée avec succès.');
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout de Partenaire : ', error);
    res.status(500).send('Erreur lors de l\'ajout de Partenaire : ' + error.message);
  }
};

exports.deletePartenaire = async (req, res) => {
  const { email } = req.body; 
  const t = await sequelize.transaction();

  try {
    const partenaire = await Partenaire.findOne({ where: { email }, transaction: t });

    if (!partenaire) {
      await t.rollback();
      return res.status(404).json({ message: 'Partenaire non trouvé.' }); 
    }
    await Partenaire.destroy({ where: { email }, transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Partenaire supprimé avec succès.' }); 
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la suppression du partenaire:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du partenaire', error: error.message }); 
  }
};

exports.getAllPartenaires = async (req, res) => {
  try {
    const partenaires = await Partenaire.findAll();
    if (partenaires.length === 0) {
      return res.status(404).send('Aucun partenaire trouvé.');
    }
    res.status(200).json(partenaires);
  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires : ', error);
    res.status(500).send('Erreur lors de la récupération des partenaires : ' + error.message);
  }
};
exports.addRegistration = async (req, res) => {
  const { ID_event, ID_Benevole } = req.body;

  try {
      const existingRegistration = await EvenementBenevole.findOne({
          where: {
              ID_event: ID_event,
              ID_Benevole: ID_Benevole
          }
      });

      if (existingRegistration) {
          return res.status(409).send('The volunteer is already registered for this event.');
      }
      const registration = await EvenementBenevole.create({
          ID_event: ID_event,
          ID_Benevole: ID_Benevole,
          Date_Inscription: new Date()  
      });

      return res.status(201).json(registration);
  } catch (error) {
      console.error('Error adding registration:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.getRegistrations = async (req, res) => {
  const { ID_event } = req.params;

  try {
      const registrations = await EvenementBenevole.findAll({
          where: { ID_event: ID_event },
          include: [{
              model: Volunteer,
              as: 'volunteer'  
          }]
      });

      return res.status(200).json(registrations);
  } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).send('Internal Server Error');
  }
};
exports.removeVolunteerFromEvent = async (req, res) => {
  const { ID_event, ID_Benevole } = req.params;

  try {
      const result = await EvenementBenevole.destroy({
          where: {
            ID_event: ID_event,
            ID_Benevole: ID_Benevole
          }
      });

      if (result === 0) {
          return res.status(404).send('No registration found with the given IDs.');
      }

      res.send('Volunteer unregistered successfully.');
  } catch (error) {
      console.error('Failed to remove volunteer from event:', error);
      res.status(500).send('Internal Server Error');
  }
};
exports.sendNotification = async (req, res) => {
  try {
      const { id_benevole, id_beneficiaire, titre, message, date_envoi } = req.body;

      const newNotification = await Notification.create({
          id_benevole,
          id_beneficiaire,
          titre,
          message,
          date_envoi
      });

      res.status(201).json(newNotification);
  } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};