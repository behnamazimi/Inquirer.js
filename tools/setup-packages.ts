import path from 'node:path';
import fs from 'node:fs/promises';
import { globby } from 'globby';
import { fixPeerDeps } from '@repo/hoist-peer-dependencies';

interface Repository {
  type?: string;
  url?: string;
}

interface PublishConfig {
  access?: string;
  exports?: Record<string, unknown>;
}

interface TsConfig {
  extends?: string;
  include?: string[];
  exclude?: string[];
  compilerOptions?: {
    outDir?: string;
    [key: string]: unknown;
  };
}

interface PackageJson {
  engines?: Record<string, string>;
  author?: string;
  license?: string;
  repository?: Repository;
  keywords?: string[];
  sideEffects?: boolean;
  publishConfig?: PublishConfig;
  homepage?: string;
  files?: string[];
  scripts?: Record<string, string>;
  exports?: Record<string, unknown>;
  main?: string;
  types?: string;
  module?: string;
  tshy?: unknown;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
}

function readFile(filepath: string) {
  return fs.readFile(filepath, 'utf8');
}

function readJSONFile(filepath: string): Promise<PackageJson> {
  return readFile(filepath).then((content) => JSON.parse(content) as PackageJson);
}

function readTsConfigFile(filepath: string): Promise<TsConfig> {
  return readFile(filepath).then((content) => JSON.parse(content) as TsConfig);
}

function fileExists(filepath: string) {
  return fs.access(filepath).then(
    () => true,
    () => false,
  );
}

async function writeFile(filepath: string, content: string) {
  if (!(await fileExists(filepath)) || (await readFile(filepath)) !== content) {
    await fs.writeFile(filepath, content);
  }
}

const versions: Record<string, string> = {};
const rootPkg = await readJSONFile(path.join(import.meta.dirname, '../package.json'));
const paths = await globby(['packages/**/package.json', '!**/node_modules']);

void Promise.all(
  paths.map(async (pkgPath) => {
    const pkg = await readJSONFile(pkgPath);

    // Collect all dependencies versions
    Object.assign(versions, pkg.devDependencies, pkg.dependencies);

    return [pkgPath, pkg] as const;
  }),
).then(async (packages) => {
  for (const [pkgPath, pkg] of packages) {
    const dir = path.dirname(pkgPath);
    (fixPeerDeps as (target: string) => void)(path.resolve(path.join(dir)));

    const isTS = await fileExists(path.join(dir, 'src/index.ts'));
    const hasReadme = await fileExists(path.join(dir, 'README.md'));

    // Replicate configs that should always be the same.
    pkg.engines = rootPkg.engines;
    pkg.author = rootPkg.author;
    pkg.license = rootPkg.license;
    pkg.repository = rootPkg.repository;
    pkg.keywords = [...new Set([...(rootPkg.keywords ?? []), ...(pkg.keywords ?? [])])];
    pkg.sideEffects = pkg.sideEffects ?? false;
    pkg.publishConfig = { access: 'public' };

    if (hasReadme) {
      const repoPath = dir.split('/').slice(-2).join('/');
      pkg.homepage = `https://github.com/SBoudrias/Inquirer.js/blob/main/${repoPath}/README.md`;
    }

    if (isTS) {
      pkg.files = ['dist'];

      pkg.scripts = pkg.scripts ?? {};
      pkg.scripts['tsc'] = 'tsc -p tsconfig.json';

      const tsconfig: TsConfig = (await fileExists(path.join(dir, 'tsconfig.json')))
        ? await readTsConfigFile(path.join(dir, 'tsconfig.json'))
        : { extends: '@repo/tsconfig' };
      tsconfig.include = ['src'];
      tsconfig.exclude = ['src/**/*.test.ts'];
      tsconfig.compilerOptions = tsconfig.compilerOptions ?? {};
      tsconfig.compilerOptions.outDir = 'dist';

      pkg.exports = {
        ...pkg.exports,
        './package.json': './package.json',
        '.': './src/index.ts',
      };

      pkg.publishConfig = pkg.publishConfig ?? {};
      pkg.publishConfig.exports = {} as Record<string, unknown>;
      for (const [exportName, value] of Object.entries(pkg.exports)) {
        if (typeof value === 'string') {
          const { dir, name, ext } = path.parse(value);
          const distDir = dir.replace(/^\.\/src/, './dist');

          if (ext === '.ts') {
            pkg.publishConfig.exports[exportName] = {
              types: path.join(distDir, name + '.d.ts'),
              default: path.join(distDir, name + '.js'),
            };
          } else {
            pkg.publishConfig.exports[exportName] = path.join(distDir, name + ext);
          }
        }
      }

      // Remove legacy exports definitions
      pkg.main = undefined;
      pkg.types = undefined;
      pkg.module = undefined;
      pkg.tshy = undefined;

      void writeFile(
        path.join(dir, 'tsconfig.json'),
        JSON.stringify(tsconfig, null, 2) + '\n',
      );

      if (tsconfig.extends === '@repo/tsconfig') {
        pkg.devDependencies = pkg.devDependencies ?? {};
        pkg.devDependencies['@repo/tsconfig'] = 'workspace:*';
      }
    }

    void writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
});
