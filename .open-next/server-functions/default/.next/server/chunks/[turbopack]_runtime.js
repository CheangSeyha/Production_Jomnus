const RUNTIME_PUBLIC_PATH = "server/chunks/[turbopack]_runtime.js";
const RELATIVE_ROOT_PATH = "..";
const ASSET_PREFIX = "/";
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        // This is invoked when a module is merged into another module, thus it wasn't invoked via
        // instantiateModule and the cache entry wasn't created yet.
        module = createModuleObject(id);
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                for (const obj of reexportedObjects){
                    const value = Reflect.get(obj, prop);
                    if (value !== undefined) return value;
                }
                return undefined;
            },
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let moduleId = chunkModules[i];
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Each chunk item has a 'primary id' and optional additional ids. If the primary id is already
        // present we know all the additional ids are also present, so we don't need to check.
        if (!moduleFactories.has(moduleId)) {
            const moduleFactoryFn = chunkModules[end];
            applyModuleFactoryName(moduleFactoryFn);
            newModuleId?.(moduleId);
            for(; i < end; i++){
                moduleId = chunkModules[i];
                moduleFactories.set(moduleId, moduleFactoryFn);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime-utils.ts" />
function readWebAssemblyAsResponse(path) {
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const stream = createReadStream(path);
    // @ts-ignore unfortunately there's a slight type mismatch with the stream.
    return new Response(Readable.toWeb(stream), {
        headers: {
            'content-type': 'application/wasm'
        }
    });
}
async function compileWebAssemblyFromPath(path) {
    const response = readWebAssemblyAsResponse(path);
    return await WebAssembly.compileStreaming(response);
}
async function instantiateWebAssemblyFromPath(path, importsObj) {
    const response = readWebAssemblyAsResponse(path);
    const { instance } = await WebAssembly.instantiateStreaming(response, importsObj);
    return instance.exports;
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime-utils.ts" />
/// <reference path="../shared-node/base-externals-utils.ts" />
/// <reference path="../shared-node/node-externals-utils.ts" />
/// <reference path="../shared-node/node-wasm-utils.ts" />
var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    return SourceType;
}(SourceType || {});
process.env.TURBOPACK = '1';
const nodeContextPrototype = Context.prototype;
const url = require('url');
const moduleFactories = new Map();
nodeContextPrototype.M = moduleFactories;
const moduleCache = Object.create(null);
nodeContextPrototype.c = moduleCache;
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
nodeContextPrototype.R = resolvePathFromModule;
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
async function loadWebAssembly(chunkPath, _edgeModule, imports) {
  const mod = await loadWasmChunk(chunkPath);
  const { exports } = await WebAssembly.instantiate(mod, imports);
  return exports;
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, _edgeModule) {
  return loadWasmChunk(chunkPath);
}
contextPrototype.u = loadWebAssemblyModule;
function getWorkerBlobURL(_chunks) {
    throw new Error('Worker blobs are not implemented yet for Node.js');
}
nodeContextPrototype.b = getWorkerBlobURL;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        let instantiationReason;
        switch(sourceType){
            case 0:
                instantiationReason = `as a runtime entry of chunk ${sourceData}`;
                break;
            case 1:
                instantiationReason = `because it was required from module ${sourceData}`;
                break;
            default:
                invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
        }
        throw new Error(`Module ${id} was instantiated ${instantiationReason}, but the module factory is not available.`);
    }
    const module1 = createModuleObject(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, 1, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, 0, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/[root-of-the-server]__1a1de0d0._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1a1de0d0._.js");
      case "server/chunks/ssr/[root-of-the-server]__644ac36d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__644ac36d._.js");
      case "server/chunks/ssr/[root-of-the-server]__8fae10d8._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__8fae10d8._.js");
      case "server/chunks/ssr/[root-of-the-server]__d77ed44f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d77ed44f._.js");
      case "server/chunks/ssr/[root-of-the-server]__e683c88a._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e683c88a._.js");
      case "server/chunks/ssr/[root-of-the-server]__ef1e0d0c._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ef1e0d0c._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_0efddc1b._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_0efddc1b._.js");
      case "server/chunks/ssr/_5b825777._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_5b825777._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_554ec2bf.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_554ec2bf.js");
      case "server/chunks/ssr/node_modules_5bf736e6._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_5bf736e6._.js");
      case "server/chunks/ssr/node_modules_next_dist_2e7de858._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_2e7de858._.js");
      case "server/chunks/ssr/node_modules_next_dist_70ed294b._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_70ed294b._.js");
      case "server/chunks/ssr/node_modules_next_dist_c2965c68._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_c2965c68._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_2fffaa3a._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_2fffaa3a._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_8892636a.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_8892636a.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_eedfc1fd._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_eedfc1fd._.js");
      case "server/chunks/ssr/src_app_5b2047f8._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_5b2047f8._.js");
      case "server/chunks/ssr/src_app_loading_tsx_7fa31b7f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_loading_tsx_7fa31b7f._.js");
      case "server/chunks/ssr/[root-of-the-server]__0ce2a3bb._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ce2a3bb._.js");
      case "server/chunks/ssr/[root-of-the-server]__6f942387._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6f942387._.js");
      case "server/chunks/ssr/[root-of-the-server]__9c686993._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9c686993._.js");
      case "server/chunks/ssr/[root-of-the-server]__a457c799._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a457c799._.js");
      case "server/chunks/ssr/[root-of-the-server]__c9068642._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c9068642._.js");
      case "server/chunks/ssr/_05d0cdfd._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_05d0cdfd._.js");
      case "server/chunks/ssr/_5a7f6847._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_5a7f6847._.js");
      case "server/chunks/ssr/_eab70120._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_eab70120._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_applications_page_actions_461d321c.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_applications_page_actions_461d321c.js");
      case "server/chunks/ssr/node_modules_framer-motion_dist_es_render_components_motion_proxy_mjs_b72b0714._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_framer-motion_dist_es_render_components_motion_proxy_mjs_b72b0714._.js");
      case "server/chunks/ssr/node_modules_next_920e7746._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_920e7746._.js");
      case "server/chunks/ssr/node_modules_next_c567c0cf._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_c567c0cf._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_ece394eb.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_ece394eb.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_15817684.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_15817684.js");
      case "server/chunks/ssr/src_app_(protected)_(admin)_layout_tsx_c7ef6ea3._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(admin)_layout_tsx_c7ef6ea3._.js");
      case "server/chunks/ssr/src_app_(protected)_layout_tsx_3749e362._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_layout_tsx_3749e362._.js");
      case "server/chunks/ssr/src_components_dashboard_sidebar_tsx_5f7b140f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_dashboard_sidebar_tsx_5f7b140f._.js");
      case "server/chunks/ssr/[root-of-the-server]__11a0762c._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__11a0762c._.js");
      case "server/chunks/ssr/_3152d40c._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_3152d40c._.js");
      case "server/chunks/ssr/_a6fc699f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_a6fc699f._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_assignments_page_actions_f41bf50b.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_assignments_page_actions_f41bf50b.js");
      case "server/chunks/ssr/[root-of-the-server]__125a6a35._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__125a6a35._.js");
      case "server/chunks/ssr/_148cca94._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_148cca94._.js");
      case "server/chunks/ssr/_3ec35e8f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_3ec35e8f._.js");
      case "server/chunks/ssr/_e148fcd9._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_e148fcd9._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_dashboard_page_actions_42edeb8d.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_dashboard_page_actions_42edeb8d.js");
      case "server/chunks/ssr/[root-of-the-server]__bd7b0a32._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bd7b0a32._.js");
      case "server/chunks/ssr/_14905646._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_14905646._.js");
      case "server/chunks/ssr/_8ea0d8cf._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_8ea0d8cf._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_notifications_page_actions_1519e8f1.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_notifications_page_actions_1519e8f1.js");
      case "server/chunks/ssr/[root-of-the-server]__7b776830._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__7b776830._.js");
      case "server/chunks/ssr/_847073cf._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_847073cf._.js");
      case "server/chunks/ssr/_e685c2d7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_e685c2d7._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_setting_page_actions_051dd9a9.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_setting_page_actions_051dd9a9.js");
      case "server/chunks/ssr/[root-of-the-server]__de8bf2b3._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__de8bf2b3._.js");
      case "server/chunks/ssr/_37b2f393._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_37b2f393._.js");
      case "server/chunks/ssr/_75ed3f9d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_75ed3f9d._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(admin)_admin_tasks_page_actions_7a1a4864.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(admin)_admin_tasks_page_actions_7a1a4864.js");
      case "server/chunks/ssr/[root-of-the-server]__8d4b4b5d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__8d4b4b5d._.js");
      case "server/chunks/ssr/_69a95528._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_69a95528._.js");
      case "server/chunks/ssr/_bc30ccd4._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_bc30ccd4._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(admin)_admin_users_page_actions_b9f64660.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(admin)_admin_users_page_actions_b9f64660.js");
      case "server/chunks/ssr/[root-of-the-server]__d23ea5a9._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d23ea5a9._.js");
      case "server/chunks/ssr/_126e0cc3._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_126e0cc3._.js");
      case "server/chunks/ssr/_a8902523._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_a8902523._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_verifications_page_actions_5907c0a6.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(admin)_admin_verifications_page_actions_5907c0a6.js");
      case "server/chunks/ssr/[root-of-the-server]__705b27f8._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__705b27f8._.js");
      case "server/chunks/ssr/_57dbd295._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_57dbd295._.js");
      case "server/chunks/ssr/_63dc379c._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_63dc379c._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_Review_page_actions_b2441408.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_Review_page_actions_b2441408.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_Review_page_tsx_5d476901._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_Review_page_tsx_5d476901._.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_layout_tsx_02f05fd0._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_layout_tsx_02f05fd0._.js");
      case "server/chunks/ssr/[root-of-the-server]__5d5da599._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5d5da599._.js");
      case "server/chunks/ssr/_b908c817._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_b908c817._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_activetask_page_actions_b7ccfb1b.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_activetask_page_actions_b7ccfb1b.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_activetask_page_tsx_78a68689._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_activetask_page_tsx_78a68689._.js");
      case "server/chunks/ssr/[root-of-the-server]__654a2f89._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__654a2f89._.js");
      case "server/chunks/ssr/_424c48c1._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_424c48c1._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_dashboard_page_actions_6fc964c4.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_dashboard_page_actions_6fc964c4.js");
      case "server/chunks/ssr/node_modules_811bef3f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_811bef3f._.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_dashboard_page_tsx_aeb19997._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_dashboard_page_tsx_aeb19997._.js");
      case "server/chunks/ssr/[root-of-the-server]__502df284._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__502df284._.js");
      case "server/chunks/ssr/_348db500._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_348db500._.js");
      case "server/chunks/ssr/_43f0801c._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_43f0801c._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_message_page_actions_c7b6a82b.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_message_page_actions_c7b6a82b.js");
      case "server/chunks/ssr/[root-of-the-server]__87aeb106._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__87aeb106._.js");
      case "server/chunks/ssr/_18d0de2e._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_18d0de2e._.js");
      case "server/chunks/ssr/bec2d_app_(protected)_(user)_myrequest_[taskId]_applications_page_actions_a8ccfd62.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/bec2d_app_(protected)_(user)_myrequest_[taskId]_applications_page_actions_a8ccfd62.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_cbc4b703._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_cbc4b703._.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_myrequest_[taskId]_applications_page_tsx_bf569cc5._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_myrequest_[taskId]_applications_page_tsx_bf569cc5._.js");
      case "server/chunks/ssr/[root-of-the-server]__40a1b19d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__40a1b19d._.js");
      case "server/chunks/ssr/_dabb5eb8._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_dabb5eb8._.js");
      case "server/chunks/ssr/_f8cc80f6._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_f8cc80f6._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(user)_myrequest_create_page_actions_7d1c1d37.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(user)_myrequest_create_page_actions_7d1c1d37.js");
      case "server/chunks/ssr/[root-of-the-server]__4e9c825b._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__4e9c825b._.js");
      case "server/chunks/ssr/_3d2f6f32._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_3d2f6f32._.js");
      case "server/chunks/ssr/_9e7b5a68._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_9e7b5a68._.js");
      case "server/chunks/ssr/ce889_server_app_(protected)_(user)_myrequest_create_step2_page_actions_a337dfe3.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/ce889_server_app_(protected)_(user)_myrequest_create_step2_page_actions_a337dfe3.js");
      case "server/chunks/ssr/[root-of-the-server]__54463fe8._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__54463fe8._.js");
      case "server/chunks/ssr/_4810cb67._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_4810cb67._.js");
      case "server/chunks/ssr/_5d4a9539._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_5d4a9539._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_myrequest_page_actions_a1b00fcd.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_myrequest_page_actions_a1b00fcd.js");
      case "server/chunks/ssr/[root-of-the-server]__027672f9._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__027672f9._.js");
      case "server/chunks/ssr/_1d130708._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_1d130708._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_mytask_page_actions_6169e3e8.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_mytask_page_actions_6169e3e8.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_clock_mjs_0bda383d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_clock_mjs_0bda383d._.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_mytask_page_tsx_04efc462._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_mytask_page_tsx_04efc462._.js");
      case "server/chunks/ssr/[root-of-the-server]__a5e84996._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a5e84996._.js");
      case "server/chunks/ssr/_8b76adf7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_8b76adf7._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_notifications_page_actions_4d65f548.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_notifications_page_actions_4d65f548.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_eb348496._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_eb348496._.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_notifications_page_tsx_cceb83c9._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_notifications_page_tsx_cceb83c9._.js");
      case "server/chunks/ssr/[root-of-the-server]__1237f40a._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1237f40a._.js");
      case "server/chunks/ssr/_41e28889._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_41e28889._.js");
      case "server/chunks/ssr/_next-internal_server_app_(protected)_(user)_setting_page_actions_e7fcb915.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(protected)_(user)_setting_page_actions_e7fcb915.js");
      case "server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_2a0de7d1._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_lucide-react_dist_esm_icons_2a0de7d1._.js");
      case "server/chunks/ssr/src_app_(protected)_(user)_setting_page_tsx_6c9fb197._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_(protected)_(user)_setting_page_tsx_6c9fb197._.js");
      case "server/chunks/ssr/[root-of-the-server]__bd4d1a6e._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bd4d1a6e._.js");
      case "server/chunks/ssr/[root-of-the-server]__d1c10054._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d1c10054._.js");
      case "server/chunks/ssr/_289478e7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_289478e7._.js");
      case "server/chunks/ssr/_92bf5500._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_92bf5500._.js");
      case "server/chunks/ssr/_d2b36d0a._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_d2b36d0a._.js");
      case "server/chunks/ssr/_next-internal_server_app_(public)_aboutUs_page_actions_faa39653.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(public)_aboutUs_page_actions_faa39653.js");
      case "server/chunks/ssr/node_modules_@swc_helpers_cjs__interop_require_default_cjs_773264a0._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_@swc_helpers_cjs__interop_require_default_cjs_773264a0._.js");
      case "server/chunks/ssr/[root-of-the-server]__43eac6ba._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__43eac6ba._.js");
      case "server/chunks/ssr/_d807712c._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_d807712c._.js");
      case "server/chunks/ssr/_fa75f7e9._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_fa75f7e9._.js");
      case "server/chunks/ssr/_next-internal_server_app_(public)_blog_page_actions_7d8d2625.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(public)_blog_page_actions_7d8d2625.js");
      case "server/chunks/ssr/[root-of-the-server]__980d39d3._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__980d39d3._.js");
      case "server/chunks/ssr/_582a3a19._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_582a3a19._.js");
      case "server/chunks/ssr/_b8d8312e._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_b8d8312e._.js");
      case "server/chunks/ssr/_next-internal_server_app_(public)_contactUs_page_actions_f5f6f4fa.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(public)_contactUs_page_actions_f5f6f4fa.js");
      case "server/chunks/ssr/[root-of-the-server]__b06170e7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b06170e7._.js");
      case "server/chunks/ssr/_10d08146._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_10d08146._.js");
      case "server/chunks/ssr/_733e64a7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_733e64a7._.js");
      case "server/chunks/ssr/_next-internal_server_app_(public)_page_actions_cf7ff801.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_(public)_page_actions_cf7ff801.js");
      case "server/chunks/ssr/[root-of-the-server]__b9356576._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b9356576._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_75761787.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_75761787.js");
      case "server/chunks/ssr/node_modules_next_dist_12287b3d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_12287b3d._.js");
      case "server/chunks/ssr/[root-of-the-server]__6e9f487f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6e9f487f._.js");
      case "server/chunks/ssr/[root-of-the-server]__aa223b82._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__aa223b82._.js");
      case "server/chunks/ssr/_cae9b1da._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_cae9b1da._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_callback_page_actions_9407c5db.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_callback_page_actions_9407c5db.js");
      case "server/chunks/ssr/[root-of-the-server]__6463d4a7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6463d4a7._.js");
      case "server/chunks/ssr/_3fe1d819._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_3fe1d819._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_forgotpassword_page_actions_b8ee87b6.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_forgotpassword_page_actions_b8ee87b6.js");
      case "server/chunks/ssr/node_modules_react-icons_md_index_mjs_d051d1fd._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_react-icons_md_index_mjs_d051d1fd._.js");
      case "server/chunks/ssr/src_components_auth_forgotpassword_tsx_7211f6c5._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_auth_forgotpassword_tsx_7211f6c5._.js");
      case "server/chunks/ssr/[root-of-the-server]__16b95aaf._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__16b95aaf._.js");
      case "server/chunks/ssr/[root-of-the-server]__a84afb2f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a84afb2f._.js");
      case "server/chunks/ssr/_86b1572d._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_86b1572d._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_login_page_actions_1786e20a.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_login_page_actions_1786e20a.js");
      case "server/chunks/ssr/[root-of-the-server]__1a123a2b._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1a123a2b._.js");
      case "server/chunks/ssr/[root-of-the-server]__a94f30e7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a94f30e7._.js");
      case "server/chunks/ssr/_e36bc5ce._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_e36bc5ce._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_register_page_actions_461674e2.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_register_page_actions_461674e2.js");
      case "server/chunks/ssr/[root-of-the-server]__4fdbafda._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__4fdbafda._.js");
      case "server/chunks/ssr/[root-of-the-server]__ec7bd8ee._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ec7bd8ee._.js");
      case "server/chunks/ssr/_73520bf7._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_73520bf7._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_signin_page_actions_bd02b52b.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_signin_page_actions_bd02b52b.js");
      case "server/chunks/ssr/[root-of-the-server]__90954725._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__90954725._.js");
      case "server/chunks/ssr/_6b56b39f._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_6b56b39f._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_signup_page_actions_e8d4ef1c.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_signup_page_actions_e8d4ef1c.js");
      case "server/chunks/ssr/[root-of-the-server]__5c40ec20._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5c40ec20._.js");
      case "server/chunks/ssr/_02fd7fb5._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_02fd7fb5._.js");
      case "server/chunks/ssr/_fc8725a2._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_fc8725a2._.js");
      case "server/chunks/ssr/_next-internal_server_app_auth_verify_page_actions_072076d4.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_auth_verify_page_actions_072076d4.js");
      case "server/chunks/[externals]_next_dist_a6d89067._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/[externals]_next_dist_a6d89067._.js");
      case "server/chunks/[root-of-the-server]__206abf59._.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__206abf59._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/_next-internal_server_app_favicon_ico_route_actions_353150a5.js": return require("/Users/macbookpro/Documents/Year4/SemesterII/Internet Programming II/Jomnus_Production/Jomnus_Frontend/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_favicon_ico_route_actions_353150a5.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }


  async function loadWasmChunk(chunkPath) {
    switch (chunkPath) {

      default:
        throw new Error(`Unknown wasm chunk: ${chunkPath}`);
    }
  }
