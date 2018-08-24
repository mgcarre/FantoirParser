# FantoirParser
Permet de parser le fichier FANTOIR

# Pré-requis
* TypesScript
* NodeJS
1. Compilez le fichier TS
```shell
tsc -p .
```
1. Modifiez le fichier main.js pour pointer vers un dossier existant
```javascript
const fantoirParser = require('./module_fantoir')
fantoirParser('FICHIER FANTOIR', 'DOSSIER EXISTANT')
```
1. Lancez node
```shell
node main.js
```
1. Patientez... La génération des dossiers prend environ 5 minutes...

# Commentaires
Le but de ce petit parser est d'accéder à une orientation "API" du fichier FANTOIR. Il permet de parser le fichier de près de 1Go en petits fichiers au format JSON.
