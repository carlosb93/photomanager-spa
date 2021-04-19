(self["webpackChunk"] = self["webpackChunk"] || []).push([["js/Administracion"],{

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***!
  \*********************************************************************************/
/***/ (function(module) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'ColorPicker',
  props: ['color'],
  data: function data() {
    return {
      colors: ['red', 'orange', 'green', 'blue']
    };
  },
  methods: {
    selectColor: function selectColor(color) {
      if (color == 'red') {
        color = 'rgb(235, 77, 77)';
      }

      if (color == 'green') {
        color = 'rgb(49, 155, 49)';
      }

      if (color == 'blue') {
        color = 'rgb(59, 59, 163)';
      }

      if (color == 'orange') {
        color = 'orange';
      }

      this.$emit('colorPicked', color);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./resources/js/config.js");
/* harmony import */ var _ColorPicker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ColorPicker */ "./resources/js/components/ColorPicker.vue");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var URL = _config__WEBPACK_IMPORTED_MODULE_2__.default.url.URL_API;

function buildURL(api) {
  var resource = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  if (api == "URL_API") {
    return URL + resource;
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "UsersForm",
  props: {
    edit: Boolean,
    UserObject: Object
  },
  data: function data() {
    return {
      data: {},
      form: {},
      eventColor: ''
    };
  },
  watch: {
    UserObject: {
      immediate: true,
      deep: true,
      handler: function handler(val, oldVal) {
        this.form = val || {};
      }
    }
  },
  components: {
    ColorPicker: _ColorPicker__WEBPACK_IMPORTED_MODULE_3__.default
  },
  methods: {
    onSubmit: function onSubmit() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var AuthToken, isValid;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                AuthToken = 'Bearer ' + localStorage.getItem('token');
                _context.next = 3;
                return _this.$refs.observer.validate();

              case 3:
                isValid = _context.sent;

                if (isValid) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return");

              case 6:
                if (_this.edit) {
                  // await this.editCalendar(this.form);
                  _this.data.name = _this.form.name;
                  _this.data.description = _this.form.description;
                  _this.data.code = _this.form.code;
                  axios__WEBPACK_IMPORTED_MODULE_1___default().put(buildURL("URL_API", "branch/" + _this.form.id), _this.data, {
                    headers: {
                      "Authorization": AuthToken
                    }
                  });
                } else {
                  // await this.addCalendar(this.form);
                  _this.form.categoria_id = 1;
                  axios__WEBPACK_IMPORTED_MODULE_1___default().post(buildURL("URL_API", "branch"), _this.form, {
                    headers: {
                      "Authorization": AuthToken
                    }
                  });
                }

                _this.$emit("eventSaved");

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    CloseModal: function CloseModal() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.$emit("eventSaved");

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Configuraciones.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Configuraciones.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./resources/js/config.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var element_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! element-ui */ "./node_modules/element-ui/lib/element-ui.common.js");
/* harmony import */ var element_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(element_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Notifications/NotificationTemplate */ "./resources/js/pages/Notifications/NotificationTemplate.vue");
/* harmony import */ var _components_BaseAlert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/BaseAlert */ "./resources/js/components/BaseAlert.vue");
var _components;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var URL_API_SUBASTA = _config__WEBPACK_IMPORTED_MODULE_0__.default.url_api.URL_API_SUBASTA;
var URL_API_CENTRAL = _config__WEBPACK_IMPORTED_MODULE_0__.default.url_api.URL_API_CENTRAL;
/**
 * Arma la URL de el servicio
 */

function buildURL(api) {
  var resource = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  if (api == "URL_API_CENTRAL") {
    return URL_API_CENTRAL + resource;
  } else {
    return URL_API_SUBASTA + resource;
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  components: (_components = {
    BaseAlert: _components_BaseAlert__WEBPACK_IMPORTED_MODULE_4__.default
  }, _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.DatePicker.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.DatePicker), _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.TimeSelect.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.TimeSelect), _components),
  data: function data() {
    return {
      stado0: "default",
      LogoFile: '',
      LogoName: '',
      errors_validation: [],
      titulo_app: localStorage.getItem('name_app'),
      name_app: '',
      logo_app: '',
      email_app: '',
      telef_app: '',
      parametros: '',
      isProcessing: false,
      errors: {},
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      }
    };
  },
  created: function created() {},
  methods: {
    validatorName: function validatorName() {
      this.errors_validation = [];

      if (!this.name_app) {
        this.errors_validation.push("El nombre de la app no puede estar vacio.");
      }

      if (this.errors_validation.length === 0) {
        this.sendConfigName();
      } else {}
    },
    sendConfigName: function sendConfigName() {
      var _this = this;

      this.isProcessing = true;
      var formData = new FormData();
      formData.append('name_app', this.name_app);
      var config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(buildURL("URL_API_SUBASTA", "set_name_app"), formData, config).then(function (res) {
        _this.isProcessing = false;

        _this.$notify({
          message: 'Cambio realizado con éxito',
          title: _this.titulo_app,
          component: _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__.default,
          icon: "tim-icons icon-bell-55",
          type: 'success',
          timeout: 4000
        });
      })["catch"](function (err) {
        _this.isProcessing = false;
        console.log(err);
      });
    },
    validatorEmail: function validatorEmail() {
      this.errors_validation = [];

      if (!this.email_app) {
        this.errors_validation.push("El email de contacto no puede estar vacio.");
      }

      if (this.errors_validation.length === 0) {
        this.sendConfigEmail();
      } else {}
    },
    sendConfigEmail: function sendConfigEmail() {
      var _this2 = this;

      this.isProcessing = true;
      var formData = new FormData();
      formData.append('email_app', this.email_app);
      var config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(buildURL("URL_API_SUBASTA", "set_email_app"), formData, config).then(function (res) {
        _this2.isProcessing = false;

        _this2.$notify({
          message: 'Cambio realizado con éxito',
          title: _this2.titulo_app,
          component: _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__.default,
          icon: "tim-icons icon-bell-55",
          type: 'success',
          timeout: 4000
        });
      })["catch"](function (err) {
        _this2.isProcessing = false;
        console.log(err);
      });
    },
    validatorTelef: function validatorTelef() {
      this.errors_validation = [];

      if (!this.telef_app) {
        this.errors_validation.push("El telefono de contacto no puede estar vacio.");
      }

      if (this.errors_validation.length === 0) {
        this.sendConfigTelef();
      } else {}
    },
    sendConfigTelef: function sendConfigTelef() {
      var _this3 = this;

      this.isProcessing = true;
      var formData = new FormData();
      formData.append('telef_app', this.telef_app);
      var config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(buildURL("URL_API_SUBASTA", "set_telef_app"), formData, config).then(function (res) {
        _this3.isProcessing = false;

        _this3.$notify({
          message: 'Cambio realizado con éxito',
          title: _this3.titulo_app,
          component: _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__.default,
          icon: "tim-icons icon-bell-55",
          type: 'success',
          timeout: 4000
        });
      })["catch"](function (err) {
        _this3.isProcessing = false;
        console.log(err);
      });
    },
    validatorLogo: function validatorLogo() {
      this.errors_validation = [];

      if (!this.LogoFile) {
        this.errors_validation.push("El logo de la app no puede estar vacio.");
      }

      if (this.errors_validation.length === 0) {
        this.sendConfigLogo();
      } else {}
    },
    sendConfigLogo: function sendConfigLogo() {
      var _this4 = this;

      this.isProcessing = true;
      var formData = new FormData();
      formData.append('LogoFile', this.LogoFile);
      formData.append('LogoName', this.LogoName);
      var config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(buildURL("URL_API_SUBASTA", "set_logo_app"), formData, config).then(function (res) {
        _this4.isProcessing = false;

        _this4.$notify({
          message: 'Cambio realizado con éxito',
          title: _this4.titulo_app,
          component: _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__.default,
          icon: "tim-icons icon-bell-55",
          type: 'success',
          timeout: 4000
        });
      })["catch"](function (err) {
        _this4.isProcessing = false;
        console.log(err);
      });
    },
    handleLogo: function handleLogo(e) {
      this.LogoFile = e.target.files[0];
      this.LogoName = e.target.files[0].name;
      this.stado0 = "info";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./resources/js/config.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var element_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! element-ui */ "./node_modules/element-ui/lib/element-ui.common.js");
/* harmony import */ var element_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(element_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Notifications/NotificationTemplate */ "./resources/js/pages/Notifications/NotificationTemplate.vue");
/* harmony import */ var _components_BaseAlert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/BaseAlert */ "./resources/js/components/BaseAlert.vue");
/* harmony import */ var _components_UsersForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/UsersForm */ "./resources/js/components/UsersForm.vue");
var _components;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






var URL_API = _config__WEBPACK_IMPORTED_MODULE_0__.default.url.URL_API;
/**
 * Arma la URL de el servicio
 */

function buildURL(api) {
  var resource = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return URL_API + resource;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  components: (_components = {
    UsersForm: _components_UsersForm__WEBPACK_IMPORTED_MODULE_5__.default,
    BaseAlert: _components_BaseAlert__WEBPACK_IMPORTED_MODULE_4__.default
  }, _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.Table.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.Table), _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.TableColumn.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.TableColumn), _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.Popover.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.Popover), _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.Tag.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.Tag), _defineProperty(_components, element_ui__WEBPACK_IMPORTED_MODULE_2__.Button.name, element_ui__WEBPACK_IMPORTED_MODULE_2__.Button), _components),
  data: function data() {
    return {
      UserObject: {},
      name_app: localStorage.getItem('name_app'),
      permission: localStorage.getItem('role') === 'Administrator' ? true : false,
      errors: {},
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      },
      tableData: []
    };
  },
  created: function created() {
    this.showallusers();
  },
  methods: {
    go_to_link: function go_to_link() {
      this.$router.push('/creauser');
    },
    showallusers: function showallusers() {
      var _this = this;

      var AuthToken = 'Bearer ' + localStorage.getItem('token');
      var user = [];
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(buildURL("URL_API", "user"), {
        headers: {
          'Authorization': AuthToken
        }
      }).then(function (res) {
        console.log(res.data);
        console.log(res.data.users);
        console.log(res.data.users[0]);
        console.log(res.data.users[0].roles);

        for (var i = 0; i < res.data.users.length; i++) {
          if (res.data.users[i].roles[0].id == '1' || res.data.users[i].roles[0].id == '2' || res.data.users[i].roles[0].id == '3' || res.data.users[i].roles[0].id == '4') {
            user = {
              id: res.data.users[i].id,
              email: res.data.users[i].email,
              name: res.data.users[i].name,
              role: res.data.users[i].roles[0].name // status: res.data.users[i].verification_profile[0].status_id,

            };

            _this.tableData.push(user);
          }
        }

        console.log(_this.tableData);
      })["catch"](function (err) {
        return console.log(err);
      });
    },
    closeModal: function closeModal() {
      this.$refs["add-modal"].hide();
      this.$refs["edit-modal"].hide();
      this.UserObject = {};
      this.showallbranch();
    },
    openEditModal: function openEditModal(index, tabledata) {
      var _tabledata$index = tabledata[index],
          id = _tabledata$index.id,
          name = _tabledata$index.name,
          description = _tabledata$index.description,
          code = _tabledata$index.code;
      this.UserObject = {
        id: id,
        name: name,
        description: description,
        code: code
      };
      console.log(this.UserObject);
      this.$refs["edit-modal"].show();
    },
    handleEdit: function handleEdit(index, row) {
      this.$router.push("/user/".concat(row[index].id));
    },
    handleCancel: function handleCancel(index, row) {
      var _this2 = this;

      axios__WEBPACK_IMPORTED_MODULE_1___default().get(buildURL("URL_API", "deactivateUser/" + row[index].id)).then(function (res) {
        _this2.$notify({
          message: 'Eliminado exitosamente',
          title: _this2.name_app,
          component: _Notifications_NotificationTemplate__WEBPACK_IMPORTED_MODULE_3__.default,
          icon: "tim-icons icon-bell-55",
          type: "danger",
          timeout: 4000
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".picker-main[data-v-023f0f94] {\n  width: 60%;\n}\n.header[data-v-023f0f94] {\n  font-size: 14px;\n  text-transform: uppercase;\n  color: orangered;\n  margin: 0 0 10px;\n  text-align: left;\n}\n.color-picker[data-v-023f0f94] {\n  display: flex;\n  justify-content: space-around;\n}\n.color-picker > .color[data-v-023f0f94] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  border: 1.5px solid whitesmoke;\n  cursor: pointer;\n}\n.color.selected[data-v-023f0f94] {\n  box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.2);\n  border: 3px solid rgba(0, 0, 0, 0.4);\n}\n.color.red[data-v-023f0f94] {\n  background: #eb4d4d;\n}\n.color.blue[data-v-023f0f94] {\n  background: #3b3ba3;\n}\n.color.orange[data-v-023f0f94] {\n  background: orange;\n}\n.color.green[data-v-023f0f94] {\n  background: #319b31;\n}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".button[data-v-33a5c1de] {\n  margin-right: 10px;\n}\n.form-control[data-v-33a5c1de] {\n  color: #525f7f;\n}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.el-table {\r\n    background-color: #00000000;\n}\n.el-table th, .el-table tr {\r\n    background-color: #00000000;\n}\n.el-table th, .el-table tr {\r\n    background-color: rgba(0, 0, 0, 0);\n}\r\n/* #797b80; */\r\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./resources/js/components/ColorPicker.vue":
/*!*************************************************!*\
  !*** ./resources/js/components/ColorPicker.vue ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ColorPicker_vue_vue_type_template_id_023f0f94_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true& */ "./resources/js/components/ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true&");
/* harmony import */ var _ColorPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ColorPicker.vue?vue&type=script&lang=js& */ "./resources/js/components/ColorPicker.vue?vue&type=script&lang=js&");
/* harmony import */ var _ColorPicker_vue_vue_type_style_index_0_id_023f0f94_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss& */ "./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _ColorPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _ColorPicker_vue_vue_type_template_id_023f0f94_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _ColorPicker_vue_vue_type_template_id_023f0f94_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "023f0f94",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/ColorPicker.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/UsersForm.vue":
/*!***********************************************!*\
  !*** ./resources/js/components/UsersForm.vue ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UsersForm_vue_vue_type_template_id_33a5c1de_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true& */ "./resources/js/components/UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true&");
/* harmony import */ var _UsersForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UsersForm.vue?vue&type=script&lang=js& */ "./resources/js/components/UsersForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _UsersForm_vue_vue_type_style_index_0_id_33a5c1de_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss& */ "./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _UsersForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _UsersForm_vue_vue_type_template_id_33a5c1de_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _UsersForm_vue_vue_type_template_id_33a5c1de_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "33a5c1de",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/UsersForm.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/Configuraciones.vue":
/*!************************************************!*\
  !*** ./resources/js/pages/Configuraciones.vue ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Configuraciones_vue_vue_type_template_id_5463a09c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Configuraciones.vue?vue&type=template&id=5463a09c& */ "./resources/js/pages/Configuraciones.vue?vue&type=template&id=5463a09c&");
/* harmony import */ var _Configuraciones_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Configuraciones.vue?vue&type=script&lang=js& */ "./resources/js/pages/Configuraciones.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__.default)(
  _Configuraciones_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _Configuraciones_vue_vue_type_template_id_5463a09c___WEBPACK_IMPORTED_MODULE_0__.render,
  _Configuraciones_vue_vue_type_template_id_5463a09c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/Configuraciones.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/Usuarios.vue":
/*!*****************************************!*\
  !*** ./resources/js/pages/Usuarios.vue ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Usuarios_vue_vue_type_template_id_e1cb19e4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Usuarios.vue?vue&type=template&id=e1cb19e4& */ "./resources/js/pages/Usuarios.vue?vue&type=template&id=e1cb19e4&");
/* harmony import */ var _Usuarios_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Usuarios.vue?vue&type=script&lang=js& */ "./resources/js/pages/Usuarios.vue?vue&type=script&lang=js&");
/* harmony import */ var _Usuarios_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Usuarios.vue?vue&type=style&index=0&lang=css& */ "./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _Usuarios_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _Usuarios_vue_vue_type_template_id_e1cb19e4___WEBPACK_IMPORTED_MODULE_0__.render,
  _Usuarios_vue_vue_type_template_id_e1cb19e4___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/Usuarios.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/ColorPicker.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./resources/js/components/ColorPicker.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ColorPicker.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=script&lang=js&");
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./resources/js/components/UsersForm.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/components/UsersForm.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UsersForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./resources/js/pages/Configuraciones.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/pages/Configuraciones.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuraciones_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Configuraciones.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Configuraciones.vue?vue&type=script&lang=js&");
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuraciones_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./resources/js/pages/Usuarios.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./resources/js/pages/Usuarios.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Usuarios.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=script&lang=js&");
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./resources/js/components/ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true&":
/*!********************************************************************************************!*\
  !*** ./resources/js/components/ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true& ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_template_id_023f0f94_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_template_id_023f0f94_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_template_id_023f0f94_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true&");


/***/ }),

/***/ "./resources/js/components/UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true&":
/*!******************************************************************************************!*\
  !*** ./resources/js/components/UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true& ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_template_id_33a5c1de_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_template_id_33a5c1de_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_template_id_33a5c1de_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true&");


/***/ }),

/***/ "./resources/js/pages/Configuraciones.vue?vue&type=template&id=5463a09c&":
/*!*******************************************************************************!*\
  !*** ./resources/js/pages/Configuraciones.vue?vue&type=template&id=5463a09c& ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuraciones_vue_vue_type_template_id_5463a09c___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuraciones_vue_vue_type_template_id_5463a09c___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Configuraciones_vue_vue_type_template_id_5463a09c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Configuraciones.vue?vue&type=template&id=5463a09c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Configuraciones.vue?vue&type=template&id=5463a09c&");


/***/ }),

/***/ "./resources/js/pages/Usuarios.vue?vue&type=template&id=e1cb19e4&":
/*!************************************************************************!*\
  !*** ./resources/js/pages/Usuarios.vue?vue&type=template&id=e1cb19e4& ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_template_id_e1cb19e4___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_template_id_e1cb19e4___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_template_id_e1cb19e4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Usuarios.vue?vue&type=template&id=e1cb19e4& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=template&id=e1cb19e4&");


/***/ }),

/***/ "./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss&":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss& ***!
  \***********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_style_index_0_id_023f0f94_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader/index.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_style_index_0_id_023f0f94_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_style_index_0_id_023f0f94_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_style_index_0_id_023f0f94_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorPicker_vue_vue_type_style_index_0_id_023f0f94_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss&":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss& ***!
  \*********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_style_index_0_id_33a5c1de_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader/index.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_style_index_0_id_33a5c1de_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_style_index_0_id_33a5c1de_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_style_index_0_id_33a5c1de_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersForm_vue_vue_type_style_index_0_id_33a5c1de_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css&":
/*!**************************************************************************!*\
  !*** ./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_9_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader/index.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Usuarios.vue?vue&type=style&index=0&lang=css& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_9_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_9_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_9_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_clonedRuleSet_9_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Usuarios_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=template&id=023f0f94&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "picker-main" }, [
    _c("h4", { staticClass: "header" }, [
      _vm._v("Seleccione el nivel de importancia")
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "color-picker" },
      _vm._l(_vm.colors, function(theme, index) {
        var _obj
        return _c("div", {
          key: index,
          staticClass: "color",
          class:
            ((_obj = { selected: _vm.color === theme }),
            (_obj[theme] = theme),
            _obj),
          on: {
            click: function($event) {
              return _vm.selectColor(theme)
            }
          }
        })
      }),
      0
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=template&id=33a5c1de&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("ValidationObserver", {
        ref: "observer",
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(ref) {
              var invalid = ref.invalid
              return [
                _c(
                  "b-form",
                  {
                    attrs: { novalidate: "" },
                    on: {
                      submit: function($event) {
                        $event.preventDefault()
                        return _vm.onSubmit($event)
                      }
                    }
                  },
                  [
                    _c(
                      "b-form-group",
                      { attrs: { label: "Nombre", "label-for": "name" } },
                      [
                        _c("ValidationProvider", {
                          attrs: { name: "name", rules: "required" },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "default",
                                fn: function(ref) {
                                  var errors = ref.errors
                                  return [
                                    _c("b-form-input", {
                                      attrs: {
                                        state: errors.length == 0,
                                        type: "text",
                                        required: "",
                                        placeholder: "Nombre",
                                        name: "name"
                                      },
                                      model: {
                                        value: _vm.form.name,
                                        callback: function($$v) {
                                          _vm.$set(_vm.form, "name", $$v)
                                        },
                                        expression: "form.name"
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c(
                                      "b-form-invalid-feedback",
                                      { attrs: { state: errors.length == 0 } },
                                      [_vm._v("Nombre is required")]
                                    )
                                  ]
                                }
                              }
                            ],
                            null,
                            true
                          )
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "b-form-group",
                      {
                        attrs: {
                          label: "Descripcion",
                          "label-for": "description"
                        }
                      },
                      [
                        _c("ValidationProvider", {
                          attrs: { name: "description", rules: "required" },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "default",
                                fn: function(ref) {
                                  var errors = ref.errors
                                  return [
                                    _c("b-form-input", {
                                      attrs: {
                                        state: errors.length == 0,
                                        type: "text",
                                        required: "",
                                        placeholder: "Descripcion",
                                        name: "description"
                                      },
                                      model: {
                                        value: _vm.form.description,
                                        callback: function($$v) {
                                          _vm.$set(_vm.form, "description", $$v)
                                        },
                                        expression: "form.description"
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c(
                                      "b-form-invalid-feedback",
                                      { attrs: { state: errors.length == 0 } },
                                      [_vm._v("Descripcion is required")]
                                    )
                                  ]
                                }
                              }
                            ],
                            null,
                            true
                          )
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "b-form-group",
                      { attrs: { label: "Codigo", "label-for": "code" } },
                      [
                        _c("ValidationProvider", {
                          attrs: { name: "code", rules: "required" },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "default",
                                fn: function(ref) {
                                  var errors = ref.errors
                                  return [
                                    _c("b-form-input", {
                                      attrs: {
                                        state: errors.length == 0,
                                        type: "text",
                                        required: "",
                                        placeholder: "Codigo",
                                        name: "code"
                                      },
                                      model: {
                                        value: _vm.form.code,
                                        callback: function($$v) {
                                          _vm.$set(_vm.form, "code", $$v)
                                        },
                                        expression: "form.code"
                                      }
                                    }),
                                    _vm._v(" "),
                                    _c(
                                      "b-form-invalid-feedback",
                                      { attrs: { state: errors.length == 0 } },
                                      [_vm._v("Codigo is required")]
                                    )
                                  ]
                                }
                              }
                            ],
                            null,
                            true
                          )
                        })
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col-6" }, [
                        _c(
                          "button",
                          {
                            staticClass: "login100-form-btn-simple",
                            attrs: { type: "submit", variant: "primary" }
                          },
                          [_vm._v("Guardar")]
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-6" }, [
                        _c(
                          "button",
                          {
                            staticClass: "login100-form-btn-simple",
                            attrs: { type: "button", variant: "primary" },
                            on: { click: _vm.CloseModal }
                          },
                          [_vm._v("Cancelar")]
                        )
                      ])
                    ])
                  ],
                  1
                )
              ]
            }
          }
        ])
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Configuraciones.vue?vue&type=template&id=5463a09c&":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Configuraciones.vue?vue&type=template&id=5463a09c& ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "card",
    {
      staticStyle: {
        "border-bottom": "3px inset rgb(253, 185, 19)",
        "border-bottom-left-radius": "10px",
        "border-bottom-right-radius": "10px"
      }
    },
    [
      _c(
        "h5",
        { staticClass: "title", attrs: { slot: "header" }, slot: "header" },
        [
          _c(
            "router-link",
            { attrs: { to: "/home" } },
            [
              _c(
                "base-button",
                {
                  staticStyle: {
                    color: "rgba(82, 95, 127, 0.56)",
                    "border-color": "rgba(82, 95, 127, 0.56)"
                  },
                  attrs: {
                    icon: "",
                    round: "",
                    simple: "",
                    "data-toggle": "tooltip",
                    "data-placement": "top",
                    title: "Atras"
                  }
                },
                [
                  _c("i", {
                    staticClass: "mdi mdi-keyboard-backspace text-black",
                    staticStyle: {
                      "font-size": "35px",
                      color: "rgba(82, 95, 127, 0.56)"
                    }
                  })
                ]
              )
            ],
            1
          ),
          _vm._v(" Configuración de App\n  ")
        ],
        1
      ),
      _vm._v(" "),
      _vm.errors_validation.length
        ? _c("div", [
            _c("b", [
              _vm._v("Por favor, corrija el(los) siguiente(s) error(es):")
            ]),
            _vm._v(" "),
            _c(
              "ul",
              _vm._l(_vm.errors_validation, function(error) {
                return _c("li", [
                  _c("p", { staticStyle: { color: "#ff8578" } }, [
                    _vm._v(_vm._s(error))
                  ])
                ])
              }),
              0
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("label", { staticClass: "control-label" }, [
        _vm._v("Nombre de la app")
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-md-6 px-md-1" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.name_app,
                expression: "name_app"
              }
            ],
            staticClass: "form-control",
            staticStyle: { "margin-top": "5px" },
            attrs: {
              "aria-describedby": "addon-right addon-left",
              placeholder: "Nombre"
            },
            domProps: { value: _vm.name_app },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.name_app = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col-md-6 px-md-1" },
          [
            _c(
              "base-button",
              {
                attrs: {
                  slot: "footer",
                  type: "info",
                  fill: "",
                  disabled: _vm.isProcessing
                },
                on: { click: _vm.validatorName },
                slot: "footer"
              },
              [_vm._v("Guardar")]
            )
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("label", { staticClass: "control-label" }, [
        _vm._v("Correo de contacto Empresa")
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-md-6 px-md-1" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.email_app,
                expression: "email_app"
              }
            ],
            staticClass: "form-control",
            staticStyle: { "margin-top": "5px" },
            attrs: {
              "aria-describedby": "addon-right addon-left",
              placeholder: "Email"
            },
            domProps: { value: _vm.email_app },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.email_app = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col-md-6 px-md-1" },
          [
            _c(
              "base-button",
              {
                attrs: {
                  slot: "footer",
                  type: "info",
                  fill: "",
                  disabled: _vm.isProcessing
                },
                on: { click: _vm.validatorEmail },
                slot: "footer"
              },
              [_vm._v("Guardar")]
            )
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("label", { staticClass: "control-label" }, [
        _vm._v("Teléfono de contacto Empresa")
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-md-6 px-md-1" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.telef_app,
                expression: "telef_app"
              }
            ],
            staticClass: "form-control",
            staticStyle: { "margin-top": "5px" },
            attrs: {
              "aria-describedby": "addon-right addon-left",
              placeholder: "Telefono"
            },
            domProps: { value: _vm.telef_app },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.telef_app = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col-md-6 px-md-1" },
          [
            _c(
              "base-button",
              {
                attrs: {
                  slot: "footer",
                  type: "info",
                  fill: "",
                  disabled: _vm.isProcessing
                },
                on: { click: _vm.validatorTelef },
                slot: "footer"
              },
              [_vm._v("Guardar")]
            )
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("label", { staticClass: "control-label" }, [_vm._v("Logo de app")]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c(
          "div",
          { staticClass: "col-md-2 px-md-1" },
          [
            _c("input", {
              ref: "LogoFile",
              staticStyle: { display: "none" },
              attrs: { type: "file" },
              on: { change: _vm.handleLogo }
            }),
            _vm._v(" "),
            _c(
              "base-button",
              {
                attrs: { round: "", type: _vm.stado0, simple: "" },
                on: {
                  click: function($event) {
                    return _vm.$refs.LogoFile.click()
                  }
                }
              },
              [
                _c("i", {
                  staticClass: "mdi mdi-cloud-upload-outline",
                  staticStyle: { "font-size": "19px" }
                }),
                _vm._v(" Logo de la App")
              ]
            )
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col-md-10 px-md-1" },
          [
            _c(
              "base-button",
              {
                attrs: {
                  slot: "footer",
                  type: "info",
                  fill: "",
                  disabled: _vm.isProcessing
                },
                on: { click: _vm.validatorLogo },
                slot: "footer"
              },
              [_vm._v("Guardar")]
            )
          ],
          1
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=template&id=e1cb19e4&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=template&id=e1cb19e4& ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "card",
    {
      staticStyle: {
        "border-bottom": "3px inset #f96332",
        "border-bottom-left-radius": "10px",
        "border-bottom-right-radius": "10px"
      }
    },
    [
      _c(
        "template",
        { slot: "header" },
        [
          _c("h5", { staticClass: "card-category" }, [
            _vm._v("\r\n            Administrar Usuarios")
          ]),
          _vm._v(" "),
          _vm._t("header"),
          _vm._v(" "),
          _vm._t("Agregar Usuario", [
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.permission,
                    expression: "permission"
                  }
                ]
              },
              [
                _c(
                  "button",
                  {
                    directives: [
                      {
                        name: "b-modal",
                        rawName: "v-b-modal.add-modal",
                        modifiers: { "add-modal": true }
                      }
                    ],
                    staticClass: "login100-form-btn-simple"
                  },
                  [
                    _c("i", {
                      staticClass: "mdi mdi-account-plus",
                      staticStyle: {
                        "font-size": "19px",
                        "margin-right": "5px"
                      }
                    }),
                    _vm._v("Nueva")
                  ]
                )
              ]
            )
          ])
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "el-table",
        { attrs: { data: _vm.tableData } },
        [
          _c("el-table-column", { attrs: { prop: "name", label: "Name" } }),
          _vm._v(" "),
          _c("el-table-column", { attrs: { prop: "email", label: "Email" } }),
          _vm._v(" "),
          _c("el-table-column", { attrs: { prop: "role", label: "Rol" } }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "Verificado" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function(scope) {
                  return [
                    scope.row.status == "1"
                      ? _c("div", [
                          _c("h4", [
                            _c("i", {
                              staticClass: "mdi mdi-shield-check",
                              staticStyle: {
                                "font-size": "19px",
                                color: "rgb(34, 202, 3)"
                              }
                            }),
                            _vm._v(" Verificado")
                          ])
                        ])
                      : _c("div", [
                          _c("h4", [
                            _c("i", {
                              staticClass: "mdi mdi-alert-outline",
                              staticStyle: {
                                "font-size": "19px",
                                color: "#FDB913"
                              }
                            }),
                            _vm._v(" No Verificado")
                          ])
                        ])
                  ]
                }
              }
            ])
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { fixed: "right", label: "Acciones" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function(scope) {
                  return [
                    _c(
                      "el-button",
                      {
                        attrs: { type: "text", size: "small" },
                        nativeOn: {
                          click: function($event) {
                            $event.preventDefault()
                            return _vm.openEditModal(
                              scope.$index,
                              _vm.tableData
                            )
                          }
                        }
                      },
                      [_vm._v("\r\n          Editar\r\n        ")]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: _vm.permission,
                            expression: "permission"
                          }
                        ]
                      },
                      [
                        _c(
                          "el-button",
                          {
                            attrs: { type: "text", size: "small" },
                            nativeOn: {
                              click: function($event) {
                                $event.preventDefault()
                                return _vm.handleCancel(
                                  scope.$index,
                                  _vm.tableData
                                )
                              }
                            }
                          },
                          [_vm._v("\r\n          Desactivar\r\n        ")]
                        ),
                        _vm._v(" "),
                        _c(
                          "el-button",
                          {
                            attrs: { type: "text", size: "small" },
                            nativeOn: {
                              click: function($event) {
                                $event.preventDefault()
                                return _vm.handleDelete(
                                  scope.$index,
                                  _vm.tableData
                                )
                              }
                            }
                          },
                          [_vm._v("\r\n          Eliminar\r\n        ")]
                        )
                      ],
                      1
                    )
                  ]
                }
              }
            ])
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          ref: "add-modal",
          attrs: {
            id: "add-modal",
            title: "Add Calendar Event",
            "hide-footer": ""
          }
        },
        [
          _c("UsersForm", {
            attrs: { edit: false },
            on: {
              eventSaved: function($event) {
                return _vm.closeModal()
              }
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          ref: "edit-modal",
          attrs: {
            id: "edit-modal",
            title: "Edit Calendar Event",
            "hide-footer": ""
          }
        },
        [
          _c("UsersForm", {
            attrs: { edit: true, UserObject: _vm.UserObject },
            on: {
              eventSaved: function($event) {
                return _vm.closeModal()
              }
            }
          })
        ],
        1
      )
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/ColorPicker.vue?vue&type=style&index=0&id=023f0f94&scoped=true&lang=scss&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("5069d3ab", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/UsersForm.vue?vue&type=style&index=0&id=33a5c1de&scoped=true&lang=scss&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("23fd1d64", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Usuarios.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js??clonedRuleSet-9[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/pages/Usuarios.vue?vue&type=style&index=0&lang=css&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("9b051aba", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ })

}]);