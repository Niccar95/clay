const mixin = entity => {
  const childrenChanges = {};
  if (entity.children) {
    Object.entries(entity.children || {}).forEach(([key, value]) => {
      childrenChanges[key + 'Changes'] = {
        tab: 'Detaljer',
        type: 'childrenChanges',
        childEntity: key,
        props: {
          ...value.fields,
        },
        optional: true,
      };
    });
  }

  entity.actions.upsert = {
    requiredRole: ['super'],
    canCreate: true,
    name: 'upsert',
    description:
      'skapar eller uppdaterar, använder id för att se om det finns eller ej',
    parameters: { includeParameters: '*', ...childrenChanges },
  };
  entity.actions.upsertWhenEmpty = {
    requiredRole: ['super'],
    canCreate: true,
    name: 'upsertWhenEmpty',
    description:
      'skapar eller uppdaterar en entitet och skriver endast värden som uppfattas som tomt',
    parameters: { includeParameters: '*' },
  };

  entity.actions.updateWhenEmpty = {
    requiredRole: ['super'],
    canCreate: false,
    name: 'updateWhenEmpty',
    description:
      'uppdaterar en entitet om värdet sedan tidigare uppfattas som tomt',
    parameters: { includeParameters: '*' },
  };
  entity.actions.update = {
    requiredRole: ['super'],
    canCreate: false,
    name: 'update',
    description:
      'uppdaterar en entitet, använder id för att se om det finns eller ej',
    parameters: { includeParameters: '*', ...childrenChanges },
  };
};

module.exports = {
  type: 'function',
  name: 'default_actions',
  function: mixin,
};
