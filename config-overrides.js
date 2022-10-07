const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@assets': 'src/assets',
    '@services': 'src/services',
    '@crudValidators': 'src/crudValidators',
    '@sections': 'src/sections',
    '@models': 'src/shared/models'
  })(config);

  return config;
};
