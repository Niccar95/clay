String.prototype.toCamelCase = function () {
  if (!this) return this;
  return this.replace(/\s(.)/g, function ($1) {
    return $1.toUpperCase();
  })
    .replace(/\_(.)/g, function ($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/\_/g, "")
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase();
    });
};

const mixin = (entity) => {
  entity.relations = entity.relations || [];
  const { actions, fields } = entity;
  const linked_fields = { ...fields };

  Object.entries(entity.children || {}).forEach(([key, value]) => {
    linked_fields[key] = {
      ...value,
      required: false,
      fields: undefined,
      props: {
        ...value.fields,
      },
    };
  });

  entity.displayFields = {
    ...entity.fields,
    ...entity.calculatedFields,
    ...entity.children,
  };

  Object.entries(actions || {}).forEach(([actionName, actionSpec]) => {
    const resultParams = {};
    Object.entries(actionSpec.parameters || {}).forEach(
      ([paramName, paramSpec]) => {
        if (paramSpec.linked_field) {
          if (linked_fields[paramSpec.linked_field] === undefined) {
            throw `no field named ${paramSpec.linked_field} in ${entity.name}`;
          }
          const merged = {
            ...linked_fields[paramSpec.linked_field],
            ...paramSpec,
          };
          delete merged.linked_field;
          resultParams[paramName] = merged;
        } else if (paramName == "includeParameters") {
          if (paramSpec != "*") {
            paramSpec.forEach((include) => {
              if (!linked_fields[include])
                throw `no such field  ${include} on type ${entity.name}`;
              resultParams[include] = { ...linked_fields[include] };
            });
          } else {
            Object.entries(linked_fields).forEach(
              ([field_name, field_spec]) => {
                resultParams[field_name] = { ...field_spec };
              }
            );
          }
          delete resultParams.includeParameters;
        } else if (paramName == "excludeParameters") {
          paramSpec.forEach((exclude) => {
            delete resultParams[exclude];
          });
          delete resultParams.excludeParameters;
        } else {
          resultParams[paramName] = paramSpec;
        }
      }
    );
    actionSpec.parameters = resultParams;
  });

  /// Update relations field to help the generators
  Object.entries(actions || {}).forEach(([actionName, actionSpec]) => {
    Object.entries(actionSpec.parameters || {}).forEach(
      ([paramName, paramSpec]) => {
        if (
          paramSpec.type === "relation" &&
          entity.relations.indexOf(paramSpec.relation) === -1
        ) {
          entity.relations.push(paramSpec.relation);
        }
      }
    );
  });

  // Verify that we follow conventions
  Object.entries(actions || {}).forEach(([actionName, actionSpec]) => {
    Object.entries(actionSpec.parameters || {}).forEach(
      ([paramName, paramSpec]) => {
        if (paramName === "id") {
          if (paramSpec.tab) {
            throw "Id can not have tab. Action: " + actionName;
          }
        } else {
          if (!paramSpec.tab) {
            throw (
              "Parameter requires tab. Action: " +
              actionName +
              " parameter: " +
              paramName
            );
          }
        }
      }
    );
  });
};

module.exports = {
  type: "function",
  name: "linked_fields",
  function: mixin,
};
