const Newsletter = require('../models/Newsletter');

exports.getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.findAll();
    res.status(200).json(newsletters);
  } catch (error) {
    console.error('Erreur lors de la récupération des newsletters :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des newsletters.' });
  }
};

exports.createNewsletter = async (req, res) => {
  const { date_inscription, email } = req.body;
  try {
    const newsletter = await Newsletter.create({ date_inscription, email });
    res.status(201).json(newsletter);
  } catch (error) {
    console.error('Erreur lors de la création de la newsletter :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la newsletter.' });
  }
};
