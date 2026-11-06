// Run with the R repository alongside this one, or pass its path as argument 1.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const vm = require('node:vm');
const root = join(__dirname, '..');
const rRoot = process.argv[2] ? resolve(process.argv[2]) : join(root, '..', 'GOLDBioAge');
const csv = readFileSync(join(rRoot, 'inst/extdata/published_coefficients.csv'), 'utf8').trim().split(/\r?\n/);
const header = csv.shift().split(',');
const reference = csv.map(line => Object.fromEntries(line.split(',').map((v, i) => [header[i], v])));
const rTable = readFileSync(join(rRoot, 'Coefficients.md'), 'utf8');
const webTable = readFileSync(join(root, 'README.md'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1]).find(source => source.includes('const formulas'));
const context = vm.createContext({});
vm.runInContext(script.split('// State Management')[0] + '\nthis.formulas = formulas;', context);
const formulas = context.formulas;
const ids = { age: 'age', creat: 'crea', glucose_mmol: 'glu', mcv: 'mcv', rdw: 'rdw',
    albumin: 'alb', alp: 'alp', lymph: 'lym', wbc: 'wbc', ggt: 'ggt', log_crp: 'crp' };
const labels = { age: 'Age', creat: 'CREA', glucose_mmol: 'GLU', mcv: 'MCV', rdw: 'RDW',
    albumin: 'ALB', alp: 'ALP', lymph: 'LYM%', wbc: 'WBC', ggt: 'GGT', log_crp: 'Log CRP', beta0: 'Constant (β0)' };
function near(a, b, tol = 1e-9) { assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`); }
function rows(text) { return text.split('\n').filter(l => l.startsWith('|')).map(l => l.split('|').slice(1, -1).map(c => c.trim())); }
const goldR = rows(rTable.split('**Table 1.')[1].split('For NHANES,')[0]);
const lightR = rows(rTable.split('**Table 2.')[1].split('The logarithm')[0]);
const goldWeb = rows(webTable.split('**Table 1.')[1].split('Table 1 displays')[0]);
const lightWeb = rows(webTable.split('**Table 2.')[1].split('Due to its non-normal')[0]);
for (const x of reference) {
    const gold = x.model === 'gold';
    const datasetIndex = ['nhanes', 'ukb', 'charls'].indexOf(x.dataset);
    const rRows = gold ? goldR : lightR;
    const rRow = rRows.find(r => gold ? r[1] === `\`${x.term}\`` : r[0].endsWith(`/ \`${x.term}\``));
    assert.ok(rRow, `Missing R table row: ${x.term}`);
    near(Number(rRow[gold ? 4 + datasetIndex : 2 + 2 * datasetIndex]), Number(x.coefficient), 0.00005001);
    const webRow = (gold ? goldWeb : lightWeb).find(r => r[0] === labels[x.term]);
    assert.ok(webRow, `Missing calculator table row: ${x.term}`);
    near(Number(webRow[gold ? 3 + datasetIndex : 3 + 2 * datasetIndex]), Number(x.coefficient), 0.00005001);
    if (x.dataset === 'charls') continue; // Calculator offers NHANES and UKB only.
    const zero = Object.fromEntries(Object.values(ids).map(id => [id, 0]));
    const baseline = formulas[x.dataset][x.model](zero);
    const value = x.term === 'log_crp' ? Math.expm1(1) / (x.input_unit === 'mg/L' ? 10 : 1) : 1;
    const actual = x.term === 'beta0' ? baseline
        : formulas[x.dataset][x.model]({ ...zero, [ids[x.term]]: value }) - baseline;
    near(actual, Number(x.coefficient));
}
// Deterministic varied inputs independently evaluated from the R coefficient CSV.
let state = 20261106;
const random = () => ((state = (1664525 * state + 1013904223) >>> 0) / 2 ** 32);
let calculations = 0;
for (const dataset of ['nhanes', 'ukb']) for (const model of ['gold', 'light']) {
    const beta = reference.filter(x => x.dataset === dataset && x.model === model);
    for (let i = 0; i < 200; i++) {
        const v = { age: 20 + 80 * random(), crea: 0.4 + 3 * random(), glu: 3 + 15 * random(),
            mcv: 65 + 50 * random(), rdw: 9 + 12 * random(), alb: 2 + 3 * random(),
            alp: 20 + 250 * random(), lym: 100 * random(), wbc: 1 + 20 * random(),
            ggt: 5 + 300 * random(), crp: 5 * random() };
        const expected = beta.reduce((sum, x) => sum + Number(x.coefficient) * (
            x.term === 'beta0' ? 1 : x.transformation === 'log1p'
                ? Math.log1p(v.crp * (x.input_unit === 'mg/L' ? 10 : 1)) : v[ids[x.term]]), 0);
        near(formulas[dataset][model](v), expected);
        calculations++;
    }
}
console.log(`Verified all ${reference.length} reference terms in both Markdown tables, all 32 calculator terms, and ${calculations} varied calculator inputs.`);
