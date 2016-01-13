"use strict";

/*
 type ClassDecorator = <TFunction extends Function>(target: TFunction): TFunction | void;
 type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
 type PropertyDecorator = (target: Object, propertyKey: string | symbol): void;
 type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
 */

export default function validate(target) {
    if (!target.prototype.validate) {
        target.prototype.validate = function() {
            if (target.valid) {
                for (var attrib in target.valid) {
                    target.valid[attrib].forEach((validator) => {
                        validator.bind(this)(this[attrib]);
                    });
                };
            }
        };
    }
};
