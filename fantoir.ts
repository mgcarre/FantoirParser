import * as fs from 'fs';
import {resolve as pathResolver} from 'path';

interface FANTOIR_code_Departement {
    code_departement: string;
}
interface FANTOIR_code_Direction {
    code_direction: string;
    libelle_direction: string;
}
enum type_commune {
    "N" = "Rurale",
    "R" = "Recensée"
}

class FANTOIR_FICHIER {
    centre_producteur: string;
    date_situation_fichier: string;
    date_production_fichier: string;
    details: string;
    constructor(line: string) {
        this.centre_producteur = line.slice(11, 36).trim();
        this.date_situation_fichier = line.slice(36, 44);
        this.date_production_fichier = line.slice(44, 52);
        this.details = `Voir nomenclature pour plus de détails.`;
    }
}

class FANTOIR_Direction implements FANTOIR_code_Departement, FANTOIR_code_Direction {
    code_departement: string;
    code_direction: string;
    libelle_direction: string;
    elements_inclus_departement:FANTOIR_Commune[];

    constructor(line:string){
        this.code_departement = line.slice(0,2);
        this.code_direction = line.slice(2,3);
        this.libelle_direction = line.slice(11,41).trim();
        this.elements_inclus_departement = [];
    }
    addVille(elem:FANTOIR_Commune):void{
        this.elements_inclus_departement.push(elem);
    }
}

class FANTOIR_Commune implements FANTOIR_code_Departement {
    id: string;
    code_departement: string;
    code_direction: string;
    code_commune: string;
    cle_rivoli: string;
    libelle_commune: string;
    type_commune: string;
    caractere_RUR: object | null;
    caractere_population: string | null;
    pop_reelle: number;
    pop_a_part: number;
    pop_fictive: number;
    caractere_annulation: string | null;
    date_annulation: string;
    date_creation_article: string;
    elements_inclus_commune: FANTOIR_Voie_Lieu_Dit[];

    constructor(line:string){
        this.code_departement = line.slice(0,2);
        this.code_direction = line.slice(2,3);
        this.code_commune = line.slice(3,6);
        this.cle_rivoli = line.slice(10,11);
        this.libelle_commune = line.slice(11,41).trim();
        this.type_commune = line.slice(42, 43);
        this.caractere_RUR = this.trouveCaractereRUR(line.slice(45, 46));
        this.caractere_population = line.slice(49,50).trim() || null;
        this.pop_reelle = parseInt(line.slice(52,59));
        this.pop_a_part = parseInt(line.slice(59,66));
        this.pop_fictive = parseInt(line.slice(66,73));
        this.caractere_annulation = line.slice(73, 74).trim() || null;
        this.date_annulation = line.slice(74,81);
        this.date_creation_article = line.slice(81,88);
        this.id = `${this.code_departement}${this.code_commune}`;
        this.elements_inclus_commune = [];
    }
    addVoie(elem:FANTOIR_Voie_Lieu_Dit):void{
        this.elements_inclus_commune.push(elem);
    }
    trouveCaractereRUR(arg:string): object | null {
        if(arg === "3"){
            return {type: arg, litteral: "Pseudo-recensée"};
        } else {
            return null;
        }
    }
}

class FANTOIR_Voie_Lieu_Dit implements FANTOIR_code_Departement {
    id:string;
    code_departement: string;
    code_direction: string;
    code_commune: string;
    identifiant_voie: string;
    cle_rivoli: string;
    libelle_voie: string;
    code_nature_voie: object;
    type_commune: string;
    caractere_RUR: string;
    caractere_voie: object;
    caractere_population: string | null;
    pop_a_part: string;
    pop_fictive: string;
    caractere_annulation: string | null;
    date_annulation: string;
    date_creation_article: string;
    code_MAJIC: string;
    type_voie: object;
    caractere_lieu_dit: object;
    dernier_mot: string;

    constructor(line: string) {
        this.code_departement = line.slice(0, 2);
        this.code_direction = line.slice(2, 3);
        this.code_commune = line.slice(3, 6);
        this.identifiant_voie = line.slice(6, 10).trim();
        this.cle_rivoli = line.slice(10, 11);
        this.code_nature_voie = this.trouveVoie(line.slice(11, 15).trim());
        this.libelle_voie = line.slice(15,41).trim();
        this.type_commune = line.slice(42, 43);
        this.caractere_RUR = line.slice(45, 46);
        this.caractere_voie = this.trouveCaractereVoie(line.slice(48, 49));
        this.caractere_population = line.slice(49, 50).trim() || null;;
        this.pop_a_part = line.slice(59, 66);
        this.pop_fictive = line.slice(66, 73);
        this.caractere_annulation = line.slice(73, 74).trim() || null;;
        this.date_annulation = line.slice(74, 81);
        this.date_creation_article = line.slice(81, 88);
        this.code_MAJIC = line.slice(103,108);
        this.type_voie = this.trouveTypeVoie(line.slice(108, 109));
        this.caractere_lieu_dit = this.trouveCaractereLieuDit(line.slice(109,110).trim());
        this.dernier_mot = line.slice(112,120);
        this.id = `${this.code_departement}${this.code_commune}${this.identifiant_voie}${this.cle_rivoli}`;
    }
    protected trouveVoie = (code: string): object => {
        let codes = [
            { code: "ACH", "nom_long": "ANCIEN CHEMIN" },
            { code: "AER", "nom_long": "AERODROME" },
            { code: "AERG", "nom_long": "AEROGARE" },
            { code: "AGL", "nom_long": "AGGLOMERATION" },
            { code: "AIRE", "nom_long": "AIRE" },
            { code: "ALL", "nom_long": "ALLEE" },
            { code: "ANGL", "nom_long": "ANGLE" },
            { code: "ARC", "nom_long": "ARCADE" },
            { code: "ART", "nom_long": "ANCIENNE ROUTE" },
            { code: "AUT", "nom_long": "AUTOROUTE" },
            { code: "AV", "nom_long": "AVENUE" },
            { code: "BASE", "nom_long": "BASE" },
            { code: "BD", "nom_long": "BOULEVARD" },
            { code: "BER", "nom_long": "BERGE" },
            { code: "BORD", "nom_long": "BORD" },
            { code: "BRE", "nom_long": "BARRIERE" },
            { code: "BRG", "nom_long": "BOURG" },
            { code: "BRTL", "nom_long": "BRETELLE" },
            { code: "BSN", "nom_long": "BASSIN" },
            { code: "CAE", "nom_long": "CARRIERA" },
            { code: "CALL", "nom_long": "CALLE, CALLADA" },
            { code: "CAMI", "nom_long": "CAMIN" },
            { code: "CAMP", "nom_long": "CAMP" },
            { code: "CAN", "nom_long": "CANAL" },
            { code: "CAR", "nom_long": "CARREFOUR" },
            { code: "CARE", "nom_long": "CARRIERE" },
            { code: "CASR", "nom_long": "CASERNE" },
            { code: "CC", "nom_long": "CHEMIN COMMUNAL" },
            { code: "CD", "nom_long": "CHEMIN DEPARTEMENTAL" },
            { code: "CF", "nom_long": "CHEMIN FORESTIER" },
            { code: "CHA", "nom_long": "CHASSE" },
            { code: "CHE", "nom_long": "CHEMIN" },
            { code: "CHEM", "nom_long": "CHEMINEMENT" },
            { code: "CHL", "nom_long": "CHALET" },
            { code: "CHP", "nom_long": "CHAMP" },
            { code: "CHS", "nom_long": "CHAUSSEE" },
            { code: "CHT", "nom_long": "CHATEAU" },
            { code: "CHV", "nom_long": "CHEMIN VICINAL" },
            { code: "CITE", "nom_long": "CITE" },
            { code: "CIVE", "nom_long": "COURSIVE" },
            { code: "CLOS", "nom_long": "CLOS" },
            { code: "CLR", "nom_long": "COULOIR" },
            { code: "COIN", "nom_long": "COIN" },
            { code: "COL", "nom_long": "COL" },
            { code: "COR", "nom_long": "CORNICHE" },
            { code: "CORO", "nom_long": "CORON" },
            { code: "COTE", "nom_long": "COTE" },
            { code: "COUR", "nom_long": "COUR" },
            { code: "CPG", "nom_long": "CAMPING" },
            { code: "CR", "nom_long": "CHEMIN RURAL" },
            { code: "CRS", "nom_long": "COURS" },
            { code: "CRX", "nom_long": "CROIX" },
            { code: "CTR", "nom_long": "CONTOUR" },
            { code: "CTRE", "nom_long": "CENTRE" },
            { code: "DARS", "nom_long": "DARSE, DARCE" },
            { code: "DEVI", "nom_long": "DEVIATION" },
            { code: "DIG", "nom_long": "DIGUE" },
            { code: "DOM", "nom_long": "DOMAINE" },
            { code: "DRA", "nom_long": "DRAILLE" },
            { code: "DSC", "nom_long": "DESCENTE" },
            { code: "ECA", "nom_long": "ECART" },
            { code: "ECL", "nom_long": "ECLUSE" },
            { code: "EMBR", "nom_long": "EMBRANCHEMENT" },
            { code: "EMP", "nom_long": "EMPLACEMENT" },
            { code: "ENC", "nom_long": "ENCLOS" },
            { code: "ENV", "nom_long": "ENCLAVE" },
            { code: "ESC", "nom_long": "ESCALIER" },
            { code: "ESP", "nom_long": "ESPLANADE" },
            { code: "ESPA", "nom_long": "ESPACE" },
            { code: "ETNG", "nom_long": "ETANG" },
            { code: "FD", "nom_long": "FOND" },
            { code: "FG", "nom_long": "FAUBOURG" },
            { code: "FON", "nom_long": "FONTAINE" },
            { code: "FOR", "nom_long": "FORET" },
            { code: "FORT", "nom_long": "FORT" },
            { code: "FOS", "nom_long": "FOSSE" },
            { code: "FRM", "nom_long": "FERME" },
            { code: "GAL", "nom_long": "GALERIE" },
            { code: "GARE", "nom_long": "GARE" },
            { code: "GBD", "nom_long": "GRAND BOULEVARD" },
            { code: "GPL", "nom_long": "GRANDE PLACE" },
            { code: "GR", "nom_long": "GRANDE RUE" },
            { code: "GREV", "nom_long": "GREVE" },
            { code: "HAB", "nom_long": "HABITATION" },
            { code: "HAM", "nom_long": "HAMEAU" },
            { code: "HIP", "nom_long": "HIPPODROME" },
            { code: "HLE", "nom_long": "HALLE" },
            { code: "HLG", "nom_long": "HALAGE" },
            { code: "HLM", "nom_long": "HLM" },
            { code: "HTR", "nom_long": "HAUTEUR" },
            { code: "ILE", "nom_long": "ILE" },
            { code: "ILOT", "nom_long": "ILOT" },
            { code: "IMP", "nom_long": "IMPASSE" },
            { code: "JARD", "nom_long": "JARDIN" },
            { code: "JTE", "nom_long": "JETEE" },
            { code: "LAC", "nom_long": "LAC" },
            { code: "LEVE", "nom_long": "LEVEE" },
            { code: "LICE", "nom_long": "LICES" },
            { code: "LIGN", "nom_long": "LIGNE" },
            { code: "LOT", "nom_long": "LOTISSEMENT" },
            { code: "MAIL", "nom_long": "MAIL" },
            { code: "MAIS", "nom_long": "MAISON" },
            { code: "MAR", "nom_long": "MARCHE" },
            { code: "MARE", "nom_long": "MARE" },
            { code: "MAS", "nom_long": "MAS" },
            { code: "MNE", "nom_long": "MORNE" },
            { code: "MRN", "nom_long": "MARINA" },
            { code: "MTE", "nom_long": "MONTEE" },
            { code: "NTE", "nom_long": "NOUVELLE ROUTE" },
            { code: "PAE", "nom_long": "PETITE AVENUE" },
            { code: "PARC", "nom_long": "PARC" },
            { code: "PAS", "nom_long": "PASSAGE" },
            { code: "PASS", "nom_long": "PASSE" },
            { code: "PCH", "nom_long": "PETIT CHEMIN" },
            { code: "PCHE", "nom_long": "PORCHE" },
            { code: "PHAR", "nom_long": "PHARE" },
            { code: "PIST", "nom_long": "PISTE" },
            { code: "PKG", "nom_long": "PARKING" },
            { code: "PL", "nom_long": "PLACE" },
            { code: "PLA", "nom_long": "PLACA" },
            { code: "PLAG", "nom_long": "PLAGE" },
            { code: "PLAN", "nom_long": "PLAN" },
            { code: "PLCI", "nom_long": "PLACIS" },
            { code: "PLE", "nom_long": "PASSERELLE" },
            { code: "PLN", "nom_long": "PLAINE" },
            { code: "PLT", "nom_long": "PLATEAU" },
            { code: "PNT", "nom_long": "POINTE" },
            { code: "PONT", "nom_long": "PONT" },
            { code: "PORQ", "nom_long": "PORTIQUE" },
            { code: "PORT", "nom_long": "PORT" },
            { code: "POST", "nom_long": "POSTE" },
            { code: "POT", "nom_long": "POTERNE" },
            { code: "PROM", "nom_long": "PROMENADE" },
            { code: "PRT", "nom_long": "PETITE ROUTE" },
            { code: "PRV", "nom_long": "PARVIS" },
            { code: "PTA", "nom_long": "PETITE ALLEE" },
            { code: "PTE", "nom_long": "PORTE" },
            { code: "PTR", "nom_long": "PETITE RUE" },
            { code: "PTTE", "nom_long": "PLACETTE" },
            { code: "QUA", "nom_long": "QUARTIER" },
            { code: "QUAI", "nom_long": "QUAI" },
            { code: "RAC", "nom_long": "RACCOURCI" },
            { code: "REM", "nom_long": "REMPART" },
            { code: "RES", "nom_long": "RESIDENCE" },
            { code: "RIVE", "nom_long": "RIVE" },
            { code: "RLE", "nom_long": "RUELLE" },
            { code: "ROC", "nom_long": "ROCADE" },
            { code: "RPE", "nom_long": "RAMPE" },
            { code: "RPT", "nom_long": "ROND-POINT" },
            { code: "RTD", "nom_long": "ROTONDE" },
            { code: "RTE", "nom_long": "ROUTE" },
            { code: "RUE", "nom_long": "RUE" },
            { code: "RUET", "nom_long": "RUETTE" },
            { code: "RUIS", "nom_long": "RUISSEAU" },
            { code: "RULT", "nom_long": "RUELLETTE" },
            { code: "RVE", "nom_long": "RAVINE" },
            { code: "SAS", "nom_long": "SAS" },
            { code: "SEN", "nom_long": "SENTIER, SENTE" },
            { code: "SQ", "nom_long": "SQUARE" },
            { code: "STDE", "nom_long": "STADE" },
            { code: "TER", "nom_long": "TERRE" },
            { code: "TOUR", "nom_long": "TOUR" },
            { code: "TPL", "nom_long": "TERRE - PLEIN" },
            { code: "TRA", "nom_long": "TRAVERSE" },
            { code: "TRAB", "nom_long": "TRABOULE" },
            { code: "TRN", "nom_long": "TERRAIN" },
            { code: "TRT", "nom_long": "TERTRE" },
            { code: "TSSE", "nom_long": "TERRASSE" },
            { code: "TUN", "nom_long": "TUNNEL" },
            { code: "VAL", "nom_long": "VAL" },
            { code: "VALL", "nom_long": "VALLON, VALLEE" },
            { code: "VC", "nom_long": "VOIE COMMUNALE" },
            { code: "VCHE", "nom_long": "VIEUX CHEMIN" },
            { code: "VEN", "nom_long": "VENELLE" },
            { code: "VGE", "nom_long": "VILLAGE" },
            { code: "VIA", "nom_long": "VIA" },
            { code: "VIAD", "nom_long": "VIADUC" },
            { code: "VIL", "nom_long": "VILLE" },
            { code: "VLA", "nom_long": "VILLA" },
            { code: "VOIE", "nom_long": "VOIE" },
            { code: "VOIR", "nom_long": "VOIRIE" },
            { code: "VOUT", "nom_long": "VOUTE" },
            { code: "VOY", "nom_long": "VOYEUL" },
            { code: "VTE", "nom_long": "VIEILLE ROUTE" },
            { code: "ZA", "nom_long": "ZA" },
            { code: "ZAC", "nom_long": "ZAC" },
            { code: "ZAD", "nom_long": "ZAD" },
            { code: "ZI", "nom_long": "ZI" },
            { code: "ZONE", "nom_long": "ZONE" },
            { code: "ZUP", "nom_long": "ZUP" }
        ]
        let voie = codes.filter(elem => { return elem.code === code });
        return voie[0];
    }
    protected trouveTypeVoie(type:string): object {
        let retour = { "type_voie": parseInt(type), "type_litteral": ""};
        switch (type) {
            case "1":
                retour.type_litteral = "VOIE";
                break;
            case "2":
                retour.type_litteral = "ENSEMBLE IMMOBILIER";
                break;
            case "3":
                retour.type_litteral = "LIEU-DIT";
                break;
            case "4":
                retour.type_litteral = "PSEUDO-VOIE";
                break;
            case "5":
                retour.type_litteral = "VOIE PROVISOIRE";
                break;
        }
        
        return retour;
    }
    protected trouveCaractereVoie(type:string): object {
        let retour = { type: parseInt(type), litteral: "" };
        if(type === "1"){
            retour.litteral = "Privée";
        } else {
            retour.litteral = "Publique";
        }
        return retour;
    }
    protected trouveCaractereLieuDit(type:string): object {
        let retour = { type: parseInt(type), litteral: "" };
        if(type === "1"){
            retour.litteral = "Lieu-dit bâti";
        } else {
            retour.litteral = "Lieu-dit non bâti";
        }
        return retour;
    }
}

export class FANTOIR {
    fichier: FANTOIR_FICHIER;
    direction: FANTOIR_Direction;
    commune:FANTOIR_Commune;
    path: string;
    active_direction:string;

    constructor(path_for_saving:string) {
        this.direction;
        this.commune;
        this.path = path_for_saving;
        this.active_direction = "";
    }
    private setEnregistrement(line:string): void {
        if(!this.fichier){
            this.fichier = new FANTOIR_FICHIER(line);
        }
    }
    private addCommune(line:string): void {
        this.commune = new FANTOIR_Commune(line);
        this.direction.addVille(this.commune);
    }
    private addDepartement(line:string): void{
        this.direction = new FANTOIR_Direction(line);
    }
    private getDirectionCode(line:string): string{
        let dep = new FANTOIR_Direction(line);
        if(dep.code_departement === "97") {
            return `${dep.code_departement}${dep.code_direction}`;
        } else {
            return dep.code_departement;
        }
    }
    private addVoie(line:string): void{
        this.commune.addVoie(new FANTOIR_Voie_Lieu_Dit(line));
    }
    public addLine(line:string): void;
    public addLine(line:string, toSave:boolean): void;
    public addLine(line:string, toSave?:boolean): void {
        if(typeof line !== "string") {
            console.error('Line is not typeof STRING', typeof line)
            throw new Error();
        }
        switch (line.length) {
            case 58:
                this.setEnregistrement(line);
                break;
            case 88:
                if(line.slice(0,6).trim().length === 6){
                    this.addCommune(line);
                } else {
                    if(this.active_direction == ""){
                        //Initialise le 1er departement
                        this.active_direction = this.getDirectionCode(line);
                    }
                    if(this.active_direction !== "" && this.getDirectionCode(line) !== this.active_direction){
                        //On enregistre des qu'on passe au departement suivant...
                        console.log('CodeDirection:', this.active_direction)
                        this.save();
                        this.active_direction = this.getDirectionCode(line)
                    }
                    this.addDepartement(line);
                }
                break;
            case 150:
                this.save();
                break;
            default:
                this.addVoie(line);
                break;
        }
    }
    private save():void{
        let saver = new FANTOIR_SAVER(pathResolver(this.path, this.active_direction));
        saver.save(this.direction, this.fichier);
    }
}

class FANTOIR_SAVER {
    private path: string;

    constructor(path:string){
        this.path = path;
    }
    private pathToDepartement(): string;
    private pathToDepartement(additive: string): string;
    private pathToDepartement(additive?:string): string{
        if(additive && typeof additive === "string"){
            return pathResolver(this.path, additive);
        } else {
            return pathResolver(this.path);
        }
    }
    public save(datas:FANTOIR_Direction, fichier: FANTOIR_FICHIER): void{
        if(!datas){ throw new Error('Method called with no param'); }
        let toSave = {
            fichier: fichier,
            elements: datas
        }

        let path = this.pathToDepartement();
        fs.mkdir(path, (err) => {
            if(err) throw err;
            fs.writeFile(this.pathToDepartement('data.json'), JSON.stringify(toSave), (err) => {
                if(err) throw err;
                console.info('Le fichier a été généré dans ', path)
            })
        })
    }
}

export * from './fantoir';
