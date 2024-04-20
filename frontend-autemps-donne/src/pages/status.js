import React, { useEffect } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';

function Status() {
    useEffect(() => {
        fetch('https://au-temps-donne-api.onrender.com/api/admin/all') 
            .then(response => response.json())
            .then(data => {
                console.log('Données des bénévoles et bénéficiaires récupérées:', data);
                const tableBody = document.querySelector('.table_statut tbody');
                let rows = '';
                
                data.forEach(item => {
                    let statusClass = '';
                    switch(item.statut_validation?.toLowerCase()) { 
                        case 'en attente': statusClass = 'attente'; break;
                        case 'accepté': statusClass = 'accepte'; break;
                        case 'refusé': statusClass = 'refuse'; break;
                        default: statusClass = ''; // Cas par défaut si le statut est absent ou différent
                    }
        
                    rows += `
                        <tr>
                            <td>${item.nom} ${item.prenom}</td>
                            <td>${item.type}</td> <!-- Afficher si c'est un bénévole ou un bénéficiaire -->
                            <td>${item.email || 'N/A'}</td> <!-- Certains bénéficiaires peuvent ne pas avoir d'email -->
                            <td class="status"><span class="status-dot ${statusClass}"></span> ${item.statut_validation || 'N/A'}</td>
                            <td class="action">
                                ${item.statut_validation?.toLowerCase() === 'en attente' ? `
                                    <form method="POST" class="change-status-form" data-email="${item.email}">
                                        <input type="hidden" name="email" value="${item.email}" />
                                        <button type="button" onclick="accept('${item.email}', '${item.type}')" class="action-btn accepter">Accepter</button>
                                        <button type="button" onclick="reject('${item.email}', '${item.type}')" class="action-btn refuser">Refuser</button>
                                        <button data-nom="${encodeURIComponent(item.nom)}" data-prenom="${encodeURIComponent(item.prenom)}" class="action-btn" onclick="redirectToConsulter(this)">ⓘ</button>
                                    </form>
                                ` : ''}
                            </td>
                            <td class="action">
                                <button data-email ="${encodeURIComponent(item.email)}" class="infos-btn" onclick="redirectToConsulter(this)">ⓘ</button>
                            </td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = rows;
            })
            .catch(error => console.error('Erreur lors de la récupération des données:', error));
    }, []);

    function redirectToConsulter(button) {
        const email = button.getAttribute('data-email');
        window.location.href = `consulter.php?email=${email}`;
    }

    async function updateVolunteerStatus(email, newStatus) {
        try {
            const response = await fetch('https://au-temps-donne-api.onrender.com/api/admin/volunteers/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, newStatus })
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); 
                window.location.href = 'status';
            } else {
                throw new Error('Erreur lors de la mise à jour du statut du bénévole.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut du bénévole :', error);
        }
    }

    async function updateBeneficiaryStatus(email, newStatus) {
        try {
            const response = await fetch('https://au-temps-donne-api.onrender.com/api/admin/beneficiaires/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, newStatus })
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); 
                window.location.href = 'status';
            } else {
                throw new Error('Erreur lors de la mise à jour du statut du bénéficiaire.');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut du bénéficiaire :', error);
        }
    }

    function accept(email, type) {
        if (type === 'Bénévole') {
            updateVolunteerStatus(email, 'accepté');
        } else if (type === 'Bénéficiaire') {
            updateBeneficiaryStatus(email, 'accepté');
        }
    }

    function reject(email, type) {
        if (type === 'Bénévole') {
            updateVolunteerStatus(email, 'refusé');
        } else if (type === 'Bénéficiaire') {
            updateBeneficiaryStatus(email, 'refusé');
        }
    }

    useEffect(() => {
        window.accept = accept;
        window.reject = reject;
    }, []);

    return (
        <>
            <NavMenu />
            <section className="content">
                <section className="table_statut">
                    <div className="table-header">
                        <h3>Status Candidats</h3>
                    </div>
                    <div className="table_bnv">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom Complet</th>
                                    <th>Rôle</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </section>
            </section>
        </>
    );
}

export default Status;
