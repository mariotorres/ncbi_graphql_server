## NCBI GraphQL Server

GraphQL API for obtaining Amino Acid Sequences from NCBI

### Installing
cd ncbi_graphql_server/ && npm install 

### Running 
``` node server.js ```

### Usage example  
```
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{   protein(accession: \"NP_005537.3\") { getAccession, getSequence } }"}' \
http://localhost:4000/graphql
```