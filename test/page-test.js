// Generated by psc-bundle 0.10.5
var PS = {};
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Category = PS["Control.Category"];
  var flip = function (f) {
      return function (b) {
          return function (a) {
              return f(a)(b);
          };
      };
  };
  var $$const = function (a) {
      return function (v) {
          return a;
      };
  };
  exports["const"] = $$const;
  exports["flip"] = flip;
})(PS["Data.Function"] = PS["Data.Function"] || {});
(function(exports) {
    "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  exports["unit"] = $foreign.unit;
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };
  exports["Functor"] = Functor;
  exports["map"] = map;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];        
  var Apply = function (__superclass_Data$dotFunctor$dotFunctor_0, apply) {
      this["__superclass_Data.Functor.Functor_0"] = __superclass_Data$dotFunctor$dotFunctor_0;
      this.apply = apply;
  };                      
  var apply = function (dict) {
      return dict.apply;
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Applicative = function (__superclass_Control$dotApply$dotApply_0, pure) {
      this["__superclass_Control.Apply.Apply_0"] = __superclass_Control$dotApply$dotApply_0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative["__superclass_Control.Apply.Apply_0"]())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["liftA1"] = liftA1;
  exports["pure"] = pure;
})(PS["Control.Applicative"] = PS["Control.Applicative"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];        
  var Bind = function (__superclass_Control$dotApply$dotApply_0, bind) {
      this["__superclass_Control.Apply.Apply_0"] = __superclass_Control$dotApply$dotApply_0;
      this.bind = bind;
  };                     
  var bind = function (dict) {
      return dict.bind;
  };
  var bindFlipped = function (dictBind) {
      return Data_Function.flip(bind(dictBind));
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
  exports["bindFlipped"] = bindFlipped;
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Monad = function (__superclass_Control$dotApplicative$dotApplicative_0, __superclass_Control$dotBind$dotBind_1) {
      this["__superclass_Control.Applicative.Applicative_0"] = __superclass_Control$dotApplicative$dotApplicative_0;
      this["__superclass_Control.Bind.Bind_1"] = __superclass_Control$dotBind$dotBind_1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(f)(function (v) {
                  return Control_Bind.bind(dictMonad["__superclass_Control.Bind.Bind_1"]())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad["__superclass_Control.Applicative.Applicative_0"]())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS["Control.Monad"] = PS["Control.Monad"] || {});
(function(exports) {
  /* globals setTimeout, clearTimeout, setImmediate, clearImmediate */
  "use strict";

  exports._makeAff = function (cb) {
    return function (success, error) {
      try {
        return cb(function (e) {
          return function () {
            error(e);
          };
        })(function (v) {
          return function () {
            success(v);
          };
        })();
      } catch (err) {
        error(err);
      }
    };
  };

  exports._pure = function (nonCanceler, v) {
    return function (success) {
      success(v);
      return nonCanceler;
    };
  };

  exports._fmap = function (f, aff) {
    return function (success, error) {
      return aff(function (v) {
        success(f(v));
      }, error);
    };
  };

  exports._bind = function (alwaysCanceler, aff, f) {
    return function (success, error) {
      var canceler1, canceler2;

      var isCanceled    = false;
      var requestCancel = false;

      var onCanceler = function () {};

      canceler1 = aff(function (v) {
        if (requestCancel) {
          isCanceled = true;

          return alwaysCanceler;
        } else {
          canceler2 = f(v)(success, error);

          onCanceler(canceler2);

          return canceler2;
        }
      }, error);

      return function (e) {
        return function (s, f) {
          requestCancel = true;

          if (canceler2 !== undefined) {
            return canceler2(e)(s, f);
          } else {
            return canceler1(e)(function (bool) {
              if (bool || isCanceled) {
                s(true);
              } else {
                onCanceler = function (canceler) {
                  canceler(e)(s, f);
                };
              }
            }, f);
          }
        };
      };
    };
  };

  exports._attempt = function (Left, Right, aff) {
    return function (success) {
      return aff(function (v) {
        success(Right(v));
      }, function (e) {
        success(Left(e));
      });
    };
  };
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
    "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var monadEff = new Control_Monad.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Control_Bind.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Control_Apply.Apply(function () {
      return functorEff;
  }, Control_Monad.ap(monadEff));
  var applicativeEff = new Control_Applicative.Applicative(function () {
      return applyEff;
  }, $foreign.pureE);
  var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
    "use strict";

  exports.error = function (msg) {
    return new Error(msg);
  };
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Extend = PS["Control.Extend"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Function = PS["Data.Function"];        
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either line 224, column 1 - line 224, column 26: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var isLeft = either(Data_Function["const"](true))(Data_Function["const"](false));
  var isRight = either(Data_Function["const"](false))(Data_Function["const"](true));
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["isLeft"] = isLeft;
  exports["isRight"] = isRight;
})(PS["Data.Either"] = PS["Data.Either"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Exception"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Either = PS["Data.Either"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Data_Functor = PS["Data.Functor"];
  exports["error"] = $foreign.error;
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
    "use strict";

  // module Unsafe.Coerce

  exports.unsafeCoerce = function (x) {
    return x;
  };
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Unsafe.Coerce"];
  exports["unsafeCoerce"] = $foreign.unsafeCoerce;
})(PS["Unsafe.Coerce"] = PS["Unsafe.Coerce"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Control.Monad.Aff"];
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Monad_Aff_Internal = PS["Control.Monad.Aff.Internal"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_Parallel = PS["Control.Parallel"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Tuple = PS["Data.Tuple"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Function = PS["Data.Function"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Semiring = PS["Data.Semiring"];
  var Control_Parallel_Class = PS["Control.Parallel.Class"];
  var Data_Unit = PS["Data.Unit"];
  var makeAff$prime = function (h) {
      return $foreign._makeAff(h);
  };
  var functorAff = new Data_Functor.Functor(function (f) {
      return function (fa) {
          return $foreign._fmap(f, fa);
      };
  });  
  var attempt = function (aff) {
      return $foreign._attempt(Data_Either.Left.create, Data_Either.Right.create, aff);
  };
  var applyAff = new Control_Apply.Apply(function () {
      return functorAff;
  }, function (ff) {
      return function (fa) {
          return $foreign._bind(alwaysCanceler, ff, function (f) {
              return Data_Functor.map(functorAff)(f)(fa);
          });
      };
  });
  var applicativeAff = new Control_Applicative.Applicative(function () {
      return applyAff;
  }, function (v) {
      return $foreign._pure(nonCanceler, v);
  });
  var nonCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(false));
  var alwaysCanceler = Data_Function["const"](Control_Applicative.pure(applicativeAff)(true));
  var makeAff = function (h) {
      return makeAff$prime(function (e) {
          return function (a) {
              return Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Function["const"](nonCanceler))(h(e)(a));
          };
      });
  };                                                                         
  var bindAff = new Control_Bind.Bind(function () {
      return applyAff;
  }, function (fa) {
      return function (f) {
          return $foreign._bind(alwaysCanceler, fa, f);
      };
  });
  exports["attempt"] = attempt;
  exports["makeAff"] = makeAff;
  exports["nonCanceler"] = nonCanceler;
  exports["functorAff"] = functorAff;
  exports["applyAff"] = applyAff;
  exports["applicativeAff"] = applicativeAff;
  exports["bindAff"] = bindAff;
})(PS["Control.Monad.Aff"] = PS["Control.Monad.Aff"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Generic = PS["Data.Generic"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Category = PS["Control.Category"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];        
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
})(PS["Data.List.Types"] = PS["Data.List.Types"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_List_Types = PS["Data.List.Types"];        
  var CatQueue = (function () {
      function CatQueue(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CatQueue.create = function (value0) {
          return function (value1) {
              return new CatQueue(value0, value1);
          };
      };
      return CatQueue;
  })();
  var snoc = function (v) {
      return function (a) {
          return new CatQueue(v.value0, new Data_List_Types.Cons(a, v.value1));
      };
  };
  var empty = new CatQueue(Data_List_Types.Nil.value, Data_List_Types.Nil.value);
  exports["CatQueue"] = CatQueue;
  exports["empty"] = empty;
  exports["snoc"] = snoc;
})(PS["Data.CatQueue"] = PS["Data.CatQueue"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Data_CatQueue = PS["Data.CatQueue"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_NaturalTransformation = PS["Data.NaturalTransformation"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_List_Types = PS["Data.List.Types"];        
  var CatNil = (function () {
      function CatNil() {

      };
      CatNil.value = new CatNil();
      return CatNil;
  })();
  var CatCons = (function () {
      function CatCons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      CatCons.create = function (value0) {
          return function (value1) {
              return new CatCons(value0, value1);
          };
      };
      return CatCons;
  })();
  var link = function (v) {
      return function (cat) {
          if (v instanceof CatNil) {
              return cat;
          };
          if (v instanceof CatCons) {
              return new CatCons(v.value0, Data_CatQueue.snoc(v.value1)(cat));
          };
          throw new Error("Failed pattern match at Data.CatList line 111, column 1 - line 111, column 22: " + [ v.constructor.name, cat.constructor.name ]);
      };
  }; 
  var empty = CatNil.value;
  var append = function (v) {
      return function (v1) {
          if (v1 instanceof CatNil) {
              return v;
          };
          if (v instanceof CatNil) {
              return v1;
          };
          return link(v)(v1);
      };
  };
  var snoc = function (cat) {
      return function (a) {
          return append(cat)(new CatCons(a, Data_CatQueue.empty));
      };
  };
  exports["CatNil"] = CatNil;
  exports["CatCons"] = CatCons;
  exports["append"] = append;
  exports["empty"] = empty;
  exports["snoc"] = snoc;
})(PS["Data.CatList"] = PS["Data.CatList"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Data_CatList = PS["Data.CatList"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Inject = PS["Data.Inject"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Functor = PS["Data.Functor"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Function = PS["Data.Function"];
  var Control_Category = PS["Control.Category"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Free = (function () {
      function Free(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Free.create = function (value0) {
          return function (value1) {
              return new Free(value0, value1);
          };
      };
      return Free;
  })();
  var Return = (function () {
      function Return(value0) {
          this.value0 = value0;
      };
      Return.create = function (value0) {
          return new Return(value0);
      };
      return Return;
  })();
  var Bind = (function () {
      function Bind(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Bind.create = function (value0) {
          return function (value1) {
              return new Bind(value0, value1);
          };
      };
      return Bind;
  })();
  var fromView = function (f) {
      return new Free(Unsafe_Coerce.unsafeCoerce(f), Data_CatList.empty);
  };
  var freeMonad = new Control_Monad.Monad(function () {
      return freeApplicative;
  }, function () {
      return freeBind;
  });
  var freeFunctor = new Data_Functor.Functor(function (k) {
      return function (f) {
          return Control_Bind.bindFlipped(freeBind)(function ($85) {
              return Control_Applicative.pure(freeApplicative)(k($85));
          })(f);
      };
  });
  var freeBind = new Control_Bind.Bind(function () {
      return freeApply;
  }, function (v) {
      return function (k) {
          return new Free(v.value0, Data_CatList.snoc(v.value1)(Unsafe_Coerce.unsafeCoerce(k)));
      };
  });
  var freeApply = new Control_Apply.Apply(function () {
      return freeFunctor;
  }, Control_Monad.ap(freeMonad));
  var freeApplicative = new Control_Applicative.Applicative(function () {
      return freeApply;
  }, function ($86) {
      return fromView(Return.create($86));
  });
  var liftF = function (f) {
      return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(f), function ($87) {
          return Control_Applicative.pure(freeApplicative)(Unsafe_Coerce.unsafeCoerce($87));
      }));
  };
  exports["liftF"] = liftF;
  exports["freeFunctor"] = freeFunctor;
  exports["freeBind"] = freeBind;
  exports["freeApplicative"] = freeApplicative;
  exports["freeApply"] = freeApply;
  exports["freeMonad"] = freeMonad;
})(PS["Control.Monad.Free"] = PS["Control.Monad.Free"] || {});
(function(exports) {
    'use strict';

  function PhantomPageError(message, stack) {
    this.name = 'PhantomPageError';
    this.message = message;
    this.stack = stack || (new Error()).stack;
  }
  PhantomPageError.prototype = Object.create(Error.prototype);
  PhantomPageError.prototype.constructor = PhantomPageError;

  exports.createPage_ = function(success, error) {
    var webpage = require('webpage').create();
    success(webpage);
  }

  exports.open_ = function(page) {
    return function(url) {
      return function(success, error) {
        page.open(url, function(status) {
          // http://phantomjs.org/api/webpage/method/open.html
          // 'success' or 'fail'
          if (status == "success") {
            success(page);
          } else {
            error(new PhantomPageError("open '" + url + "' failed with phantom status '" + status + "'"));
          }
        });
      }
    }
  }
})(PS["PhantomJS.Page"] = PS["PhantomJS.Page"] || {});
(function(exports) {
    "use strict";
  var $foreign = PS["PhantomJS.Page"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Foldable = PS["Data.Foldable"];
  var PhantomJS_Phantom = PS["PhantomJS.Phantom"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Generic_Rep_Show = PS["Data.Generic.Rep.Show"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Show = PS["Data.Show"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Symbol = PS["Data.Symbol"];

  /**
 *  | Opens a URL in a page context.
 */  
  var open = $foreign.open_;

  /**
 *  | Creates a new page context.
 */  
  var createPage = $foreign.createPage_;
  exports["createPage"] = createPage;
  exports["open"] = open;
})(PS["PhantomJS.Page"] = PS["PhantomJS.Page"] || {});
(function(exports) {// module Test.Unit

  exports.memoise = function(aff) {
    var fresh = true;
    var listeners = [];
    var resultValue = undefined;
    var failed = false;
    var done = false;
    return function(success, failure) {
      if (done) {
        if (failed) {
          failure(resultValue);
        } else {
          success(resultValue);
        }
        return;
      }

      listeners.push({success: success, failure: failure});

      if (fresh) {
        fresh = false;
        aff(function(result) {
          done = true;
          resultValue = result;
          listeners.forEach(function(listener) {
            listener.success(result);
          });
          listeners = [];
        }, function(error) {
          done = true;
          failed = true;
          resultValue = error;
          listeners.forEach(function(listener) {
            listener.failure(error);
          });
          listeners = [];
        });
      }
    };
  };
})(PS["Test.Unit"] = PS["Test.Unit"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var $foreign = PS["Test.Unit"];
  var Prelude = PS["Prelude"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Control_Monad_Aff_AVar = PS["Control.Monad.Aff.AVar"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Timer = PS["Control.Monad.Eff.Timer"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Data_Either = PS["Data.Either"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_List = PS["Data.List"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Show = PS["Data.Show"];
  var Data_List_Types = PS["Data.List.Types"];
  var Control_Applicative = PS["Control.Applicative"];        
  var Group = (function () {
      function Group(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Group.create = function (value0) {
          return function (value1) {
              return new Group(value0, value1);
          };
      };
      return Group;
  })();
  var TestGroup = (function () {
      function TestGroup(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TestGroup.create = function (value0) {
          return function (value1) {
              return new TestGroup(value0, value1);
          };
      };
      return TestGroup;
  })();
  var TestUnit = (function () {
      function TestUnit(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      TestUnit.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new TestUnit(value0, value1, value2);
              };
          };
      };
      return TestUnit;
  })();
  var test = function (l) {
      return function (t) {
          return Control_Monad_Free.liftF(new TestUnit(l, $foreign.memoise(t), Data_Unit.unit));
      };
  };
  var suite = function (label) {
      return function (tests) {
          return Control_Monad_Free.liftF(new TestGroup(new Group(label, tests), Data_Unit.unit));
      };
  };
  var success = Control_Monad_Aff.makeAff(function (v) {
      return function (succeed) {
          return succeed(Data_Unit.unit);
      };
  });  
  var it = test;
  var failure = function (reason) {
      return Control_Monad_Aff.makeAff(function (fail) {
          return function (v) {
              return fail(Control_Monad_Eff_Exception.error(reason));
          };
      });
  };
  var describe = suite;
  exports["Group"] = Group;
  exports["TestGroup"] = TestGroup;
  exports["TestUnit"] = TestUnit;
  exports["describe"] = describe;
  exports["failure"] = failure;
  exports["it"] = it;
  exports["success"] = success;
  exports["suite"] = suite;
  exports["test"] = test;
})(PS["Test.Unit"] = PS["Test.Unit"] || {});
(function(exports) {
  // Generated by psc version 0.10.5
  "use strict";
  var Prelude = PS["Prelude"];
  var Data_Either = PS["Data.Either"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var Test_Unit = PS["Test.Unit"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var assert = function (v) {
      return function (v1) {
          if (v1) {
              return Test_Unit.success;
          };
          if (!v1) {
              return Test_Unit.failure(v);
          };
          throw new Error("Failed pattern match at Test.Unit.Assert line 18, column 1 - line 18, column 24: " + [ v.constructor.name, v1.constructor.name ]);
      };
  };
  exports["assert"] = assert;
})(PS["Test.Unit.Assert"] = PS["Test.Unit.Assert"] || {});
(function(exports) {
    "use strict";
  var Prelude = PS["Prelude"];
  var Data_Either = PS["Data.Either"];
  var Test_Unit = PS["Test.Unit"];
  var Test_Unit_Assert = PS["Test.Unit.Assert"];
  var Control_Monad_Free = PS["Control.Monad.Free"];
  var Control_Monad_Aff = PS["Control.Monad.Aff"];
  var PhantomJS_Phantom = PS["PhantomJS.Phantom"];
  var PhantomJS_Page = PS["PhantomJS.Page"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Function = PS["Data.Function"];        
  var pageTests = Test_Unit.describe("open")(Control_Bind.bind(Control_Monad_Free.freeBind)(Test_Unit.it("should open test.html")(Control_Bind.bind(Control_Monad_Aff.bindAff)(PhantomJS_Page.createPage)(function (v) {
      return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(PhantomJS_Page.open(v)("assets/test.html")))(function (v1) {
          return Test_Unit_Assert.assert("open returned failure case")(Data_Either.isRight(v1));
      });
  })))(function () {
      return Test_Unit.it("should fail when local asset not found.")(Control_Bind.bind(Control_Monad_Aff.bindAff)(PhantomJS_Page.createPage)(function (v) {
          return Control_Bind.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.attempt(PhantomJS_Page.open(v)("test-not-found.html")))(function (v1) {
              return Test_Unit_Assert.assert("open returned success case")(Data_Either.isLeft(v1));
          });
      }));
  }));
  exports["pageTests"] = pageTests;
})(PS["Test.PhantomJS.Page"] = PS["Test.PhantomJS.Page"] || {});
PS["Test.PhantomJS.Page"].main();
