importScripts('gin.js');
importScripts('mt.js');
importScripts('mcl.js');

onmessage = function(event){
  var prelude = event.data.prelude;
  var vars = event.data.vars;
  var s = event.data.s;
  var externalVars = event.data.externalVars;

  var mce = new MCE();
  var mcl = new MCL();
  var debug = "";
  mce.externalVar = externalVars;
  mce.createScope();
  mce.bindVariable('t', vars.t);
  mce.bindVariable('mx', vars.mx);
  mce.bindVariable('my', vars.my);

  var t1 = new Date();
  s = prelude + mcl.preProcess(s);
  try{
    var out = mcl.parse(s);

    var t2 = new Date();
    var res = mce.run(out);
  }catch(e){
    debug += e + "\n\n";
  }
  //console.log(res);
  var sout = mce.out;
  //console.log("sout:",sout);
  postMessage({
    renderProgram:sout,
    externalVar:mce.externalVarRequest,
    description: mce.description,
    debug:debug
  });
};
