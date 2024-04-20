import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/admin.css';
import NavMenu from './navMenu';
import viewIcon from '../assets/voir_all.png';
import addIcon from '../assets/add.png';
import horlogeIcon from '../assets/horloge.png';

function Event() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetch('https://au-temps-donne-api.onrender.com/api/admin/activities/latest')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setActivities(data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }, []);

    useEffect(() => {
        document.getElementById('add_link').addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('popupForm').style.display = 'block';
        });

        document.getElementById('overlay').addEventListener('click', function() {
            this.style.display = 'none';
            document.getElementById('popupForm').style.display = 'none';
        });

        document.getElementById('publicButton').addEventListener('click', function() {
            document.getElementById('publicEventForm').style.display = 'block';
            document.getElementById('privateEventForm').style.display = 'none';
            document.getElementById('formationEventForm').style.display = 'none';
            this.classList.add('active');
            document.getElementById('privateButton').classList.remove('active');
            document.getElementById('formationButton').classList.remove('active'); 
        });

        document.getElementById('privateButton').addEventListener('click', function() {
            document.getElementById('publicEventForm').style.display = 'none';
            document.getElementById('privateEventForm').style.display = 'block';
            document.getElementById('formationEventForm').style.display = 'none';
            this.classList.add('active');
            document.getElementById('publicButton').classList.remove('active');
            document.getElementById('formationButton').classList.remove('active'); 
        });

        document.getElementById('formationButton').addEventListener('click', function() {
            document.getElementById('publicEventForm').style.display = 'none';
            document.getElementById('privateEventForm').style.display = 'none';
            document.getElementById('formationEventForm').style.display = 'block';
            this.classList.add('active');
            document.getElementById('publicButton').classList.remove('active');
            document.getElementById('privateButton').classList.remove('active'); 
        });

        fetchServices();
    }, []);

    function fetchServices() {
        const url = new URL('https://au-temps-donne-api.onrender.com/api/admin/services');
    
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Problème de réponse réseau');
            }
            return response.json();
        })
        .then(services => {
            console.log("Services récupérés:", services);
            displayServices(services);
        })
        .catch(error => {
            console.error("Il y a eu un problème avec l'opération fetch: " + error.message);
        });
    }

    function displayServices(services) {
        const activityTypeSelectPublic = document.getElementById('activityType');
        const activityTypeSelectPrivate = document.getElementById('privateActivityType'); 
    
        function fillSelectWithServices(selectElement) {
            selectElement.innerHTML = ''; 
    
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "Sélectionnez un service";
            selectElement.appendChild(defaultOption);
    
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.nom; 
                option.textContent = service.nom;
                selectElement.appendChild(option);
            });
        }
    
        fillSelectWithServices(activityTypeSelectPublic);
        fillSelectWithServices(activityTypeSelectPrivate);
    }
    document.addEventListener('DOMContentLoaded', function () {
        fetchVolunteersAndBeneficiaries();
    
        document.getElementById('privateEventForm').addEventListener('submit', function (e) {
            e.preventDefault(); 
    
            let formData = new FormData(e.target);
            let data = {};
            formData.forEach((value, key) => {
                switch (key) {
                    case 'date':
                        data['date_activite'] = value; 
                        break;
                    case 'heure_debut':
                        data['heure_debut'] = value; 
                        break;
                    case 'heure_fin':
                        data['heure_fin'] = value;
                        break;
                    case 'nom_service_privé':
                        data['nom_service'] = value; 
                        break;
                    case 'adresseComplete': 
                        data['adresseComplete'] = value;
                        break;
                    case 'titre':
                        data['titre'] = value;
                        break;
            
                    default:
                        data[key] = value; 
                }
            });
            let selectedVolunteer = data.selectedVolunteer ? data.selectedVolunteer.split(" ") : [];
            let selectedBeneficiary = data.selectedBeneficiary ? data.selectedBeneficiary.split(" ") : [];
            if (selectedVolunteer.length === 2) {
                [data.nomBenevole, data.prenomBenevole] = selectedVolunteer;
            }
            if (selectedBeneficiary.length === 2) {
                [data.nomBeneficiaire, data.prenomBeneficiaire] = selectedBeneficiary;
            }
    
            delete data.selectedVolunteer;
            delete data.selectedBeneficiary;
    
            console.log('Données prêtes à être envoyées:', data);
    
            fetch('https://au-temps-donne-api.onrender.com/api/admin/addActivityPrive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau ou du serveur');
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json(); // Parse comme JSON si le contenu est du JSON
                } else {
                    return response.text().then(text => ({text})); 
                }
            })
            .then(data => {
                if (data.text) {
                    console.log('Réponse en texte:', data.text);
                    alert('Activité privée ajoutée avec succès !');
                } else {
                    console.log('Succès:', data);
                    alert(data.message || 'Activité privée ajoutée avec succès !');
                }
            })
            .catch((error) => {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'ajout de l\'activité privée: ' + error.message);
            });
        });
    
        function fetchVolunteersAndBeneficiaries() {
            fetch('https://au-temps-donne-api.onrender.com/api/admin/volunteers') 
            .then(response => response.json())
            .then(data => {
                const volunteerSelect = document.getElementById('volunteerSelect');
                data.forEach(volunteer => {
                    if (volunteer.nom && volunteer.prenom && volunteer.statut_validation.toLowerCase() === 'accepté') {
                        let option = new Option(`${volunteer.nom} ${volunteer.prenom}`, `${volunteer.nom} ${volunteer.prenom}`);
                        volunteerSelect.add(option);
                    }
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des bénévoles:', error));
    
            fetch('https://au-temps-donne-api.onrender.com/api/admin/beneficiaires') 
            .then(response => response.json())
            .then(data => {
                const beneficiarySelect = document.getElementById('beneficiarySelect');
                data.forEach(beneficiary => {
                    if (beneficiary.nom && beneficiary.prenom && beneficiary.statut_validation.toLowerCase() === 'accepté') {
                        let option = new Option(`${beneficiary.nom} ${beneficiary.prenom}`, `${beneficiary.nom} ${beneficiary.prenom}`);
                        beneficiarySelect.add(option);
                    }
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des bénéficiaires:', error));
        }
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const publicEventForm = document.getElementById('publicEventForm');
    
        publicEventForm.addEventListener('submit', async function(event) {
            event.preventDefault();
    
            const formData = new FormData(publicEventForm);
    
            fetch('https://au-temps-donne-api.onrender.com/api/admin/addActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau ou du serveur');
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json(); 
                } else {
                    return response.text().then(text => ({text})); 
                }
            })
            .then(data => {
                if (data.text) {
                    console.log('Réponse en texte:', data.text);
                    alert('Activité privée ajoutée avec succès !');
                } else if (data.error) {
                    console.error('Erreur:', data.error);
                    alert('Erreur lors de l\'ajout de l\'activité privée: ' + data.error);
                } else if (data.message) {
                    console.log('Succès:', data);
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error('Erreur:', error);
                if (error instanceof TypeError) {
                    alert('Erreur de connexion réseau');
                } else {
                    alert('Erreur lors de l\'ajout de l\'activité privée: ' + error.message);
                }
            });
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const formationEventForm = document.getElementById('formationEventForm');
    
        formationEventForm.addEventListener('submit', async function(event) {
            event.preventDefault();
    
            const formData = new FormData(formationEventForm);
    
            fetch('https://au-temps-donne-api.onrender.com/api/admin/addFormation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau ou du serveur');
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json(); 
                } else {
                    return response.text().then(text => ({text})); 
                }
            })
            .then(data => {
                if (data.text) {
                    console.log('Réponse en texte:', data.text);
                    alert('la formation ajoutée avec succès !');
                } else if (data.error) {
                    console.error('Erreur:', data.error);
                    alert('Erreur lors de l\'ajout de la formation : ' + data.error);
                } else if (data.message) {
                    console.log('Succès:', data);
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error('Erreur:', error);
                if (error instanceof TypeError) {
                    alert('Erreur de connexion réseau');
                } else {
                    alert('Erreur lors de l\'ajout de la formation: ' + error.message);
                }
            });
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
      fetch('https://au-temps-donne-api.onrender.com/api/admin/activities/latest') 
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur réseau');
          }
          return response.json();
        })
        .then(activities => {
          const container = document.getElementById('boxContainer');
          container.innerHTML = '';
          activities.forEach(activity => {
            const box = document.createElement('div');
            box.className = 'elm_box';
    
            const date = new Date(activity.date_activite);
            const formattedDate = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    
            box.innerHTML = `
              <div class="infos">
                <div class="info">
                  <img height="180px" src="assets/benevole-img.png" style="border-radius: 25px;">
                  <div class="info-container">
                    <div class="hour">
                      <img height="20px" src="assets/horloge.png" style="padding-top:10px;"><p class="time">${formattedDate}</p>
                    </div>
                  </div>
                </div>
                <div class="info2">
                  <h3>${activity.titre}</h3>
                  <hr>
                  <p class="description">${activity.description}</p>
                  <div class="adresse">
                    <p>${activity.lieu.adresse}</p>
                    <p>${activity.lieu.code_postal} ${activity.lieu.ville}</p>
                  </div>
                </div>
              </div>
              <a id="details_link" href="javascript:void(0);" class="view">Voir plus<img class="voir-all-icon" height="15px" width="17px" src="assets/voir_all.png" alt="Voir tout"></a>
            `;
    
            container.appendChild(box);
          });
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données:', error);
        });
    });

    return (
        <>
            <NavMenu />
            <section className="content">
                <div className="lists">
                    <div className="table-header">
                        <h3>Gestionnaire des événements</h3>
                        <Link id="add_link" href="javascript:void(0);"class="view-all">Ajouter<img class="voir-all-icon" height="15px" width="17px"  src={addIcon} alt="Voir tout"/></Link>
                    </div>
                    <div className="table-header">
                        <h3>Tous les évènements</h3>
                        <Link to="/allEvents" className="view-all">Voir Tout<img className="voir-all-icon" src={viewIcon} alt="Voir tout" /></Link>
                    </div>
                    <div className="box-container">
                        {activities.map((activity, index) => (
                            <div key={index} className="elm_box">
                                <div className="infos">
                                    <div className="info">
                                        <img height="180px" src={`assets/${activity.image}`} style={{ borderRadius: '25px' }} />
                                        <div className="info-container">
                                            <div className="hour">
                                                <img id="img-time" height="20px" src={horlogeIcon} />
                                                <p className="time">{(activity.date_activite)}  {activity.heure_debut}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info2">
                                        <h3>{activity.titre}</h3>
                                        <hr />
                                        <p>{activity.description}</p>
                                        <div className="adresse">
                                            <p>{activity.lieu.adresse}</p>
                                            <p>{activity.lieu.code_postal} {activity.lieu.ville}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/activity-details/${activity.id}`} className="view">Voir plus<img className="voir-all-icon" height="15px" width="17px" src={viewIcon} alt="Voir tout" /></Link>
                            </div>
                        ))}
                    </div>
                    <div id="overlay"></div>
                    <div id="popupForm">
<div id="statutButtons">
        <button class="btn_event_type"id="publicButton">Public</button>
        <button class="btn_event_type" id="privateButton">Privé</button>
        <button class="btn_event_type" id="formationButton">Formation</button>
    </div>
    <form id="publicEventForm">
        <div class="scrollable-content">
                <label for="activityName">Nom de l'activité:</label>
                <input type="text" id="activityName" name="titre" required/>

                <label for="activityDesc">Description:</label>
                <textarea id="activityDesc" name="description" required></textarea>
                <div class="form-row">
                    <label for="activityType">Service:</label>
                    <select id="activityType" name="nom_service">
                        <option value="">Sélectionnez un service</option>
                    </select>
                </div>
        
                <div class="datetime-row">
                    <div class="date">
                        <label for="activityDate">Date:</label>
                        <input type="date" id="activityDate" name="date_activite" required/>
                    </div>
                    <div>
                        <label for="activityTimeStart">Heure de début:</label>
                        <input type="time" id="activityTimeStart" name="heure_debut" required/>
                    </div>
                    <div>
                        <label for="activityTimeEnd">Heure de fin:</label>
                        <input type="time" id="activityTimeEnd" name="heure_fin" required/>
                    </div>
                </div>
                <div class="form-row">
                    <label for="activityAddress">Adresse:</label>
                    <input type="text" id="activityAddress" name="adresseComplete" required/>
                </div>
                <div class="adresse-row">
                    <div class="form-row">
                        <label for="activityCity">Ville:</label>
                        <input type="text" id="activityCity" name="ville" required/>
                    </div>

                    <div class="form-row">
                        <label style={{paddingLeft:'20px'}} for="activityPostalCode">Code postal:</label>
                        <input type="text" id="activityPostalCode" name="code_postal" required/>
                    </div>
                </div>
                <div class="form-row">
                    <label for="volunteerCount">Nombre de bénévoles requis:</label>
                    <input type="number" id="volunteerCount" name="nb_benevoles" min="1" />
                </div>

                <input class="btn_event" type="submit" value="Ajouter"/>
            </div>
    </form>
    <form id="privateEventForm" style={{display:'none'}}>
        <div class="scrollable-content">
            <label for="privateActivityName">Nom de l'activité:</label>
            <input type="text" id="privateActivityName" name="titre" required/>

            <label for="privateActivityDesc">Description:</label>
            <textarea id="privateActivityDesc" name="description" required></textarea>

            <div class="form-row">
                <label for="privateActivityType">Service:</label>
                <select id="privateActivityType" name="nom_service_privé">
                    <option value="">Sélectionnez un service</option>
                </select>
            </div>
        
            <div class="datetime-row">
                <div class="date">
                    <label for="privateActivityDate">Date:</label>
                    <input type="date" id="privateActivityDate" name="date" required/>
                </div>
                <div>
                    <label for="aprivateActivityTimeStart">Heure de début:</label>
                    <input type="time" id="privateActivityTimeStart" name="heure_debut" required/>
                </div>
                <div>
                    <label for="privateActivityTimeEnd">Heure de fin:</label>
                    <input type="time" id="privateActivityTimeEnd" name="heure_fin" required/>
                </div>
            </div>

            <div class="form-row">
                <label for="privateActivityAddress">Adresse:</label>
                <input type="text" id="privateActivityAddress" name="adresseComplete" required/>
            </div>

            <div class="adresse-row">
                <div class="form-row">
                    <label for="aprivateActivityCity">Ville:</label>
                    <input type="text" id="privateActivityCity" name="ville" required/>
                </div>

                <div class="form-row">
                    <label  style={{paddingLeft:'20px'}} for="privateActivityPostalCode">Code postal:</label>
                    <input type="text" id="privateActivityPostalCode" name="code_postal" required/>
                </div>
            </div>

            <div class="form-row">
                <label for="volunteerSelect">Choisir un bénévole :</label>
                <select id="volunteerSelect" name="selectedVolunteer" >
                    <option value="">Sélectionner un bénévole</option>
                </select>

                <label for="beneficiarySelect">Choisir un bénéficiaire :</label>
                <select id="beneficiarySelect" name="selectedBeneficiary" >
                    <option value="">Sélectionner un bénéficiaire</option>
                </select>
            </div>

            <input class="btn_event" type="submit" value="Ajouter"/>
        </div>
    </form>
    <form id="formationEventForm" style={{display:'none'}}>
    <div class="scrollable-content">
            <label for="formationName">Titre de la formation:</label>
            <input type="text" id="formationName" name="titre" required/>

            <label for="formationDesc">Description:</label>
            <textarea id="formationDesc" name="description" required></textarea>
        
            <div class="datetime-row">
                <div class="date">
                    <label for="formationDateStart">Date de début:</label>
                    <input type="date" id="formationDateStart" name="date" required/>
                </div>
                <div class="date">
                    <label for="formationDateEnd">Date de fin:</label>
                    <input type="date" id="formationDateEnd" name="date" required/>
                </div>
                <div>
                    <label for="aformationTimeStart">Heure de début:</label>
                    <input type="time" id="formationTimeStart" name="heure_debut" required/>
                </div>
                <div>
                    <label for="formationTimeEnd">Heure de fin:</label>
                    <input type="time" id="formationTimeEnd" name="heure_fin" required/>
                </div>
            </div>

            <div class="form-row">
                <label for="formationAddress">Adresse:</label>
                <input type="text" id="formationAddress" name="adresseComplete" required/>
            </div>

            <div class="adresse-row">
                <div class="form-row">
                    <label for="formationCity">Ville:</label>
                    <input type="text" id="formationCity" name="ville" required/>
                </div>

                <div class="form-row">
                    <label for="formationPostalCode">Code postal:</label>
                    <input type="text" id="formationPostalCode" name="code_postal" required/>
                </div>
            </div>
            <input class="btn_event" type="submit" value="Ajouter"/>   
            </div>     
    </form>
    </div>
                </div>
            </section>
        </>
    );
}

export default Event;