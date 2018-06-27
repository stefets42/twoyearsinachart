# Cartographie des compétences
C'est un projet de data visualisation. L'interface cherche à représenter visuellement les compétences développées chez Simplon.
[Simplon](https://simplon.co) est une école du numérique, gratuite et inclusive.  
  
Ce projet met en forme les blocs de compétences et les compétences sous la forme d'un graphique de type *sunburst*.
  
L'interface permet aussi de sélectionner une certification afin de mettre en valeur les compétences développées au sein de cette même certification.

## Comment ça marche ?
D3.js est l'outil principal de cette application. Il s'agit d'une bibliothèque JavaScript dédiée à la data visualisation.  
  
Les données qui alimentent ce graphique proviennent d'une base de données de type *tableur* stockée sur Google SpreadSheet. 
La récupération des données est faite via l'API REST Google SpreadSheet.

## Premiers pas
- Cloner le projet git en local : `git clone https://<domaine>/<username>/<project-name>`
- Depuis l'interface développeur Google, créez une clé d'API et un ID OAuth2
- Remplacez la clé et l'ID en en-tête du fichier `js/google-connect.js`
- Placer vous à la racine du projet et lancez un server http local : `python3 -m http.server`
