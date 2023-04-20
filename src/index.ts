import * as process from "child_process";
import * as tls from "tls";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const certFilePath = path.join(__dirname, "cert.pem");
const npmregistryUrl = "https://registry.npmjs.org/";

// 读取当前目录下的config.json文件, 如果没有则创建
if (!fs.existsSync(path.join(__dirname, "config.json"))) {
  fs.writeFileSync(
    path.join(__dirname, "config.json"),
    JSON.stringify({
      wchatRobotToken: "",
      logFile: "",
    })
  );
}

const config = require("../config.json");

/**
 * 创建证书文件
 */
function createPem() {
  const tlsData = tls.rootCertificates.join("\n");
  fs.writeFileSync(certFilePath, tlsData);
}

/**
 * 删除证书文件
 */
function removePem() {
  fs.unlinkSync(certFilePath);
}

/**
 * 获取npm的registry
 * @returns
 */
async function getNpmRegistrySync() {
  return await new Promise((resolve, reject) => {
    process.exec(
      "npm config get registry",
      { encoding: "utf-8" },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

/**
 * 设置npm的registry
 * @param {*} npmregistry
 * @returns
 */
async function setNpmRegistrySync(npmregistry) {
  return await new Promise((resolve, reject) => {
    process.exec(
      `npm config set registry ${npmregistry}`,
      { encoding: "utf-8" },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

/**
 * 执行npm audit
 * @returns
 */
async function runAuditSync() {
  return await new Promise((resolve, reject) => {
    process.exec(
      "npm audit",
      { encoding: "utf-8" },
      (error, stdout, stderr) => {
        if (stdout) {
          const rulestArr = stdout.split("\n");
          const highSeverityArr = [];
          const isSussecc = stdout.includes("found 0 vulnerabilities");
          rulestArr.forEach((item, index) => {
            if (item.includes("Severity: high")) {
              highSeverityArr.push([
                rulestArr[index - 1],
                rulestArr[index],
                rulestArr[index + 1],
              ]);
            }

            if (item.includes("high severity vulnerabilities")) {
              highSeverityArr.push(rulestArr[index]);
            }
          });

          fs.writeFile(
            config.logFile || path.join(__dirname, "auditReport.log"),
            stdout,
            (err) => {
              if (err) {
                console.log("日志文件创建失败！！");
                reject({});
              }
            }
          );

          const allRulest = highSeverityArr.pop();

          const codes = highSeverityArr
            .map((item) => {
              if (typeof item === "string") {
                return "`" + item + "`";
              } else {
                return (
                  item.map((item) => "`" + item + "`").join("\r\n") +
                  "\r\n---------------------\r\n"
                );
              }
            })
            .join("\r\n");

          const option = {
            msgtype: "markdown",
            markdown: {
              content: [
                `<font color="info">执行npm audit结果</font>`,
                codes,
                isSussecc
                  ? `<font color="info">${stdout}</font>`
                  : `<font color="info">${allRulest || "执行异常"}</font>`,
              ].join("\r\n"),
            },
          };

          // 存在token则发送消息
          if (config.wchatRobotToken) {
            createPem();
            const req = https.request(
                {
                  protocol: "https:",
                  hostname: "qyapi.weixin.qq.com",
                  path: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${config.wchatRobotToken}`,
                  port: 443,
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }, (res) => {}
              )
              .on("error", (err) => {
                console.log("Error: ", err.message);
              });
            req.write(JSON.stringify(option));
            req.end();
          } else {
            resolve({});
          }
        }
      }
    );
  });
}

/**
 * 执行入口
 */
async function ready() {
  // 1. 先获取当前npm的registry
  const registryName = await getNpmRegistrySync();
  try {
    console.log("获取registryName:: ", registryName);
    const isChangeRegistryName = registryName !== npmregistryUrl;
    if (isChangeRegistryName) {
      console.log("设置registryName:: ", npmregistryUrl);
      await setNpmRegistrySync(npmregistryUrl);
    }

    // 2. 执行npm audit
    console.log("执行npm audit:: ");
    await runAuditSync();

    // 3. 执行完毕后，恢复npm的registry
    if (isChangeRegistryName) {
      console.log("恢复registryName:: ", registryName);
      await setNpmRegistrySync(registryName);
    }
  } catch (error) {
    // 异常回滚
    console.log("异常回滚 registryName:: ", registryName);
    await setNpmRegistrySync(registryName);
  }
}

async function setConfig(name, cmd) {
  fs.readFile(path.join(__dirname, "./config.json"), (err, data) => {
    if (err) {
      console.log("读取配置文件失败");
      return;
    }
    const config = JSON.parse(String(data));
    config[name] = cmd;
    fs.writeFileSync("./config.json", JSON.stringify(config));
    console.log("Success!");
  });
}

export default { ready, setConfig };
