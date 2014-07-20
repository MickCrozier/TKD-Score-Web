
module.exports = {
  staging: {
      auth: {
        host: '54.206.61.99',
        port: 22,
        authKey: 'mcAWS'
      },
      src: './dist/',
      dest: 'projects/TKD-Score-Web/dist',
      exclusions: ['.DS_Store'],
      server_sep: '/'
  }
};