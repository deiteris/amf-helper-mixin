export const AmfLoader = {};
AmfLoader.load = async function(opts) {
  opts = opts || {};
  const fileTemplate = opts.isCompact ? 'demo-api-compact.VERSION.json' : 'demo-api.VERSION.json';
  const file = fileTemplate.replace('VERSION', opts.version || 'v1');
  const url = location.protocol + '//' + location.host + '/base/test/' + file;
  /* global Promise */
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    });
    xhr.addEventListener('error', () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
