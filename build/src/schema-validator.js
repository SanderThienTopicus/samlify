"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var SchemaValidators;
(function (SchemaValidators) {
    SchemaValidators["JAVAC"] = "@authenio/xsd-schema-validator";
    SchemaValidators["LIBXML"] = "libxml-xsd";
    SchemaValidators["XMLLINT"] = "node-xmllint";
})(SchemaValidators || (SchemaValidators = {}));
var moduleResolver = function (name) {
    try {
        require.resolve(name);
        return name;
    }
    catch (e) {
        return null;
    }
};
var getValidatorModule = function () { return __awaiter(_this, void 0, void 0, function () {
    var selectedValidator, xsd, setSchemaDir, validator, mod_1, mod_2, mod_3, schemaPath, schemaProto_1, schemaAssert_1, schemaXmldsig_1, schemaXenc_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                selectedValidator = moduleResolver(SchemaValidators.JAVAC)
                    || moduleResolver(SchemaValidators.LIBXML)
                    || moduleResolver(SchemaValidators.XMLLINT) || '';
                xsd = 'saml-schema-protocol-2.0.xsd';
                if (!(selectedValidator === SchemaValidators.JAVAC)) return [3 /*break*/, 2];
                setSchemaDir = function (v) {
                    var schemaDir;
                    try {
                        schemaDir = path.resolve(__dirname, '../schemas');
                        fs.accessSync(schemaDir, fs.constants.F_OK);
                    }
                    catch (err) {
                        // for built-from git folder layout
                        try {
                            schemaDir = path.resolve(__dirname, '../../schemas');
                            fs.accessSync(schemaDir, fs.constants.F_OK);
                        }
                        catch (err) {
                            //console.warn('Unable to specify schema directory', err);
                            // QUESTION should this be swallowed?
                            console.error(err);
                            throw new Error('ERR_FAILED_FETCH_SCHEMA_FILE');
                        }
                    }
                    v.cwd = schemaDir;
                    v.debug = process.env.NODE_ENV === 'test';
                    return v;
                };
                return [4 /*yield*/, Promise.resolve().then(function () { return require(SchemaValidators.JAVAC); })];
            case 1:
                validator = _a.sent();
                mod_1 = setSchemaDir(new validator());
                return [2 /*return*/, {
                        validate: function (xml) {
                            return new Promise(function (resolve, reject) {
                                mod_1.validateXML(xml, xsd, function (err, result) {
                                    if (err) {
                                        console.error('[ERROR] validateXML', err);
                                        return reject('ERR_EXCEPTION_VALIDATE_XML');
                                    }
                                    if (result.valid) {
                                        return resolve('SUCCESS_VALIDATE_XML');
                                    }
                                    return reject('ERR_INVALID_XML');
                                });
                            });
                        }
                    }];
            case 2:
                if (!(selectedValidator === SchemaValidators.LIBXML)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.resolve().then(function () { return require(SchemaValidators.LIBXML); })];
            case 3:
                mod_2 = _a.sent();
                return [2 /*return*/, {
                        validate: function (xml) {
                            return new Promise(function (resolve, reject) {
                                // https://github.com/albanm/node-libxml-xsd/issues/11
                                process.chdir(path.resolve(__dirname, '../schemas'));
                                mod_2.parseFile(path.resolve(xsd), function (err, schema) {
                                    if (err) {
                                        console.error('[ERROR] validateXML', err);
                                        return reject('ERR_INVALID_XML');
                                    }
                                    schema.validate(xml, function (techErrors, validationErrors) {
                                        if (techErrors !== null || validationErrors !== null) {
                                            console.error("this is not a valid saml response with errors: " + validationErrors);
                                            return reject('ERR_EXCEPTION_VALIDATE_XML');
                                        }
                                        return resolve('SUCCESS_VALIDATE_XML');
                                    });
                                });
                            });
                        }
                    }];
            case 4:
                if (!(selectedValidator === SchemaValidators.XMLLINT)) return [3 /*break*/, 6];
                return [4 /*yield*/, Promise.resolve().then(function () { return require(SchemaValidators.XMLLINT); })];
            case 5:
                mod_3 = _a.sent();
                schemaPath = function (schema) { return path.resolve(__dirname, "../schemas/" + schema); };
                schemaProto_1 = fs.readFileSync(schemaPath(xsd), 'utf-8');
                schemaAssert_1 = fs.readFileSync(schemaPath('saml-schema-assertion-2.0.xsd'), 'utf-8');
                schemaXmldsig_1 = fs.readFileSync(schemaPath('xmldsig-core-schema.xsd'), 'utf-8');
                schemaXenc_1 = fs.readFileSync(schemaPath('xenc-schema.xsd'), 'utf-8');
                // file fix for virtual filesystem of emscripten
                schemaProto_1 = schemaProto_1.replace('saml-schema-assertion-2.0.xsd', 'file_0.xsd');
                schemaProto_1 = schemaProto_1.replace('xmldsig-core-schema.xsd', 'file_1.xsd');
                schemaAssert_1 = schemaAssert_1.replace('xmldsig-core-schema.xsd', 'file_1.xsd');
                schemaAssert_1 = schemaAssert_1.replace('xenc-schema.xsd', 'file_2.xsd');
                schemaXenc_1 = schemaXenc_1.replace('xmldsig-core-schema.xsd', 'file_1.xsd');
                return [2 /*return*/, {
                        validate: function (xml) {
                            return new Promise(function (resolve, reject) {
                                var validationResult = mod_3.validateXML({
                                    xml: xml,
                                    schema: [schemaAssert_1, schemaXmldsig_1, schemaXenc_1, schemaProto_1]
                                });
                                if (!validationResult.errors) {
                                    return resolve('SUCCESS_VALIDATE_XML');
                                }
                                console.error("this is not a valid saml response with errors: " + validationResult.errors);
                                return reject('ERR_EXCEPTION_VALIDATE_XML');
                            });
                        }
                    }];
            case 6:
                // allow to skip the validate function if it's in development or test mode if no schema validator is provided
                if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
                    return [2 /*return*/, {
                            validate: function (_xml) {
                                return new Promise(function (resolve, _reject) { return resolve('SKIP_XML_VALIDATION'); });
                            }
                        }];
                }
                throw new Error('ERR_UNDEFINED_SCHEMA_VALIDATOR_MODULE');
        }
    });
}); };
exports.getValidatorModule = getValidatorModule;
//# sourceMappingURL=schema-validator.js.map