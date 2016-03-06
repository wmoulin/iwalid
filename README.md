# IWALID

## Présentation

module de validation de beans JavaScript. Ce module propose deux modes de fonctionnement, une validation direct synchrone et une autre sous forme de promesses.
L'application des validateurs sur les beans, peut se faire soit en utilisant des décorateurs, soit par configuration dite externe avec un simple oject, qui pourra donc
être un flux json.

## Principe de fonctionnement

L'application du décorateur sur la classe permet d'ajouter la méthode `validate`, qui parcours l'ensemble des validations ajoutées. Cette méthode appelle soit les validateurs directement soit renvoit une promesse. Les erreurs de validation `ValidatorError` sont englobées dans une seul erreur `ValidationError`.

## Les validateurs

### Obligatoire

### Date

### Pattern

### Nombre

### Email

## Mise en oeuvre

### configuration

Tous les validateurs ont en paramètre optionel, un object de configuration `ValidatorConfiguration`

| nom        | description           | valeur par défaut  | règles
| ---------- | --------------------- | ------------------ | ------------------ |
| index | permet de préciser l'odre de passage des validations. | undefined  | si aucun, index courant dans le groupe
| groupIndex | permet de préciser un groupement de validation. | undefined | si aucun, on ratache le validateur au groupe 0
| propName | nom de la propriété dans l'objet | undefined | on met le nom de la propriété issu du descriptor |
| stopOnError | indicateur pour arrêter la validation en cas d'erreur | false | |
| nextOnError | indicateur de passage au groupe suivant en cas d'erreur | true | |
| message | message de l'erreur | undefined | Si aucun, un message par défaut est définit dans chaque validateur |
| extra | objet tout venant | undefined | <br> |

Cet objet est rajouté comme attribut de l'erreur de validation ce qui permettra de l'exploiter en cas d'erreur de validation, pour par exemple l'internationalisation des messages.

L'ordre de validation est le suivant :
1. groupe >= 1 : si l'nidicateur stopOnError on arrete, nextOnError on passe au groupe suivant.
2. groupe 0 : stopOnError on arrete, nextOnError validation suivante, donc stopOnError et nextOnError on des concéquences identiques pour ce groupe 0.

### Utilisation des décorateurs

#### Sur les classes

@validateCallFct()
@requiredValidators.required({propName: "name"})
@requiredValidators.required({propName: "password"})
class UserBis {}


#### Sur les getter

@validateCallFct()
class UserBis {
  ...
  @requiredValidators.required()
  get name() { return this.\_name };
}

#### Sur les attributs

@validateCallFct()
class UserTer {

  @requiredValidators.required()
  name = "";

  @requiredValidators.notEmpty()
  password = "";
}



#### Sur les fonctions

@validateCallFct()
class UserTer {
  ...
  @requiredValidators.notEmpty({index: 0, propName: "param", message: ""})
  @requiredValidators.required({index: 0, propName: "param", message: ""})
}

### Configuration externe

ValidatorLoader.applyExternalConfValidator(confExt, monBean);

{
  "__validator__": {
    "modePromise": false,
    "__instance__": ["required"],
    "__properties__" : {
      "name": ["required"],
      "password": [{"name": "notEmpty"}],
      "contact": {
        "__validator__": {
          "__instance__": ["required"],
          "__properties__" : {
            "email": ["notEmpty"]
          }
        }
      }
    }
  }
}

### Lancement de la validation

monBean.validate()
