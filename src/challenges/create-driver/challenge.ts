import dotenv from 'dotenv'; 
dotenv.config({ path: '.env' });

// Import the driver
import neo4j, { Integer, Node, Relationship } from 'neo4j-driver'
import { getNeo4jCredentials } from '../utils'

// Neo4j Credentials
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD,
  NEO4J_DATABASE
} = getNeo4jCredentials()

async function main() {
  // TODO: Create a Driver Instance using neo4j.driver()

  // TODO: Open a new Session using driver.session() and specify the database

  try {
    const cypher = `
      MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
      RETURN p.name AS Director
    `
    const params = { title: 'Toy Story' }

    // TODO: Run the Cypher statement using session.run()

    // TODO: Log the Director value of the first record

  }
  finally {
    // TODO: Close the session
  }
}

main()
