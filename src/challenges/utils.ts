interface Neo4jCredentials {
  NEO4J_URI: string;
  NEO4J_USERNAME: string;
  NEO4J_PASSWORD: string;
}

/**
 * This is a quick hack to trick the runtime into recognising
 * the NEO4J_* environment variables are all defined.  They
 * are passed as variables in the URL.
 *
 * For some reason it ignores globals.d.ts.
 *
 * @returns {Neo4jCredentials}
 */
export function getNeo4jCredentials(): Neo4jCredentials {
  const {
    NEO4J_URI,
    NEO4J_USERNAME,
    NEO4J_PASSWORD
  } = process.env as Record<string, any>

  return {
    NEO4J_URI,
    NEO4J_USERNAME,
    NEO4J_PASSWORD,
  }
}
