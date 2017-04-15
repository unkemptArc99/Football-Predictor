var http = require('http');
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();




app.get('/scrape', function(req, res){

       url = 'http://www.espn.in/football/table/_/league/eng.1';


     request(url, function(error, response, html){

         if(!error){

             console.log('Request made to url');    
             var $ = cheerio.load(html);
             var inner =  cheerio.load(html);
             var title, release;
             var array = new Array();
             
             var win;
             var data;


               $('.standings-row').each(function(i,element){
                 
                   var json = {name : "",GP:"",W:"",D:"",L:"",F:"",A:"", GD: ""};    
                   data = $(this);

                 title = data.children().eq(0).children().eq(2).children().eq(0).children().eq(0).text();
                 GP = data.children().eq(1).text();
                 W  = data.children().eq(2).text();
                 D  = data.children().eq(3).text();
                 L  = data.children().eq(4).text();
                 F  = data.children().eq(5).text();
                 A  = data.children().eq(6).text();
                 GD = data.children().eq(7).text();
                 

                 json.name = title;
                 json.GP = GP;
                 json.W  = W;
                 json.D  = D;
                 json.L  = L;
                 json.F =  F;
                 json.A =  A;
                 json.GD = GD;

                 array.push(json);
                 
              })

              var str1 = "Manchester United";
              var str2 = "Chelsea";
              var i1,i2;

              for(var i = 0; i < 20; i++){
                if(str1 == array[i].name){console.log(Math.pow(-1.56,1.7));
                    i1 = i;
                }
                if(str2 == array[i].name){
                    i2 = i;
                }
              }

              var gp1 = array[i1].GP;
              gp1 = Number(gp1);
              var gf1 = array[i1].F
              gf1 = Number(gf1);
              gf1 = gf1/gp1;
              var ga1 = array[i1].A
              ga1 = Number(ga1);
              ga1 = ga1/gp1;

              var gp2 = array[i2].GP;
              gp2 = Number(gp2);
              var gf2 = array[i2].F
              gf2 = Number(gf2);
              gf2 = gf2/gp2;
              var ga2 = array[i2].A
              ga2 = Number(ga2);
              ga2 = ga2/gp2;
              
              var max = 0;
              var gamma = 1.7;
              
              gf1 = (gf1 + 0.5)/(1 + (1/gamma));
              ga1 = (ga1 + 0.5)/(1 + (1/gamma));
              gf2 = (gf2 + 0.5)/(1 + (1/gamma));
              ga2 = (ga2 + 0.5)/(1 + (1/gamma));
              
              var pwin1 = 0;
              var pwin2 = 0;
              var draw = 0;

              for(var i = 0;i<=6;++i){
                pwin1 = pwin1 + (Math.pow(2.31,-Math.pow((i/gf1),gamma)) - Math.pow(2.31,-Math.pow(((i + 1)/gf1),gamma)))*(Math.pow(2.31,-Math.pow((i/ga2),gamma)) - Math.pow(2.31,-Math.pow((i + 1/ga2),gamma)))*(1 - Math.pow(2.31,-Math.pow((i/ga1),gamma)))*(1 - Math.pow(2.31,-Math.pow((i/gf2),gamma)));
                pwin2 = pwin2 + (Math.pow(2.31,-Math.pow((i/gf2),gamma)) - Math.pow(2.31,-Math.pow(((i + 1)/gf2),gamma)))*(Math.pow(2.31,-Math.pow((i/ga1),gamma)) - Math.pow(2.31,-Math.pow((i + 1/ga1),gamma)))*(1 - Math.pow(2.31,-Math.pow((i/ga2),gamma)))*(1 - Math.pow(2.31,-Math.pow((i/gf1),gamma)));
                draw = draw + (Math.pow(2.31,-Math.pow((i/gf1),gamma)) - Math.pow(2.31,-Math.pow(((i + 1)/gf1),gamma)))*(Math.pow(2.31,-Math.pow((i/ga2),gamma)) - Math.pow(2.31,-Math.pow((i + 1/ga2),gamma)))*(Math.pow(2.31,-Math.pow((i/gf2),gamma)) - Math.pow(2.31,-Math.pow((i + 1/gf2),gamma)))*(Math.pow(2.31,-Math.pow((i/ga1),gamma)) - Math.pow(2.31,-Math.pow((i + 1/ga1),gamma)));
              }
              if(pwin1 > pwin2){
                  if(pwin1 > 1.5 * pwin2){
                      console.log(str1,"wins!!");
                  }
                  else{
                      console.log("draw");
                  }
              }
              else{
                  if(pwin2 > 1.5 * pwin1){
                      console.log(str2,"wins!!");
                  }
                  else{
                      console.log("draw");
                  }
              }
              //console.log(array);
             fs.writeFile('output.json', JSON.stringify(array), function(err){

             console.log('File successfully written! - Check your project directory for the output.json file');
             if(err)
                 console.log("shit happens");

             })


             res.send('Check console..');
       
         }
    
     })

})

app.listen('8001')



exports = module.exports = app;