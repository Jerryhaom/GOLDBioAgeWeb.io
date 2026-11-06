const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = join(__dirname, '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1]).find(source => source.includes('const formulas'));
// Evaluate the actual formula definitions, without requiring a browser or dependencies.
const context = vm.createContext({});
vm.runInContext(script.split('// State Management')[0] + '\nthis.formulas = formulas;', context);
const formulas = context.formulas;

const goldInputs = {
    age: 50, crea: 1, glu: 5, mcv: 90, rdw: 13,
    alb: 4, alp: 80, lym: 30, wbc: 7, ggt: 25
};
const lightInputs = { age: 50, crea: 1, glu: 5, crp: 0.3 };

function close(actual, expected, tolerance = 1e-10) {
    assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
}

// Frozen reference values calculated independently in R; CRP input is mg/dL.
for (const [dataset, model, inputs, expected] of [
    ['nhanes', 'gold', goldInputs, 51.102039670000003],
    ['nhanes', 'gold', {
        age: 68.5, crea: 1.32, glu: 6.75, mcv: 96.4, rdw: 15.2,
        alb: 3.85, alp: 112.3, lym: 17.6, wbc: 10.4, ggt: 85.2
    }, 89.533644373000016],
    ['ukb', 'gold', goldInputs, 50.747200000000007],
    ['nhanes', 'light', lightInputs, 50.439978417530952],
    ['ukb', 'light', lightInputs, 53.382622562072712]
]) {
    test(`${dataset} ${model}: reference result ${expected}`, () => {
        close(formulas[dataset][model](inputs), expected);
    });
}

test('NHANES GOLD: increasing LYM% lowers age; increasing GGT raises age', () => {
    const baseline = formulas.nhanes.gold(goldInputs);
    close(formulas.nhanes.gold({ ...goldInputs, lym: 40 }) - baseline, -2.0318306);
    close(formulas.nhanes.gold({ ...goldInputs, ggt: 35 }) - baseline, 0.6075152);
});

test('LIGHT: zero CRP is valid in both models', () => {
    close(formulas.nhanes.light({ ...lightInputs, crp: 0 }), 48.9365);
    close(formulas.ukb.light({ ...lightInputs, crp: 0 }), 47.6033);
});

test('Table 1 agrees with each GOLD formula at four decimal places', () => {
    const table = readFileSync(join(root, 'README.md'), 'utf8').split('**Table 2.**')[0];
    const fields = {
        Age: 'age', CREA: 'crea', GLU: 'glu', MCV: 'mcv', RDW: 'rdw',
        ALB: 'alb', ALP: 'alp', 'LYM%': 'lym', WBC: 'wbc', GGT: 'ggt'
    };
    const zeroInputs = Object.fromEntries(Object.values(fields).map(field => [field, 0]));
    const rows = table.split('\n').filter(line => line.startsWith('|'));
    let checked = 0;
    for (const row of rows) {
        const cells = row.split('|').map(cell => cell.trim());
        const field = fields[cells[1]];
        if (!field && cells[1] !== 'Constant (β0)') continue;
        for (const [dataset, column] of [['nhanes', 4], ['ukb', 5]]) {
            const baseline = formulas[dataset].gold(zeroInputs);
            const actual = field
                ? formulas[dataset].gold({ ...zeroInputs, [field]: 1 }) - baseline
                : baseline;
            close(actual, Number(cells[column]), 0.00005);
            checked++;
        }
    }
    assert.equal(checked, 22);
});

test('Table 2 agrees with both LIGHT formulas, using the correct raw CRP units', () => {
    const table = readFileSync(join(root, 'README.md'), 'utf8')
        .split('**Table 2.**')[1].split('Due to its non-normal')[0];
    const fields = { Age: 'age', CREA: 'crea', GLU: 'glu', 'Log CRP': 'crp' };
    const zero = { age: 0, crea: 0, glu: 0, crp: 0 };
    let checked = 0;
    for (const row of table.split('\n').filter(line => line.startsWith('|'))) {
        const cells = row.split('|').map(cell => cell.trim());
        const field = fields[cells[1]];
        if (!field && cells[1] !== 'Constant (β0)') continue;
        for (const [dataset, column] of [['nhanes', 4], ['ukb', 6]]) {
            const baseline = formulas[dataset].light(zero);
            // Make the model's transformed predictor exactly 1, starting in UI mg/dL.
            const value = field === 'crp' ? Math.expm1(1) / (dataset === 'ukb' ? 10 : 1) : 1;
            const actual = field
                ? formulas[dataset].light({ ...zero, [field]: value }) - baseline : baseline;
            close(actual, Number(cells[column]));
            checked++;
        }
    }
    assert.equal(checked, 10);
});

test('LIGHT: natural log, small positive CRP, and UKB factor ten are retained', () => {
    for (const dataset of ['nhanes', 'ukb']) {
        const coefficient = dataset === 'nhanes' ? 5.7305 : 4.1689;
        const factor = dataset === 'nhanes' ? 1 : 10;
        for (const crp of [1e-12, 0.01, 0.3, 3, 100]) {
            const baseline = formulas[dataset].light({ ...lightInputs, crp: 0 });
            close(formulas[dataset].light({ ...lightInputs, crp }) - baseline,
                  coefficient * Math.log1p(factor * crp));
        }
    }
});
