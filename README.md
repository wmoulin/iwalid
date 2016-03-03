# IWALID

## Présentation

module de validation de beans JavaScript. Ce module propose deux modes de fonctionnement, une validation direct synchrone et un autre sous forme de promesse.
L'application des validateurs sur les beans, peut se faire soit en utilisant des décorateurs, soit par configuration dite externe avec un simple oject, qui pourra donc
être un flux json.

## Principe de fonctionnement

L'application du décorateur sur la classe permet d'ajouter la méthode *validate*, qui parcours l'ensemble des validations ajoutées.

## Les validateurs

### Obligatoire

### Date

### Pattern

### Nombre

### Email

## Mise en oeuvre

### configuration

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
  get name() { return this._name };
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
