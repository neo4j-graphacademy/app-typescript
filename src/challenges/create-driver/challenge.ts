// Import the driver
import neo4j, { Integer, Node, Relationship } from 'neo4j-driver'
import { getNeo4jCredentials } from '../utils'

// Neo4j Credentials
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = getNeo4jCredentials()

async function main() {
  // TODO: Create a Driver Instance

  // TODO: Open a new Session

  try {
    // TODO: Run a Cypher statement

    // TODO: Log the Director value of the first record

  }
  finally {
    // TODO: Close the session
  }

}

main()
