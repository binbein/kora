import ts from 'typescript';
import fs from 'fs';
for (const f of ['it','de','fr','en']) {
  const p=`src/lib/i18n/${f}.ts`;
  const sf=ts.createSourceFile(p,fs.readFileSync(p,'utf8'),ts.ScriptTarget.Latest,true);
  let n=0;
  const walk=(node)=>{
    if (ts.isPropertyAssignment(node) && (ts.isStringLiteral(node.initializer)||ts.isNoSubstitutionTemplateLiteral(node.initializer))) n++;
    ts.forEachChild(node,walk);
  };
  walk(sf);
  console.log(f, n);
}
