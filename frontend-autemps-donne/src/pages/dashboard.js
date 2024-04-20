import React, { useEffect } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';
import view from '../assets/voir_all.png';

function Dashboard() {
  useEffect(() => {
    fetch('https://au-temps-donne-api.onrender.com/api/admin/all/latest')
      .then(response => response.json())
      .then(data => {
        console.log('Données des bénévoles et bénéficiaires récupérées:', data);
        const tableBody = document.querySelector('.table_bnv tbody');
        let rows = '';
        
        data.forEach(item => {
          let statusClass = '';
          switch(item.statut_validation?.toLowerCase()) {
            case 'en attente': statusClass = 'attente'; break;
            case 'accepté': statusClass = 'accepte'; break;
            case 'refusé': statusClass = 'refuse'; break;
            default: statusClass = '';
          }

          rows += `
            <tr>
              <td>${item.nom} ${item.prenom}</td>
              <td>${item.type}</td> <!-- Afficher si c'est un bénévole ou un bénéficiaire -->
              <td class="status"><span class="status-dot ${statusClass}"></span> ${item.statut_validation || 'N/A'}</td>
              <td class="action">
                ${item.statut?.toLowerCase() === 'en attente' ? `
                  <form method="POST" class="change-status-form" data-email="${item.email}">
                    <input type="hidden" name="email" value="${item.email}" />
                    <button data-nom="${encodeURIComponent(item.nom)}" data-prenom="${encodeURIComponent(item.prenom)}" class="action-btn" onclick="redirectToConsulter(this)">ⓘ</button>
                  </form>
                ` : ''}
              </td>
              <td class="action">
              </td>
            </tr>
          `;
        });
        tableBody.innerHTML = rows;
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  return (
    <>
      <NavMenu />
      <section className="content">
        <section className="tables">
          <div className="main_table">
            <div>
              <h3 className="title_dashboard">Dernières notifications</h3>
            </div>
          </div>
          <div className="main_table">
            <div className="table-header">
              <h3>Status Candidats</h3>
              <a href="statut_a_valider.php" className="view-all">Voir Tout<img className="voir-all-icon" src={view} alt="View All"/></a>
            </div>
            <div className="table_bnv">
              <table>
                <thead>
                  <tr>
                    <th>Nom Complet</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <div className="table_avenir">
          <h3 className="title_dashboard">À venir</h3>
          <p id="date"></p>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
