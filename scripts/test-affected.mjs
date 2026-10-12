import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const zeroSha = /^0+$/;
const remoteName = process.argv[2] || 'origin';
const vitestCli = resolve('node_modules/vitest/vitest.mjs');

function git(args, options = {}) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    ...options,
  });
}

function runVitest(args) {
  const result = spawnSync(process.execPath, [vitestCli, ...args], {
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(`Failed to start Vitest: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

function remoteBase() {
  const remoteHead = git(['symbolic-ref', '--quiet', '--short', `refs/remotes/${remoteName}/HEAD`]);
  if (remoteHead.status === 0) return remoteHead.stdout.trim();

  for (const branch of ['main', 'master']) {
    const candidate = `${remoteName}/${branch}`;
    if (git(['rev-parse', '--verify', '--quiet', candidate]).status === 0) return candidate;
  }
  return undefined;
}

async function main() {
  if (!existsSync(vitestCli)) {
    console.error('Vitest is not installed. Run `yarn install` before pushing.');
    process.exit(1);
  }

  let input = '';
  if (!process.stdin.isTTY) {
    input = await new Promise((resolveInput, reject) => {
      let value = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => (value += chunk));
      process.stdin.on('end', () => resolveInput(value));
      process.stdin.on('error', reject);
    });
  }
  const refs = input
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.trim().split(/\s+/));

  if (refs.length === 0) {
    const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']);
    const local = git(['rev-parse', 'HEAD']);
    const remote = upstream.status === 0 ? git(['rev-parse', upstream.stdout.trim()]) : undefined;
    if (local.status === 0 && remote?.status === 0) {
      refs.push(['', local.stdout.trim(), '', remote.stdout.trim()]);
    } else {
      console.log('No push range or branch upstream found; running the full unit suite.');
      runVitest(['run']);
    }
  }

  const changedFiles = new Set();
  let runFullSuite = false;

  for (const [, localSha, , remoteSha] of refs) {
    if (!localSha || zeroSha.test(localSha)) continue;

    let base = remoteSha && !zeroSha.test(remoteSha) ? remoteSha : remoteBase();
    if (!base) {
      runFullSuite = true;
      break;
    }

    const range = `${base}...${localSha}`;
    const diff = git(['diff', '--name-only', '-z', range]);
    if (diff.status !== 0) {
      runFullSuite = true;
      break;
    }
    const files = diff.stdout.split('\0').filter(Boolean);
    files.forEach((file) => changedFiles.add(file));
    if (
      files.some((file) =>
        ['package.json', 'yarn.lock', 'vite.config.ts', '.husky/pre-push'].includes(file),
      ) ||
      files.includes('scripts/test-affected.mjs')
    ) {
      runFullSuite = true;
      break;
    }

    const deleted = git(['diff', '--name-only', '-z', '--diff-filter=D', range]);
    if (deleted.status !== 0) {
      runFullSuite = true;
      break;
    }
    if (
      deleted.stdout
        .split('\0')
        .filter(Boolean)
        .some((file) => /^src\/.*\.(?:[cm]?[jt]sx?)$/i.test(file))
    ) {
      runFullSuite = true;
      break;
    }
  }

  if (runFullSuite) {
    console.log('Could not determine a complete push diff; running the full unit suite.');
    runVitest(['run']);
  }

  const sourceFiles = [];
  const testFiles = [];
  for (const file of changedFiles) {
    if (!/^src\/.*\.(?:[cm]?[jt]sx?)$/i.test(file) || !existsSync(file)) continue;
    if (/\.(?:test|spec)\.[cm]?[jt]sx?$/i.test(file)) testFiles.push(file);
    else sourceFiles.push(file);
  }

  if (testFiles.length === 0 && sourceFiles.length === 0) {
    console.log('No changed source or test files; skipping affected unit tests.');
    return;
  }

  if (testFiles.length > 0) {
    console.log(`Running changed test files:\n${testFiles.join('\n')}`);
    const result = spawnSync(process.execPath, [vitestCli, 'run', ...testFiles], {
      stdio: 'inherit',
    });
    if (result.error) {
      console.error(`Failed to start Vitest: ${result.error.message}`);
      process.exit(1);
    }
    if (result.status !== 0) process.exit(result.status ?? 1);
  }

  if (sourceFiles.length > 0) {
    console.log(`Running tests related to changed source files:\n${sourceFiles.join('\n')}`);
    runVitest(['related', '--run', '--passWithNoTests', ...sourceFiles]);
  }
}

main().catch((error) => {
  console.error('Failed to determine affected tests:', error);
  process.exit(1);
});
