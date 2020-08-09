function init(ctx, nextFunc){

// === Prelude ===
        var prelude = (function () {/*
!sqrt = \(n){
  eval("Math","sqrt",n)
};
!sin = \(n){
  eval("Math","sin",n * 3.1415 * 2)
};
!cos = \(n){
  eval("Math","cos",n * 3.1415 * 2)
};
!tan = \(n){
  eval("Math","tan",n * 3.1415 * 2)
};
!atan2 = \(y,x){
  eval("Math", "atan2", y, x)/(3.1415*2)
};



!floor = \(n){
  eval("Math","floor",n)
};

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
!dlw = \(size){
  save(){
    write("dlw " + size);
    evalAllExtArgs();
  };
};
!blur = \(size){
  save(){
    write("blur " + size);
    evalAllExtArgs();
  };
};
!bs = \(c){
  save(){
    write("bs " + c);
    evalAllExtArgs();
  };
};

!fs = \(c){
  save(){
    write("fs " + c);
    evalAllExtArgs();
  };
};
!ss = \(c){
  save(){
    write("ss " + c);
    evalAllExtArgs();
  };
};
!col = \(c){
  save(){
    write("ss " + c);
    write("fs " + c);
    evalAllExtArgs();
  };
};
!ssfs = \(c1,c2){
  save(){
    write("ss " + c1);
    write("fs " + c2);
    evalAllExtArgs();
  };
};
!cs = \(pos, col){
  write("cs " + pos + " " + col);
};
!rgrad = \(x0,y0,r0,x1,y1,r1){
  write("radialGrad " + x0 + " " + y0 + " " + r0 + " " + x1 + " " + y1 + " " + r1);
  evalAllExtArgs();
};
!lgrad = \(x0,y0,x1,y1){
  write("linearGrad " + x0 + " " + y0 + " " + x1 + " " + y1);
  evalAllExtArgs();
};
!fsgrad = \(){
  save(){
    evalExtArg(0);
    write("fsGrad");
    block("a"){
      !a = 1;
      loop(extArgsLength() - 1){
        evalExtArg(a);
        !a = a + 1;
      }
    }
  };
};
!ssgrad = \(){
  save(){
    evalExtArg(0);
    write("ssGrad");
    block("a"){
      !a = 1;
      loop(extArgsLength() - 1){
        evalExtArg(a);
        !a = a + 1;
      }
    }
  };
};
!skew = \(t,t2){
  save(){
    write("skew " + t + " " + t2);
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
  if(not(h)){
    !h = w;
  };
  save(){
    write("scale " + w + " " + h);
    evalAllExtArgs();
  };
};
!shift = \(x,y){
  save(){
    write("shift " + x + " " + y);
    evalAllExtArgs();
  };
};
!outerFig = 1;
!fig = \(closed){
  write("beginPath");
  !outerFig = 0;
  evalAllExtArgs();
  !outerFig = 1;
  if(closed){
    write("closePath");
  };
  write("fill");
  write("stroke");
};
!blockClip = \(closed){
  write("beginPath");
  !outerFig = 0;
  evalExtArg(0);
  !outerFig = 1;
  if(closed){
    write("closePath");
  };
  write("clip");
  evalExtArg(1);
  write("resetClip");
};

!autoFig = \(){
  if(outerFig){
    write("beginPath");
  };
  evalAllExtArgs();
  if(outerFig){
    write("closePath");
    write("fill");
    write("stroke");
  };
}
!rect = \(){
  autoFig(){
    write("moveTo -0.5 -0.5");
    write("lineTo 0.5 -0.5");
    write("lineTo 0.5 0.5");
    write("lineTo -0.5 0.5");
  };
};
!rrect = \(){
  autoFig(){
    write("moveTo -0.5 -0.5");
    write("lineTo -0.5 0.5");
    write("lineTo 0.5 0.5");
    write("lineTo 0.5 -0.5");
  };
};

!xy0 = \(x,y){
  write("moveTo " + x + " " + y);
}
!xy = \(x,y){
  write("lineTo " + x + " " + y);
}
!grid = \(xx,yy){
  block("aa","bb"){
    !aa = 0;
    !bb = 0;
    loop(xx){
      !bb = 0;
      !aa = aa + 1;
      loop(yy){
        !bb = bb + 1;
        shift(aa - xx/2 - 0.5 ,bb - yy/2 - 0.5){
          evalAllExtArgs();
        }
      }
    }
  }
};

!flower = \(n){
  block("a"){
    !a = 0;
    loop(n){
      rotate(a/n*2){
        evalAllExtArgs();
      }
      !a = a + 1;
    }
  }
}

!text = \(s){
  scale(0.1){
    write("fillText " + s);
    write("strokeText " + s);
  }
}
!fillText = \(s){
  write("fillText " + s);
}
!strokeText = \(s){
  write("strokeText " + s);
}
!rgb = \(r,g,b){"rgb(" + r + "," + g + "," + b + ")"};
!rgba = \(rr,gg,bb,aa){"rgba(" + rr + "," + gg + "," + bb + "," + aa + ")"};

!poly = \(n, p){
 block("ploya"){
   !polya = 0;
   autoFig(0){
     rotate((polya*p) * 2){
      write("moveTo 0 0.5");
     }
    loop(n){
     !polya = polya + 1;
     rotate((polya*p)/n * 2){
      write("lineTo 0 0.5");
     }
    }
   }
 }
};

!apoly = \(mode,size){
 block("r2","a"){
  scale(0.3){
   !r2 = 1/cos(1/mode/2)
   fig(1){
    !a = 0
    write('moveTo ' + cos(-1/mode/2) + ' ' + sin(-1/mode/2))
    loop(mode){
     write('arcTo' + ' ' + r2*cos((a*2)/mode/2) + ' ' + r2*sin((a*2)/mode/2) + ' ' + cos((a*2+1)/mode/2) + ' ' + sin((a*2+1)/mode/2) + ' ' + size)
     !a = a + 1
    }
   }
  }
 }
}

!font = \(name){
  save(){
    write("font " + name);
    evalAllExtArgs();
  }
}
!circle = \(s){
 block("polyq","n","r2"){
  if(not(s)){
    !s = 1;
  }
  scale(s){
   !polya = 0;
   !n = 8;
   !r2 = 0.5/cos(1/n/2);
   autoFig(){
    write('moveTo 0.5 0')
    loop(n){
     !x1 = 0.5 * cos((polya+1) / n);
     !y1 = 0.5 * sin((polya+1) / n);
     !x2 = r2 * cos(polya / n + 1 / n / 2);
     !y2 = r2 * sin(polya / n + 1 / n / 2);

     write("quadTo " + x2 + " " + y2 + " " + x1 + " " + y1);
     !polya = polya + 1;
    }
   }
  }
 }
}

!rcircle = \(s){
 block("polyq","n","r2"){
  if(not(s)){
    !s = 1;
  }
  scale(s){
   !polya = 0;
   !n = 8;
   !r2 = 0.5/cos(1/n/2);
   autoFig(){
    write('moveTo 0.5 0')
    loop(n){
     !x1 = 0.5 * cos((n-polya-1) / n);
     !y1 = 0.5 * sin((n-polya-1) / n);
     !x2 = r2 * cos((n-polya) / n - 1 / n / 2);
     !y2 = r2 * sin((n-polya) / n - 1 / n / 2);
   
     write("quadTo " + x2 + " " + y2 + " " + x1 + " " + y1);
     !polya = polya + 1;
    }
   }
  }
 }
}


                                    */}).toString().match(/[^]*\/\*([^]*)\*\/;{0,1}\}$/)[1];

  function draw(){
    var fonts = new Fonts(); // google fonts
    var renderSvg = new RendererSVG(fonts);
    var p = new SimpleParser();

    let worker = null;
    worker = new Worker('js/worker.js');
    let s = editor.getValue();
    let t = 0;

    //処理起動
    worker.postMessage({prelude:prelude, s:s, vars:{t:t}});

    worker.onerror = function(){
      console.log('worker error');
      worker = null;
      if(f)f();
    }
    worker.onmessage = function(event){
      // 処理終了
      var sout = event.data.renderProgram;
      var description = event.data.description;
      var debug = event.data.debug;
      var out = p.parse(sout);

      try{
        //console.log(sout)
        //console.log(out)
        //console.log(debug)
        renderSvg.render(out, 800);
        //console.log("render", renderSvg.svgData)
        var svgText = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-1,-1,2,2">' + renderSvg.svgData.join("\n")+ "</svg>"
        nextFunc(svgText);

        // canvas

        var renderCanvas = new Renderer(ctx, fonts, 400);
        renderCanvas.render(out, 400, 400);


      }catch(e){
        debug += e + '\n\n';
        console.log(e)
      }
    }
  }
  draw();
}
