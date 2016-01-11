"use strict";

/*
 type ClassDecorator = <TFunction extends Function>(target: TFunction): TFunction | void;
 type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
 type PropertyDecorator = (target: Object, propertyKey: string | symbol): void;
 type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number): void;
 */

export default function validate(target) {
    if (!target.prototype.validate) {
        target.prototype.validate = function () {
            var _this = this;

            if (this.valid) {
                for (var attrib in this.valid) {
                    this.valid[attrib].forEach(function (validator) {
                        validator.bind(_this)(_this[attrib]);
                    }, this);
                };
            }
        };
    };
};
