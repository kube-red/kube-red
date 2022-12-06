"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("./lower-case/controller"));
function default_1(RED) {
    (0, controller_1.default)(RED);
}
exports.default = default_1;
