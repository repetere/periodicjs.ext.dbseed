'use strict';

const Promisie = require('promisie');
const fs = Promisie.promisifyAll(require('fs-extra'));
const path = require('path');
const periodicjs = require('periodicjs');
const Transform = require('stream').Transform;
const os = require('os');

/**
 * exports data from a given core data database model
 * 
 * @param {string} core_data_name 
 * @returns {Promise} contents of the core data model seed
 */
function handleWriteStream (fd) {
  let isFirst = true;
  let transform = new Transform({
    objectMode: true,
    transform: function (data, enc, next) {
      try {
        if (isFirst) {
          isFirst = false;
          this.push(`[${ os.EOL }`);
        }
        this.push((data && typeof data === 'object') ? JSON.stringify(data, null, 2) : data);
        next();
      } catch (e) {
        next(e);
      }
    },
  });
  transform.pipe(fd);
  return transform;
}

function handleReadStream (core_data_name, writeStream, fd) {
  let firstData = true;
  return function (readStream) {
    let count = 0;
    return new Promisie((resolve, reject) => {
      try {
        writeStream.write(`\t{${ os.EOL }\t\t"${ core_data_name }": [${ os.EOL }`);
        writeStream.once('error', reject);
        readStream.on('data', data => {
          count++;
          if (firstData) {
            firstData = false;
            writeStream.write(data);
          } else {
            writeStream.write(`,${ os.EOL }`);
            writeStream.write(data);
          }
        })
          .on('error', reject)
          .on('end', () => {
            writeStream.write(`${ os.EOL }\t\t]`);
            resolve([writeStream, fd, count,]);
          });
      } catch (e) {
        reject(e);
      }
    });
  };
}

function handleWriteEnd (transform, fd) {
  transform.end(`${ os.EOL }\t}${ os.EOL }]`);
  return new Promisie((resolve, reject) => {
    fd.on('finish', () => resolve())
      .on('error', reject);
  });
}

function exportCoreData (filepath, split_count) {
  return function (core_data_name) {
    let data_count = 0;
    let file_index = 0;
    return Promisie.doWhilst(() => {
      let fd = fs.createWriteStream(path.join(path.dirname(filepath), `${ path.basename(filepath, '.json') }_${ core_data_name }(${ file_index }).json`));
      let writeStream = handleWriteStream(fd);
      return periodicjs.datas.get(core_data_name).stream({ 
        limit: (typeof split_count === 'number') ? split_count : Infinity,
        skip: data_count,
      })
        .then(handleReadStream(core_data_name, writeStream, fd))
        .then(result => {
          let [transform, fd, count,] = result;
          data_count += count;
          file_index++;
          return handleWriteEnd(transform, fd)
            .then(() => count)
            .catch(e => Promisie.reject(e));
        })
        .catch(e => Promisie.reject(e));
    }, result => (typeof split_count === 'number' && split_count > 0 && result === split_count));
  };
}

/**
 * exports all data from periodic into a seed file
 * 
 * @param {string} filepath 
 * @returns {Promise} resolved value from each export from exportCoreData
 */
function exportData(options) {
  try {
    const filepath = (typeof options === 'string')
      ? options
      : options.filepath;
    const excluded_data = periodicjs.settings.extensions['periodicjs.ext.dbseed'].export.ignore_core_datas;
    const split_count = periodicjs.settings.extensions[ 'periodicjs.ext.dbseed' ].export.split_count;
    const include_data_filter = (Array.isArray(options.include_datas))
      ? (datum => options.include_datas.indexOf(datum) > -1)
      : (() => true);
    const core_datas = Array.from(periodicjs.datas.keys())
      .filter(datum => excluded_data.indexOf(datum) === -1)
      .filter(include_data_filter);
    return Promisie.map(core_datas, 5, exportCoreData(filepath, split_count));
  } catch (e) {
    return Promisie.reject(e);
  }
}

module.exports = {
  exportCoreData,
  // exportCoreDatabase,
  exportData,
};