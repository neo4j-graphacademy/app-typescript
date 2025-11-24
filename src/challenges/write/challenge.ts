import dotenv from 'dotenv'; 
dotenv.config({ path: '.env' });

// Import the driver
import neo4j from 'neo4j-driver'
import { getNeo4jCredentials } from '../utils'

// Neo4j Credentials
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD,
  NEO4J_DATABASE
} = getNeo4jCredentials()

async function main() {
  // Create a Driver Instance
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  )

  // Open a new Session
  const session = driver.session({ database: NEO4J_DATABASE })

  try {
    // TODO: Create the Cypher statement
    

    // TODO: Define the parameters


    // TODO: Execute the `cypher` statement in a write transaction

    
    // TODO: Log the result

  }
  finally {
    // Close the session
    await session.close()
  }
}

main()
