import React, { useEffect, useState } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';
import { Link, useLocation } from 'react-router-dom';

function List() {
    const [volunteers, setVolunteers] = useState([]);
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        fetch('https://au-temps-donne-api.onrender.com/api/admin/volunteers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Données des bénévoles récupérées:', data);
                setVolunteers(data.filter(v => v.statut_validation.toLowerCase() === 'accepté'));
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des bénévoles:', error);
                alert('Failed to fetch volunteers: ' + error.message);
            });
    }, []);

    const confirmerSuppression = (email) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bénévole ?')) {
            fetch(`https://au-temps-donne-api.onrender.com/api/admin/volunteers/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du bénévole');
                }
                setVolunteers(prev => prev.filter(v => v.email !== email));
                console.log('Bénévole supprimé avec succès');
            })
            .catch(error => {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression du bénévole: ' + error.message);
            });
        }
    }

    return (
        <>
            <NavMenu />
            <section className="content">
                <section className="lists">
                    <div className="list_type">
                        <Link to="/list" className={currentPath === '/list' ? 'active' : ''} style={currentPath === '/list' ? { color: '#D23939' } : {}}>Bénévoles</Link>
                        <Link to="/beneficiaires" className={currentPath === '/beneficiaires' ? 'active' : 'link_list'} style={currentPath === '/beneficiaires' ? { color: '#D23939' } : null}>Bénéficiaires</Link>
                        <Link to="/list_partenaires" className={`link_list ${currentPath === '/list_partenaires' ? 'active' : ''}`} style={currentPath === '/list_partenaires' ? { color: '#D23939' } : {}}>Partenaires</Link>
                        <Link to="/newsletter_list" className={currentPath === '/newsletter' ? 'active' : ''}>Newsletter</Link>
                    </div>
                    <div className="container_search">
                        <div className="filtrer">
                            <Link className="p_filtre" to="#"><img style={{paddingTop: '30px'}} height="20" width="20" src="assets/filtrer_trier.png" alt="Filtrer et trier"/>Filtrer et trier</Link>
                        </div>
                        <form className="search" onSubmit={e => e.preventDefault()}>
                            <input type="text" id="champRecherche" placeholder="   Rechercher ..." />
                        </form>
                    </div>
                    <div className="table-header">
                        <h3>Liste des Bénévoles</h3>
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
                                {volunteers.map(volunteer => (
                                    <tr key={volunteer.email}>
                                        <td>{volunteer.nom} {volunteer.prenom}</td>
                                        <td>{volunteer.email}</td>
                                        <td>{volunteer.telephone}</td>
                                        <td className="action">
                                            <a href={`consulter.php?nom=${encodeURIComponent(volunteer.nom)}&prenom=${encodeURIComponent(volunteer.prenom)}`} className="action-btn details">Consulter</a>
                                            <button onClick={() => confirmerSuppression(volunteer.email)} className="action-btn refuser">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </section>
        </>
    );
}

export default List;
