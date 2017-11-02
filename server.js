var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var rp = require('request-promise');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type ncbiResponse {
    accession: String
    getAccession: String
    getSequence: String
  }
  
  type Query {
    protein(accession: String): ncbiResponse
  }
`);

class ncbiResponse {
    constructor(accession) {
        this.accession = accession;
    }

    getAccession () {
        return this.accession;
    }

    getSequence () {
        var opts = {
            url: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
            qs: {
                db: "nuccore",
                id: this.accession,
                rettype: "fasta",
                retmode: "text"
            }
        };

        return rp.get(opts).then((data)=>{
            //console.log(data);
            return data.split("\n").slice(1).join("\n");
        }).catch((error)=>{
            console.log(error);
            return "Error"
        });
    }
}

// The root provides a resolver function for each API endpoint
var root = {
    protein: function ({accession}) {
        return new ncbiResponse(accession)
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');