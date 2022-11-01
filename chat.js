/// codigo geral
var texto = "";
var debug=false;
 
for (let i = 2; i < process.argv.length; i++) {
   if (process.argv[i] == '-d') debug=true;
   else texto += process.argv[i]+" ";
}
 
console.log(responder(texto));
 
process.exit(0);
 
/// logica do bot
function responder(texto) {
   if (debug) console.log(texto);
   var questao =remover(texto);
   questao=questao.split(' ');
   questao=ignorar(questao);
   questao=relevancia(questao);
   questao=resposta(questao);
   questao=ordenar(questao);
 
   if (questao.length>0) return(questao[0].resposta);
   else return("Desculpe, não entendi!")
}
 
function remover(str) {
   let ret=str.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
   if (debug) console.log(ret);
   return ret;
}
 
function ignorar(texto) {
   /// palavras para ignorar
   //var ignorar = ["ou","gostaria"];
   var ignorar =  require('./ignorar.json');
 
   if (debug) console.log(texto);
   let tratado=[];
   texto.forEach(palavra => {
       if (palavra.length >1 )  {
           if (!ignorar.includes(palavra.toLowerCase())) tratado.push(palavra);
       }
   });
   if (debug) console.log(tratado);
   return tratado;
}
 
function relevancia(texto) {
   // var relevantes = [
   //                {"key":"ola", "val":10},
   //                {"key":"nome","val":100},
   //                {"key":"namorada","val":150}
   //               ] ;
   var relevantes = require("./relevantes.json");
   let tratado=[];
   texto.forEach(palavra => {
       if (debug) console.log(palavra);
       let obj = relevantes.find(o => o.key === palavra.toLowerCase());
       let valor=1;
       if (obj!=undefined) valor=obj.val;   
       tratado.push({"palavra":palavra,"relevancia":valor});
   });
   if (debug) console.log(tratado);
   return tratado;
}
 
function resposta(questao) {
   // var resp = [];
   // resp.push({"pergunta":["ola"],"resposta":"Tudo bem?","relevancia":10});
   // resp.push({"pergunta":["nome"],"resposta":"Sou um Bot","relevancia":20});
   // resp.push({"pergunta":["time"],"resposta":"Gosto do Tubarão!","relevancia":20});
   // resp.push({"pergunta":["comida"],"resposta":"Não como sou um bot!","relevancia":20});
   // resp.push({"pergunta":["namorada","namorado"],"resposta":"Sou um bot não entendo bem isso.","relevancia":20});
   var resp=require("./respostas.json");
 
   let tratado=[];
   questao.forEach(elemento => {
       let obj = resp.find(o => o.pergunta.includes(elemento.palavra.toLowerCase()));
       if (obj!=undefined) {
           tratado.push({"resposta":obj.resposta,"relevancia":(elemento.relevancia*obj.relevancia)});
       }
   });
   if (debug) console.log(tratado);
   return tratado;
}
 
function ordenar(questao) {
   questao.sort((a,b) => b.relevancia - a.relevancia);
   if (debug) console.log(questao);
   return questao;
}
