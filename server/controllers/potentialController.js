const neo4j = require('neo4j');
const request = require('request');

const db = new neo4j.GraphDatabase('http://neo4j:cake@localhost:7474');

module.exports = {

	createPotentials: (redditId) => {
    db.cypher({
  	    query: 'MATCH (user:Person)-[r:FOLLOWS]->(s: subreddit)<-[:FOLLOWS]-(potential:Person) WHERE user.redditId = {redditId} MERGE (user)<-[:POTENTIAL]->(potential) RETURN user, potential, r, s;',
  	    params: {
  	    	redditId: redditId,
  	    }
  	}, function (err, results) {
  		  if (err) {
  		    console.log("issue with: ", err);
  		  } else {
  		    console.log('list of potentials', results);
  		  }
  	});
  },

  queryPotentials: (req, res) => {
  	redditId = req.query.redditId;
    db.cypher({
  	    query: 'MATCH (user:Person)<-[r:POTENTIAL]->(potential:Person) WHERE user.redditId={redditId} RETURN potential LIMIT 2;',
  	    params: {
  	    	redditId: redditId,
  	    }
  	}, (err, results) => {
  		  if (err) {
  		    console.log("issue with: ", err);
  		  } else {
            if (err) {
              console.log("issue with: ", err);
            } else {
              // console.log('list of potentials', potentials);

              var arrayOfPotentials = []; //{ "name": "David Ludgren, 
              // "photo": "https://cdn1.iconfinder.com/data/icons/simple-icons/4096/reddit-4096-black.png",
              // "redditId": "8" 
              // "common_subreddits": [] }
              var finalPotentials = [];  //['Casper']

              for (var i = 0; i < potentials.length; i++) {
                var personObj = {};
                let potential = potentials[i].potential.properties.name;
                let repeatPotential = arrayOfPotentials.indexOf(potential);
                let sub = potentials[i].s.properties.name;
                personObj = potentials[i].potential.properties;
                if (repeatPotential === -1) {
                  personObj['common_subreddits'] = [sub];
                  arrayOfPotentials.push(potential)
                  finalPotentials.push(personObj);
                } else {
                  //for multiple subreddit commonalities: 
                  for (var j=0; j < finalPotentials.length; j++) {
                    //if potential is in potentials array, push it to existing potential's subreddit array
                    if (finalPotentials[j].name === potential) {
                      finalPotentials[j].common_subreddits.push(sub);
                    }
                  }
                }
              }
              res.send(finalPotentials);
            }
  		  }
  	});
  },

};
