import React, { useEffect, useState } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';
import { Link, useLocation } from 'react-router-dom';

function BeneficiaryList() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        fetch('https://au-temps-donne-api.onrender.com/api/admin/beneficiaires')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data for beneficiaries retrieved:', data);
                setBeneficiaries(data.filter(b => b.statut_validation.toLowerCase() === 'accepté'));
            })
            .catch(error => {
                console.error('Error fetching beneficiary data:', error);
                alert('Failed to fetch beneficiaries: ' + error.message);
            });
    }, []);

    const confirmDeletion = (email) => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            fetch(`https://au-temps-donne-api.onrender.com/api/admin/beneficiaires/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error during the deletion of the beneficiary');
                }
                setBeneficiaries(prev => prev.filter(b => b.email !== email));
                console.log('Beneficiary successfully deleted');
            })
            .catch(error => {
                console.error('Error during deletion:', error);
                alert('Error during the deletion of the beneficiary: ' + error.message);
            });
        }
    }

    return (
        <>
            <NavMenu />
            <section className="content">
                <section className="lists">
                    <div className="list_type">
                        <Link to="/list" className={currentPath === '/list' ? 'active' : 'link_list'}>Bénévole</Link>
                        <Link to="/beneficiaires" className={currentPath === '/beneficiaires' ? 'active' : 'link_list'} style={currentPath === '/beneficiaires' ? { color: '#D23939' } : null}>Bénéficiaries</Link>
                        <Link to="/partners" className={`link_list ${currentPath === '/partners' ? '' : 'link_list'}`}>Partenaires</Link>
                        <Link to="/newsletter" className={`link_list ${currentPath === '/newsletter' ? '' : 'link_list'}`}>Newsletter</Link>
                    </div>
                    <div className="container_search">
                        <div className="filter">
                            <Link className="p_filter" to="#"><img style={{paddingTop: '30px'}} height="20" width="20" src="assets/filter_sort.png" alt="Filter and sort"/>Filter and sort</Link>
                        </div>
                        <form className="search" onSubmit={e => e.preventDefault()}>
                            <input type="text" id="searchField" placeholder="   Search ..." />
                        </form>
                    </div>
                    <div className="table-header">
                        <h3>Liste Beneficiaries</h3>
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
                                {beneficiaries.map(beneficiary => (
                                    <tr key={beneficiary.email}>
                                        <td>{beneficiary.nom} {beneficiary.prenom}</td>
                                        <td>{beneficiary.email}</td>
                                        <td>{beneficiary.telephone}</td>
                                        <td className="action">
                                            <a href={`consult.php?name=${encodeURIComponent(beneficiary.nom)}&surname=${encodeURIComponent(beneficiary.prenom)}`} className="action-btn details">Consulter</a>
                                            <button onClick={() => confirmDeletion(beneficiary.email)} className="action-btn refuser">Supprimer</button>
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

export default BeneficiaryList;
