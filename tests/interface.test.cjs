const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');
const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1]).find(source => source.includes('const formulas'));

// A small DOM boundary for exercising the real event handlers. Native browser
// validation, keyboard navigation and layout still need browser verification.
function calculator() {
    const elements = new Map();
    let inputIds = [];
    function element(id, attributes = {}) {
        const listeners = {};
        const classes = new Set();
        const node = {
            id, value: attributes.value ?? '', textContent: '',
            get valueAsNumber() { return this.value.trim() === '' ? NaN : Number(this.value); },
            classList: { add: name => classes.add(name), remove: name => classes.delete(name),
                contains: name => classes.has(name) },
            addEventListener(name, callback) { (listeners[name] ??= []).push(callback); },
            dispatch(name) { for (const callback of listeners[name] ?? []) callback({ preventDefault() {} }); },
            setAttribute(name, value) { attributes[name] = String(value); },
            getAttribute(name) { return attributes[name] ?? null; },
            focus() {},
            checkValidity() {
                return inputIds.every(inputId => {
                    const input = elements.get(inputId);
                    const value = input.valueAsNumber;
                    return Number.isFinite(value) && value >= Number(input.getAttribute('min') ?? '-Infinity')
                        && value <= Number(input.getAttribute('max') ?? 'Infinity');
                });
            }
        };
        elements.set(id, node);
        return node;
    }
    for (const [, id] of html.split('<script')[0].matchAll(/\bid="([^"]+)"/g)) element(id);
    elements.get('datasetSelect').value = 'nhanes';
    elements.get('modelSelect').value = 'gold';
    Object.defineProperty(elements.get('inputContainer'), 'innerHTML', {
        set(markup) {
            inputIds.forEach(id => elements.delete(id));
            inputIds = [];
            for (const [tag] of markup.matchAll(/<input\b[^>]*>/g)) {
                const attributes = Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)]
                    .map(([, name, value]) => [name, value]));
                element(attributes.id, attributes);
                inputIds.push(attributes.id);
            }
        }
    });
    vm.runInNewContext(script, { document: { getElementById: id => elements.get(id) ?? null } });
    return {
        get: id => elements.get(id),
        fill(values) { for (const [id, value] of Object.entries(values)) elements.get(id).value = String(value); },
        select(id, value) { elements.get(id).value = value; elements.get(id).dispatch('change'); },
        submit() { elements.get('bioAgeForm').dispatch('submit'); },
        visible() { return elements.get('resultSection').classList.contains('show'); },
        score() { return elements.get('bioAgeResult').textContent; }
    };
}

const gold = { age: 50, crea: 1, glu: 5, mcv: 90, rdw: 13, alb: 4, alp: 80, lym: 30, wbc: 7, ggt: 25 };
const light = { age: 50, crea: 1, glu: 5, crp: 0.3 };

test('editing an input clears a previously calculated result', () => {
    const app = calculator();
    app.fill(gold);
    app.submit();
    assert.equal(app.score(), '51.1');
    assert.ok(app.visible());
    app.fill({ lym: 40 });
    app.get('bioAgeForm').dispatch('input');
    assert.equal(app.visible(), false);
    assert.notEqual(app.score(), '51.1');
    app.submit();
    assert.equal(app.score(), '49.1');
});

test('each dataset and model retains its own inputs and result on return', () => {
    const app = calculator();
    for (const [dataset, model, values, score] of [
        ['nhanes', 'gold', gold, '51.1'], ['nhanes', 'light', light, '50.4'],
        ['ukb', 'light', { ...light, crp: 0 }, '47.6'], ['ukb', 'gold', { ...gold, age: 60 }, '60.7']
    ]) {
        app.select('datasetSelect', dataset);
        app.select('modelSelect', model);
        app.fill(values);
        app.submit();
        assert.equal(app.score(), score);
    }
    app.select('datasetSelect', 'nhanes');
    assert.equal(app.get('age').value, '50');
    assert.equal(app.score(), '51.1');
    app.select('modelSelect', 'light');
    assert.equal(app.get('crp').value, '0.3');
    assert.equal(app.score(), '50.4');
    app.select('datasetSelect', 'ukb');
    assert.equal(app.get('crp').value, '0');
    assert.equal(app.score(), '47.6');
});

test('empty, negative and out-of-range inputs cannot leave a valid score', () => {
    const app = calculator();
    app.fill(gold);
    for (const invalid of [{ age: '' }, { crea: -1 }, { lym: 101 }]) {
        app.fill(gold);
        app.submit();
        assert.ok(app.visible());
        app.fill(invalid);
        app.submit();
        assert.equal(app.visible(), false);
    }
    app.select('modelSelect', 'light');
    app.fill({ ...light, crp: 0 });
    app.submit();
    assert.equal(app.score(), '48.9');
    assert.ok(app.visible());
    app.fill({ crp: -1 });
    app.submit();
    assert.equal(app.visible(), false);
});
