import React, { useEffect, useState } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';
import { Link, useLocation } from 'react-router-dom';
import add from '../assets/add.png';
import Modal from './Modal';

function MembreList() {
    const [admins, setAdmins] = useState([]); // Changed from [admin, setAdmins] to [admins, setAdmins] for clarity and correct usage
    const location = useLocation();
    const currentPath = location.pathname;
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(!showModal);

    useEffect(() => {
        fetch('https://au-temps-donne-api.onrender.com/api/admin/admins')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n’était pas correcte');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data for admin retrieved:', data);
                setAdmins(data); // Setting the fetched data into state
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des administrateurs:', error);
                alert('Échec de la récupération des administrateurs: ' + error.message);
            });
    }, []);

    const confirmDeletion = (email) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
            fetch(`https://au-temps-donne-api.onrender.com/api/admin/delete/${email}`, { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression de l’administrateur');
                }
                setAdmins(prev => prev.filter(a => a.email !== email));
                console.log('L’administrateur a été supprimé avec succès');
            })
            .catch(error => {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression de l’administrateur: ' + error.message);
            });
        }
    }
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        fetch('https://au-temps-donne-api.onrender.com/api/admin/volunteers')
            .then(response => response.json())
            .then(data => {
                setVolunteers(data.filter(v => v.statut_validation.toLowerCase() === 'accepté'));
            })
            .catch(error => {
                console.error('Failed to fetch volunteers:', error);
            });
    }, []);
    
function ajouterAdminOuSupprimer(email) {
    customConfirm(`Voulez-vous ajouter ${email} comme administrateur et le supprimer de la liste des bénévoles ?`, function(ajouterEtSupprimer) {
        ajouterAdmin(email, ajouterEtSupprimer);
    });
}
function customConfirm(message, callback) {
    document.getElementById("confirmMessage").innerText = message;
    document.getElementById("customConfirmBox").style.display = "block";

    window.reponseConfirm = function(reponse) {
        document.getElementById("customConfirmBox").style.display = "none";
        callback(reponse);
    };
}
function ajouterAdmin(email, supprimerApresAjout) {
    const requestBody = {
        email: email,
        removeFromVolunteers: supprimerApresAjout
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    const actionText = supprimerApresAjout ? "et supprimé de la liste des bénévoles" : "comme administrateur";
    alert(`Le bénévole ${email} sera ajouté ${actionText}.`);

    fetch('https://au-temps-donne-api.onrender.com/api/admin/addAdmin', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Le bénévole ${email} a été ajouté ${actionText} avec succès:`, data);
        })
        .catch(error => console.error(`Erreur lors de l'ajout du bénévole ${email} ${actionText}:`, error));
}


function supprimerBenevole(email) {
    console.log(`Suppression du bénévole avec l'email ${email} (implémentez votre logique de suppression ici).`);
}



    return (
        <>
            <NavMenu />
            <section className="content">
                <section className="lists">
                    <div className="table-header">
                        <h3>Liste des administrateurs</h3>
                        <button id="add_link" onClick={toggleModal} className="link-button">
                            Ajouter <img height="15px" width="17px" src={add} alt="Add"/>
                        </button>
                    <Modal show={showModal} onClose={toggleModal}>
                        <h2>Add a new administrator</h2>
                            <div className="table_bnv">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nom Complet</th>
                                            <th>Email</th>
                                            <th>Téléphone</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {volunteers.map(volunteer => (
                                            <tr key={volunteer.email}>
                                                <td>{volunteer.nom} {volunteer.prenom}</td>
                                                <td>{volunteer.email}</td>
                                                <td>{volunteer.telephone}</td>
                                                <td class="action">
                                                    <button onclick="ajouterAdminOuSupprimer('${volunteer.email}')" class="action-btn ajouter">Ajouter</button>

                                                    </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                    </Modal>
                    <div className="container_search">
                        <div className="filter">
                            <Link className="p_filter" to="#"><img style={{paddingTop: '30px'}} height="20" width="20" src="assets/filter_sort.png" alt="Filtrer et trier"/>Filtrer et trier</Link>
                        </div>
                        
                        <form className="search" onSubmit={e => e.preventDefault()}>
                            <input type="text" id="searchField" placeholder="Rechercher ..." />
                        </form>
                    </div>
                    <div className="table_bnv">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom Complet</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map(admin => (
                                    <tr key={admin.email}>
                                        <td>{admin.nom} {admin.prenom}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.telephone}</td>
                                        <td className="action">
                                            <Link to={`/consult/${admin.email}`} className="action-btn details">Consulter</Link>
                                            <button onClick={() => confirmDeletion(admin.email)} className="action-btn refuser">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default MembreList;
