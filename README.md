﻿# exo-ipi-jquery

## Features 
* Les mots de passes envoyés à l'API sont hashés en sha256.
* Possibilité d'ajouter des ToDoList.
* Possibilité d'ajouter des tâches dans les ToDoList
* La connexion au site est permanante jusqu'à la déconnexion, pas besoin de se reconnecter à chaque actualisation grâce au backend.
* Le backend utilise un framework maison.
* Les pages d'inscriptions et de connexion ne sont pas accessible si on est déjà authentifié. Nous sommes automatiquement redirigé vers la page d'accueil si on tent d'y accéder (middleware backend du framework).
* Les pages de déconnexion et la page d'accueil permettant d'afficher les ToDoList ne sont pas accessible. Nous sommes automatiquement redirigé vers la page de login si on tente d'y accéder (middleware backend du framework)
* Possibilité de modifier le nom des ToDoList ou des tâches.
* Possibilité de supprimer les tâches ou ToDoList.
* Possibilité de déplacer les tâches et les ToDoList pour changer l'ordre d'affichage.
* On peut également déplacer des tâches d'une ToDoList à une autre.
* Une fois la modification de l'ordre effectué (features précédent), un bouton de sauvegarde permet de rendre le changement persistant même après une actualisation
* Pour annuler la modification de l'ordre des éléments qu'on vient de modifier, il existe également un bouton "annuler"
* Les boutons "annuler" et "sauvegarder" n'apparaissent que si on à modifié l'odre.
* Animation : animation lors de la connexion ou l'inscription un smiley apparait (de bas en haut) avant d'être redirigé
