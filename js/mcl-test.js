var mcl = new MCL();
var mce = new MCE();

module("test", {
  setup:function(){
  }
});

test("simple mul", function(){
  var s = "2*3";
  var out = mcl.parse(s);
  deepEqual(out ,[[["mul",["imm",2], ["imm",3]]]], "MCL");
  equal(mce.run(out), 6, "MCE");
});
test("simple add", function(){
  var s = "10+1";
  var out = mcl.parse(s);
  deepEqual(out ,[[["add",["imm",10], ["imm",1]]]], "MCL");
  equal(mce.run(out), 11, "MCE");
});
test("simple sub", function(){
  var s = "10-1";
  var out = mcl.parse(s);
  deepEqual(out ,[[["sub",["imm",10], ["imm",1]]]], "MCL");
  equal(mce.run(out), 9, "MCE");
});
test("simple div", function(){
  var s = "10/2";
  var out = mcl.parse(s);
  deepEqual(out ,[[["div",["imm",10], ["imm",2]]]], "MCL");
  equal(mce.run(out), 5, "MCE");
});
test("simple div(2)", function(){
  var s = "5/2";
  var out = mcl.parse(s);
  deepEqual(out ,[[["div",["imm",5], ["imm",2]]]], "MCL");
  equal(mce.run(out), 2.5, "MCE");
});
test("simple mod", function(){
  var s = "10%4";
  var out = mcl.parse(s);
  deepEqual(out ,[[["mod",["imm",10], ["imm",4]]]], "MCL");
  equal(mce.run(out), 2, "MCE");
});

// execute only test

test("complex calc", function(){
  var s = "6*5 + 10/2 + (3+4) * 2";
  var out = mcl.parse(s);
  equal(mce.run(out), 6*5 + 10/2 + (3+4) * 2, "MCE");
});

test("function call", function(){
  var s = "!hoge = (\\(){1+1;});hoge() + hoge();";
  var out = mcl.parse(s);
  equal(mce.run(out), 4, "MCE");
});

test("assign", function(){
  var s = "!a=1;!b=2;!a=5;a+b;";
  var out = mcl.parse(s);
  equal(mce.run(out), 7, "MCE");
});

test("assign lambda" , function(){
  var s = '!a=(\\(i){i*i;})(2);a;';

  var out = mcl.parse(s);
  equal(mce.run(out),4, "MCE");
});

test("if" , function(){
  var s = '!a=4;if(0){!a=2;};a;';

  var out = mcl.parse(s);
  equal(mce.run(out),4, "MCE");
});

// max 500,,,

test("recursion call" , function(){
  var s = '!b=0;!a=\\(i){if(i){!b = b + 1; a(i - 1);};};a(500);b;';

  var out = mcl.parse(s);
  //console.log(dump(out,0))
  equal(mce.run(out),500, "MCE");
});

test("loop test" , function(){
  var s = '!a=0;loop(250*2){!a=a+1;};a;';
  var out = mcl.parse(s);
  equal(mce.run(out),500, "MCE");
});

test("loop test (heavy)" , function(){
  var s = '!a=0;loop(100000){!a=a+1;};a;';
  var out = mcl.parse(s);
  equal(mce.run(out),100000, "MCE");
});

test("loop test (heavy2)" , function(){
  var s = '!b=0;!a=0;loop(100000){!a=a+1;!b=b+1;};a+b;';
  var out = mcl.parse(s);
  equal(mce.run(out),200000, "MCE");
});

test("write test" , function(){
  var s = 'write("test")';
  var out = mcl.parse(s);
  mce.run(out);
  equal(mce.out,'test\n', "MCE");
});

test("write*loop test" , function(){
  var s = 'loop(10){write("test");}';
  var out = mcl.parse(s);
  mce.run(out);
  var ans = "";
  for(var i=0; i < 10; i++) ans += 'test\n';
  equal(mce.out,ans, "MCE");
});

test("indent preprocess" , function(){
  var s,out;
  s = 'test()';
  out = mcl.preProcess(s);
  equal(out ,'test()\n', "Preprocess");

  s = 'test()\n  hoge()';
  out = mcl.preProcess(s);
  equal(out ,'test()\n{\n  hoge()\n}', "Preprocess");

  s = 'test()\n  hoge()\n  fuga()\n  aaa()\n';
  out = mcl.preProcess(s);
  equal(out ,'test()\n{\n  hoge()\n  fuga()\n  aaa()\n}', "Preprocess");

  s = 'test()\n  hoge()\n  fuga()\naaa()\n';
  out = mcl.preProcess(s);
  equal(out ,'test()\n{\n  hoge()\n  fuga()\n}\naaa()\n', "Preprocess");

  s = 'test()\n  hoge()\n  fuga()\n   aaa()\naaa()\n';
  out = mcl.preProcess(s);
  equal(out ,'test()\n{\n  hoge()\n  fuga()\n{\n   aaa()\n}\n}\naaa()\n', "Preprocess");

  /*
scale(0.1,0.1)
 !a = 0
 loop(10)
  rotate(a/10)
   !a = 1 + a;
   fig(1)
    rect()
  text("@")
  */
  s = 'scale(0.1,0.1)\n !a=0\n loop(10)\n  rotate(a/10)\n   !a = a+ 1\n   fig(1)\n    rect()\n  text("@")\n';
  out = mcl.preProcess(s);
  equal(out ,'scale(0.1,0.1)\n{\n !a=0\n loop(10)\n{\n  rotate(a/10)\n{\n   !a = a+ 1\n   fig(1)\n{\n    rect()\n}\n}\n  text("@")\n}}', "Preprocess");
});



test("prelude test" , function(){
  var s = '';
  var prelude = (function () {/*
                                    !save = \(){
                                      write("save");
                                      evalAllExtArgs();
                                      write("restore");
                                    };
                                    !lw = \(size){
                                      save(){
                                        write("lw " + size);
                                        evalAllExtArgs();
                                      };
                                    };
                                    !rotate = \(t){
                                      save(){
                                        write("rotate " + t);
                                        evalAllExtArgs();
                                      };
                                    };
                                    !scale = \(w,h){
                                      save(){
                                        write("scale " + w + "," + h);
                                        evalAllExtArgs();
                                      };
                                    };
                                    !shift = \(x,y){
                                      save(){
                                        write("shift " + x + " " + y);
                                        evalAllExtArgs();
                                      };
                                    };

                                    !fig = \(closed){
                                      write("beginPath");
                                      evalAllExtArgs();
                                      if(closed){
                                        write("closePath");
                                      };
                                      write("stroke");
                                    };
                                    !rect = \(){
                                      write("moveTo -0.5 -0.5");
                                      write("lineTo 0.5 -0.5");
                                      write("lineTo 0.5 0.5");
                                      write("lineTo -0.5 0.5");
                                    };
                                    shift(0.1,0){lw(10){fig(1){rect();};};};
                                    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
  s = prelude + s;

  var out = mcl.parse(s);
  //console.log(dump(out,0))
  mce.run(out);
  equal(mce.out,"save\nshift 0.1 0\nsave\nlw 10\nbeginPath\nmoveTo -0.5 -0.5\nlineTo 0.5 -0.5\nlineTo 0.5 0.5\nlineTo -0.5 0.5\nclosePath\nstroke\nrestore\nrestore\n", "MCE");
});

test("comment" , function(){
  var s = '0\n//1\n2\n3';
  var out = mcl.parse(s);
  equal(mce.run(out),3, "comment");

});


