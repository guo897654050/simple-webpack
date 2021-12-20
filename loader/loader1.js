const fn = (source) => {
  return source.replace(/from/, 'after loader1 process');
}
module.exports = fn;