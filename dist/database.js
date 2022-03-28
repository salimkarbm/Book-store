"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1["default"].config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_DB = _a.POSTGRES_DB, POSTGRES_TEST_DB = _a.POSTGRES_TEST_DB, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD, NODE_ENV = _a.NODE_ENV, POSTGRES_PORT = _a.POSTGRES_PORT;
var connectionString = "postgresql://".concat(POSTGRES_USER, ":").concat(POSTGRES_PASSWORD, "@").concat(POSTGRES_HOST, ":").concat(POSTGRES_PORT, "/").concat(POSTGRES_DB);
var client;
if (NODE_ENV === 'test') {
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_TEST_DB,
        password: POSTGRES_PASSWORD
    });
}
else {
    client = new pg_1.Pool({ connectionString: connectionString });
}
exports["default"] = client;
