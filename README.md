# FantoirParser
Permet de parser le fichier FANTOIR

# Pré-requis
* TypesScript
* NodeJS
1. Compilez le fichier **TS** (fantoir.ts)
```shell
tsc -p .
```
2. Modifiez le fichier **main.js** pour pointer vers un dossier existant
```javascript
const fantoirParser = require('./module_fantoir')
fantoirParser('FICHIER FANTOIR', 'DOSSIER EXISTANT')
```
3. Lancez **node**
```shell
node main.js
```
4. Patientez... La génération des dossiers prend * *environ* * 5 minutes...

# Output
- Le fichier FANTOIR est découpé en fichiers JSON de 45Mo environ...
- Chaque fichier JSON départemental est composé de :
  - Définition du fichier FANTOIR :
    - Centre producteur
    - Date de situation du fichier FANTOIR
    - Date de production du fichier FANTOIR
  - Un tableau d'éléments regroupant :
    - Les communes, et chacune contient un tableau de toutes les voies de la commune

Les définitions du fichier FANTOIR sont disponible sur la [page de téléchargement](https://www.data.gouv.fr/fr/datasets/fichier-fantoir-des-voies-et-lieux-dits) 

# Commentaires
Le but de ce petit parser est d'accéder à une orientation "API" du fichier FANTOIR. Il permet de parser le fichier de près de 1Go en petits fichiers au format JSON.
