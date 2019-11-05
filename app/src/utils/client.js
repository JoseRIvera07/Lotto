const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: '12345678',
  dataset: 'lotto',
  useCdn: true
})

export default client
