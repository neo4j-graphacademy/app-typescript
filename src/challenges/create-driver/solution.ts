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
  NEO4J_PASSWORD,
  NEO4J_DATABASE
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

  try {
    // tag::run_cypher[]
    const cypher = `
      MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
      RETURN p.name AS Director
    `
    const params = { title: 'Toy Story' }

    // Run the Cypher statement using driver.executeQuery()
    const res = await driver.executeQuery(
      cypher,
      params,
      { database: NEO4J_DATABASE }
    )
    // end::run_cypher[]

    // Log the Director value of the first record
    // tag::log_director[]
    console.log(res.records[0].get('Director'))
    // end::log_director[]
  }
  finally {
    // Close the driver
    // tag::close_session[]
    await driver.close()
    // end::close_session[]
  }
  // end::solution[]
}

main()
