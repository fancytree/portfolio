/** Guard the narrative token contract. SVG coordinates, screenshots and isolated
 * product/demo implementations are evidence rather than portfolio typography. */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';

const root = process.cwd();
const tokenPath = 'src/lib/design-tokens/case.css';
const canonical = postcss.parse(fs.readFileSync(tokenPath, 'utf8'));
const definitions = new Set();
canonical.walkDecls(decl => definitions.add(decl.prop));
const errors = [];
let checked = 0;
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'page.tsx' || entry.name === 'ConnectnovaNarrative.tsx' || entry.name === 'FragmentedOperationsDiagram.tsx' || entry.name === 'UnifiedOperationsDiagram.tsx' || entry.name === 'MonoWorkflowDiagrams.tsx') files.push(file);
  }
}
walk('src/app/projects');
files.push('src/app/components/CaseStudyHero.tsx', 'src/app/components/CaseStudyControls.tsx', 'src/app/components/CaseStudyBackButton.tsx', 'src/app/components/case-kit/CaseKit.tsx', 'src/app/components/case-kit/CaseWorkflow.tsx', 'src/app/components/case-kit/CaseButton.tsx', 'src/app/components/case-kit/CaseViewportVideo.tsx', 'src/app/components/case-kit/CaseInteractivePreview.tsx', 'src/lib/design-tokens/typography.ts', 'src/lib/design-tokens/radius.ts');
const properties = /^(fontSize|fontWeight|fontFamily|lineHeight|letterSpacing|borderRadius|color|backgroundColor|border(?:Top|Bottom|Left|Right)?(?:Color|Width)?|boxShadow|padding\w*|margin\w*|gap|rowGap|columnGap)$/;
const structural = /^(?:0|auto|none|transparent|inherit|currentColor|collapse|[-\d.]+%)(?:\s+(?:0|auto))*$/;
function branches(node, callback) {
  if (ts.isConditionalExpression(node)) { branches(node.whenTrue, callback); branches(node.whenFalse, callback); }
  else if (ts.isBinaryExpression(node)) { branches(node.left, callback); branches(node.right, callback); }
  else if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) callback(node);
}
function validateValue(value, file, line) {
  if ((value.match(/\(/g)?.length ?? 0) !== (value.match(/\)/g)?.length ?? 0)) errors.push(`${file}:${line}: unbalanced CSS value ${value}`);
  for (const [, token] of value.matchAll(/var\((--case-[\w-]+)/g)) if (!definitions.has(token)) errors.push(`${file}:${line}: undefined ${token}`);
}
const monoOnly = process.argv.includes('--mono');
const selectedFiles = monoOnly ? files.filter(file => /\/mono\/page\.tsx$|MonoWorkflowDiagrams\.tsx$|CaseWorkflow\.tsx$|CaseButton\.tsx$/.test(file)) : files;
for (const file of selectedFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fail = (node, message) => errors.push(`${file}:${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1}: ${message}`);
  function visit(node) {
    if (ts.isJsxElement(node) && (node.openingElement.tagName.getText(tree) === 'svg' || node.openingElement.attributes.properties.some(attr => attr.name?.text === 'data-case-visual'))) return;
    if (ts.isJsxSelfClosingElement(node) && node.attributes.properties.some(attr => attr.name?.text === 'data-case-visual')) return;
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(tree) === 'button' && !file.endsWith('/CaseButton.tsx')) fail(node, 'native case button: use CaseButton');
    if (ts.isPropertyAssignment(node) && properties.test(node.name.getText(tree))) {
      branches(node.initializer, literal => {
        checked++;
        const value = literal.text;
        validateValue(value, file, tree.getLineAndCharacterOfPosition(literal.getStart()).line + 1);
        if (!value.includes('var(') && !structural.test(value)) fail(literal, `literal ${node.name.getText(tree)}: ${value}`);
      });
    }
    if (ts.isStringLiteral(node) && /--case-[\w-]+/.test(node.text)) validateValue(node.text, file, tree.getLineAndCharacterOfPosition(node.getStart()).line + 1);
    ts.forEachChild(node, visit);
  }
  visit(tree);
}
for (const file of ['src/app/components/case-kit/case-kit.module.css', 'src/app/components/case-kit/case-content.css', 'src/app/components/case-kit/case-button.module.css', 'src/app/components/case-kit/case-workflow.module.css']) {
  postcss.parse(fs.readFileSync(file, 'utf8')).walkDecls(decl => {
    validateValue(decl.value, file, decl.source.start.line);
    if (decl.prop.startsWith('--case-') && !/^var\(--case-[\w-]+\)$/.test(decl.value)) errors.push(`${file}:${decl.source.start.line}: case values must be defined in ${tokenPath}`);
  });
}
// A project must consume the shared scale, never redefine it locally.
for (const file of files.filter(file => file.startsWith('src/app/projects/'))) {
  const source = fs.readFileSync(file, 'utf8');
  if (/['"]--case-[\w-]+['"]\s*:|--case-[\w-]+\s*:/.test(source)) errors.push(`${file}: local case token override`);
}
// Guard every narrative helper, including newly added files. Product runtimes are
// checked against their own systems, rather than the portfolio action component.
const productFiles = /(?:MemQScreens|JobnovaPageDesignMockup|AutoApplyStateSwitcher|ConnectnovaProductEvidence|MonoTokenEvidence|MonoComponentShowcase)\.tsx$|\/mono\/(?:components|runtime)\/|\/def-erp\/live\//;
function guardButtons(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { guardButtons(file); continue; }
    if (!file.endsWith('.tsx') || productFiles.test(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        const opening = ts.isJsxElement(node) ? node.openingElement : node;
        if (opening.attributes.properties.some(a => a.name?.text === 'data-case-visual')) return;
        const tag = opening.tagName.getText(tree);
        const fail = message => errors.push(`${file}:${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1}: ${message}`);
        if (tag === 'button') fail('native case button: use CaseButton');
        if (tag === 'CaseButton') {
          for (const attr of opening.attributes.properties) {
            if (attr.name?.text === 'className' && attr.initializer && ts.isStringLiteral(attr.initializer) && /(?:^|\s)(?:[\w-]+:)*(?:bg-|text-|font-|rounded|border|shadow|p[xytrbl]?-(?!0)|gap-|opacity-|duration-|transition)/.test(attr.initializer.text)) fail('CaseButton appearance classes belong in the shared component');
            if (attr.name?.text === 'style' && attr.initializer?.expression && ts.isObjectLiteralExpression(attr.initializer.expression)) {
              for (const prop of attr.initializer.expression.properties) {
                if (/^(?:color|background.*|font.*|lineHeight|letterSpacing|border.*|boxShadow|padding.*|gap|opacity|transition.*)$/.test(prop.name?.text ?? '')) fail('CaseButton appearance belongs in the shared component');
              }
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
}
guardButtons(monoOnly ? 'src/app/projects/mono' : 'src/app/projects');

if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else console.log(`Case token contract passed: ${selectedFiles.length} source files, ${checked} style values; canonical values: ${path.join(root, tokenPath)}`);
