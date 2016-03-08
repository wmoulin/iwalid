# IWALID

## Présentation

module de validation de beans JavaScript. Ce module propose deux modes de fonctionnement, une validation direct synchrone et une autre sous forme de promesses.
L'application des validateurs sur les beans, peut se faire soit en utilisant des décorateurs, soit par configuration dite externe avec un simple oject, qui pourra donc
être un flux json.

## Principe de fonctionnement

L'application du décorateur sur la classe permet d'ajouter la méthode `validate`, qui parcours l'ensemble des validations ajoutées. Cette méthode appelle soit les validateurs directement soit renvoit un enchainemenet de promesses. Les erreurs de validation `ValidatorError` sont englobées dans une seul erreur `ValidationError`.

## Les validateurs

### Obligatoire

Tous ces validateurs prennent q'un seul paramètre, un objet de configuration.

+ required : la valeur doit être définie.
+ notEmpty : ne s'applique qu'aux string et elle ne doivent pas être vides.

### Date

Tous ces validateurs prennent deux paramètres, la date de référence et un objet de configuration

+ equal
+ after
+ afterOrEqual
+ before
+ beforeOrEqual

### Pattern

Prend deux paramètres, le pattern et un objet de configuration

+ match

### Nombre

Tous ces validateurs prennent deux paramètres, la nombre de référence et un objet de configuration

+ equal
+ greater
+ greaterOrEqual
+ lower
+ lowerOrEqual

### Email

Prend q'un seul paramètre, un objet de configuration.

+ match : doit correspondre au pattern `[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}`

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

Pour pouvoir appliquer une configuration de validation sur un objet, il faut utliser la méthode `applyExternalConfValidator` (ValidatorLoader).

Voici une exemple de configuration :

```
{
  "__validator__": {
    "modePromise": false,
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
```

C'est l'attribut `__validator__` qui contient la déclaration des validation et qui déclenchera l'ajout potentiel de la méthode sur l'objet. `modePromise`, comme son nom l'indique, permet d'activer ou non la validation sous forme de promesses.

 `__properties__` est un objet qui permet d'ajouter les différents validateur sur les propriétés de notre bean à valider. Chaque propriété de cette objet, correspond à une de notre bean, et à pour valeur une string (nom du décorateur) pour ajouter un seul validateur sans lui passer de paramètre ou un tableau d'objet avec une propriété `name` pour le nom du décorateur et une propriété `args` qui correspond au tableau d'arguments à passer au décorateur.

  `__instance__` permet d'ajouter des validateurs sur une instance d'attribut à valider, comportant lui même d'autres attributs à aussi valider.


### Lancement de la validation

monBean.validate() qui suivant le mode est une méthode que exécute la validation directement ou qui retourne un enchainement de promesse.
