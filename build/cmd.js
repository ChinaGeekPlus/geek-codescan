#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var index_1 = __importDefault(require("./index"));
commander_1.program
    .name('geek-codeScan')
    .description([
    '执行gcs run进行代码扫描, 最终输出至日志中, 或是发送到企业微信机器人中',
    '执行gcs config <setKey> <setValue>进行配置项设置',
    '或是使用 import gcs from "geek-codeScan" 嵌入到代码中进行使用'
].join('\r\n'))
    .version('0.0.1');
commander_1.program
    .command('config <setKey> <setValue>')
    .description([
    '设置当前工具的配置项',
    '目前可以设置 wchatRobotToken 为企业微信机器人的token, 不设置将不会给微信机器人发消息',
    'logFile 为日志文件的路径, 不设置将会在当前目录下生成auditReport.log文件',
].join('\r\n'))
    .action(function (name, cmd) {
    index_1.default.setConfig(name, cmd);
});
commander_1.program
    .command('run')
    .description('执行代码检查')
    .action(function (name, cmd) {
    index_1.default.ready();
});
//解析用户传入的命令
commander_1.program.parse(process.argv);
