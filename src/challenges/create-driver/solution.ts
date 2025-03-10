import dotenv from 'dotenv'; 
dotenv.config({ path: '.env' });

// tag::import[]
// Import the driver
import neo4j, { Integer, Node, Relationship } from 'neo4j-driver'
import { getNeo4jCredentials } from '../utils'
// end::import[]

// tag::credentials[]
// Neo4j Credentials
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = getNeo4jCredentials()
// end::credentials[]

async function main() {
  // tag::solution[]
  // Create a Driver Instance using neo4j.driver()
  // tag::create_driver[]
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  )
  // end::create_driver[]

  // Open a new Session using driver.session()
  // tag::new_session[]
  const session = driver.session()
  // end::new_session[]

  try {
    // tag::run_cypher[]
    const cypher = `
      MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
      RETURN p.name AS Director
    `
    const params = { title: 'Toy Story' }

    // Run the Cypher statement using session.run()
    const res = await session.run(cypher, params)
    // end::run_cypher[]

    // Log the Director value of the first record
    // tag::log_director[]
    console.log(res.records[0].get('Director'))
    // end::log_director[]
  }
  finally {
    // Close the session
    // tag::close_session[]
    await session.close()
    // end::close_session[]
  }
  // end::solution[]
}

main()
