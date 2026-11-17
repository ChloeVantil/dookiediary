const { spawn } = require('child_process');
const os = require('os');

const apiUrl = 'http://localhost:3001';
const frontendUrl = 'http://localhost:4173';

function start(command, args, label, color) {
  const child = spawn(command, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
  });

  const print = (chunk) => {
    const text = chunk.toString();
    if (!text) return;
    process.stdout.write(`[${label}] ${text}`);
  };

  child.stdout.on('data', print);
  child.stderr.on('data', print);

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`\n[${label}] exited from signal ${signal}`);
      return;
    }

    console.log(`\n[${label}] exited with code ${code}`);
    process.exit(code || 0);
  });

  return child;
}

const api = start('node', ['server/app.js'], 'api', 'blue');
const web = start('python3', ['-m', 'http.server', '4173', '--directory', '.'], 'web', 'green');

const launchBrowser = () => {
  const platform = process.platform;
  let command = null;

  if (platform === 'darwin') {
    command = `open ${frontendUrl}`;
  } else if (platform === 'win32') {
    command = `start ${frontendUrl}`;
  } else {
    command = `xdg-open ${frontendUrl}`;
  }

  const opener = spawn(command, { stdio: 'ignore', shell: true, detached: true });
  opener.unref();
};

setTimeout(() => {
  console.log('\n========================================');
  console.log('App ready. Open the web app here:');
  console.log(frontendUrl);
  console.log('API health check:');
  console.log(`${apiUrl}/health`);
  console.log('========================================\n');
  launchBrowser();
}, 2500);

const shutdown = () => {
  api.kill('SIGTERM');
  web.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
