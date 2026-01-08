// This file registers the schemas and generates the openapi document.
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31
} from '@asteasolutions/zod-to-openapi';
import {
  CreateMovieSchema,
  CreateMovieResponseSchema,
  ConflictMovieResponseSchema,
  GetMovieResponseUnionSchema,
  MovieNotFoundResponseSchema,
  DeleteMovieResponseSchema,
  UpdateMovieSchema,
  UpdateMovieResponseSchema
} from '../@types/schema';
import type { ParameterObject } from 'openapi3-ts/oas31';

// Register the schemas with the openapi registry
const registry = new OpenAPIRegistry();
registry.register('CreateMovieRequest', CreateMovieSchema);
registry.register('CreateMovieResponse', CreateMovieResponseSchema);
registry.register('ConflictMovieResponse', ConflictMovieResponseSchema);
registry.register('GetMovieResponse', GetMovieResponseUnionSchema);
registry.register('MovieNotFoundResponse', MovieNotFoundResponseSchema);
registry.register('DeleteMovieResponse', DeleteMovieResponseSchema);
registry.register('UpdateMovieRequest', UpdateMovieSchema);
registry.register('UpdateMovieResponse', UpdateMovieResponseSchema);

// Constants
const MOVIE_ID_PARAM: ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description: 'Movie ID'
};

const MOVIE_NAME_PARAM: ParameterObject = {
  name: 'name',
  in: 'query',
  required: false,
  schema: { type: 'string' },
  description: 'Movie name to search for'
};

// register the paths with the openapi generator
registry.registerPath({
  method: 'get',
  path: '/',
  summary: 'Health check',
  responses: {
    200: {
      description: 'Server is running',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Server is running' }
            }
          }
        }
      }
    }
  }
});

// register path for getting all movies or filtering by name via query parameter
registry.registerPath({
  method: 'get',
  path: '/movies',
  summary: 'Get all movies or filter by name',
  parameters: [MOVIE_NAME_PARAM], // query param for filtering by name
  description:
    'Retrieve a list of all movies or filter by query parameter "name".',
  responses: {
    200: {
      description:
        'List of movies or a speicific movie if the "name" query parameter is provided',
      content: {
        'application/json': {
          schema: GetMovieResponseUnionSchema
        }
      }
    },
    404: {
      description:
        'Movie not found if the name provided does not match any movie',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
});

// register path for getting a movie by ID
registry.registerPath({
  method: 'get',
  path: '/movies/{id}',
  summary: 'Get a movie by ID',
  description: 'Retrive a single movie by ID',
  parameters: [MOVIE_ID_PARAM],
  responses: {
    200: {
      description: 'Movie found',
      content: {
        'application/json': {
          schema: GetMovieResponseUnionSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
});

// register path for creating a new movie
registry.registerPath({
  method: 'post',
  path: '/movies',
  summary: 'Create a new movie',
  description: 'Create a new movie with the provided details',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMovieSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie created successfully',
      content: {
        'application/json': {
          schema: CreateMovieResponseSchema
        }
      }
    },
    400: {
      description: 'Invalid request body or validation error'
    },
    409: {
      description: 'Movie already exists',
      content: {
        'application/json': {
          schema: ConflictMovieResponseSchema
        }
      }
    },
    500: {
      description: 'Unexpected error occurred'
    }
  }
});

// register path for deleting a movie by ID
registry.registerPath({
  method: 'delete',
  path: '/movies/{id}',
  summary: 'Delete a movie by ID',
  description: 'Delete a movie with the specified ID',
  parameters: [MOVIE_ID_PARAM],
  responses: {
    200: {
      description: 'Movie {id} has been deleted',
      content: {
        'application/json': {
          schema: DeleteMovieResponseSchema
        }
      }
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    }
  }
});

// register path for updating a movie by ID
registry.registerPath({
  method: 'put',
  path: '/movies/{id}',
  summary: 'Update a movie by ID',
  description: 'Update the details of a movie with the specified ID',
  parameters: [MOVIE_ID_PARAM],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateMovieSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Movie updated successfully',
      content: {
        'application/json': {
          schema: UpdateMovieResponseSchema
        }
      }
    },
    400: {
      description: 'Invalid request body or validation error'
    },
    404: {
      description: 'Movie not found',
      content: {
        'application/json': {
          schema: MovieNotFoundResponseSchema
        }
      }
    },
    500: {
      description: 'Internal server error'
    }
  }
});

// generate the OpenAPI document
const generator = new OpenApiGeneratorV31(registry.definitions);
export const openApiDoc = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Movies API',
    version: '0.0.1',
    description: 'API for managing movies'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local development server'
    },
    {
      url: 'https://movies-api.example.com',
      description: 'Production server'
    }
  ]
});
