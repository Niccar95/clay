# domain-model xsd-schema-validator requires java in the environment. 
# If we can remove this dependency we can build on a node machine
FROM --platform=linux/amd64 timbru31/java-node:11-jdk-18 as build

COPY ./lib /app/lib

# Install and build libaries. 
# Install with --omit=dev after build skip dev dependencies
WORKDIR /app/lib/domain-model
RUN npm ci --silent
RUN npm run build
RUN npm ci --silent --omit=dev

WORKDIR /app/lib/shared-service
RUN npm ci --silent 
RUN npm run build
RUN npm ci --silent --omit=dev

WORKDIR /app/lib/integrations
RUN npm ci --silent 
RUN npm run build
RUN npm ci --silent --omit=dev

WORKDIR /app/lib/moleculer-health-check
RUN npm ci --silent
RUN npm run build
RUN npm ci --silent --omit=dev

{{#if clay_parent.nonServiceOutputPath}}
# Install and build project
RUN mkdir -p /app/{{clay_parent.nonServiceOutputPath}}
COPY ./{{clay_parent.nonServiceOutputPath}} /app/{{clay_parent.nonServiceOutputPath}}

WORKDIR /app/{{clay_parent.nonServiceOutputPath}}
RUN npm ci --silent
RUN npm run build

# -------------------
FROM --platform=linux/amd64 node:18-alpine
RUN mkdir -p /app

# copy all libaries, we're pointing out the dist folder in each library with package.json
COPY --from=build /app/lib /app/lib

COPY --from=build /app/{{clay_parent.nonServiceOutputPath}}/dist /app/{{clay_parent.nonServiceOutputPath}}
COPY --from=build /app/{{clay_parent.nonServiceOutputPath}}/package.json /app/{{clay_parent.nonServiceOutputPath}}/package.json
COPY --from=build /app/{{clay_parent.nonServiceOutputPath}}/package-lock.json /app/{{clay_parent.nonServiceOutputPath}}/package-lock.json

WORKDIR /app/{{clay_parent.nonServiceOutputPath}}
RUN npm ci --omit=dev
ENV NODE_ENV=production
CMD ["npm", "start"]
{{else}}
# Install and build project
RUN mkdir -p /app/services/{{clay_parent.name}}
COPY ./services/{{clay_parent.name}} /app/services/{{clay_parent.name}}

WORKDIR /app/services/{{clay_parent.name}}
RUN npm ci --silent
RUN npm run build

# -------------------
FROM --platform=linux/amd64 node:18-alpine
RUN mkdir -p /app/services

# copy all libaries, we're pointing out the dist folder in each library with package.json
COPY --from=build /app/lib /app/lib

COPY --from=build /app/services/{{clay_parent.name}}/dist /app/services/{{clay_parent.name}}
COPY --from=build /app/services/{{clay_parent.name}}/package.json /app/services/{{clay_parent.name}}/package.json
COPY --from=build /app/services/{{clay_parent.name}}/package-lock.json /app/services/{{clay_parent.name}}/package-lock.json

WORKDIR /app/services/{{clay_parent.name}}
RUN npm ci --omit=dev

ENV NODE_ENV=production
CMD ["npm", "start"]
{{/if}}