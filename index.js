// @flow
/*::
export type BabelFileResult = {
  ast?: ?Object,
  code?: ?string,
  map?: ?Object,
  ignored?: ?boolean,
  metadata?: ?BabelFileMetadata,
};

export type BabelFileMetadata = {
  usedHelpers: Array<string>;
  marked: Array<{
    type: string,
    message: string,
    loc: Object,
  }>;
  modules: BabelFileModulesMetadata,
};

export type BabelFileModulesMetadata = {
  imports: Array<Object>,
  exports: {
    exported: Array<Object>,
    specifiers: Array<Object>,
  },
};

export type BabelParserOptions = {
  sourceFilename?: string;
  sourceType?: "module" | "script";
  plugins?: Array<string>;
};

export interface BabelPipeline {
  lint(code: string, opts?: Object): BabelFileResult,
  pretransform(code: string, opts?: Object): BabelFileResult,
  transform(code: string, opts?: Object): BabelFileResult,
  analyse(code: string, opts?: Object, visitor?: Object): BabelFileMetadata,
  transformFromAst(ast: Object, code: string, opts: Object): BabelFileResult,
}

export interface BabelStore extends Map<any, any> {
  dynamicData: Object,
  setDynamic(key: string, fn: Function): void,
  get(key: string): any,
}

export type Plugin = (babel: Babel) => {
  manipulateOptions?: Function,
  post?: Function,
  pre?: Function,
  visitor: BabelVisitor,
};

export interface BabelPlugin extends BabelStore {
  constructor(plugin: Object, key?: string): Plugin,

  initialized: boolean,
  raw: Object,
  manipulateOptions: ?Function,
  post: ?Function,
  pre: ?Function,
  visitor: BabelVisitor,

  take(key: string): any,
  chain(target: Object, key: string): Function,
  maybeInherit(loc: string): void,
  init(loc: string, i: number): void,
  normaliseVisitor(visitor: Object): Object,
}

export interface BabelPluginPass extends BabelStore {
  constructor(file: BabelFile, plugin: BabelPlugin, options?: Object): BabelPluginPass,
  key: string,
  plugin: Plugin,
  file: BabelFile,
  opts: Object,
  addHelper(name: string): Object,
  addImport(source: string, imported: string, name?: string): Object,
  getModuleName(): ?string,
  buildCodeFrameError(node: Object, msg: string, error?: Class<Error>): Error,
}

export interface BabelLogger {
  constructor(file: BabelFile, filename: string): BabelLogger,
  filename: string,
  file: BabelFile,
  warn(msg: string): void,
  error(msg: string, error?: Class<Error>): void,
  deprecate(msg: string): void,
  verbose(msg: string): void,
  debug(msg: string): void,
  deopt(node: Object, msg: string): void,
}

export interface BabelOptionManager {
  constructor(log?: BabelLogger): BabelOptionManager,
  resolvedConfigs: Array<string>,
  options: Object,
  log?: BabelLogger,
  // static memoisePluginContainer(fn: Function, loc?: string, i?: any, alias?: string): BabelPlugin,
  // static createBareOptions(): Object,
  // static normalisePlugin(plugin: Function | BabelPlugin, loc?: string, i?: any, alias?: string): void,
  // static normalisePlugins(loc: string, dirname: string, plugins: Array<string | [string, Object]>): Array<any>,
  mergeOptions(opts: { options: Object, extending: Object, alias?: string, loc?: string, dirname?: string }): void,
  mergePresets(presets: Array<string | Object>, dirname: string): void,
  resolvePresets(presets: Array<string | Object>, dirname: string, onResolve?: Function): Array<any>,
  normaliseOptions(): void,
  init(opts?: Object): Object,
}

export interface BabelFile extends BabelStore {
  constructor(opts: ?Object, pipeline: BabelPipeline): BabelFile,

  opts: Object,
  parserOpts: BabelParserOptions,

  ast: Node,
  code: string,
  shebang: string,
  metadata: BabelFileMetadata,

  path: BabelPath,
  scope: BabelScope,

  hub: BabelHub,
  log: BabelLogger,
  pipeline: BabelPipeline,

  pluginPasses: Array<BabelPluginPass>,
  pluginVisitors: Array<Object>,

  dynamicImportTypes: Object,
  dynamicImportIds: Object,
  dynamicImports: Array<Object>,

  usedHelpers: Object,
  declarations: Object,

  getMetadata(): void,
  initOptions(opts: Object): Object,
  buildPluginsForOptions(opts: Object): void,
  getModuleName(): ?string,
  resolveModuleSource(source: string): string,
  addImport(source: string, imported: string, name?: string): Object,
  addHelper(name: string): Object,
  addTemplateObject(helperName: string, strings: Array<Object>, raw: Object): Object,
  buildCodeFrameError(node: Node, msg: string, error: Class<Error>): Error,
  mergeSourceMap(map: Object): void,
  parse(code: string): Node,
  addAST(ast: Node): void,
  transform(): BabelFileResult,
  wrap(code: string, callback: Function): BabelFileResult,
  addCode(code: string): void,
  parseCode(): void,
  shouldIgnore(): boolean,
  call(key: 'pre' | 'post', pluginPasses: Array<BabelPluginPass>): void,
  parseInputSourceMap(code: string): string,
  parseShebang(): void,
  makeResult(opts: BabelFileResult): BabelFileResult,
  generate(): BabelFileResult,
}

export type Babel = {
  File: BabelFile,
  options: Object,
  buildExternalHelpers: Function,
  template(code: string): Template,
  resolvePlugin: Function,
  resolvePreset: Function,
  version: string,

  util: any,
  types: Types,
  traverse: Function,

  OptionManager: BabelOptionManager,
  Pipeline: BabelPipeline,

  analyse(code: string, opts?: Object, visitor?: Object): BabelFileMetadata,
  transform(code: string, opts?: Object): BabelFileResult,
  transformFromAst(ast: Object, code: string, opts: Object): BabelFileResult,

  transformFile(filename: string, opts: ?Object, callback: Function): void,
  transformFileSync(filename: string, opts: ?Object): string,
};

export interface BabelTraverse {
  (parent: Object | Array<Object>, opts?: Object, scope?: BabelScope, state: BabelPluginPass, parentPath: BabelPath): void,
  visitors: BabelVisitors,
  verify: BabelVisitorVerify,
  explode: BabelVisitorExplode,
  NodePath: Class<BabelPath>,
  Scope: Class<BabelScope>,
  Hub: Class<BabelHub>,

  cheap(node: Node, enter: (node: Node) => void): void,
  node(node: Node, opts: Object, scope: BabelScope, state: BabelPluginPass, parentPath: BabelPath, shipKeys?: Object): void,
  clearNode(node: Node, opts: Object): void,
  removeProperties(tree: Node, opts: Object): Node,
  hasType(tree: Node, scope: BabelScope, type: Object, blacklistTypes: Array<string>): boolean,
  clearCache(): void,
  copyCache(source: Object, destination: Object): void,
}

export type BabelVisitorMethod = (path: BabelPath, state: BabelPluginPass) => mixed;

export type BabelVisitor = {
  [key: string]: { enter?: BabelVisitorMethod, exit?: BabelVisitorMethod } | BabelVisitorMethod,
};

type BabelVisitorVerify = (visitor: BabelVisitor) => void;
type BabelVisitorExplode = (visitor: BabelVisitor) => BabelVisitor;

export type BabelVisitors = {
  explode: BabelVisitorExplode,
  verify: BabelVisitorVerify,
  merge(visitors: Array<BabelVisitor>, states: Array<BabelPluginPass>, wrapper?: ?Function): Object,
};

export interface BabelHub {
  constructor(file: BabelFile, options: Object): BabelHub,
  file: BabelFile,
  options: Object,
}

export interface BabelTraversalContext {
  constructor(scope: BabelScope, opts: Object, state: BabelPluginPass, parentPath: BabelPath): BabelTraversalContext,
  parentPath: BabelPath,
  scope: BabelScope,
  state: BabelPluginPass,
  opts: Object,
  queue: ?Array<BabelPath>,

  shouldVisit(node: Node): boolean,
  create(node: Node, obj: ?Array<Node>, key: string, listKey: string): BabelPath,
  maybeQueue(path: BabelPath, notPriority?: boolean): void,
  visitMultipe(container: Array<Node>, parent: Node, listKey: string): boolean,
  visitSingle(node: Node, key: string): boolean,
  visitQueue(queue: Array<BabelPath>): boolean,
  visit(node: Node | Array<Node>, key: string): boolean,
}

export type BabelContainer = Object | Array<Object>;

export interface BabelPath {
  constructor(hub: BabelHub, parent: Object): BabelPath,

  parent: Object,
  hub: BabelHub,
  contexts: Array<BabelTraversalContext>,
  data: Object,
  shouldSkip: boolean,
  shouldStop: boolean,
  removed: boolean,
  state: BabelPluginPass,
  opts: ?Object,
  skipKeys: ?Object,
  parentPath: BabelPath,
  context: BabelTraversalContext,
  container: ?BabelContainer,
  listKey: ?string,
  inList: boolean,
  parentKey: ?string,
  key: ?string,
  node: ?Object,
  scope: BabelScope,
  type: string,
  typeAnnotation: ?Object,

  // static get(opts: {
  //   hub: BabelHub,
  //   parentPath?: BabelPath,
  //   parent?: Node,
  //   container?: ?BabelContainer,
  //   listKey?: string,
  //   key?: string,
  // }): BabelPath,

  getScope(scope: BabelScope): BabelScope,
  setData(key: string, val: any): any,
  getData(key: string, def?: any): any,

  buildCodeFrameError(msg: string, error?: Class<Error>): Error,
  traverse(visitor: Object, state?: any): void,
  mark(type: string, message: string): void,
  set(key: string, node: Node): void,
  getPathLocation(): string,
  debug(buildMessage: Function): void,

  findParent(callback: (path: BabelPath) => boolean): BabelPath | null,
  find(callback: (path: BabelPath) => boolean): BabelPath | null,
  getFunctionParent(): BabelPath,
  getStatementParent(): BabelPath,
  getEarliestCommonAncestorFrom(paths: Array<BabelPath>): BabelPath,
  getDeepestCommonAncestorFrom(paths: Array<BabelPath>, filter?: Function): BabelPath,
  getAncestry(): Array<BabelPath>,
  isAncestor(maybeDescendant: BabelPath): boolean,
  isDescendant(maybeAncestor: BabelPath): boolean,
  inType(...types: Array<string>): boolean,
  inShadow(key?: string): ?boolean,

  getTypeAnnotation(): Node,
  isBaseType(baseName: string, soft?: boolean): boolean,
  couldBeBaseType(name: string): boolean,
  baseTypeStrictlyMatches(right: BabelPath): ?boolean,
  isGenericType(genericName: string): boolean,

  replaceWithMultiple(node: Array<Node>): void,
  replaceWithSourceString(replacement: string): void,
  replaceWith(replacement: Node): void,
  replaceExpressionWithStatements(nodes: Array<Node>): Node,
  replaceInline(nodes: Node | Array<Node>): void,

  evaluateTruthy(): ?boolean,
  evaluate(): { confident: boolean, value: any },

  toComputedKey(): Node,
  ensureBlock(): Node,
  arrowFunctionToShadowed(): void,

  matchesPattern(pattern: string, allowPartial?: boolean): boolean,
  isStatic(): boolean,
  has(key: string): boolean,
  is(key: string): boolean,
  isnt(key: string): boolean,
  equals(key: string, value: any): boolean,
  isNodeType(type: string): boolean,
  canHaveVariableDeclarationOrExpression(): boolean,
  canSwapBetweenExpressionAndStatement(replacement: Node): boolean,
  isCompletionRecord(allowInsideFunction?: boolean): boolean,
  isStatementOrBlock(): boolean,
  referencesImport(moduleSource: string, importName: string): boolean,
  getSource(): string,
  willIMaybeExecuteBefore(target: BabelPath): boolean,
  resolve(dangerous?: boolean, resolved?: Array<BabelPath>): BabelPath,

  call(key: string): boolean,
  isBlackListed(): boolean,
  visit(): boolean,
  skip(): void,
  skipKey(key: string): void,
  stop(): void,
  setScope(): void,
  setContext(context: Object): BabelPath,
  resync(): void,
  popContext(): void,
  pushContext(context: Object): void,
  setup(parentPath: ?BabelPath, container: ?BabelContainer, listKey: ?string, key: ?string): void,
  requeue(pathToQueue?: BabelPath): void,

  remove(): void,

  insertBefore(nodes: Array<Node>): Array<BabelPath>,
  insertAfter(nodes: Array<Node>): Array<BabelPath>,
  updateSiblingKeys(fromIndex: number, incrementBy: number): void,
  unshiftContainer(listKey: string, nodes: Array<Node>): Array<BabelPath>,
  pushContainer(listKey: string, nodes: Array<Node>): void,
  hoist(scope?: BabelScope): void,

  getStatementParent(): ?BabelPath,
  getOpposite(): ?BabelPath,
  getCompletionRecord(): Array<BabelPath>,
  getSibling(key: string): ?BabelPath,
  getPrevSibling(): ?BabelPath,
  getNextSibling(): ?BabelPath,
  getAllNextSiblings(): Array<BabelPath>,
  getAllPrevSiblings(): Array<BabelPath>,
  get(key: string, context?: boolean | BabelTraversalContext): any,
  getBindingIdentifiers(duplicates?: boolean): { [key: string]: Identifier },
  getOuterBindingIdentifiers(duplicates?: boolean): { [key: string]: Identifier },
  getBindingIdentifierPaths(duplicates?: boolean, outerOnly?: boolean): { [key: string]: BabelPath },
  getOuterBindingIdentifierPaths(duplicates?: boolean): { [key: string]: BabelPath },

  shareCommentsWithSiblings(): void,
  addComment(type: string, content: string, line?: boolean): void,
  addComments(type: string, comments: Array<{ type: string, value: string }>): void,
}

export interface BabelScope {
  constructor(path: BabelPath, parentScope?: BabelScope): BabelScope,

  uid: number,
  parent: ?BabelScope,
  hub: BabelHub,
  parentBlock: Node,
  block: Node,
  path: BabelPath,
  labels: Map<string, BabelPath>,

  // static globals: Array<string>,
  // static contextVariables: Array<string>,

  traverse(node: Node, opts: Object, state?: Object): void,
  generateDeclaredUidIdentifier(name?: string): Node,
  generateUidIdentifier(name?: string): Node,
  generateUid(name?: string): string,
  generateUidIdentifierBasedOnNode(parent: Node, defaultName?: string): Node,
  isStatic(node: Node): boolean,
  maybeGenerateMemoised(node: Node, dontPush?: boolean): ?Node,
  checkBlockScopedCollisions(local: BabelBinding, kind: BabelBindingKind, name: string, id: Node): void,
  rename(oldName: string, newName: string, block?: boolean): void,
  dump(): void,
  toArray(node: Node, i?: number): Node,
  hasLabel(name: string): boolean,
  getLabel(name: string): BabelPath,
  registerLabel(path: BabelPath): void,
  registerDeclaration(path: BabelPath): void,
  buildUndefinedNode(): Node,
  registerConstantViolation(path: BabelPath): void,
  registerBinding(kind: string, path: BabelPath, bindingPath?: BabelPath): void,
  addGlobal(node: Object): void,
  hasUid(name: string): boolean,
  hasGlobal(name: string): boolean,
  hasReference(name: string): boolean,
  isPure(node: Node, constantsOnly?: boolean): boolean,
  setData(key: string, val: any): any,
  getData(key: string): any,
  removeData(key: string): void,
  init(): void,
  crawl(): void,
  push(opts: {
    id: Node,
    init?: Node,
    unique?: boolean,
    _blockHoist?: number,
    kind: 'var' | 'let'
  }): void,
  getProgramParent(): BabelScope,
  getFunctionParent(): BabelScope,
  getBlockParent(): BabelScope,
  getAllBindings(): { [key: string]: BabelBinding },
  getAllBindingsOfKind(): { [key: string]: BabelBinding },
  bindingIdentifierEquals(name: string, node: Node): boolean,
  getBinding(name: string): ?BabelBinding,
  getOwnBinding(name: string): ?BabelBinding,
  getBindingIdentifier(name: string): ?Node,
  getOwnBindingIdentifier(name: string): ?Node,
  hasOwnBinding(name: string): boolean,
  hasBinding(name: string, noGlobals?: boolean): boolean,
  parentHasBinding(name: string, noGlobals?: boolean): boolean,
  moveBindingTo(name: string, scope: BabelScope): void,
  removeOwnBinding(name: string): void,
  removeBinding(name: string): void,
}

export type BabelBindingKind = 'let' | 'var' | 'hoisted' | 'module';

type BabelBindingOptions = {
  existing?: boolean,
  identifier: Node,
  scope: BabelScope,
  path: BabelPath,
  kind: BabelBindingKind,
}

export interface BabelBinding {
  constructor(opts: BabelBindingOptions): BabelBinding,

  identifier: Node,
  scope: BabelScope,
  path: BabelPath,
  kind: BabelBindingKind,

  constantViolations: Array<BabelPath>,
  constant: boolean,

  referencePaths: Array<BabelPath>,
  referenced: boolean,
  references: number,

  hasDeoptedValue: boolean,
  hasValue: boolean,
  value: any,

  deoptValue(): void,
  setValue(value: any): void,
  clearValue(): void,
  reassign(path: BabelPath): void,
  reference(path: BabelPath): void,
  dereference(): void,
}

export type Template = (code: string, opts?: Object) => (opts: { [key: string]: Node }) => Node;

export interface Comment {
  value: string;
  start: number;
  end: number;
  loc: SourceLocation;
}

export interface CommentBlock extends Comment {
  type: "CommentBlock";
}

export interface CommentLine extends Comment {
  type: "CommentLine";
}

export interface SourceLocation {
  start: {
    line: number;
    column: number;
  };

  end: {
    line: number;
    column: number;
  };
}

export interface Node {
  +type: string;
  leadingComments?: Array<Comment>;
  innerComments?: Array<Comment>;
  trailingComments?: Array<Comment>;
  start: number;
  end: number;
  loc: SourceLocation;
}

export interface ArrayExpression extends Node {
  type: "ArrayExpression";
  elements: Array<Expression | SpreadElement>;
}

export interface AssignmentExpression extends Node {
  type: "AssignmentExpression";
  operator: "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | ">>>=" | "|=" | "^=" | "&=";
  left: LVal;
  right: Expression;
}

export interface BinaryExpression extends Node {
  type: "BinaryExpression";
  operator: "+" | "-" | "/" | "%" | "*" | "**" | "&" | "|" | ">>" | ">>>" | "<<" | "^" | "==" | "===" | "!=" | "!==" | "in" | "instanceof" | ">" | "<" | ">=" | "<=";
  left: Expression;
  right: Expression;
}

export interface Directive extends Node {
  type: "Directive";
  value: DirectiveLiteral;
}

export interface DirectiveLiteral extends Node {
  type: "DirectiveLiteral";
  value: string;
}

export interface BlockStatement extends Node {
  type: "BlockStatement";
  directives?: Directive[];
  body: Statement[];
}

export interface BreakStatement extends Node {
  type: "BreakStatement";
  label: Identifier;
}

export interface CallExpression extends Node {
  type: "CallExpression";
  callee: Expression | Super;
  arguments: Array<Expression | SpreadElement>;
}

export interface CatchClause extends Node {
  type: "CatchClause";
  param: Identifier;
  body: BlockStatement;
}

export interface ConditionalExpression extends Node {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface ContinueStatement extends Node {
  type: "ContinueStatement";
  label: Identifier;
}

export interface DebuggerStatement extends Node {
  type: "DebuggerStatement";
}

export interface DoWhileStatement extends Node {
  type: "DoWhileStatement";
  test: Expression;
  body: Statement;
}

export interface EmptyStatement extends Node {
  type: "EmptyStatement";
}

export interface ExpressionStatement extends Node {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface File extends Node {
  type: "File";
  program: Program;
  comments: Comment[];
  tokens: any[];
}

export interface ForInStatement extends Node {
  type: "ForInStatement";
  left: VariableDeclaration | LVal;
  right: Expression;
  body: Statement;
}

export interface ForStatement extends Node {
  type: "ForStatement";
  init: VariableDeclaration | Expression;
  test: Expression;
  update: Expression;
  body: Statement;
}

export interface FunctionDeclaration extends Node {
  type: "FunctionDeclaration";
  id: Identifier;
  params: Array<LVal>;
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  returnType?: TypeAnnotation;
  typeParameters?: TypeParameterDeclaration;
}

export interface FunctionExpression extends Node {
  type: "FunctionExpression";
  id: Identifier;
  params: Array<LVal>;
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  returnType?: TypeAnnotation;
  typeParameters?: TypeParameterDeclaration;
}

export interface Identifier extends Node {
  type: "Identifier";
  name: string;
  typeAnnotation?: TypeAnnotation;
}

export interface IfStatement extends Node {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement;
}

export interface LabeledStatement extends Node {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

export interface StringLiteral extends Node {
  type: "StringLiteral";
  value: string;
}

export interface NumericLiteral extends Node {
  type: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Node {
  type: "NullLiteral";
}

export interface BooleanLiteral extends Node {
  type: "BooleanLiteral";
  value: boolean;
}

export interface RegExpLiteral extends Node {
  type: "RegExpLiteral";
  pattern: string;
  flags?: string;
}

export interface LogicalExpression extends Node {
  type: "LogicalExpression";
  operator: "||" | "&&";
  left: Expression;
  right: Expression;
}

export interface MemberExpression extends Node {
  type: "MemberExpression";
  object: Expression | Super;
  property: Expression;
  computed: boolean;
}

export interface NewExpression extends Node {
  type: "NewExpression";
  callee: Expression | Super;
  arguments: Array<Expression | SpreadElement>;
}

export interface Program extends Node {
  type: "Program";
  sourceType: "script" | "module";
  directives?: Directive[];
  body: Array<Statement | ModuleDeclaration>;
}

export interface ObjectExpression extends Node {
  type: "ObjectExpression";
  properties: Array<ObjectProperty | ObjectMethod | SpreadProperty>;
}

export interface ObjectMethod extends Node {
  type: "ObjectMethod";
  key: Expression;
  kind: "get" | "set" | "method";
  shorthand: boolean;
  computed: boolean;
  value: Expression;
  decorators?: Decorator[];
  id: Identifier;
  params: Array<LVal>;
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  returnType?: TypeAnnotation;
  typeParameters?: TypeParameterDeclaration;
}

export interface ObjectProperty extends Node {
  type: "ObjectProperty";
  key: Expression;
  computed: boolean;
  value: Expression;
  decorators?: Decorator[];
  shorthand: boolean;
}

export interface RestElement extends Node {
  type: "RestElement";
  argument: LVal;
  typeAnnotation?: TypeAnnotation;
}

export interface ReturnStatement extends Node {
  type: "ReturnStatement";
  argument: Expression;
}

export interface SequenceExpression extends Node {
  type: "SequenceExpression";
  expressions: Expression[];
}

export interface SwitchCase extends Node {
  type: "SwitchCase";
  test: Expression;
  consequent: Statement[];
}

export interface SwitchStatement extends Node {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface ThisExpression extends Node {
  type: "ThisExpression";
}

export interface ThrowStatement extends Node {
  type: "ThrowStatement";
  argument: Expression;
}

export interface TryStatement extends Node {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause;
  finalizer: BlockStatement;
}

export interface UnaryExpression extends Node {
  type: "UnaryExpression";
  operator: "-" | "+" | "!" | "~" | "typeof" | "void" | "delete";
  prefix: boolean;
  argument: Expression;
}

export interface UpdateExpression extends Node {
  type: "UpdateExpression";
  operator: "++" | "--";
  prefix: boolean;
  argument: Expression;
}

export interface VariableDeclaration extends Node {
  type: "VariableDeclaration";
  declarations: VariableDeclarator[];
  kind: "var" | "let" | "const";
}

export interface VariableDeclarator extends Node {
  type: "VariableDeclarator";
  id: LVal;
  init: Expression;
}

export interface WhileStatement extends Node {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface WithStatement extends Node {
  type: "WithStatement";
  object: Expression;
  body: BlockStatement | Statement;
}

export interface AssignmentPattern extends Node {
  type: "AssignmentPattern";
  left: Identifier;
  right: Expression;
}

export interface ArrayPattern extends Node {
  type: "ArrayPattern";
  elements: Array<Expression>;
  typeAnnotation?: TypeAnnotation;
}

export interface ArrowFunctionExpression extends Node {
  type: "ArrowFunctionExpression";
  id: Identifier;
  params: Array<LVal>;
  body: BlockStatement | Expression;
  generator: boolean;
  async: boolean;
  expression: boolean;
  returnType?: TypeAnnotation;
  typeParameters?: TypeParameterDeclaration;
}

export interface ClassBody extends Node {
  type: "ClassBody";
  body: Array<ClassMethod | ClassProperty>;
}

export interface ClassDeclaration extends Node {
  type: "ClassDeclaration";
  id: Identifier;
  superClass: Expression;
  body: ClassBody;
  decorators?: Decorator[];
  implements?: ClassImplements[];
  mixins?: any[];
  typeParameters?: TypeParameterDeclaration;
  superTypeParameters?: TypeParameterInstantiation;
}

export interface ClassExpression extends Node {
  type: "ClassExpression";
  id: Identifier;
  superClass: Expression;
  body: ClassBody;
  decorators?: Decorator[];
  implements?: ClassImplements[];
  mixins?: any[];
  typeParameters?: TypeParameterDeclaration;
  superTypeParameters?: TypeParameterInstantiation;
}

export interface ExportAllDeclaration extends Node {
  type: "ExportAllDeclaration";
  source: StringLiteral;
}

export interface ExportDefaultDeclaration extends Node {
  type: "ExportDefaultDeclaration";
  declaration: Declaration | Expression;
}

export interface ExportNamedDeclaration extends Node {
  type: "ExportNamedDeclaration";
  declaration: Declaration;
  specifiers: ExportSpecifier[];
  source: StringLiteral;
}

export interface ExportSpecifier extends Node {
  type: "ExportSpecifier";
  local: Identifier;
  imported: Identifier;
  exported: Identifier;
}

export interface ForOfStatement extends Node {
  type: "ForOfStatement";
  left: VariableDeclaration | LVal;
  right: Expression;
  body: Statement;
}

export interface ImportDeclaration extends Node {
  type: "ImportDeclaration";
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>;
  source: StringLiteral;
}

export interface ImportDefaultSpecifier extends Node {
  type: "ImportDefaultSpecifier";
  local: Identifier;
}

export interface ImportNamespaceSpecifier extends Node {
  type: "ImportNamespaceSpecifier";
  local: Identifier;
}

export interface ImportSpecifier extends Node {
  type: "ImportSpecifier";
  local: Identifier;
  imported: Identifier;
}

export interface MetaProperty extends Node {
  type: "MetaProperty";
  meta: Identifier;
  property: Identifier;
}

export interface ClassMethod extends Node {
  type: "ClassMethod";
  key: Expression;
  value?: FunctionExpression;
  kind: "constructor" | "method" | "get" | "set";
  computed: boolean;
  // static: boolean;
  decorators?: Decorator[];
  id: Identifier;
  params: Array<LVal>;
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  expression: boolean;
  returnType?: TypeAnnotation;
  typeParameters?: TypeParameterDeclaration;
}

// See: https://github.com/babel/babel/blob/master/doc/ast/spec.md#objectpattern
export interface AssignmentProperty extends Node {
  type: "ObjectProperty";
  key: Expression;
  computed: boolean;
  value: Pattern;
  decorators?: Decorator[];
  shorthand: boolean;
}

export interface ObjectPattern extends Node {
  type: "ObjectPattern";
  properties: Array<AssignmentProperty | RestProperty>;
  typeAnnotation?: TypeAnnotation;
}

export interface SpreadElement extends Node {
  type: "SpreadElement";
  argument: Expression;
}

export interface Super extends Node {
  type: "Super";
}

export interface TaggedTemplateExpression extends Node {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends Node {
  type: "TemplateElement";
  tail: boolean;
  value: {
    cooked: string;
    raw: string;
  };
}

export interface TemplateLiteral extends Node {
  type: "TemplateLiteral";
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface YieldExpression extends Node {
  type: "YieldExpression";
  argument: Expression;
  delegate: boolean;
}

export interface AnyTypeAnnotation extends Node {
  type: "AnyTypeAnnotation";
}

export interface ArrayTypeAnnotation extends Node {
  type: "ArrayTypeAnnotation";
  elementType: FlowTypeAnnotation;
}

export interface BooleanTypeAnnotation extends Node {
  type: "BooleanTypeAnnotation";
}

export interface BooleanLiteralTypeAnnotation extends Node {
  type: "BooleanLiteralTypeAnnotation";
}

export interface NullLiteralTypeAnnotation extends Node {
  type: "NullLiteralTypeAnnotation";
}

export interface ClassImplements extends Node {
  type: "ClassImplements";
  id: Identifier;
  typeParameters: TypeParameterInstantiation;
}

export interface ClassProperty extends Node {
  type: "ClassProperty";
  key: Identifier;
  value: Expression;
  decorators?: Decorator[];
  typeAnnotation?: TypeAnnotation;
}

export interface DeclareClass extends Node {
  type: "DeclareClass";
  id: Identifier;
  typeParameters: TypeParameterDeclaration;
  extends: InterfaceExtends[];
  body: ObjectTypeAnnotation;
}

export interface DeclareFunction extends Node {
  type: "DeclareFunction";
  id: Identifier;
}

export interface DeclareInterface extends Node {
  type: "DeclareInterface";
  id: Identifier;
  typeParameters: TypeParameterDeclaration;
  extends: InterfaceExtends[];
  body: ObjectTypeAnnotation;
}

export interface DeclareModule extends Node {
  type: "DeclareModule";
  id: StringLiteral | Identifier;
  body: BlockStatement;
}

export interface DeclareTypeAlias extends Node {
  type: "DeclareTypeAlias";
  id: Identifier;
  typeParameters: TypeParameterDeclaration;
  right: FlowTypeAnnotation;
}

export interface DeclareVariable extends Node {
  type: "DeclareVariable";
  id: Identifier;
}

export interface ExistentialTypeParam extends Node {
  type: "ExistentialTypeParam";
}

export interface FunctionTypeAnnotation extends Node {
  type: "FunctionTypeAnnotation";
  typeParameters: TypeParameterDeclaration;
  params: FunctionTypeParam[];
  rest: FunctionTypeParam;
  returnType: FlowTypeAnnotation;
}

export interface FunctionTypeParam extends Node {
  type: "FunctionTypeParam";
  name: Identifier;
  typeAnnotation: FlowTypeAnnotation;
}

export interface GenericTypeAnnotation extends Node {
  type: "GenericTypeAnnotation";
  id: Identifier;
  typeParameters: TypeParameterInstantiation;
}

export interface InterfaceExtends extends Node {
  type: "InterfaceExtends";
  id: Identifier;
  typeParameters: TypeParameterInstantiation;
}

export interface InterfaceDeclaration extends Node {
  type: "InterfaceDeclaration";
  id: Identifier;
  typeParameters: TypeParameterDeclaration;
  extends: InterfaceExtends[];
  mixins?: any[];
  body: ObjectTypeAnnotation;
}

export interface IntersectionTypeAnnotation extends Node {
  type: "IntersectionTypeAnnotation";
  types: FlowTypeAnnotation[];
}

export interface MixedTypeAnnotation extends Node {
  type: "MixedTypeAnnotation";
}

export interface NullableTypeAnnotation extends Node {
  type: "NullableTypeAnnotation";
  typeAnnotation: FlowTypeAnnotation;
}

export interface NumericLiteralTypeAnnotation extends Node {
  type: "NumericLiteralTypeAnnotation";
}

export interface NumberTypeAnnotation extends Node {
  type: "NumberTypeAnnotation";
}

export interface StringLiteralTypeAnnotation extends Node {
  type: "StringLiteralTypeAnnotation";
}

export interface StringTypeAnnotation extends Node {
  type: "StringTypeAnnotation";
}

export interface ThisTypeAnnotation extends Node {
  type: "ThisTypeAnnotation";
}

export interface TupleTypeAnnotation extends Node {
  type: "TupleTypeAnnotation";
  types: FlowTypeAnnotation[];
}

export interface TypeofTypeAnnotation extends Node {
  type: "TypeofTypeAnnotation";
  argument: FlowTypeAnnotation;
}

export interface TypeAlias extends Node {
  type: "TypeAlias";
  id: Identifier;
  typeParameters: TypeParameterDeclaration;
  right: FlowTypeAnnotation;
}

export interface TypeAnnotation extends Node {
  type: "TypeAnnotation";
  typeAnnotation: FlowTypeAnnotation;
}

export interface TypeCastExpression extends Node {
  type: "TypeCastExpression";
  expression: Expression;
  typeAnnotation: FlowTypeAnnotation;
}

export interface TypeParameterDeclaration extends Node {
  type: "TypeParameterDeclaration";
  params: Identifier[];
}

export interface TypeParameterInstantiation extends Node {
  type: "TypeParameterInstantiation";
  params: FlowTypeAnnotation[];
}

export interface ObjectTypeAnnotation extends Node {
  type: "ObjectTypeAnnotation";
  properties: ObjectTypeProperty[];
  indexers: ObjectTypeIndexer[];
  callProperties: ObjectTypeCallProperty[];
}

export interface ObjectTypeCallProperty extends Node {
  type: "ObjectTypeCallProperty";
  value: FlowTypeAnnotation;
}

export interface ObjectTypeIndexer extends Node {
  type: "ObjectTypeIndexer";
  id: Expression;
  key: FlowTypeAnnotation;
  value: FlowTypeAnnotation;
}

export interface ObjectTypeProperty extends Node {
  type: "ObjectTypeProperty";
  key: Expression;
  value: FlowTypeAnnotation;
}

export interface QualifiedTypeIdentifier extends Node {
  type: "QualifiedTypeIdentifier";
  id: Identifier;
  qualification: Identifier | QualifiedTypeIdentifier;
}

export interface UnionTypeAnnotation extends Node {
  type: "UnionTypeAnnotation";
  types: FlowTypeAnnotation[];
}

export interface VoidTypeAnnotation extends Node {
  type: "VoidTypeAnnotation";
}

export interface JSXAttribute extends Node {
  type: "JSXAttribute";
  name: JSXIdentifier | JSXNamespacedName;
  value: JSXElement | StringLiteral | JSXExpressionContainer;
}

export interface JSXClosingElement extends Node {
  type: "JSXClosingElement";
  name: JSXIdentifier | JSXMemberExpression;
}

export interface JSXElement extends Node {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement;
  children: Array<JSXElement | JSXExpressionContainer | JSXText>;
  selfClosing?: boolean;
}

export interface JSXEmptyExpression extends Node {
  type: "JSXEmptyExpression";
}

export interface JSXExpressionContainer extends Node {
  type: "JSXExpressionContainer";
  expression: Expression;
}

export interface JSXIdentifier extends Node {
  type: "JSXIdentifier";
  name: string;
}

export interface JSXMemberExpression extends Node {
  type: "JSXMemberExpression";
  object: JSXMemberExpression | JSXIdentifier;
  property: JSXIdentifier;
}

export interface JSXNamespacedName extends Node {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}

export interface JSXOpeningElement extends Node {
  type: "JSXOpeningElement";
  name: JSXIdentifier | JSXMemberExpression;
  selfClosing: boolean;
  attributes: JSXAttribute[];
}

export interface JSXSpreadAttribute extends Node {
  type: "JSXSpreadAttribute";
  argument: Expression;
}

export interface JSXText extends Node {
  type: "JSXText";
  value: string;
}

export interface Noop extends Node {
  type: "Noop";
}

export interface ParenthesizedExpression extends Node {
  type: "ParenthesizedExpression";
  expression: Expression;
}

export interface AwaitExpression extends Node {
  type: "AwaitExpression";
  argument: Expression;
}

export interface BindExpression extends Node {
  type: "BindExpression";
  object: Expression;
  callee: Expression;
}

export interface Decorator extends Node {
  type: "Decorator";
  expression: Expression;
}

export interface DoExpression extends Node {
  type: "DoExpression";
  body: BlockStatement;
}

export interface ExportDefaultSpecifier extends Node {
  type: "ExportDefaultSpecifier";
  exported: Identifier;
}

export interface ExportNamespaceSpecifier extends Node {
  type: "ExportNamespaceSpecifier";
  exported: Identifier;
}

export interface RestProperty extends Node {
  type: "RestProperty";
  argument: LVal;
}

export interface SpreadProperty extends Node {
  type: "SpreadProperty";
  argument: Expression;
}

export type Expression = ArrayExpression | AssignmentExpression | BinaryExpression | CallExpression | ConditionalExpression | FunctionExpression | Identifier | StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | RegExpLiteral | LogicalExpression | MemberExpression | NewExpression | ObjectExpression | SequenceExpression | ThisExpression | UnaryExpression | UpdateExpression | ArrowFunctionExpression | ClassExpression | MetaProperty | Super | TaggedTemplateExpression | TemplateLiteral | YieldExpression | TypeCastExpression | JSXElement | JSXEmptyExpression | JSXIdentifier | JSXMemberExpression | ParenthesizedExpression | AwaitExpression | BindExpression | DoExpression;
export type Binary = BinaryExpression | LogicalExpression;
export type Scopable = BlockStatement | CatchClause | DoWhileStatement | ForInStatement | ForStatement | FunctionDeclaration | FunctionExpression | Program | ObjectMethod | SwitchStatement | WhileStatement | ArrowFunctionExpression | ClassDeclaration | ClassExpression | ForOfStatement | ClassMethod;
export type BlockParent = BlockStatement | DoWhileStatement | ForInStatement | ForStatement | FunctionDeclaration | FunctionExpression | Program | ObjectMethod | SwitchStatement | WhileStatement | ArrowFunctionExpression | ForOfStatement | ClassMethod;
export type Block = BlockStatement | Program;
export type Statement = BlockStatement | BreakStatement | ContinueStatement | DebuggerStatement | DoWhileStatement | EmptyStatement | ExpressionStatement | ForInStatement | ForStatement | FunctionDeclaration | IfStatement | LabeledStatement | ReturnStatement | SwitchStatement | ThrowStatement | TryStatement | VariableDeclaration | WhileStatement | WithStatement | ClassDeclaration | ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration | ForOfStatement | ImportDeclaration | DeclareClass | DeclareFunction | DeclareInterface | DeclareModule | DeclareTypeAlias | DeclareVariable | InterfaceDeclaration | TypeAlias;
export type Terminatorless = BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement | YieldExpression | AwaitExpression;
export type CompletionStatement = BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement;
export type Conditional = ConditionalExpression | IfStatement;
export type Loop = DoWhileStatement | ForInStatement | ForStatement | WhileStatement | ForOfStatement;
export type While = DoWhileStatement | WhileStatement;
export type ExpressionWrapper = ExpressionStatement | TypeCastExpression | ParenthesizedExpression;
export type For = ForInStatement | ForStatement | ForOfStatement;
export type ForXStatement = ForInStatement | ForOfStatement;
export type Function = FunctionDeclaration | FunctionExpression | ObjectMethod | ArrowFunctionExpression | ClassMethod;
export type FunctionParent = FunctionDeclaration | FunctionExpression | Program | ObjectMethod | ArrowFunctionExpression | ClassMethod;
export type Pureish = FunctionDeclaration | FunctionExpression | StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | ArrowFunctionExpression | ClassDeclaration | ClassExpression;
export type Declaration = FunctionDeclaration | VariableDeclaration | ClassDeclaration | ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration | ImportDeclaration | DeclareClass | DeclareFunction | DeclareInterface | DeclareModule | DeclareTypeAlias | DeclareVariable | InterfaceDeclaration | TypeAlias;
export type LVal = Identifier | MemberExpression | RestElement | AssignmentPattern | ArrayPattern | ObjectPattern;
export type Literal = StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | RegExpLiteral | TemplateLiteral;
export type Immutable = StringLiteral | NumericLiteral | BooleanLiteral | NullLiteral | JSXAttribute | JSXClosingElement | JSXElement | JSXExpressionContainer | JSXOpeningElement;
export type UserWhitespacable = ObjectMethod | ObjectProperty | ObjectTypeCallProperty | ObjectTypeIndexer | ObjectTypeProperty;
export type Method = ObjectMethod | ClassMethod;
export type ObjectMember = ObjectMethod | ObjectProperty;
export type Property = ObjectProperty | ClassProperty;
export type UnaryLike = UnaryExpression | SpreadElement | RestProperty | SpreadProperty;
export type Pattern = AssignmentPattern | ArrayPattern | ObjectPattern;
export type Class = ClassDeclaration | ClassExpression;
export type ModuleDeclaration = ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration | ImportDeclaration;
export type ExportDeclaration = ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration;
export type ModuleSpecifier = ExportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier | ExportDefaultSpecifier | ExportNamespaceSpecifier;
export type Flow = AnyTypeAnnotation | ArrayTypeAnnotation | BooleanTypeAnnotation | BooleanLiteralTypeAnnotation | ClassImplements | ClassProperty | DeclareClass | DeclareFunction | DeclareInterface | DeclareModule | DeclareTypeAlias | DeclareVariable | ExistentialTypeParam | FunctionTypeAnnotation | FunctionTypeParam | GenericTypeAnnotation | InterfaceExtends | InterfaceDeclaration | IntersectionTypeAnnotation | MixedTypeAnnotation | NullableTypeAnnotation | NumericLiteralTypeAnnotation | NumberTypeAnnotation | StringLiteralTypeAnnotation | StringTypeAnnotation | ThisTypeAnnotation | TupleTypeAnnotation | TypeofTypeAnnotation | TypeAlias | TypeAnnotation | TypeCastExpression | TypeParameterDeclaration | TypeParameterInstantiation | ObjectTypeAnnotation | ObjectTypeCallProperty | ObjectTypeIndexer | ObjectTypeProperty | QualifiedTypeIdentifier | UnionTypeAnnotation | VoidTypeAnnotation;
export type FlowTypeAnnotation = AnyTypeAnnotation | ArrayTypeAnnotation | BooleanTypeAnnotation | BooleanLiteralTypeAnnotation | FunctionTypeAnnotation | GenericTypeAnnotation | IntersectionTypeAnnotation | MixedTypeAnnotation | NullableTypeAnnotation | NumericLiteralTypeAnnotation | NumberTypeAnnotation | StringLiteralTypeAnnotation | StringTypeAnnotation | ThisTypeAnnotation | TupleTypeAnnotation | TypeofTypeAnnotation | TypeAnnotation | ObjectTypeAnnotation | UnionTypeAnnotation | VoidTypeAnnotation;
export type FlowBaseAnnotation = AnyTypeAnnotation | BooleanTypeAnnotation | MixedTypeAnnotation | NumberTypeAnnotation | StringTypeAnnotation | ThisTypeAnnotation | VoidTypeAnnotation;
export type FlowDeclaration = DeclareClass | DeclareFunction | DeclareInterface | DeclareModule | DeclareTypeAlias | DeclareVariable | InterfaceDeclaration | TypeAlias;
export type JSX = JSXAttribute | JSXClosingElement | JSXElement | JSXEmptyExpression | JSXExpressionContainer | JSXIdentifier | JSXMemberExpression | JSXNamespacedName | JSXOpeningElement | JSXSpreadAttribute | JSXText;

export type Types = {
  is(type: string, node: Object, opts?: Object): boolean,
  isType(nodeType: string, targetType: string): boolean,
  validate(node?: Object, key: string, val: any): void,
  shallowEqual(actual: Object, expected: Object): boolean,

  appendToMemberExpression(member: MemberExpression, append: Node, computed?: boolean): MemberExpression,
  prependToMemberExpression(member: MemberExpression, prepend: Node): MemberExpression,

  ensureBlock(node: Node, key?: string): Node,

  clone(node: Node): Node,
  cloneWithoutLoc(node: Node): Node,
  cloneDeep(node: Node): Node,

  matchesPattern(member: Node, match: string | Array<string>, allowPartial?: boolean): boolean,

  removeComments(node: Node): Node,
  inheritsComments(child: Node, parent: Node): Node,
  inheritTrailingComments(child: Node, parent: Node): void,
  inheritLeadingComments(child: Node, parent: Node): void,
  inheritInnerComments(child: Node, parent: Node): void,
  inherits(child: Node, parent: Node): Node,

  assertNode(node: ?Object): void,
  isNode(node: ?Object): boolean,

  traverseFast(node: Node, enter: (node: Node) => void, opts?: Object): void,

  removeProperties(node: Node, opts?: Object): void,
  removePropertiesDeep(tree: Node, opts?: Object): void,

  getBindingIdentifiers(node: Node, duplicates?: boolean, outerOnly?: boolean): { [key: string]: Identifier },
  getOuterBindingIdentifiers(node: Node, duplicates?: boolean): { [key: string]: Identifier },

  isBinding(node: Node, parent: Node): boolean,
  isReferenced(node: Node, parent: Node): boolean,
  isValidIdentifier(name: string): boolean,
  isLet(node: Node): boolean,
  isBlockScoped(node: Node): boolean,
  isVar(node: Node): boolean,
  isSpecifierDefault(specifier: Node): boolean,
  isScope(node: Node, parent: Node): boolean,
  isImmutable(node: Node): boolean,
  isNodesEquivalent(a: Node, b: Node): boolean,

  toComputedKey(node: Node, key?: Node): Node,
  toSequenceExpression(nodes: Array<Node>, scope: BabelScope): ?Node,
  toKeyAlias(node: Node, key?: Node): string,
  toIdentifier(name: string): Identifier,
  toBindingIdentifierName(name: string): string,
  toStatement(node: Node, ignore?: boolean): Node | false,
  toExpression(node: Node): Node,
  toBlock(node: Node, parent: Node): Node,
  valueToNode(value: mixed): Node,

  createUnionTypeAnnotation(types: Array<Node>): Node,
  removeTypeDuplicates(nodes: Array<Node>): Array<Node>,
  createTypeAnnotationBasedOnTypeof(type: string): Node,

  arrayExpression(elements?: Array<Expression | SpreadElement>): ArrayExpression;
  assignmentExpression(operator?: string, left?: LVal, right?: Expression): AssignmentExpression;
  binaryExpression(operator?: "+" | "-" | "/" | "%" | "*" | "**" | "&" | "|" | ">>" | ">>>" | "<<" | "^" | "==" | "===" | "!=" | "!==" | "in" | "instanceof" | ">" | "<" | ">=" | "<=", left?: Expression, right?: Expression): BinaryExpression;
  directive(value?: DirectiveLiteral): Directive;
  directiveLiteral(value?: string): DirectiveLiteral;
  blockStatement(body?: Statement[], directives?: Directive[]): BlockStatement;
  breakStatement(label?: Identifier): BreakStatement;
  callExpression(callee?: Expression, _arguments?: Array<Expression | SpreadElement>): CallExpression;
  catchClause(param?: Identifier, body?: BlockStatement): CatchClause;
  conditionalExpression(test?: Expression, consequent?: Expression, alternate?: Expression): ConditionalExpression;
  continueStatement(label?: Identifier): ContinueStatement;
  debuggerStatement(): DebuggerStatement;
  doWhileStatement(test?: Expression, body?: Statement): DoWhileStatement;
  emptyStatement(): EmptyStatement;
  expressionStatement(expression?: Expression): ExpressionStatement;
  file(program?: Program, comments?: Comment[], tokens?: any[]): File;
  forInStatement(left?: VariableDeclaration | LVal, right?: Expression, body?: Statement): ForInStatement;
  forStatement(init?: VariableDeclaration | Expression, test?: Expression, update?: Expression, body?: Statement): ForStatement;
  functionDeclaration(id?: Identifier, params?: Array<LVal>, body?: BlockStatement, generator?: boolean, async?: boolean): FunctionDeclaration;
  functionExpression(id?: Identifier, params?: Array<LVal>, body?: BlockStatement, generator?: boolean, async?: boolean): FunctionExpression;
  identifier(name?: string): Identifier;
  ifStatement(test?: Expression, consequent?: Statement, alternate?: Statement): IfStatement;
  labeledStatement(label?: Identifier, body?: Statement): LabeledStatement;
  stringLiteral(value?: string): StringLiteral;
  numericLiteral(value?: number): NumericLiteral;
  nullLiteral(): NullLiteral;
  booleanLiteral(value?: boolean): BooleanLiteral;
  regExpLiteral(pattern?: string, flags?: string): RegExpLiteral;
  logicalExpression(operator?: "||" | "&&", left?: Expression, right?: Expression): LogicalExpression;
  memberExpression(object?: Expression | Super, property?: Expression, computed?: boolean): MemberExpression;
  newExpression(callee?: Expression | Super, _arguments?: Array<Expression | SpreadElement>): NewExpression;
  program(body?: Array<Statement | ModuleDeclaration>, directives?: Directive[]): Program;
  objectExpression(properties?: Array<ObjectProperty | ObjectMethod | SpreadProperty>): ObjectExpression;
  objectMethod(kind?: "get" | "set" | "method", key?: Expression, params?: Array<LVal>, body?: BlockStatement, computed?: boolean): ObjectMethod;
  objectProperty(key?: Expression, value?: Expression, computed?: boolean, shorthand?: boolean, decorators?: Decorator[]): ObjectProperty;
  restElement(argument?: LVal, typeAnnotation?: TypeAnnotation): RestElement;
  returnStatement(argument?: Expression): ReturnStatement;
  sequenceExpression(expressions?: Expression[]): SequenceExpression;
  switchCase(test?: Expression, consequent?: Statement[]): SwitchCase;
  switchStatement(discriminant?: Expression, cases?: SwitchCase[]): SwitchStatement;
  thisExpression(): ThisExpression;
  throwStatement(argument?: Expression): ThrowStatement;
  tryStatement(block?: BlockStatement, handler?: CatchClause, finalizer?: BlockStatement): TryStatement;
  unaryExpression(operator?: "void" | "delete" | "!" | "+" | "-" | "++" | "--" | "~" | "typeof", argument?: Expression, prefix?: boolean): UnaryExpression;
  updateExpression(operator?: "++" | "--", argument?: Expression, prefix?: boolean): UpdateExpression;
  variableDeclaration(kind?: "var" | "let" | "const", declarations?: VariableDeclarator[]): VariableDeclaration;
  variableDeclarator(id?: LVal, init?: Expression): VariableDeclarator;
  whileStatement(test?: Expression, body?: BlockStatement | Statement): WhileStatement;
  withStatement(object?: Expression, body?: BlockStatement | Statement): WithStatement;
  assignmentPattern(left?: Identifier, right?: Expression): AssignmentPattern;
  arrayPattern(elements?: Array<Expression>, typeAnnotation?: TypeAnnotation): ArrayPattern;
  arrowFunctionExpression(params?: Array<LVal>, body?: BlockStatement | Expression, async?: boolean): ArrowFunctionExpression;
  classBody(body?: Array<ClassMethod | ClassProperty>): ClassBody;
  classDeclaration(id?: Identifier, superClass?: Expression, body?: ClassBody, decorators?: Decorator[]): ClassDeclaration;
  classExpression(id?: Identifier, superClass?: Expression, body?: ClassBody, decorators?: Decorator[]): ClassExpression;
  exportAllDeclaration(source?: StringLiteral): ExportAllDeclaration;
  exportDefaultDeclaration(declaration?: FunctionDeclaration | ClassDeclaration | Expression): ExportDefaultDeclaration;
  exportNamedDeclaration(declaration?: Declaration, specifiers?: ExportSpecifier[], source?: StringLiteral): ExportNamedDeclaration;
  exportSpecifier(local?: Identifier, exported?: Identifier): ExportSpecifier;
  forOfStatement(left?: VariableDeclaration | LVal, right?: Expression, body?: Statement): ForOfStatement;
  importDeclaration(specifiers?: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>, source?: StringLiteral): ImportDeclaration;
  importDefaultSpecifier(local?: Identifier): ImportDefaultSpecifier;
  importNamespaceSpecifier(local?: Identifier): ImportNamespaceSpecifier;
  importSpecifier(local?: Identifier, imported?: Identifier): ImportSpecifier;
  metaProperty(meta?: string, property?: string): MetaProperty;
  classMethod(kind?: "constructor" | "method" | "get" | "set", key?: Expression, params?: Array<LVal>, body?: BlockStatement, computed?: boolean, _static?: boolean): ClassMethod;
  objectPattern(properties?: Array<AssignmentProperty | RestProperty>, typeAnnotation?: TypeAnnotation): ObjectPattern;
  spreadElement(argument?: Expression): SpreadElement;
  taggedTemplateExpression(tag?: Expression, quasi?: TemplateLiteral): TaggedTemplateExpression;
  templateElement(value?: {cooked?: string; raw?: string;}, tail?: boolean): TemplateElement;
  templateLiteral(quasis?: TemplateElement[], expressions?: Expression[]): TemplateLiteral;
  yieldExpression(argument?: Expression, delegate?: boolean): YieldExpression;
  anyTypeAnnotation(): AnyTypeAnnotation;
  arrayTypeAnnotation(elementType?: FlowTypeAnnotation): ArrayTypeAnnotation;
  booleanTypeAnnotation(): BooleanTypeAnnotation;
  booleanLiteralTypeAnnotation(): BooleanLiteralTypeAnnotation;
  nullLiteralTypeAnnotation(): NullLiteralTypeAnnotation;
  classImplements(id?: Identifier, typeParameters?: TypeParameterInstantiation): ClassImplements;
  classProperty(key?: Identifier, value?: Expression, typeAnnotation?: TypeAnnotation, decorators?: Decorator[]): ClassProperty;
  declareClass(id?: Identifier, typeParameters?: TypeParameterDeclaration, _extends?: InterfaceExtends[], body?: ObjectTypeAnnotation): DeclareClass;
  declareFunction(id?: Identifier): DeclareFunction;
  declareInterface(id?: Identifier, typeParameters?: TypeParameterDeclaration, _extends?: InterfaceExtends[], body?: ObjectTypeAnnotation): DeclareInterface;
  declareModule(id?: StringLiteral | Identifier, body?: BlockStatement): DeclareModule;
  declareTypeAlias(id?: Identifier, typeParameters?: TypeParameterDeclaration, right?: FlowTypeAnnotation): DeclareTypeAlias;
  declareVariable(id?: Identifier): DeclareVariable;
  existentialTypeParam(): ExistentialTypeParam;
  functionTypeAnnotation(typeParameters?: TypeParameterDeclaration, params?: FunctionTypeParam[], rest?: FunctionTypeParam, returnType?: FlowTypeAnnotation): FunctionTypeAnnotation;
  functionTypeParam(name?: Identifier, typeAnnotation?: FlowTypeAnnotation): FunctionTypeParam;
  genericTypeAnnotation(id?: Identifier, typeParameters?: TypeParameterInstantiation): GenericTypeAnnotation;
  interfaceExtends(id?: Identifier, typeParameters?: TypeParameterInstantiation): InterfaceExtends;
  interfaceDeclaration(id?: Identifier, typeParameters?: TypeParameterDeclaration, _extends?: InterfaceExtends[], body?: ObjectTypeAnnotation): InterfaceDeclaration;
  intersectionTypeAnnotation(types?: FlowTypeAnnotation[]): IntersectionTypeAnnotation;
  mixedTypeAnnotation(): MixedTypeAnnotation;
  nullableTypeAnnotation(typeAnnotation?: FlowTypeAnnotation): NullableTypeAnnotation;
  numericLiteralTypeAnnotation(): NumericLiteralTypeAnnotation;
  numberTypeAnnotation(): NumberTypeAnnotation;
  stringLiteralTypeAnnotation(): StringLiteralTypeAnnotation;
  stringTypeAnnotation(): StringTypeAnnotation;
  thisTypeAnnotation(): ThisTypeAnnotation;
  tupleTypeAnnotation(types?: FlowTypeAnnotation[]): TupleTypeAnnotation;
  typeofTypeAnnotation(argument?: FlowTypeAnnotation): TypeofTypeAnnotation;
  typeAlias(id?: Identifier, typeParameters?: TypeParameterDeclaration, right?: FlowTypeAnnotation): TypeAlias;
  typeAnnotation(typeAnnotation?: FlowTypeAnnotation): TypeAnnotation;
  typeCastExpression(expression?: Expression, typeAnnotation?: FlowTypeAnnotation): TypeCastExpression;
  typeParameterDeclaration(params?: Identifier[]): TypeParameterDeclaration;
  typeParameterInstantiation(params?: FlowTypeAnnotation[]): TypeParameterInstantiation;
  objectTypeAnnotation(properties?: ObjectTypeProperty[], indexers?: ObjectTypeIndexer[], callProperties?: ObjectTypeCallProperty[]): ObjectTypeAnnotation;
  objectTypeCallProperty(value?: FlowTypeAnnotation): ObjectTypeCallProperty;
  objectTypeIndexer(id?: Expression, key?: FlowTypeAnnotation, value?: FlowTypeAnnotation): ObjectTypeIndexer;
  objectTypeProperty(key?: Expression, value?: FlowTypeAnnotation): ObjectTypeProperty;
  qualifiedTypeIdentifier(id?: Identifier, qualification?: Identifier | QualifiedTypeIdentifier): QualifiedTypeIdentifier;
  unionTypeAnnotation(types?: FlowTypeAnnotation[]): UnionTypeAnnotation;
  voidTypeAnnotation(): VoidTypeAnnotation;
  jSXAttribute(name?: JSXIdentifier | JSXNamespacedName, value?: JSXElement | StringLiteral | JSXExpressionContainer): JSXAttribute;
  jSXClosingElement(name?: JSXIdentifier | JSXMemberExpression): JSXClosingElement;
  jSXElement(openingElement?: JSXOpeningElement, closingElement?: JSXClosingElement, children?: Array<JSXElement | JSXExpressionContainer | JSXText>, selfClosing?: boolean): JSXElement;
  jSXEmptyExpression(): JSXEmptyExpression;
  jSXExpressionContainer(expression?: Expression): JSXExpressionContainer;
  jSXIdentifier(name?: string): JSXIdentifier;
  jSXMemberExpression(object?: JSXMemberExpression | JSXIdentifier, property?: JSXIdentifier): JSXMemberExpression;
  jSXNamespacedName(namespace?: JSXIdentifier, name?: JSXIdentifier): JSXNamespacedName;
  jSXOpeningElement(name?: JSXIdentifier | JSXMemberExpression, attributes?: JSXAttribute[], selfClosing?: boolean): JSXOpeningElement;
  jSXSpreadAttribute(argument?: Expression): JSXSpreadAttribute;
  jSXText(value?: string): JSXText;
  noop(): Noop;
  parenthesizedExpression(expression?: Expression): ParenthesizedExpression;
  awaitExpression(argument?: Expression): AwaitExpression;
  bindExpression(object?: Expression, callee?: Expression): BindExpression;
  decorator(expression?: Expression): Decorator;
  doExpression(body?: BlockStatement): DoExpression;
  exportDefaultSpecifier(exported?: Identifier): ExportDefaultSpecifier;
  exportNamespaceSpecifier(exported?: Identifier): ExportNamespaceSpecifier;
  restProperty(argument?: LVal): RestProperty;
  spreadProperty(argument?: Expression): SpreadProperty;

  isArrayExpression(node: Object, opts?: Object): boolean; //: node is ArrayExpression;
  isAssignmentExpression(node: Object, opts?: Object): boolean; //: node is AssignmentExpression;
  isBinaryExpression(node: Object, opts?: Object): boolean; //: node is BinaryExpression;
  isDirective(node: Object, opts?: Object): boolean; //: node is Directive;
  isDirectiveLiteral(node: Object, opts?: Object): boolean; //: node is DirectiveLiteral;
  isBlockStatement(node: Object, opts?: Object): boolean; //: node is BlockStatement;
  isBreakStatement(node: Object, opts?: Object): boolean; //: node is BreakStatement;
  isCallExpression(node: Object, opts?: Object): boolean; //: node is CallExpression;
  isCatchClause(node: Object, opts?: Object): boolean; //: node is CatchClause;
  isConditionalExpression(node: Object, opts?: Object): boolean; //: node is ConditionalExpression;
  isContinueStatement(node: Object, opts?: Object): boolean; //: node is ContinueStatement;
  isDebuggerStatement(node: Object, opts?: Object): boolean; //: node is DebuggerStatement;
  isDoWhileStatement(node: Object, opts?: Object): boolean; //: node is DoWhileStatement;
  isEmptyStatement(node: Object, opts?: Object): boolean; //: node is EmptyStatement;
  isExpressionStatement(node: Object, opts?: Object): boolean; //: node is ExpressionStatement;
  isFile(node: Object, opts?: Object): boolean; //: node is File;
  isForInStatement(node: Object, opts?: Object): boolean; //: node is ForInStatement;
  isForStatement(node: Object, opts?: Object): boolean; //: node is ForStatement;
  isFunctionDeclaration(node: Object, opts?: Object): boolean; //: node is FunctionDeclaration;
  isFunctionExpression(node: Object, opts?: Object): boolean; //: node is FunctionExpression;
  isIdentifier(node: Object, opts?: Object): boolean; //: node is Identifier;
  isIfStatement(node: Object, opts?: Object): boolean; //: node is IfStatement;
  isLabeledStatement(node: Object, opts?: Object): boolean; //: node is LabeledStatement;
  isStringLiteral(node: Object, opts?: Object): boolean; //: node is StringLiteral;
  isNumericLiteral(node: Object, opts?: Object): boolean; //: node is NumericLiteral;
  isNullLiteral(node: Object, opts?: Object): boolean; //: node is NullLiteral;
  isBooleanLiteral(node: Object, opts?: Object): boolean; //: node is BooleanLiteral;
  isRegExpLiteral(node: Object, opts?: Object): boolean; //: node is RegExpLiteral;
  isLogicalExpression(node: Object, opts?: Object): boolean; //: node is LogicalExpression;
  isMemberExpression(node: Object, opts?: Object): boolean; //: node is MemberExpression;
  isNewExpression(node: Object, opts?: Object): boolean; //: node is NewExpression;
  isProgram(node: Object, opts?: Object): boolean; //: node is Program;
  isObjectExpression(node: Object, opts?: Object): boolean; //: node is ObjectExpression;
  isObjectMethod(node: Object, opts?: Object): boolean; //: node is ObjectMethod;
  isObjectProperty(node: Object, opts?: Object): boolean; //: node is ObjectProperty;
  isRestElement(node: Object, opts?: Object): boolean; //: node is RestElement;
  isReturnStatement(node: Object, opts?: Object): boolean; //: node is ReturnStatement;
  isSequenceExpression(node: Object, opts?: Object): boolean; //: node is SequenceExpression;
  isSwitchCase(node: Object, opts?: Object): boolean; //: node is SwitchCase;
  isSwitchStatement(node: Object, opts?: Object): boolean; //: node is SwitchStatement;
  isThisExpression(node: Object, opts?: Object): boolean; //: node is ThisExpression;
  isThrowStatement(node: Object, opts?: Object): boolean; //: node is ThrowStatement;
  isTryStatement(node: Object, opts?: Object): boolean; //: node is TryStatement;
  isUnaryExpression(node: Object, opts?: Object): boolean; //: node is UnaryExpression;
  isUpdateExpression(node: Object, opts?: Object): boolean; //: node is UpdateExpression;
  isVariableDeclaration(node: Object, opts?: Object): boolean; //: node is VariableDeclaration;
  isVariableDeclarator(node: Object, opts?: Object): boolean; //: node is VariableDeclarator;
  isWhileStatement(node: Object, opts?: Object): boolean; //: node is WhileStatement;
  isWithStatement(node: Object, opts?: Object): boolean; //: node is WithStatement;
  isAssignmentPattern(node: Object, opts?: Object): boolean; //: node is AssignmentPattern;
  isArrayPattern(node: Object, opts?: Object): boolean; //: node is ArrayPattern;
  isArrowFunctionExpression(node: Object, opts?: Object): boolean; //: node is ArrowFunctionExpression;
  isClassBody(node: Object, opts?: Object): boolean; //: node is ClassBody;
  isClassDeclaration(node: Object, opts?: Object): boolean; //: node is ClassDeclaration;
  isClassExpression(node: Object, opts?: Object): boolean; //: node is ClassExpression;
  isExportAllDeclaration(node: Object, opts?: Object): boolean; //: node is ExportAllDeclaration;
  isExportDefaultDeclaration(node: Object, opts?: Object): boolean; //: node is ExportDefaultDeclaration;
  isExportNamedDeclaration(node: Object, opts?: Object): boolean; //: node is ExportNamedDeclaration;
  isExportSpecifier(node: Object, opts?: Object): boolean; //: node is ExportSpecifier;
  isForOfStatement(node: Object, opts?: Object): boolean; //: node is ForOfStatement;
  isImportDeclaration(node: Object, opts?: Object): boolean; //: node is ImportDeclaration;
  isImportDefaultSpecifier(node: Object, opts?: Object): boolean; //: node is ImportDefaultSpecifier;
  isImportNamespaceSpecifier(node: Object, opts?: Object): boolean; //: node is ImportNamespaceSpecifier;
  isImportSpecifier(node: Object, opts?: Object): boolean; //: node is ImportSpecifier;
  isMetaProperty(node: Object, opts?: Object): boolean; //: node is MetaProperty;
  isClassMethod(node: Object, opts?: Object): boolean; //: node is ClassMethod;
  isObjectPattern(node: Object, opts?: Object): boolean; //: node is ObjectPattern;
  isSpreadElement(node: Object, opts?: Object): boolean; //: node is SpreadElement;
  isSuper(node: Object, opts?: Object): boolean; //: node is Super;
  isTaggedTemplateExpression(node: Object, opts?: Object): boolean; //: node is TaggedTemplateExpression;
  isTemplateElement(node: Object, opts?: Object): boolean; //: node is TemplateElement;
  isTemplateLiteral(node: Object, opts?: Object): boolean; //: node is TemplateLiteral;
  isYieldExpression(node: Object, opts?: Object): boolean; //: node is YieldExpression;
  isAnyTypeAnnotation(node: Object, opts?: Object): boolean; //: node is AnyTypeAnnotation;
  isArrayTypeAnnotation(node: Object, opts?: Object): boolean; //: node is ArrayTypeAnnotation;
  isBooleanTypeAnnotation(node: Object, opts?: Object): boolean; //: node is BooleanTypeAnnotation;
  isBooleanLiteralTypeAnnotation(node: Object, opts?: Object): boolean; //: node is BooleanLiteralTypeAnnotation;
  isNullLiteralTypeAnnotation(node: Object, opts?: Object): boolean; //: node is NullLiteralTypeAnnotation;
  isClassImplements(node: Object, opts?: Object): boolean; //: node is ClassImplements;
  isClassProperty(node: Object, opts?: Object): boolean; //: node is ClassProperty;
  isDeclareClass(node: Object, opts?: Object): boolean; //: node is DeclareClass;
  isDeclareFunction(node: Object, opts?: Object): boolean; //: node is DeclareFunction;
  isDeclareInterface(node: Object, opts?: Object): boolean; //: node is DeclareInterface;
  isDeclareModule(node: Object, opts?: Object): boolean; //: node is DeclareModule;
  isDeclareTypeAlias(node: Object, opts?: Object): boolean; //: node is DeclareTypeAlias;
  isDeclareVariable(node: Object, opts?: Object): boolean; //: node is DeclareVariable;
  isExistentialTypeParam(node: Object, opts?: Object): boolean; //: node is ExistentialTypeParam;
  isFunctionTypeAnnotation(node: Object, opts?: Object): boolean; //: node is FunctionTypeAnnotation;
  isFunctionTypeParam(node: Object, opts?: Object): boolean; //: node is FunctionTypeParam;
  isGenericTypeAnnotation(node: Object, opts?: Object): boolean; //: node is GenericTypeAnnotation;
  isInterfaceExtends(node: Object, opts?: Object): boolean; //: node is InterfaceExtends;
  isInterfaceDeclaration(node: Object, opts?: Object): boolean; //: node is InterfaceDeclaration;
  isIntersectionTypeAnnotation(node: Object, opts?: Object): boolean; //: node is IntersectionTypeAnnotation;
  isMixedTypeAnnotation(node: Object, opts?: Object): boolean; //: node is MixedTypeAnnotation;
  isNullableTypeAnnotation(node: Object, opts?: Object): boolean; //: node is NullableTypeAnnotation;
  isNumericLiteralTypeAnnotation(node: Object, opts?: Object): boolean; //: node is NumericLiteralTypeAnnotation;
  isNumberTypeAnnotation(node: Object, opts?: Object): boolean; //: node is NumberTypeAnnotation;
  isStringLiteralTypeAnnotation(node: Object, opts?: Object): boolean; //: node is StringLiteralTypeAnnotation;
  isStringTypeAnnotation(node: Object, opts?: Object): boolean; //: node is StringTypeAnnotation;
  isThisTypeAnnotation(node: Object, opts?: Object): boolean; //: node is ThisTypeAnnotation;
  isTupleTypeAnnotation(node: Object, opts?: Object): boolean; //: node is TupleTypeAnnotation;
  isTypeofTypeAnnotation(node: Object, opts?: Object): boolean; //: node is TypeofTypeAnnotation;
  isTypeAlias(node: Object, opts?: Object): boolean; //: node is TypeAlias;
  isTypeAnnotation(node: Object, opts?: Object): boolean; //: node is TypeAnnotation;
  isTypeCastExpression(node: Object, opts?: Object): boolean; //: node is TypeCastExpression;
  isTypeParameterDeclaration(node: Object, opts?: Object): boolean; //: node is TypeParameterDeclaration;
  isTypeParameterInstantiation(node: Object, opts?: Object): boolean; //: node is TypeParameterInstantiation;
  isObjectTypeAnnotation(node: Object, opts?: Object): boolean; //: node is ObjectTypeAnnotation;
  isObjectTypeCallProperty(node: Object, opts?: Object): boolean; //: node is ObjectTypeCallProperty;
  isObjectTypeIndexer(node: Object, opts?: Object): boolean; //: node is ObjectTypeIndexer;
  isObjectTypeProperty(node: Object, opts?: Object): boolean; //: node is ObjectTypeProperty;
  isQualifiedTypeIdentifier(node: Object, opts?: Object): boolean; //: node is QualifiedTypeIdentifier;
  isUnionTypeAnnotation(node: Object, opts?: Object): boolean; //: node is UnionTypeAnnotation;
  isVoidTypeAnnotation(node: Object, opts?: Object): boolean; //: node is VoidTypeAnnotation;
  isJSXAttribute(node: Object, opts?: Object): boolean; //: node is JSXAttribute;
  isJSXClosingElement(node: Object, opts?: Object): boolean; //: node is JSXClosingElement;
  isJSXElement(node: Object, opts?: Object): boolean; //: node is JSXElement;
  isJSXEmptyExpression(node: Object, opts?: Object): boolean; //: node is JSXEmptyExpression;
  isJSXExpressionContainer(node: Object, opts?: Object): boolean; //: node is JSXExpressionContainer;
  isJSXIdentifier(node: Object, opts?: Object): boolean; //: node is JSXIdentifier;
  isJSXMemberExpression(node: Object, opts?: Object): boolean; //: node is JSXMemberExpression;
  isJSXNamespacedName(node: Object, opts?: Object): boolean; //: node is JSXNamespacedName;
  isJSXOpeningElement(node: Object, opts?: Object): boolean; //: node is JSXOpeningElement;
  isJSXSpreadAttribute(node: Object, opts?: Object): boolean; //: node is JSXSpreadAttribute;
  isJSXText(node: Object, opts?: Object): boolean; //: node is JSXText;
  isNoop(node: Object, opts?: Object): boolean; //: node is Noop;
  isParenthesizedExpression(node: Object, opts?: Object): boolean; //: node is ParenthesizedExpression;
  isAwaitExpression(node: Object, opts?: Object): boolean; //: node is AwaitExpression;
  isBindExpression(node: Object, opts?: Object): boolean; //: node is BindExpression;
  isDecorator(node: Object, opts?: Object): boolean; //: node is Decorator;
  isDoExpression(node: Object, opts?: Object): boolean; //: node is DoExpression;
  isExportDefaultSpecifier(node: Object, opts?: Object): boolean; //: node is ExportDefaultSpecifier;
  isExportNamespaceSpecifier(node: Object, opts?: Object): boolean; //: node is ExportNamespaceSpecifier;
  isRestProperty(node: Object, opts?: Object): boolean; //: node is RestProperty;
  isSpreadProperty(node: Object, opts?: Object): boolean; //: node is SpreadProperty;
  isExpression(node: Object, opts?: Object): boolean; //: node is Expression;
  isBinary(node: Object, opts?: Object): boolean; //: node is Binary;
  isScopable(node: Object, opts?: Object): boolean; //: node is Scopable;
  isBlockParent(node: Object, opts?: Object): boolean; //: node is BlockParent;
  isBlock(node: Object, opts?: Object): boolean; //: node is Block;
  isStatement(node: Object, opts?: Object): boolean; //: node is Statement;
  isTerminatorless(node: Object, opts?: Object): boolean; //: node is Terminatorless;
  isCompletionStatement(node: Object, opts?: Object): boolean; //: node is CompletionStatement;
  isConditional(node: Object, opts?: Object): boolean; //: node is Conditional;
  isLoop(node: Object, opts?: Object): boolean; //: node is Loop;
  isWhile(node: Object, opts?: Object): boolean; //: node is While;
  isExpressionWrapper(node: Object, opts?: Object): boolean; //: node is ExpressionWrapper;
  isFor(node: Object, opts?: Object): boolean; //: node is For;
  isForXStatement(node: Object, opts?: Object): boolean; //: node is ForXStatement;
  isFunction(node: Object, opts?: Object): boolean; //: node is Function;
  isFunctionParent(node: Object, opts?: Object): boolean; //: node is FunctionParent;
  isPureish(node: Object, opts?: Object): boolean; //: node is Pureish;
  isDeclaration(node: Object, opts?: Object): boolean; //: node is Declaration;
  isLVal(node: Object, opts?: Object): boolean; //: node is LVal;
  isLiteral(node: Object, opts?: Object): boolean; //: node is Literal;
  isImmutable(node: Object, opts?: Object): boolean; //: node is Immutable;
  isUserWhitespacable(node: Object, opts?: Object): boolean; //: node is UserWhitespacable;
  isMethod(node: Object, opts?: Object): boolean; //: node is Method;
  isObjectMember(node: Object, opts?: Object): boolean; //: node is ObjectMember;
  isProperty(node: Object, opts?: Object): boolean; //: node is Property;
  isUnaryLike(node: Object, opts?: Object): boolean; //: node is UnaryLike;
  isPattern(node: Object, opts?: Object): boolean; //: node is Pattern;
  isClass(node: Object, opts?: Object): boolean; //: node is Class;
  isModuleDeclaration(node: Object, opts?: Object): boolean; //: node is ModuleDeclaration;
  isExportDeclaration(node: Object, opts?: Object): boolean; //: node is ExportDeclaration;
  isModuleSpecifier(node: Object, opts?: Object): boolean; //: node is ModuleSpecifier;
  isFlow(node: Object, opts?: Object): boolean; //: node is Flow;
  isFlowBaseAnnotation(node: Object, opts?: Object): boolean; //: node is FlowBaseAnnotation;
  isFlowDeclaration(node: Object, opts?: Object): boolean; //: node is FlowDeclaration;
  isJSX(node: Object, opts?: Object): boolean; //: node is JSX;
  isNumberLiteral(node: Object, opts?: Object): boolean; //: node is NumericLiteral;
  isRegexLiteral(node: Object, opts?: Object): boolean; //: node is RegExpLiteral;

  isReferencedIdentifier(node: Object, opts?: Object): boolean;
  isReferencedMemberExpression(node: Object, opts?: Object): boolean;
  isBindingIdentifier(node: Object, opts?: Object): boolean;
  isScope(node: Object, opts?: Object): boolean;
  isReferenced(node: Object, opts?: Object): boolean;
  isBlockScoped(node: Object, opts?: Object): boolean;
  isVar(node: Object, opts?: Object): boolean;
  isUser(node: Object, opts?: Object): boolean;
  isGenerated(node: Object, opts?: Object): boolean;
  isPure(node: Object, opts?: Object): boolean;

  assertArrayExpression(node: Object, opts?: Object): void;
  assertAssignmentExpression(node: Object, opts?: Object): void;
  assertBinaryExpression(node: Object, opts?: Object): void;
  assertDirective(node: Object, opts?: Object): void;
  assertDirectiveLiteral(node: Object, opts?: Object): void;
  assertBlockStatement(node: Object, opts?: Object): void;
  assertBreakStatement(node: Object, opts?: Object): void;
  assertCallExpression(node: Object, opts?: Object): void;
  assertCatchClause(node: Object, opts?: Object): void;
  assertConditionalExpression(node: Object, opts?: Object): void;
  assertContinueStatement(node: Object, opts?: Object): void;
  assertDebuggerStatement(node: Object, opts?: Object): void;
  assertDoWhileStatement(node: Object, opts?: Object): void;
  assertEmptyStatement(node: Object, opts?: Object): void;
  assertExpressionStatement(node: Object, opts?: Object): void;
  assertFile(node: Object, opts?: Object): void;
  assertForInStatement(node: Object, opts?: Object): void;
  assertForStatement(node: Object, opts?: Object): void;
  assertFunctionDeclaration(node: Object, opts?: Object): void;
  assertFunctionExpression(node: Object, opts?: Object): void;
  assertIdentifier(node: Object, opts?: Object): void;
  assertIfStatement(node: Object, opts?: Object): void;
  assertLabeledStatement(node: Object, opts?: Object): void;
  assertStringLiteral(node: Object, opts?: Object): void;
  assertNumericLiteral(node: Object, opts?: Object): void;
  assertNullLiteral(node: Object, opts?: Object): void;
  assertBooleanLiteral(node: Object, opts?: Object): void;
  assertRegExpLiteral(node: Object, opts?: Object): void;
  assertLogicalExpression(node: Object, opts?: Object): void;
  assertMemberExpression(node: Object, opts?: Object): void;
  assertNewExpression(node: Object, opts?: Object): void;
  assertProgram(node: Object, opts?: Object): void;
  assertObjectExpression(node: Object, opts?: Object): void;
  assertObjectMethod(node: Object, opts?: Object): void;
  assertObjectProperty(node: Object, opts?: Object): void;
  assertRestElement(node: Object, opts?: Object): void;
  assertReturnStatement(node: Object, opts?: Object): void;
  assertSequenceExpression(node: Object, opts?: Object): void;
  assertSwitchCase(node: Object, opts?: Object): void;
  assertSwitchStatement(node: Object, opts?: Object): void;
  assertThisExpression(node: Object, opts?: Object): void;
  assertThrowStatement(node: Object, opts?: Object): void;
  assertTryStatement(node: Object, opts?: Object): void;
  assertUnaryExpression(node: Object, opts?: Object): void;
  assertUpdateExpression(node: Object, opts?: Object): void;
  assertVariableDeclaration(node: Object, opts?: Object): void;
  assertVariableDeclarator(node: Object, opts?: Object): void;
  assertWhileStatement(node: Object, opts?: Object): void;
  assertWithStatement(node: Object, opts?: Object): void;
  assertAssignmentPattern(node: Object, opts?: Object): void;
  assertArrayPattern(node: Object, opts?: Object): void;
  assertArrowFunctionExpression(node: Object, opts?: Object): void;
  assertClassBody(node: Object, opts?: Object): void;
  assertClassDeclaration(node: Object, opts?: Object): void;
  assertClassExpression(node: Object, opts?: Object): void;
  assertExportAllDeclaration(node: Object, opts?: Object): void;
  assertExportDefaultDeclaration(node: Object, opts?: Object): void;
  assertExportNamedDeclaration(node: Object, opts?: Object): void;
  assertExportSpecifier(node: Object, opts?: Object): void;
  assertForOfStatement(node: Object, opts?: Object): void;
  assertImportDeclaration(node: Object, opts?: Object): void;
  assertImportDefaultSpecifier(node: Object, opts?: Object): void;
  assertImportNamespaceSpecifier(node: Object, opts?: Object): void;
  assertImportSpecifier(node: Object, opts?: Object): void;
  assertMetaProperty(node: Object, opts?: Object): void;
  assertClassMethod(node: Object, opts?: Object): void;
  assertObjectPattern(node: Object, opts?: Object): void;
  assertSpreadElement(node: Object, opts?: Object): void;
  assertSuper(node: Object, opts?: Object): void;
  assertTaggedTemplateExpression(node: Object, opts?: Object): void;
  assertTemplateElement(node: Object, opts?: Object): void;
  assertTemplateLiteral(node: Object, opts?: Object): void;
  assertYieldExpression(node: Object, opts?: Object): void;
  assertAnyTypeAnnotation(node: Object, opts?: Object): void;
  assertArrayTypeAnnotation(node: Object, opts?: Object): void;
  assertBooleanTypeAnnotation(node: Object, opts?: Object): void;
  assertBooleanLiteralTypeAnnotation(node: Object, opts?: Object): void;
  assertNullLiteralTypeAnnotation(node: Object, opts?: Object): void;
  assertClassImplements(node: Object, opts?: Object): void;
  assertClassProperty(node: Object, opts?: Object): void;
  assertDeclareClass(node: Object, opts?: Object): void;
  assertDeclareFunction(node: Object, opts?: Object): void;
  assertDeclareInterface(node: Object, opts?: Object): void;
  assertDeclareModule(node: Object, opts?: Object): void;
  assertDeclareTypeAlias(node: Object, opts?: Object): void;
  assertDeclareVariable(node: Object, opts?: Object): void;
  assertExistentialTypeParam(node: Object, opts?: Object): void;
  assertFunctionTypeAnnotation(node: Object, opts?: Object): void;
  assertFunctionTypeParam(node: Object, opts?: Object): void;
  assertGenericTypeAnnotation(node: Object, opts?: Object): void;
  assertInterfaceExtends(node: Object, opts?: Object): void;
  assertInterfaceDeclaration(node: Object, opts?: Object): void;
  assertIntersectionTypeAnnotation(node: Object, opts?: Object): void;
  assertMixedTypeAnnotation(node: Object, opts?: Object): void;
  assertNullableTypeAnnotation(node: Object, opts?: Object): void;
  assertNumericLiteralTypeAnnotation(node: Object, opts?: Object): void;
  assertNumberTypeAnnotation(node: Object, opts?: Object): void;
  assertStringLiteralTypeAnnotation(node: Object, opts?: Object): void;
  assertStringTypeAnnotation(node: Object, opts?: Object): void;
  assertThisTypeAnnotation(node: Object, opts?: Object): void;
  assertTupleTypeAnnotation(node: Object, opts?: Object): void;
  assertTypeofTypeAnnotation(node: Object, opts?: Object): void;
  assertTypeAlias(node: Object, opts?: Object): void;
  assertTypeAnnotation(node: Object, opts?: Object): void;
  assertTypeCastExpression(node: Object, opts?: Object): void;
  assertTypeParameterDeclaration(node: Object, opts?: Object): void;
  assertTypeParameterInstantiation(node: Object, opts?: Object): void;
  assertObjectTypeAnnotation(node: Object, opts?: Object): void;
  assertObjectTypeCallProperty(node: Object, opts?: Object): void;
  assertObjectTypeIndexer(node: Object, opts?: Object): void;
  assertObjectTypeProperty(node: Object, opts?: Object): void;
  assertQualifiedTypeIdentifier(node: Object, opts?: Object): void;
  assertUnionTypeAnnotation(node: Object, opts?: Object): void;
  assertVoidTypeAnnotation(node: Object, opts?: Object): void;
  assertJSXAttribute(node: Object, opts?: Object): void;
  assertJSXClosingElement(node: Object, opts?: Object): void;
  assertJSXElement(node: Object, opts?: Object): void;
  assertJSXEmptyExpression(node: Object, opts?: Object): void;
  assertJSXExpressionContainer(node: Object, opts?: Object): void;
  assertJSXIdentifier(node: Object, opts?: Object): void;
  assertJSXMemberExpression(node: Object, opts?: Object): void;
  assertJSXNamespacedName(node: Object, opts?: Object): void;
  assertJSXOpeningElement(node: Object, opts?: Object): void;
  assertJSXSpreadAttribute(node: Object, opts?: Object): void;
  assertJSXText(node: Object, opts?: Object): void;
  assertNoop(node: Object, opts?: Object): void;
  assertParenthesizedExpression(node: Object, opts?: Object): void;
  assertAwaitExpression(node: Object, opts?: Object): void;
  assertBindExpression(node: Object, opts?: Object): void;
  assertDecorator(node: Object, opts?: Object): void;
  assertDoExpression(node: Object, opts?: Object): void;
  assertExportDefaultSpecifier(node: Object, opts?: Object): void;
  assertExportNamespaceSpecifier(node: Object, opts?: Object): void;
  assertRestProperty(node: Object, opts?: Object): void;
  assertSpreadProperty(node: Object, opts?: Object): void;
  assertExpression(node: Object, opts?: Object): void;
  assertBinary(node: Object, opts?: Object): void;
  assertScopable(node: Object, opts?: Object): void;
  assertBlockParent(node: Object, opts?: Object): void;
  assertBlock(node: Object, opts?: Object): void;
  assertStatement(node: Object, opts?: Object): void;
  assertTerminatorless(node: Object, opts?: Object): void;
  assertCompletionStatement(node: Object, opts?: Object): void;
  assertConditional(node: Object, opts?: Object): void;
  assertLoop(node: Object, opts?: Object): void;
  assertWhile(node: Object, opts?: Object): void;
  assertExpressionWrapper(node: Object, opts?: Object): void;
  assertFor(node: Object, opts?: Object): void;
  assertForXStatement(node: Object, opts?: Object): void;
  assertFunction(node: Object, opts?: Object): void;
  assertFunctionParent(node: Object, opts?: Object): void;
  assertPureish(node: Object, opts?: Object): void;
  assertDeclaration(node: Object, opts?: Object): void;
  assertLVal(node: Object, opts?: Object): void;
  assertLiteral(node: Object, opts?: Object): void;
  assertImmutable(node: Object, opts?: Object): void;
  assertUserWhitespacable(node: Object, opts?: Object): void;
  assertMethod(node: Object, opts?: Object): void;
  assertObjectMember(node: Object, opts?: Object): void;
  assertProperty(node: Object, opts?: Object): void;
  assertUnaryLike(node: Object, opts?: Object): void;
  assertPattern(node: Object, opts?: Object): void;
  assertClass(node: Object, opts?: Object): void;
  assertModuleDeclaration(node: Object, opts?: Object): void;
  assertExportDeclaration(node: Object, opts?: Object): void;
  assertModuleSpecifier(node: Object, opts?: Object): void;
  assertFlow(node: Object, opts?: Object): void;
  assertFlowBaseAnnotation(node: Object, opts?: Object): void;
  assertFlowDeclaration(node: Object, opts?: Object): void;
  assertJSX(node: Object, opts?: Object): void;
  assertNumberLiteral(node: Object, opts?: Object): void;
  assertRegexLiteral(node: Object, opts?: Object): void;
}
*/
