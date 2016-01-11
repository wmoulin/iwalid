"use strict";

export function required(target, key, descriptor) {
    if (!target.valid) {
        target.valid = {};
    }

    if (!target.valid[key]) {
        target.valid[key] = [];
    }

    target.valid[key].push(function (value) {
        if (!value) {
            throw new Error(key + " : required validator error !!!");
        }
    });
};

export function notEmpty(target, key, descriptor) {
    if (!target.valid) {
        target.valid = {};
    }

    if (!target.valid[key]) {
        target.valid[key] = [];
    }

    target.valid[key].push(function (value) {
        if (!value) {
            throw new Error(key + " : required validator error !!!");
        } else {
            if (!(value instanceof String)) {
                throw new Error(key + " : required.notEmpty validator only for string !!!");
            } else if (value === "") {
                throw new Error(key + " : required validator error !!!");
            }
        }
    });
};
