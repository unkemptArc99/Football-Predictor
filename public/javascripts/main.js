var http = require('http');
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


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

              var str1 = "Chelsea";
              var str2 = "Sunderland";
              var i1,i2;

              for(var i = 0; i < 20; i++){
                if(str1 == array[i].name){
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
              
              var gw1 = array[i1].W;
              gw1 = Number(gw1);
              gw1 = gw1/gp1;
              var gl1 = array[i1].L
              gl1 = Number(gl1);
              gl1 = gl1/gp1;

              var gw2 = array[i2].W;
              gw2 = Number(gw2);
              gw2 = gw2/gp2;
              var gl2 = array[i2].L
              gl2= Number(gl2);
              gl2 = gl2/gp2;

              var hga = 0.13675;
              var alpha_variable1 = gf1/(gf1 + gf2);
              var alpha_variable2 = ga1/(ga1 + ga2);
              var goals1 = (0.5 + 0.4*(alpha_variable1)*(gw1 - gl1) + hga)*gf1 + (0.5 + 0.4*(alpha_variable2)*(gl2 - gw2) + hga)*ga2;
              var goals2 = (0.5 + 0.4*(1 - alpha_variable1)*(gw2 - gl2) - hga)*gf2 + (0.5 + 0.4*(1 - alpha_variable2)*(gl1 - gw1) - hga)*ga1;

              function round(value, decimals) {
                return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
              }

              goals1 = round(goals1,0);
              goals2 = round(goals2,0);

              var str_result;

              if(goals1 > goals2){
                  str_result = str1+' wins! by '+goals1+'-'+goals2;
              }
              else if(goals2 > goals1){
                  str_result = str2+' wins! by '+goals2+'-'+goals1;
              }
              else{
                  str_result = 'Draw by '+goals1+'-'+goals2;
              }

             fs.writeFile('output.json', JSON.stringify(array), function(err){

             console.log('File successfully written! - Check your project directory for the output.json file');
             if(err)
                 console.log("shit happens");

             })

             str_result = '<h2>In the match between '+str1+' and '+str2+' the result is predicted as : '+str_result+'</h2><br>'+str1+' goal scoring ratio :'+gf1+'<br>'+str2+' goal scoring ratio :'+gf2+'<br>'+str1+' goal scoring ratio :'+ga1+'<br>'+str2+' goal scoring ratio :'+ga2;
             console.log(str_result);
             res.send(str_result);
       
         }
    
     })

})

app.listen('8001')



exports = module.exports = app;