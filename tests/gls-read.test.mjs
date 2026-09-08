import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const here = new URL('..', import.meta.url).pathname;
const cli = join(here, 'bin/gls');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'gls-read-'));
  await writeFile(join(root, 'package.json'), '{"name":"great-library-of-siso","type":"module"}\n');
  await mkdir(join(root, 'site/works/demo'), { recursive: true });
  await mkdir(join(root, 'registry/works'), { recursive: true });
  await mkdir(join(root, '.agents/tasks/backlog/TASK-0001'), { recursive: true });
  const registry = Buffer.from('{"record_type":"work","id":"gls:work:1"}\n');
  await writeFile(join(root, 'registry/works/demo.json'), registry);
  const selection = { state: 'selected' }, owner_entry = { state: 'not_recorded' };
  const dossier = { work_id: 'gls:work:1', slug: 'demo', name: 'Demo Work', selection, selected_release: null, owner_entry };
  await writeFile(join(root, 'site/works/demo/index.json'), JSON.stringify(dossier));
  await writeFile(join(root, '.agents/tasks/backlog/TASK-0001/task.json'), JSON.stringify({ id: 'TASK-0001', title: 'Read it', status: 'backlog', priority: 'high', spec: { acceptance_criteria: ['Do it'] }, execution_log: [] }));
  const sourceInputs = [{ path: 'registry/works/demo.json', sha256: hash(registry) }];
  await writeFile(join(root, 'site/catalog.json'), JSON.stringify({ works: [{ id: 'gls:work:1', slug: 'demo', name: 'Demo Work', summary: 'A searchable example', type: 'project', section: 'Research', agent_context_url: '/works/demo/index.json', selection, selected_release: null, owner_entry }], source_inputs: sourceInputs }));
  return root;
}
function run(root, ...args) { return spawnSync(process.execPath, [cli, ...args, '--root', root], { encoding: 'utf8' }); }
async function check(name, fn) { const root = await fixture(); try { await fn(root); } finally { await rm(root, { recursive: true, force: true }); } console.log(`PASS gls read: ${name}`); }

await check('exact inspect and bounded multiword search', async root => {
  const search = run(root, 'search', 'demo searchable', '--limit', '1');
  assert.equal(search.status, 0, search.stderr); assert.equal(JSON.parse(search.stdout).matches.length, 1);
  const inspect = run(root, 'inspect', 'gls:work:1');
  assert.equal(inspect.status, 0, inspect.stderr); assert.equal(JSON.parse(inspect.stdout).dossier.work_id, 'gls:work:1');
});
await check('tasks are compact and read-only', async root => {
  const before = await readFile(join(root, '.agents/tasks/backlog/TASK-0001/task.json'), 'utf8');
  const result = run(root, 'tasks'); assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).tasks[0].id, 'TASK-0001');
  assert.equal(await readFile(join(root, '.agents/tasks/backlog/TASK-0001/task.json'), 'utf8'), before);
  await rm(join(root, 'site/catalog.json'));
  const task = run(root, 'task', 'TASK-0001'); assert.equal(task.status, 0, task.stderr); assert.deepEqual(JSON.parse(task.stdout).task.spec.acceptance_criteria, ['Do it']);
});
await check('unsafe slug and dossier metadata mismatch fail closed', async root => {
  const catalogPath = join(root, 'site/catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  catalog.works[0].slug = '../escape';
  await writeFile(catalogPath, JSON.stringify(catalog));
  assert.notEqual(run(root, 'inspect', 'gls:work:1').status, 0);
  const clean = await fixture();
  try {
    const cleanPath = join(clean, 'site/works/demo/index.json'); const dossier = JSON.parse(await readFile(cleanPath, 'utf8')); dossier.selection = { state: 'registered_not_selected' }; await writeFile(cleanPath, JSON.stringify(dossier));
    assert.notEqual(run(clean, 'inspect', 'demo').status, 0);
  } finally { await rm(clean, { recursive: true, force: true }); }
});
await check('source drift, additions and symlinks fail closed', async root => {
  await writeFile(join(root, 'registry/works/extra.json'), '{}');
  assert.notEqual(run(root, 'search', 'demo').status, 0);
  const clean = await fixture();
  try { await symlink(join(clean, 'registry/works/demo.json'), join(clean, 'registry/works/link.json')); assert.notEqual(run(clean, 'search', 'demo').status, 0); } finally { await rm(clean, { recursive: true, force: true }); }
});
console.log('PASS gls read contract');
