const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PACKAGE_NAME = pkg.name;
const PACKAGE_VERSION = pkg.version;

const WPS_PACKAGE_APP_ID = 'com.tenderer.exam';

const WORK_DIR = process.cwd();
const DOCKER_IMAGE_NAME = `${PACKAGE_NAME}:${PACKAGE_VERSION}`;
const SOURCE_FILE_NAME = `service-${WPS_PACKAGE_APP_ID}-${`1.0.0`}`;

async function ifExistThenDelete(path) {
  if (fs.existsSync(path)) {
    await new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// 构建镜像
async function buildDockerImage() {
  console.log('-> 构建镜像');
  await new Promise((resolve, reject) => {
    const cmd = spawn('docker', ['build', './', '-t', DOCKER_IMAGE_NAME], {
      cwd: WORK_DIR,
      shell: 'powershell',
      stdio: 'inherit',
    });
    cmd.on('close', (code) => {
      if (code !== 0) reject(new Error('构建镜像失败'));
      else resolve();
    });
  });
}

// 存储镜像
async function saveDockerImage() {
  console.log('-> 存储镜像');
  await new Promise((resolve, reject) => {
    const cmd = spawn(
      'docker',
      [
        'save',
        '-o',
        path.join(WORK_DIR, `/build/__ca-builder/${SOURCE_FILE_NAME}`),
        DOCKER_IMAGE_NAME,
      ],
      {
        cwd: WORK_DIR,
        shell: 'powershell',
        stdio: 'inherit',
      }
    );
    cmd.on('close', (code) => {
      if (code !== 0) reject(new Error('存储镜像失败'));
      else resolve();
    });
  });
}

async function zipCAFile() {
  console.log('-> 生成 CA 文件');
  const target = path.join(
    WORK_DIR,
    `/build/components/${WPS_PACKAGE_APP_ID}.ca`
  );
  await ifExistThenDelete(target);
  await new Promise((resolve, reject) => {
    const cmd = spawn(
      'Compress-Archive',
      [
        '-Path',
        ['./__ca-builder/meta.json', `./__ca-builder/${SOURCE_FILE_NAME}`].join(
          ','
        ),
        '-DestinationPath',
        target,
      ],
      {
        cwd: path.join(WORK_DIR, '/build'),
        shell: 'powershell',
        stdio: 'inherit',
      }
    );
    cmd.on('close', (code) => {
      if (code !== 0) reject(new Error('生成 CA 文件失败'));
      else resolve();
    });
  });
}

async function zipCAPFile() {
  console.log('-> 生成 CAP 文件');
  const target = path.join(WORK_DIR, `./build/${WPS_PACKAGE_APP_ID}.cap`);
  await ifExistThenDelete(target);
  await new Promise((resolve, reject) => {
    const cmd = spawn(
      'Compress-Archive',
      [
        '-Path',
        ['./components', './META', './licenceMap.json', './manifest.json'].join(
          ','
        ),
        '-DestinationPath',
        target,
      ],
      {
        cwd: path.join(WORK_DIR, '/build'),
        shell: 'powershell',
        stdio: 'inherit',
      }
    );
    cmd.on('close', (code) => {
      if (code !== 0) reject(new Error('生成 CAP 文件失败'));
      else resolve();
    });
  });
}

async function clean() {
  await Promise.all(
    [
      path.join(WORK_DIR, `/build/__ca-builder/${SOURCE_FILE_NAME}`),
      path.join(WORK_DIR, `/build/components/${WPS_PACKAGE_APP_ID}.ca`),
    ].map((file) => new Promise((resolve) => fs.unlink(file, resolve)))
  );
}

async function main() {
  await buildDockerImage();
  await saveDockerImage();
  await zipCAFile();
  await zipCAPFile();
  // await clean();
  console.log(path.resolve(WORK_DIR, `build/${WPS_PACKAGE_APP_ID}.cap`));
}

main().catch((reason) => {
  console.error(reason);
  process.exit(1);
});
